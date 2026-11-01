import Guide from "../Guide";
import { pageMeta } from "../meta";

export const meta = () => pageMeta("zh-CN", "zdesk-guide");

export default function Page() {
  return <Guide locale="zh-CN" guide="zdesk" />;
}
