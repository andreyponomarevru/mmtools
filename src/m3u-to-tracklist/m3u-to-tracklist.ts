import { mmFacade } from "../music-metadata-facade";
import { UtfString } from "utfstring";
import { parseID3V2Array } from "../utils";

export type TracklistLineMeta = {
  artists?: string[];
  title?: string;
  year?: number;
  originaldate?: string;
};

export async function buildTracklistLine(meta: TracklistLineMeta) {
  const artists = new UtfString(parseID3V2Array(meta.artists || []).join(", "));
  const title = new UtfString(meta.title);
  const year = meta.originaldate ? meta.originaldate : meta.year;

  const leftToRightTextMark = "\u200E";

  return `${artists} — ${title} (${leftToRightTextMark}${year})`;
}

export async function m3uToTracklist(
  trackPaths: string[],
  buildTracklistLine: (meta: TracklistLineMeta) => Promise<string>
) {
  const tracklistAsText: string[] = [];

  for (const trackPath of trackPaths) {
    const { meta } = await mmFacade.parseFile(trackPath);
    tracklistAsText.push(await buildTracklistLine(meta));
  }

  const lines = tracklistAsText.join("\n");
  return lines;
}

export async function buildArtistsList(trackPaths: string[]) {
  const names = new Set<string>();

  for (const tPath of trackPaths) {
    const {
      meta: { artists = [] },
    } = await mmFacade.parseFile(tPath);

    const list = parseID3V2Array(artists);
    list.forEach((artist) => names.add(artist));
  }

  return [...names];
}
