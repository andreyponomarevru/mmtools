require("ts-node").register({ transpileOnly: true });

import fs from "fs/promises";
import { BUILD_DIR } from "../src/config";

const teardown = async () => {
  await fs.rmdir(BUILD_DIR[process.env.NODE_ENV!], { recursive: true });
};

module.exports = teardown;
