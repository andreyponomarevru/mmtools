import { init } from "./init";

const m3uPath = process.argv[2];

if (!m3uPath) {
  console.log("\nPlease, provide m3u playlist path\n");
  process.exit(1);
}

init(m3uPath).catch(console.error);
