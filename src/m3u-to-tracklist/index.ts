import { init } from "./init";

const m3uPath = process.argv[2];
const shouldThrowOnValidationErr = true;

if (!m3uPath) {
  console.log("\nPlease, provide m3u playlist path.");
  process.exit(1);
}

init(m3uPath, shouldThrowOnValidationErr).catch(console.error);
