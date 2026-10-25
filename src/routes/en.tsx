import Home from "../Home";
import { localeMeta } from "../meta";

export const meta = () => localeMeta("en");

export default function Page() {
  return <Home locale="en" />;
}
