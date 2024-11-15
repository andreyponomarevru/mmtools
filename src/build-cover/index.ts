import { init } from "./build-cover";

const m3uPathArg = process.argv[2];

init(m3uPathArg).catch(console.error);
