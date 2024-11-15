import * as mm from "music-metadata";

class MusicMetadataFacade {
  parser: typeof import("music-metadata");

  constructor(mm: typeof import("music-metadata")) {
    this.parser = mm;
  }

  async parseFile(path: string) {
    const track = await this.parser.default.parseFile(path, { duration: true });
    return {
      meta: { ...track.common, ...track.format },
      cover: mm.selectCover(track.common.picture),
    };
  }
}

export const mmFacade = new MusicMetadataFacade(mm);
