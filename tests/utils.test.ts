import * as child_process from "child_process";
import { BumpType } from "../src/types";
import { bumpVersion, getCurrentVersion } from "../src/utils";

jest.mock("@actions/core");
jest.mock("child_process");

describe("Utils", () => {
  describe("getCurrentVersion", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const testCases = [
      {
        description: "return the provided current version if it is valid",
        inputs: {
          prefix: "v",
          postfix: "-beta",
          currentVersion: "1.2.3",
        },
        mockTags: null,
        expectedResult: "1.2.3",
      },
      {
        description: "return 0.0.0 if no valid tags are found",
        inputs: {
          prefix: "v",
          postfix: "-beta",
          currentVersion: "",
        },
        mockTags: "",
        expectedResult: "0.0.0",
      },
      {
        description: "return 0.0.0 if no valid tags are found",
        inputs: {
          prefix: "",
          postfix: "-beta",
          currentVersion: "",
        },
        mockTags: "v1.0.0-beta\nv1.1.0-beta\nv2.0.0-beta",
        expectedResult: "0.0.0",
      },
      {
        description:
          "filter tags by prefix and postfix and return the latest version",
        inputs: {
          prefix: "v",
          postfix: "-beta",
          currentVersion: "",
        },
        mockTags: "v1.0.0-beta\nv1.1.0-beta\nv2.0.0-beta",
        expectedResult: "2.0.0",
      },
      {
        description: "throw an error for invalid provided current version",
        inputs: {
          prefix: "v",
          postfix: "-beta",
          currentVersion: "1.2",
        },
        mockTags: null,
        expectedError: "Invalid semantic version: 1.2",
      },
    ];

    for (const testCase of testCases) {
      it(`should ${testCase.description}`, () => {
        const { prefix, postfix, currentVersion } = testCase.inputs;

        if (testCase.mockTags !== null) {
          (child_process.execSync as jest.Mock).mockReturnValue(
            testCase.mockTags,
          );
        }

        if (testCase.expectedError) {
          expect(() =>
            getCurrentVersion(prefix, postfix, currentVersion),
          ).toThrow(testCase.expectedError);
        } else {
          const result = getCurrentVersion(prefix, postfix, currentVersion);
          expect(result).toBe(testCase.expectedResult);

          if (testCase.mockTags !== null) {
            expect(child_process.execSync).toHaveBeenCalledWith(
              "git tag --list",
              {
                encoding: "utf-8",
              },
            );
          }
        }
      });
    }
  });

  describe("bumpVersion", () => {
    const testCases = [
      {
        description: "bump the major version",
        inputs: { version: "1.2.3", bumpType: BumpType.Major },
        expectedResult: "2.0.0",
      },
      {
        description: "bump the minor version",
        inputs: { version: "1.2.3", bumpType: BumpType.Minor },
        expectedResult: "1.3.0",
      },
      {
        description: "bump the patch version",
        inputs: { version: "1.2.3", bumpType: BumpType.Patch },
        expectedResult: "1.2.4",
      },
      {
        description: "throw an error for invalid semantic version 1.2",
        inputs: { version: "1.2", bumpType: BumpType.Patch },
        expectedError: "Invalid semantic version: 1.2",
      },
      {
        description: "throw an error for invalid semantic version 1.2.3.4",
        inputs: { version: "1.2.3.4", bumpType: BumpType.Patch },
        expectedError: "Invalid semantic version: 1.2.3.4",
      },
    ];

    for (const testCase of testCases) {
      it(`should ${testCase.description}`, () => {
        const { version, bumpType } = testCase.inputs;

        if (testCase.expectedError) {
          expect(() => bumpVersion(version, bumpType)).toThrow(
            testCase.expectedError,
          );
        } else {
          const result = bumpVersion(version, bumpType);
          expect(result).toBe(testCase.expectedResult);
        }
      });
    }
  });
});
