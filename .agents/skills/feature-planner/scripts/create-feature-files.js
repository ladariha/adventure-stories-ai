const { constants } = require("node:fs");
const { access, readFile, writeFile } = require("node:fs/promises");
const { join } = require("node:path");

const assetRoot = join(__dirname, "..", "assets");

const slugify = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const fileExists = async (path) => {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const writeFromTemplate = async (templatePath, outputPath, featureName) => {
  if (await fileExists(outputPath)) {
    throw new Error(`${outputPath} already exists.`);
  }

  const template = await readFile(templatePath, "utf8");
  const content = template.replaceAll("FEATURE_NAME", featureName);

  await writeFile(outputPath, content);
  console.log(`Created ${outputPath}`);
};

const main = async () => {
  const rawFeatureName = process.argv.slice(2).join(" ");

  if (!rawFeatureName) {
    throw new Error(
      "Usage: node .agents/skills/feature-planner/scripts/create-feature-files.js my-feature",
    );
  }

  const featureName = slugify(rawFeatureName);

  if (!featureName) {
    throw new Error("Feature name must include at least one letter or number.");
  }

  await writeFromTemplate(
    join(assetRoot, "implementation-template.md"),
    `feature_${featureName}_implementation.md`,
    featureName,
  );

  await writeFromTemplate(
    join(assetRoot, "tasks-template.md"),
    `feature_${featureName}_tasks.md`,
    featureName,
  );
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
