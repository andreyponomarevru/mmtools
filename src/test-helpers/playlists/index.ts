import fs from "fs";

export const m3uWithAbsolutePaths = {
  m3u: fs
    .readFileSync(
      "./src/test-helpers/playlists/absolute-path-test-saved-in-vlc.m3u"
    )
    .toString(),
  parsed: [
    "/mnt/CE64EB6A64EB53AD/music-lib/tracks/Carlos Niño & Friends - (I'm just) Chillin', on Fire [International Anthem 2023] (FLAC)/12. Woo, Acknowledgement.flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/tracks/P. Real|Albertas - Omakase Colors, Vol. 1/11-p__real__albertas--dedicated_2_u-46dd7eff.mp3",
    "/mnt/CE64EB6A64EB53AD/music-lib/tracks/Various Artists - 10 (2023) [FLAC] {MFM066}/02. The Zenmenn - The Legend Of Haziz.flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/tracks/Lexx - Cosmic Shift (2019) [WEB FLAC]/Lexx - Cosmic Shift - 06 Hot Weather Feat. Harriett Brown.flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/tracks/Calm & Jimi Tenor - Time and Space/05 Calm & Jimi Tenor - Time and Space (The Vendetta Suite Remix).flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/tracks/Slow Rotation Inc - Slow Rotation Inc/01 - A Light From Afar, The Beginning of The World.flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/tracks/[DSOFT_001] Jon Jones - Hyla (WEB FLAC)/Jon Jones - Jon Jones - Hyla EP - 01 This Must be the Place.flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/tracks/Khotin - Release Spirit(Electronic) [2023] 24-44.1/6. Fountain, Growth.flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/inbox-new/Chill_Pill_Volume_VI-2024/13-boys_shorts-come_into_my_world-ce4fbdf4.flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/tracks/03-Feel Fly - Esperanto (Gallo's Tropical Hinterhof Remix)-electrobuzz.net.mp3",
    "/mnt/CE64EB6A64EB53AD/music-lib/tracks/Calm - before/08 - Calm - Kunpoo.flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/inbox-new/Ten City - 2021 - Judgement (FLAC)/02 - Love Is Just A Game.flac",
  ],
};

export const m3uWithNonLatinChars = {
  m3u: fs
    .readFileSync(
      "./src/test-helpers/playlists/non-latin-chars-test-saved-in-vlc.m3u"
    )
    .toString(),
  parsed: [
    "/mnt/CE64EB6A64EB53AD/music-lib/tracks/VA – Vinyan Remixes [ST-004] (2021) [AIFF]/-  01 ٹرانس.aiff",
    "/mnt/CE64EB6A64EB53AD/music-lib/tracks/Various Artists - Partials III Hi-Res/Virusmoto - Partials III - 11 ᛪ.flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/tracks/Nmesh and t e l e p a t h テレパシー能力者 - ロストエデンへのパス/Nmesh - ロストエデンへのパス - 06 心はシダであります.flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/tracks/Nmesh and t e l e p a t h テレパシー能力者 - ロストエデンへのパス/Nmesh - ロストエデンへのパス - 11 夕暮れがやってきた.flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/tracks/Nmesh and t e l e p a t h テレパシー能力者 - ロストエデンへのパス/Nmesh - ロストエデンへのパス - 15 心痛を受け入れます (Zomby Version).flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/tracks/Nmesh and t e l e p a t h テレパシー能力者 - ロストエデンへのパス/Nmesh - ロストエデンへのパス - 02 アンチ技術のマジェスティックビューティー.flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/tracks/Гости Из Будущего - Беги От Меня/03. Гости Из Будущего - Время Песок.flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/tracks/Гости Из Будущего - Беги От Меня/08. Гости Из Будущего - Прощай.flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/tracks/VA – Vinyan Remixes [ST-004] (2021) [AIFF]/04 ٹرانس (Eternal Injection Mix).aiff",
    "/mnt/CE64EB6A64EB53AD/music-lib/tracks/VA – Vinyan Remixes [ST-004] (2021) [AIFF]/03 วิญญาณ (Full Circle's Lost In Translation Remix).aiff",
    "/mnt/CE64EB6A64EB53AD/music-lib/tracks/Sandspider - Spider/02. Sandspider - 1.19.flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/tracks/Metro - $1.15 Please.flac",
  ],
};

export const m3uWithRelativePathsSavedInVLC = {
  m3u: fs
    .readFileSync(
      "./src/test-helpers/playlists/relative-path-test-saved-in-vlc.m3u"
    )
    .toString(),
  parsed: [
    "music-lib/inbox-new/1993 - [GLR 002] Tayla - Bang The Drums – Remnants [FLAC]/B-Remnants.flac",
    "music-lib/inbox-new/CD2 - Those Things Remixed/06 - Miguel Migs - So Far (Rasmus Faber’s Farplane radio edit) [16-44].flac",
    "music-lib/inbox-new/CD2 - Those Things Remixed/12 - Miguel Migs - Fire (Cottonbelly remix) [16-44].flac",
  ],
};

export const m3uWithRelativePathsSavedInQuodLibet = {
  m3u: fs
    .readFileSync(
      "./src/test-helpers/playlists/relative-paths-test-saved-in-quod-libet.m3u"
    )
    .toString(),
  parsed: [
    "../tracks/Priori - Noogenesis (Echovolt Records; EvR029; 2018)/B1. Priori - Noogenesis.flac",
    "../tracks/Hilary - Just Before After Hours/Hilary - Reach For The Stars.mp3",
    "../tracks/03. Aural Float - Him & Her.flac",
    "../tracks/Deep Dish with Everything But The Girl - The Future Of The Future (Stay Gold)/02. Deep Dish with Everything But The Girl - The Future Of The Future (Stay Gold) (David Morales Radio Edit).flac",
  ],
};
