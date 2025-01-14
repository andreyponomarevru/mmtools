import fs from "fs";
import { exec, ExecException } from "child_process";
import { processBrokenM3Upaths } from "../utils";
import { validateM3UfilePaths } from "../utils";
import { EXTRACTED_COVERS_DIR } from "../config/constants";
import { init as extractCovers } from "../extract-covers/init";

type Init = { m3uPath: string; photoPath: string; date: string };

const callback = (
  err: ExecException | null,
  stdout: string,
  stderr: string
) => {
  console.log(stdout);

  if (err !== null) console.error(err);
};

export async function init({ m3uPath, photoPath, date }: Init) {
  const paths = await validateM3UfilePaths(m3uPath);
  await processBrokenM3Upaths(paths.broken);
  await fs.promises.writeFile("./build/track-paths.txt", paths.ok.join("\n"));

  await extractCovers(m3uPath);

  const CMD = `bash "./src/build-cover/build" "${photoPath}" "${date}" "./build/track-paths.txt" "${EXTRACTED_COVERS_DIR}"`;

  exec(CMD, callback);
}
