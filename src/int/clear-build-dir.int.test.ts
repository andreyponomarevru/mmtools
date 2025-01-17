import fs from "fs";
import { describe, expect } from "@jest/globals";
import { clearDir } from "../utils";
import { clearDir as clearDirHelper } from "../test-helpers/helpers";
import { BUILD_DIR } from "../config/constants";

async function createFilesHelper() {
  await fs.promises.mkdir(`${BUILD_DIR}/test`, { recursive: true });
  await fs.promises.writeFile(`${BUILD_DIR}/test/a.txt`, "string");
  await fs.promises.writeFile(`${BUILD_DIR}/test/b.png`, "string");
  await fs.promises.writeFile(`${BUILD_DIR}/test/c.svg`, "string");
  await fs.promises.writeFile(`${BUILD_DIR}/d.txt`, "string");
  await fs.promises.writeFile(`${BUILD_DIR}/e.md`, "string");
}

describe("clearDir", () => {
  beforeEach(async () => await createFilesHelper);
  afterEach(async () => await clearDirHelper(BUILD_DIR));

  test("clears the dir removing all nested dirs and files", async () => {
    clearDir(BUILD_DIR);

    await expect(fs.promises.readdir(BUILD_DIR)).resolves.toEqual([]);
  });

  test("if dir doesn't exist, returns without error", async () => {
    expect(clearDir(BUILD_DIR + "/fsdf/")).toBe(undefined);
  });
});
