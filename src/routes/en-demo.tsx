import Demo from "../Demo";
import { pageMeta } from "../meta";

export const meta = () => pageMeta("en", "demo");

export default function Page() {
  return <Demo locale="en" />;
}
