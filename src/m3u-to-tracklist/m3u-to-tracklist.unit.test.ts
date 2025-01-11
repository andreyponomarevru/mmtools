import { UtfString } from "utfstring";
import { describe, expect, it, jest } from "@jest/globals";
import { mmFacade } from "../music-metadata-facade";
import { buildTracklistLine } from "./m3u-to-tracklist";

jest.mock("../music-metadata-facade");
jest.mock("utfstring");

describe("buildTracklistLine", () => {
  const leftToRightTextMark = "\u200E";
  const parsedTrack: Awaited<ReturnType<typeof mmFacade.parseFile>> = {
    meta: {
      year: 2024,
      title: "Song Title",
      artists: ["Artist name 1", "Artist name 2"],
      album: undefined,
      genre: undefined,
      bpm: undefined,
      label: undefined,
      catalognumber: undefined,
      format: undefined,
      bitrate: undefined,
      originaldate: undefined,
    },
    cover: { format: "", data: Buffer.from([]) },
  };

  it("uses the `originaldate` prop, if it exists", async () => {
    const track = {
      ...parsedTrack,
      meta: { ...parsedTrack.meta, originaldate: "1976" },
    };
    jest.mocked(mmFacade).parseFile.mockResolvedValueOnce(track);

    const result = await buildTracklistLine(parsedTrack.meta);

    expect(result).toContain(String(parsedTrack.meta.originaldate));
  });

  it("uses the `year` prop, if the `originaldate` is undefined", async () => {
    jest.mocked(mmFacade).parseFile.mockResolvedValueOnce(parsedTrack);

    const result = await buildTracklistLine(parsedTrack.meta);

    expect(result).toContain(String(parsedTrack.meta.year));
  });

  it("returns the string matching the format `<artists> — <title> (<year>)`, if all required props exist", async () => {
    jest.mocked(mmFacade).parseFile.mockResolvedValueOnce(parsedTrack);
    jest
      .mocked(UtfString)
      .mockReturnValueOnce([parsedTrack.meta.artists!.join(", ")] as any)
      .mockReturnValueOnce([parsedTrack.meta.title] as any);

    const result = await buildTracklistLine(parsedTrack.meta);

    expect(result).toBe(
      `${parsedTrack.meta.artists![0]}, ${parsedTrack.meta.artists![1]} — ${
        parsedTrack.meta.title
      } (${leftToRightTextMark}${parsedTrack.meta.year})`
    );
  });
});
