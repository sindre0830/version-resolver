# [Action Name]

[Provide a concise description of what this GitHub Action does.]

## Motivation

[Provide a short description of the motivation you had when making this GitHub Action.]

---

## Usage Guide

To use this action in your workflow, reference it in a step using the `uses` keyword followed by the action reference `your-organization/your-action-name@v1`. Here's an example of how to include it in a workflow:

```yaml
name: Example Workflow

on:
  push:
    branches:
      - main

jobs:
  example_job:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Use this action
        uses: your-organization/your-action-name@v1
        with:
          input_name: "example"
```

### Inputs

| Name          | Description                           | Type     | Default/Required |
|---------------|---------------------------------------|----------|------------------|
| `input_name`  | [Description of the input]            | `string` | Required         |
| `another_input` | [Description of another input]       | `string` | `default_value`  |

### Outputs

| Name           | Description                         |
|----------------|-------------------------------------|
| `output_name`  | [Description of the output]         |
| `another_output` | [Description of another output]    |

---

## Development Guide

### Prerequisites

- Node.js v23 or later

### Setup

1. Install dependencies:

   ```bash
   npm install
   npm i -g @vercel/ncc
   ```

### Commands

| Command         | Description                                         | Script                                                                                   |
|------------------|-----------------------------------------------------|------------------------------------------------------------------------------------------|
| `npm run build`  | Compiles TypeScript files and prepares the action for publishing. | `tsc && ncc build`                                                                       |
| `npm run test`   | Executes unit tests using Jest.                     | `jest --config config/jest.config.js`                                                    |
| `npm run lint`   | Fixes linting issues in the source and test directories. | `npx @biomejs/biome check --config-path ./config/biome.json --write ./src ./tests`       |
| `npm run lint-check` | Reports linting issues without making changes.      | `npx @biomejs/biome check --config-path ./config/biome.json ./src ./tests`               |

### Managing Dependencies

- To add a dependency:

  ```bash
  npm install package-name
  ```

- To add a development dependency:

  ```bash
  npm install package-name --save-dev
  ```

### Upgrading Node Packages

1. Update the package version in `package.json` or run:

   ```bash
   npm install package-name@latest
   ```

2. Reset `package-lock.json` if necessary:

   ```bash
   rm package-lock.json
   npm install
   ```

   This regenerates the lock file with the latest versions allowed by `package.json`.
