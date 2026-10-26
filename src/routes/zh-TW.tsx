import Home from "../Home";
import { pageMeta } from "../meta";

export const meta = () => pageMeta("zh-TW", "home");

export default function Page() {
  return <Home locale="zh-TW" />;
}
