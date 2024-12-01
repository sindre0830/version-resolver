import * as child_process from "child_process";
import * as core from "@actions/core";
import type { ActionInputs } from "./types";
import { BumpType } from "./types";

export function getInputs(): ActionInputs {
  return {
    bumpType: core.getInput("bump_type", { required: true }) as BumpType,
    prefix: core.getInput("prefix"),
    postfix: core.getInput("postfix"),
    currentVersion: core.getInput("current_version"),
  };
}

export function getCurrentVersion(
  prefix: string,
  postfix: string,
  providedCurrentVersion: string,
): string {
  if (providedCurrentVersion) {
    if (!isValidSemver(providedCurrentVersion)) {
      throw new Error(`Invalid semantic version: ${providedCurrentVersion}`);
    }

    return providedCurrentVersion;
  }

  const tagsOutput = child_process.execSync("git tag --list", {
    encoding: "utf-8",
  });

  const tags = tagsOutput
    .split("\n")
    .map((tag) => tag.trim())
    .filter((tag) => tag);

  const filteredTags = tags.filter((tag) => {
    const strippedTag = tag.slice(prefix.length, tag.length - postfix.length);
    return (
      tag.startsWith(prefix) &&
      tag.endsWith(postfix) &&
      isValidSemver(strippedTag)
    );
  });

  if (filteredTags.length === 0) {
    return "0.0.0";
  }

  const sortedTags = filteredTags.sort((a, b) => {
    const versionA = a.slice(prefix.length, a.length - postfix.length);
    const versionB = b.slice(prefix.length, b.length - postfix.length);

    return compareSemver(versionA, versionB);
  });

  const latestTag = sortedTags[sortedTags.length - 1];
  return latestTag.slice(prefix.length, latestTag.length - postfix.length);
}

export function bumpVersion(version: string, bumpType: BumpType): string {
  if (!isValidSemver(version)) {
    throw new Error(`Invalid semantic version: ${version}`);
  }

  const [major, minor, patch] = version.split(".").map(Number);

  switch (bumpType) {
    case BumpType.Major:
      return `${major + 1}.0.0`;
    case BumpType.Minor:
      return `${major}.${minor + 1}.0`;
    case BumpType.Patch:
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Unknown bump type: ${bumpType}`);
  }
}

function compareSemver(versionA: string, versionB: string): number {
  const [majorA, minorA, patchA] = versionA.split(".").map(Number);
  const [majorB, minorB, patchB] = versionB.split(".").map(Number);

  if (majorA !== majorB) return majorA - majorB;
  if (minorA !== minorB) return minorA - minorB;
  return patchA - patchB;
}

function isValidSemver(version: string): boolean {
  const semverRegex = /^(\d+)\.(\d+)\.(\d+)$/;
  return semverRegex.test(version);
}
