import Home from "../Home";
import { localeMeta } from "../meta";

export const meta = () => localeMeta("zh-TW");

export default function Page() {
  return <Home locale="zh-TW" />;
}
