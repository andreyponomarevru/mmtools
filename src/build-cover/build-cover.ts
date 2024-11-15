import fs from "fs";
import { processBrokenM3Upaths } from "../utils";
import { validateM3UfilePaths } from "../utils";

export async function init(m3uFilePath: string) {
  const paths = await validateM3UfilePaths(m3uFilePath);
  await processBrokenM3Upaths(paths.broken);
  await fs.promises.writeFile("./build/track-paths.txt", paths.ok.join("\n"));
}
