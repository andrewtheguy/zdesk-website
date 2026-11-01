import type { ReactNode } from "react";
import type { Locale } from "../content";
import type { IconName } from "../guides/visuals";
import en from "./en";
import zhCN from "./zh-CN";
import zhTW from "./zh-TW";

export interface WlshareText {
  // The page's title, before the site's name, and its description.
  title: string;
  description: string;
  tagline: string;
  intro: ReactNode;
  // The hero's links: to the guide, to the demo, and to the source.
  setUp: string;
  seeInAction: string;
  source: string;
  heroCaption: ReactNode;
  features: { icon: IconName; title: string; body: ReactNode }[];
  sections: { id: string; title: ReactNode; body: ReactNode }[];
}

export const wlshareText: Record<Locale, WlshareText> = { en, "zh-CN": zhCN, "zh-TW": zhTW };
