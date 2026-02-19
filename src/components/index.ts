import Calendar from "./Calendar.svelte";
import type {
  ICalendarSource,
  IDot,
  IEvaluatedMetadata,
  IEventHandlers,
  ISourceSettings,
} from "./types";

export { Calendar };
export type {
  ICalendarSource,
  IDot,
  IEvaluatedMetadata,
  IEventHandlers,
  ISourceSettings,
};
export { getDateUIDFromFile } from "./fileStore";
export {
  configureGlobalMomentLocale,
  type ILocaleOverride,
  type IWeekStartOption,
  weekdays,
} from "./localization";
