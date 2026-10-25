import type { Config } from "@react-router/dev/config";
import { routes } from "./site.config.mjs";

export default {
  appDirectory: "src",
  ssr: false,
  prerender: routes.map((r) => r.path),
} satisfies Config;
