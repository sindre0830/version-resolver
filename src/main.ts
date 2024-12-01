import * as core from "@actions/core";
import { bumpVersion, getCurrentVersion, getInputs } from "./utils";

export async function execute(): Promise<void> {
  const inputs = getInputs();
  const currentVersion = getCurrentVersion(
    inputs.prefix,
    inputs.postfix,
    inputs.currentVersion,
  );

  const nextVersion = bumpVersion(currentVersion, inputs.bumpType);

  core.setOutput("next_version", nextVersion);
  core.setOutput("current_version", currentVersion);
}

async function run(): Promise<void> {
  try {
    await execute();
  } catch (error) {
    core.setFailed(`${error instanceof Error ? error.message : error}`);
  }
}

void run();
