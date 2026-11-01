import Guide from "../Guide";
import { pageMeta } from "../meta";

export const meta = () => pageMeta("zh-TW", "zdesk-guide");

export default function Page() {
  return <Guide locale="zh-TW" guide="zdesk" />;
}
