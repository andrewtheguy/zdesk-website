import Guide from "../Guide";
import { pageMeta } from "../meta";

export const meta = () => pageMeta("zh-TW", "guide");

export default function Page() {
  return <Guide locale="zh-TW" />;
}
