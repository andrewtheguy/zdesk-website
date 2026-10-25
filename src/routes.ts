import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/en.tsx"),
  route("zh-CN", "routes/zh-CN.tsx"),
  route("zh-TW", "routes/zh-TW.tsx"),
] satisfies RouteConfig;
