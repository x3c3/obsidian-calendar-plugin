import type { Moment } from "moment";
import type { TFile } from "obsidian";
import {
  getDailyNoteSettings,
  getMonthlyNoteSettings,
  getQuarterlyNoteSettings,
  getWeeklyNoteSettings,
  getYearlyNoteSettings,
} from "./settings";
import type { IGranularity } from "./types";

export function getDateUID(
  date: Moment,
  granularity: IGranularity = "day",
): string {
  const ts = date.clone().startOf(granularity).format();
  return `${granularity}-${ts}`;
}

function removeEscapedCharacters(format: string): string {
  return format.replace(/\[[^\]]*\]/g, "");
}

function isFormatAmbiguous(format: string, granularity: IGranularity): boolean {
  if (granularity === "week") {
    const cleanFormat = removeEscapedCharacters(format);
    return (
      /w{1,2}/i.test(cleanFormat) &&
      (/M{1,4}/.test(cleanFormat) || /D{1,4}/.test(cleanFormat))
    );
  }
  return false;
}

function basename(fullPath: string): string {
  let base = fullPath.substring(fullPath.lastIndexOf("/") + 1);
  if (base.lastIndexOf(".") !== -1) {
    base = base.substring(0, base.lastIndexOf("."));
  }
  return base;
}

function getDateFromFilename(
  filename: string,
  granularity: IGranularity,
): Moment | null {
  const getSettings = {
    day: getDailyNoteSettings,
    week: getWeeklyNoteSettings,
    month: getMonthlyNoteSettings,
    quarter: getQuarterlyNoteSettings,
    year: getYearlyNoteSettings,
  };
  const format = getSettings[granularity]().format?.split("/").pop() ?? "";
  const noteDate = window.moment(filename, format, true);
  if (!noteDate.isValid()) {
    return null;
  }
  if (isFormatAmbiguous(format, granularity)) {
    if (granularity === "week") {
      const cleanFormat = removeEscapedCharacters(format);
      if (/w{1,2}/i.test(cleanFormat)) {
        return window.moment(
          filename,
          format.replace(/M{1,4}/g, "").replace(/D{1,4}/g, ""),
          false,
        );
      }
    }
  }
  return noteDate;
}

export function getDateFromFile(
  file: TFile,
  granularity: IGranularity,
): Moment | null {
  return getDateFromFilename(file.basename, granularity);
}

export function getDateFromPath(
  path: string,
  granularity: IGranularity,
): Moment | null {
  return getDateFromFilename(basename(path), granularity);
}
