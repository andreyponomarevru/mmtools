import fs from "fs";

export async function isPathExists(path: string) {
  return fs.promises.stat(path).then(
    () => true,
    () => false
  );
}

export const TEST_LIB_PATH = "./test-data/music-lib";
export const PATH_TO_INVALID_TRACKS = `${TEST_LIB_PATH}/invalid-tags`;
export const PATH_TO_VALID_TRACKS = `${TEST_LIB_PATH}/valid-tags`;
