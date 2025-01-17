import {
  BUILD_COVER_SCRIPT_PATH,
  BUILD_DIR,
  EXTRACTED_COVERS_DIR,
  NUMBER_OF_COVER_VERSIONS_TO_CREATE,
} from "../config/constants";
import { clearDir } from "../utils";
import { spawnBuildCoversScript } from "./spawn";
import { init as extractCovers } from "../extract-covers/init";

const m3uPath = process.argv[2];
const photoPath = process.argv[3];
const date = process.argv[4];

if ([m3uPath, photoPath, date].some((arg) => arg === undefined)) {
  console.log(
    "\nPlease, provide all arguments in the following format:\n\n    <m3u playlist path> <photo path> <date>\n"
  );
  process.exit(1);
}

const config = {
  buildDir: BUILD_DIR,
  extractedCoversDir: EXTRACTED_COVERS_DIR,
  photoPath,
  date,
  coversCount: NUMBER_OF_COVER_VERSIONS_TO_CREATE,
};

clearDir(BUILD_DIR);

extractCovers(m3uPath)
  .then(() => spawnBuildCoversScript(BUILD_COVER_SCRIPT_PATH, config))
  .catch(console.error);
