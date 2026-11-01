import type { Guide, Locale } from "../content";
import type { GuideText } from "./links";
import wlshareEn from "./wlshare/en";
import wlshareZhCN from "./wlshare/zh-CN";
import wlshareZhTW from "./wlshare/zh-TW";
import zdeskEn from "./zdesk/en";
import zdeskZhCN from "./zdesk/zh-CN";
import zdeskZhTW from "./zdesk/zh-TW";

// Each guide's text, one file per locale.
export const guideText: Record<Guide, Record<Locale, GuideText>> = {
  zdesk: { en: zdeskEn, "zh-CN": zdeskZhCN, "zh-TW": zdeskZhTW },
  wlshare: { en: wlshareEn, "zh-CN": wlshareZhCN, "zh-TW": wlshareZhTW },
};
