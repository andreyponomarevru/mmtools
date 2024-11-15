import { init, onCtrlC } from "./validate-lib";

// Clean up and exit on Ctrl+C
process.on("SIGINT", onCtrlC);

init().catch(console.error);
