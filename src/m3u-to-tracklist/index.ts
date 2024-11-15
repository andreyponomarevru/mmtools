import { init } from "./m3u-to-tracklist";

const m3uPathArg = process.argv[2];

init(m3uPathArg).catch(console.error);
