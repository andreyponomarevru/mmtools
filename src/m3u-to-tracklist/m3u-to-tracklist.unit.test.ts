import { UtfString } from "utfstring";
import { describe, expect, it, jest } from "@jest/globals";
import { buildTracklistLine } from "./m3u-to-tracklist";

jest.mock("utfstring");

describe("buildTracklistLine", () => {
  const leftToRightTextMark = "\u200E";
  const track = {
    year: 2024,
    title: "Song Title",
    artists: ["Artist name 1", "Artist name 2"],
    label: "NotYoutBusiness Records",
    originaldate: "1995",
  };

  beforeEach(() => {
    jest
      .mocked(UtfString)
      .mockReturnValueOnce([track.artists.join(", ")] as any)
      .mockReturnValueOnce([track.title] as any);
  });

  it("returns the string matching the format `<artists> — <title> (<original date>/<year>, <label>)`, if all required props exist", async () => {
    const result = buildTracklistLine(track);

    expect(result).toBe(
      `${track.artists![0]}, ${track.artists![1]} — ${
        track.title
      } (${leftToRightTextMark}${track.originaldate}/${track.year}, ${
        track.label
      })`
    );
  });

  it("returns the string matching the format `<artists> — <title> (<year>, <label>)`, if 'originaldate' prop doesn't exist", async () => {
    const result = buildTracklistLine({ ...track, originaldate: undefined });

    expect(result).toBe(
      `${track.artists![0]}, ${track.artists![1]} — ${
        track.title
      } (${leftToRightTextMark}${track.year}, ${track.label})`
    );
  });
});
