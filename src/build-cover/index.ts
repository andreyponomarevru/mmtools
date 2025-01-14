import { init } from "./init";

const m3uPathArg = process.argv[2];
const photoPathArg = process.argv[3];
const date = process.argv[4];

if (!m3uPathArg || !photoPathArg || !date) {
  console.log(
    "\nPlease, provide arguments in the following format:\n\n    <m3u playlist path> <photo path> <date>\n"
  );
  process.exit(1);
}

init({ m3uPath: m3uPathArg, photoPath: photoPathArg, date }).catch(
  console.error
);
