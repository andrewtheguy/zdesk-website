import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/en.tsx"),
  route("demo", "routes/en-demo.tsx"),
  route("zh-CN", "routes/zh-CN.tsx"),
  route("zh-CN/demo", "routes/zh-CN-demo.tsx"),
  route("zh-TW", "routes/zh-TW.tsx"),
  route("zh-TW/demo", "routes/zh-TW-demo.tsx"),
] satisfies RouteConfig;
