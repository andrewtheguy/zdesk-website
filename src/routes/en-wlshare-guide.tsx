import Guide from "../Guide";
import { pageMeta } from "../meta";

export const meta = () => pageMeta("en", "wlshare-guide");

export default function Page() {
  return <Guide locale="en" guide="wlshare" />;
}
