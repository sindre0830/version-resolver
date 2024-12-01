# Version Resolver

**Version Resolver** is a GitHub Action designed to resolve the next version tag based on semantic versioning rules. It retrieves and filters existing tags, allowing users to specify prefixes and postfixes for targeted version streams, and calculates the next version tag based on major, minor, or patch increments.

This action is particularly useful in release workflows, where it helps automate the process of determining the next version, ensuring consistent versioning across multiple release streams without manual intervention.

## Motivation

Managing version tags consistently across multiple release streams can be challenging, especially in environments with strict versioning standards or complex tag naming conventions. Manual calculations of the next version are prone to error, and filtering through existing tags can be time-consuming.

**Version Resolver** was created to simplify this process by automating the retrieval, filtering, and calculation of the next version tag. With support for customizable prefixes and postfixes, this action makes it easy to handle multiple release streams or semantic versioning policies, reducing the risk of errors and ensuring accuracy in your CI/CD workflows.

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
  version_resolve:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Resolve next version
        id: version_step
        uses: your-organization/version-resolver@v1
        with:
          bump_type: "minor"
          prefix: "v"

      - name: Print versions
        run: |
          echo "Next version: ${{ steps.version_step.outputs.next_version }}"
          echo "Previous version: ${{ steps.version_step.outputs.previous_version }}"
```

### Inputs

| Name             | Description                                      | Type     | Default/Required |
|------------------|--------------------------------------------------|----------|------------------|
| `bump_type`      | The type of bump to perform (`major`, `minor`, `patch`). | `string` | Required         |
| `prefix`         | The prefix to use for finding the current version. | `string` | Default: `''`    |
| `postfix`        | The postfix to use for finding the current version. | `string` | Default: `''`    |
| `current_version`| The current version to bump, if you prefer to provide it manually instead of detecting it. | `string` | Optional         |

### Outputs

| Name              | Description                                      |
|-------------------|--------------------------------------------------|
| `next_version`    | The next version without the prefix and postfix. |
| `previous_version`| The previous version without the prefix and postfix. |

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
