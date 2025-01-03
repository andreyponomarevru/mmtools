import { UtfString } from "utfstring";
import { describe, expect, it, jest } from "@jest/globals";
import { mmFacade } from "../music-metadata-facade";
import { buildTracklistLine } from "./m3u-to-tracklist";
import { parseID3V2Array } from "../utils";

jest.mock("../utils");
jest.mock("../music-metadata-facade");
jest.mock("utfstring");

describe("buildTracklistLine", () => {
  const leftToRightTextMark = "\u200E";
  const artists = ["Artist name 1", "Artist name 2"];
  const title = "Song Title";
  const cover = { format: "", data: Buffer.from([]) };

  it("uses the `originaldate` ID3 tag if it exists", async () => {
    const parsedTrack = {
      meta: { artists, title, year: 2024, originaldate: 1976 },
      cover,
    } as any;
    jest.mocked(mmFacade).parseFile.mockResolvedValueOnce(parsedTrack);
    jest.mocked(parseID3V2Array).mockReturnValueOnce([]);
    jest
      .mocked(UtfString)
      .mockReturnValueOnce([parsedTrack.meta.artists!.join(", ")] as any)
      .mockReturnValueOnce([parsedTrack.meta.title] as any);

    const result = await buildTracklistLine(parsedTrack.meta);

    expect(result).toBe(
      `${parsedTrack.meta.artists[0]}, ${parsedTrack.meta.artists[1]} — ${parsedTrack.meta.title} (${leftToRightTextMark}${parsedTrack.meta.originaldate})`
    );
  });

  it("uses the `year` ID3 tag if the `original date` ID3 tag is absent", async () => {
    const parsedTrack = {
      meta: { artists, title, year: 2024, originaldate: undefined },
      cover,
    } as any;
    jest.mocked(mmFacade).parseFile.mockResolvedValueOnce(parsedTrack);
    jest.mocked(parseID3V2Array).mockReturnValueOnce([]);
    jest
      .mocked(UtfString)
      .mockReturnValueOnce([parsedTrack.meta.artists!.join(", ")] as any)
      .mockReturnValueOnce([parsedTrack.meta.title] as any);

    const result = await buildTracklistLine(parsedTrack.meta);

    expect(result).toBe(
      `${parsedTrack.meta.artists[0]}, ${parsedTrack.meta.artists[1]} — ${parsedTrack.meta.title} (${leftToRightTextMark}${parsedTrack.meta.year})`
    );
  });

  it("returns the line corresponding to the format `<artists> — <title> (<year>)`", async () => {
    const parsedTrack = { meta: { artists, title, year: 2024 }, cover } as any;
    jest.mocked(mmFacade).parseFile.mockResolvedValueOnce(parsedTrack);
    jest.mocked(parseID3V2Array).mockReturnValueOnce([]);
    jest
      .mocked(UtfString)
      .mockReturnValueOnce([parsedTrack.meta.artists!.join(", ")] as any)
      .mockReturnValueOnce([parsedTrack.meta.title] as any);

    const result = await buildTracklistLine(parsedTrack.meta);

    expect(result).toBe(
      `${parsedTrack.meta.artists[0]}, ${parsedTrack.meta.artists[1]} — ${parsedTrack.meta.title} (${leftToRightTextMark}${parsedTrack.meta.year})`
    );
  });
});
