import Wlshare from "../Wlshare";
import { pageMeta } from "../meta";

export const meta = () => pageMeta("zh-TW", "wlshare");

export default function Page() {
  return <Wlshare locale="zh-TW" />;
}
