import Demo from "../Demo";
import { pageMeta } from "../meta";

export const meta = () => pageMeta("zh-CN", "demo");

export default function Page() {
  return <Demo locale="zh-CN" />;
}
