import Wlshare from "../Wlshare";
import { pageMeta } from "../meta";

export const meta = () => pageMeta("en", "wlshare");

export default function Page() {
  return <Wlshare locale="en" />;
}
