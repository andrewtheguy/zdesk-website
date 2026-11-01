import Guides from "../Guides";
import { pageMeta } from "../meta";

export const meta = () => pageMeta("zh-TW", "guides");

export default function Page() {
  return <Guides locale="zh-TW" />;
}
