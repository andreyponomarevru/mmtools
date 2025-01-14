import fs from "fs";
import sizeof from "image-size";
import { describe, expect, it, jest } from "@jest/globals";
import { validateAudioFile } from "./validate-lib";
import { mmFacade } from "../music-metadata-facade";
import { COVER_MIN_SIZE } from "../config/constants";

jest.mock("image-size");
jest.mock("../music-metadata-facade");
jest.mock("fs", () => ({ promises: { appendFile: jest.fn() } }));

const invalidTrack = {
  meta: {
    year: undefined,
    title: undefined,
    artists: undefined,
    album: undefined,
    genre: undefined,
    bpm: undefined,
    label: undefined,
    bitrate: undefined,
  },
  cover: null,
} as any;
const validTrack = {
  meta: {
    year: 2025,
    title: "Title",
    artists: ["Artist"],
    album: "Album",
    genre: ["Ambient"],
    bpm: 0,
    label: "Label",
    bitrate: 320000,
  },
  cover: { type: "", data: new Uint8Array() },
} as any;
const cover = {
  width: COVER_MIN_SIZE,
  height: COVER_MIN_SIZE,
} as any;

describe("validateAudioFile", () => {
  beforeEach(() => jest.mocked(sizeof).mockReturnValue(cover));

  it("parses audio file", async () => {
    jest.mocked(mmFacade.parseFile).mockResolvedValue(invalidTrack);
    const filePath = "/path/to/file";
    await validateAudioFile(filePath);

    const calledTimes = jest.mocked(mmFacade.parseFile).mock.calls.length;
    const calledWithArg = jest.mocked(mmFacade.parseFile).mock.calls[0];
    expect(calledTimes).toBe(1);
    expect(calledWithArg).toEqual([filePath]);
  });

  it("writes all validation errors to disk, if there are any", async () => {
    jest.mocked(mmFacade.parseFile).mockResolvedValue({
      meta: {
        year: undefined,
        title: undefined,
        artists: undefined,
        genre: undefined,
        bpm: 125,
        label: undefined,
        bitrate: undefined,
      },
      cover: null,
    } as any);

    await validateAudioFile("/path/to/file");

    const calledTimes = jest.mocked(fs.promises.appendFile).mock.calls.length;
    expect(calledTimes).toBe(6);
  });

  describe("throwing error", () => {
    it("doesn't throw, if there are no validation errors", async () => {
      jest.mocked(mmFacade.parseFile).mockResolvedValue(validTrack);

      // TIP You don;t need 'await' here cause 'expect' expects the promise
      await expect(validateAudioFile("/path/to/file")).resolves.toBe(undefined);
    });

    describe("if the optional 'shouldThrow' arg is set to true", () => {
      it("throws, if there are validation errors", async () => {
        jest.mocked(mmFacade.parseFile).mockResolvedValue(invalidTrack);

        await expect(
          validateAudioFile("/path/to/file", true)
        ).rejects.toThrowError(`MISSING ID3 TAGS. See logs in /build dir\n`);
      });

      it("doesn't throw, if there are no validation errors", async () => {
        jest.mocked(mmFacade.parseFile).mockResolvedValue(validTrack);

        await expect(validateAudioFile("/path/to/file", true)).resolves.toBe(
          undefined
        );
      });
    });

    describe("if the optional 'shouldThrow' arg is set to false", () => {
      it("doesn't throw, if no validation errors", async () => {
        jest.mocked(mmFacade.parseFile).mockResolvedValue(validTrack);

        await expect(validateAudioFile("/path/to/file", false)).resolves.toBe(
          undefined
        );
      });

      it("doesn't throw, if there are validation errors", async () => {
        jest.mocked(mmFacade.parseFile).mockResolvedValue(invalidTrack);

        await expect(validateAudioFile("/path/to/file", false)).resolves.toBe(
          undefined
        );
      });
    });
  });
});
