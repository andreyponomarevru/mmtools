import fs from "fs";
import { processBrokenM3Upaths } from "../utils";
import { validateM3UfilePaths } from "../utils";

const m3uPathArg = process.argv[2];

validateM3UfilePaths(m3uPathArg)
  .then(processBrokenM3Upaths)
  .then((trackPaths) => {
    return fs.promises.writeFile(
      "./build/track-paths.txt",
      trackPaths.join("\n")
    );
  });
