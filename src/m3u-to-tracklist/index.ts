import { init } from "./init";

const m3uPathArg = process.argv[2];

if (!m3uPathArg) {
  console.log("\nPlease, provide m3u playlist path.");
  process.exit(1);
}

init(m3uPathArg, true).catch(console.error);
