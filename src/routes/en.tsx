import Home from "../Home";
import { pageMeta } from "../meta";

export const meta = () => pageMeta("en", "home");

export default function Page() {
  return <Home locale="en" />;
}
