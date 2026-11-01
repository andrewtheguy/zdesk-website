import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/en.tsx"),
  route("demo", "routes/en-demo.tsx"),
  route("guides", "routes/en-guides.tsx"),
  route("guides/zdesk", "routes/en-zdesk-guide.tsx"),
  route("guides/wlshare", "routes/en-wlshare-guide.tsx"),
  route("wlshare", "routes/en-wlshare.tsx"),
  route("zh-CN", "routes/zh-CN.tsx"),
  route("zh-CN/demo", "routes/zh-CN-demo.tsx"),
  route("zh-CN/guides", "routes/zh-CN-guides.tsx"),
  route("zh-CN/guides/zdesk", "routes/zh-CN-zdesk-guide.tsx"),
  route("zh-CN/guides/wlshare", "routes/zh-CN-wlshare-guide.tsx"),
  route("zh-CN/wlshare", "routes/zh-CN-wlshare.tsx"),
  route("zh-TW", "routes/zh-TW.tsx"),
  route("zh-TW/demo", "routes/zh-TW-demo.tsx"),
  route("zh-TW/guides", "routes/zh-TW-guides.tsx"),
  route("zh-TW/guides/zdesk", "routes/zh-TW-zdesk-guide.tsx"),
  route("zh-TW/guides/wlshare", "routes/zh-TW-wlshare-guide.tsx"),
  route("zh-TW/wlshare", "routes/zh-TW-wlshare.tsx"),
] satisfies RouteConfig;
