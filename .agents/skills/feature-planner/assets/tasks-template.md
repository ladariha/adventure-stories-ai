# Feature FEATURE_NAME Tasks

## Overview

Summarize the sequential implementation work for the executor agent.

```json
{
  "feature": "FEATURE_NAME",
  "tasks": [
    {
      "id": "T001",
      "title": "First bounded implementation task",
      "objective": "Explain the specific outcome this task should produce.",
      "readFiles": [
        "path/to/context-file.ts"
      ],
      "editFiles": [
        "path/to/file-to-edit.ts"
      ],
      "instructions": [
        "Follow the existing local pattern.",
        "Keep the change narrowly scoped.",
        "Always prefer const over function in TypeScript."
      ],
      "verify": [
        "replace-with-project-verification-command"
      ],
      "expected": "The verification command passes and the requested behavior is present.",
      "rollback": "Revert only this task's edits if verification fails and repair is not obvious."
    }
  ]
}
```
