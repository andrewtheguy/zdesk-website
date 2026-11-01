import Wlshare from "../Wlshare";
import { pageMeta } from "../meta";

export const meta = () => pageMeta("zh-CN", "wlshare");

export default function Page() {
  return <Wlshare locale="zh-CN" />;
}
