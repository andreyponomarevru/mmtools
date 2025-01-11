import { init } from "./init";
import { onCtrlC } from "./validate-lib";
import { LIB_PATH } from "../config/constants";

// Clean up and exit on Ctrl+C
process.on("SIGINT", onCtrlC);

init(LIB_PATH).catch(console.error);
