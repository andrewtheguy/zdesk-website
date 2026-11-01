import { REPO } from "../content";

// A file in the zdesk repository, the docs the guide leaves to it among them.
export const repo = (path: string) => `${REPO}/blob/main/${path}`;

export interface GuideText {
  intro: React.ReactNode;
  sections: { id: string; title: React.ReactNode; body: React.ReactNode }[];
}
