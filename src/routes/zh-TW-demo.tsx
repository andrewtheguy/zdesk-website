import Demo from "../Demo";
import { pageMeta } from "../meta";

export const meta = () => pageMeta("zh-TW", "demo");

export default function Page() {
  return <Demo locale="zh-TW" />;
}
