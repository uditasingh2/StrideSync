require("dotenv").config();
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { parse } = require("csv-parse/sync");
const Sample = require("../models/Sample");

const DEFAULT_DATASET_PATH = path.resolve(
  __dirname,
  "..",
  "..",
  "final_walkwise_dataset (1).csv"
);

const NUMERIC_FIELDS = [
  "Piezo_1_hits",
  "Piezo_1_mean",
  "Piezo_2_hits",
  "Piezo_2_mean",
  "Piezo_3_hits",
  "Piezo_3_mean",
  "Piezo_4_hits",
  "Piezo_4_mean",
  "Piezo_5_hits",
  "Piezo_5_mean",
  "toe_ratio",
  "Force_1_mean",
  "Force_1_max",
  "Force_1_std",
  "Force_1_nonzero_count",
  "Force_2_mean",
  "Force_2_max",
  "Force_2_std",
  "Force_2_nonzero_count",
  "Force_3_mean",
  "Force_3_max",
  "Force_3_std",
  "Force_3_nonzero_count",
  "Force_4_mean",
  "Force_4_max",
  "Force_4_std",
  "Force_4_nonzero_count",
  "force_zero_ratio",
  "force_overall_std",
  "missing_sensor_count",
  "force_imbalance",
  "gait_score",
  "age",
];

const STRING_FIELDS = ["foot", "file", "flat_foot"];

function createSampleKey(keySeed) {
  const hash = crypto.createHash("sha1");
  hash.update(keySeed);
  return hash.digest("hex");
}

function normalizeRow(row, rowNumber, datasetName) {
  const normalized = {};

  for (const field of NUMERIC_FIELDS) {
    const value = Number(row[field]);
    if (Number.isNaN(value)) {
      throw new Error(`Invalid numeric value for '${field}': ${row[field]}`);
    }
    normalized[field] = value;
  }

  for (const field of STRING_FIELDS) {
    normalized[field] = String(row[field] ?? "").trim();
  }

  normalized.foot = normalized.foot.toLowerCase();
  normalized.flat_foot = normalized.flat_foot.toLowerCase();
  normalized.source_row_number = rowNumber;
  normalized.sample_key = createSampleKey(`${datasetName}:${rowNumber}`);

  return normalized;
}

async function printSummary() {
  const total = await Sample.countDocuments();
  const byFoot = await Sample.aggregate([
    { $group: { _id: "$foot", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  const byGaitScore = await Sample.aggregate([
    { $group: { _id: "$gait_score", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  const byFlatFoot = await Sample.aggregate([
    { $group: { _id: "$flat_foot", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  console.log("----- Import Summary -----");
  console.log(`Total samples in DB: ${total}`);
  console.log(
    `Foot distribution: ${byFoot
      .map((i) => `${i._id}: ${i.count}`)
      .join(" | ")}`
  );
  console.log(
    `Gait score distribution: ${byGaitScore
      .map((i) => `${i._id}: ${i.count}`)
      .join(" | ")}`
  );
  console.log(
    `Flat foot distribution: ${byFlatFoot
      .map((i) => `${i._id}: ${i.count}`)
      .join(" | ")}`
  );
}

async function run() {
  const args = process.argv.slice(2);
  const datasetArg = args.find((arg) => !arg.startsWith("--"));
  const shouldReset = args.includes("--reset");
  const datasetPath = datasetArg ? path.resolve(datasetArg) : DEFAULT_DATASET_PATH;
  const datasetName = path.basename(datasetPath);

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI missing in backend/.env");
  }

  if (!fs.existsSync(datasetPath)) {
    throw new Error(`Dataset not found at: ${datasetPath}`);
  }

  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });

  try {
    if (shouldReset) {
      const deleted = await Sample.deleteMany({});
      console.log(`Reset enabled: removed ${deleted.deletedCount} existing rows.`);
    }

    const csvText = fs.readFileSync(datasetPath, "utf8");
    const rows = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const operations = rows.map((row, index) => {
      const normalized = normalizeRow(row, index + 1, datasetName);
      return {
        updateOne: {
          filter: { sample_key: normalized.sample_key },
          update: { $setOnInsert: normalized },
          upsert: true,
        },
      };
    });

    const result = await Sample.bulkWrite(operations, { ordered: false });
    const inserted = result.upsertedCount || 0;
    const skippedExisting = rows.length - inserted;

    console.log(`Dataset path: ${datasetPath}`);
    console.log(`Rows read from CSV: ${rows.length}`);
    console.log(`Inserted new rows: ${inserted}`);
    console.log(`Skipped existing/duplicate rows: ${skippedExisting}`);
    await printSummary();
  } finally {
    await mongoose.connection.close();
  }
}

run().catch((err) => {
  console.error("Import failed:", err.message);
  process.exit(1);
});
