import Guides from "../Guides";
import { pageMeta } from "../meta";

export const meta = () => pageMeta("en", "guides");

export default function Page() {
  return <Guides locale="en" />;
}
