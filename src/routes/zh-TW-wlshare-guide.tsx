import Guide from "../Guide";
import { pageMeta } from "../meta";

export const meta = () => pageMeta("zh-TW", "wlshare-guide");

export default function Page() {
  return <Guide locale="zh-TW" guide="wlshare" />;
}
