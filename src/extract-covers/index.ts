import { init } from "./extract-covers";

export const m3uPathArg = process.argv[2];

if (!m3uPathArg) {
  console.log("\nPlease, provide m3u playlist path\n");
  process.exit(1);
}

init(m3uPathArg).catch(console.error);
