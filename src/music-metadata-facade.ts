import * as mm from "music-metadata";

type Parser = typeof import("music-metadata");

class MusicMetadataFacade {
  parser: Parser;

  constructor(mm: Parser) {
    this.parser = mm;
  }

  async parseFile(path: string) {
    const track = await this.parser.parseFile(path, { duration: true });
    return {
      meta: {
        year: track.common.year,
        title: track.common.title,
        artists: track.common.artists,
        album: track.common.album,
        originaldate: track.common.originaldate,
        genre: track.common.genre,
        label: track.common.label ? track.common.label[0] : undefined,
        bpm: track.common.bpm,
        catalognumber: track.common.catalognumber,
        format: track.format.duration,
        bitrate: track.format.bitrate,
      },
      cover: mm.selectCover(track.common.picture),
    };
  }
}

export const mmFacade = new MusicMetadataFacade(mm);
