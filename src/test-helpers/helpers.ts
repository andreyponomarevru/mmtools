import fs from "fs";

export async function isPathExists(path: string) {
  return fs.promises.stat(path).then(
    () => true,
    () => false
  );
}
