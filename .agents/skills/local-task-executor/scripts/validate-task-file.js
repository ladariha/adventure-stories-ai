const { readFile } = require("node:fs/promises");

const extractJsonBlock = (markdown) => {
  const match = markdown.match(/```json\s*([\s\S]*?)```/);

  if (!match) {
    throw new Error("No fenced json task block found.");
  }

  return match[1];
};

const requireObject = (value, message) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(message);
  }

  return value;
};

const requireString = (value, message) => {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(message);
  }

  return value;
};

const requireStringArray = (value, message) => {
  if (!Array.isArray(value)) {
    throw new Error(message);
  }

  for (const item of value) {
    if (typeof item !== "string" || item.length === 0) {
      throw new Error(message);
    }
  }

  return value;
};

const validateTask = (rawTask) => {
  const task = requireObject(rawTask, "Each task must be an object.");
  const taskId = requireString(task.id, "Task is missing id.");

  if (!/^T[0-9]{3}$/.test(taskId)) {
    throw new Error(`Task ${taskId} id must match T001 format.`);
  }

  requireString(task.title, `Task ${taskId} is missing title.`);
  requireString(task.objective, `Task ${taskId} is missing objective.`);
  requireString(task.expected, `Task ${taskId} is missing expected.`);
  requireString(task.rollback, `Task ${taskId} is missing rollback.`);
  requireStringArray(
    task.readFiles,
    `Task ${taskId} field readFiles must be a string array.`,
  );
  const editFiles = requireStringArray(
    task.editFiles,
    `Task ${taskId} field editFiles must be a non-empty string array.`,
  );
  requireStringArray(
    task.instructions,
    `Task ${taskId} field instructions must be a string array.`,
  );
  requireStringArray(
    task.verify,
    `Task ${taskId} field verify must be a string array.`,
  );

  if (editFiles.length === 0) {
    throw new Error(`Task ${taskId} must include at least one edit file.`);
  }
};

const validateTaskFile = (rawTaskFile) => {
  const taskFile = requireObject(rawTaskFile, "Task file must be an object.");

  requireString(taskFile.feature, "Task file is missing feature.");

  if (!Array.isArray(taskFile.tasks) || taskFile.tasks.length === 0) {
    throw new Error("Task file must include at least one task.");
  }

  for (const task of taskFile.tasks) {
    validateTask(task);
  }

  return taskFile.tasks.length;
};

const main = async () => {
  const taskPath = process.argv[2];

  if (!taskPath) {
    throw new Error(
      "Usage: node .agents/skills/local-task-executor/scripts/validate-task-file.js feature_name_tasks.md",
    );
  }

  const markdown = await readFile(taskPath, "utf8");
  const rawJson = extractJsonBlock(markdown);
  const taskFile = JSON.parse(rawJson);
  const taskCount = validateTaskFile(taskFile);

  console.log(`Validated ${taskPath} with ${taskCount} task(s).`);
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
