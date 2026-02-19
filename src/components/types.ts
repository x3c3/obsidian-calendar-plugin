import type { Moment } from "moment";
import type { TFile } from "obsidian";
import type { IGranularity } from "../periodic-notes";

export interface IDot {
  isFilled: boolean;
  color?: string;
  className?: string;
}

export interface IWeek {
  days: Moment[];
  weekNum: number;
}

export type IMonth = IWeek[];

export type IHTMLAttributes = Record<string, string | number | boolean>;

export interface IEvaluatedMetadata {
  value: number | string;
  dots: IDot[];
  attrs?: IHTMLAttributes;
}

export interface ISourceSettings {
  color: string;
  display: "calendar-and-menu" | "menu" | "none";
  order: number;
}

export interface IDayMetadata
  extends ICalendarSource,
    ISourceSettings,
    IEvaluatedMetadata {}

export interface IEventHandlers {
  onHover: (
    periodicity: IGranularity,
    date: Moment,
    file: TFile | null,
    targetEl: EventTarget,
    isMetaPressed: boolean,
  ) => void;
  onClick: (
    granularity: IGranularity,
    date: Moment,
    existingFile: TFile | null,
    inNewSplit: boolean,
  ) => void;
  onContextMenu: (
    granularity: IGranularity,
    date: Moment,
    file: TFile | null,
    event: MouseEvent,
  ) => void;
}

export interface ICalendarSource {
  id: string;
  name: string;

  getMetadata?: (
    granularity: IGranularity,
    date: Moment,
    file: TFile | null,
  ) => Promise<IEvaluatedMetadata>;

  defaultSettings: Record<string, string | number>;
}
