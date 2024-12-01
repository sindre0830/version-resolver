export interface ActionInputs {
  bumpType: BumpType;
  prefix: string;
  postfix: string;
  currentVersion: string;
}

export enum BumpType {
  Major = "major",
  Minor = "minor",
  Patch = "patch",
}
