import type { ReactNode } from "react";

export type Locale = "en" | "zh-CN" | "zh-TW";

export const locales: { id: Locale; path: string; label: string }[] = [
  { id: "en", path: "/", label: "English" },
  { id: "zh-CN", path: "/zh-CN", label: "简体中文" },
  { id: "zh-TW", path: "/zh-TW", label: "繁體中文" },
];

export function localeForPath(pathname: string): Locale {
  const path = pathname.replace(/\/$/, "") || "/";
  return locales.find((l) => l.path === path)?.id ?? "en";
}

const REPO = "https://github.com/andrewtheguy/zdesk";
const RELEASE = `${REPO}/releases/latest`;
const LICENSE = `${REPO}/blob/main/LICENSE`;

export const INSTALL_COMMAND = `curl -fsSLO ${RELEASE}/download/zdesk-linux-amd64.deb
sudo apt install ./zdesk-linux-amd64.deb`;

export interface Demo {
  id: string;
  video: string;
  portrait?: boolean;
}

export const demos: Demo[] = [
  { id: "windows-to-mac-one-display", video: "windows-to-mac-one-display.mp4" },
  { id: "windows-to-mac-two-displays", video: "windows-to-mac-two-displays.mp4" },
  { id: "ios-to-windows", video: "ios-to-windows.mp4", portrait: true },
  { id: "ios-to-mac", video: "ios-to-mac.mp4", portrait: true },
  { id: "mac-to-windows", video: "mac-to-windows-hidpi-audio.mp4" },
  { id: "mac-to-linux", video: "mac-to-linux-wlshare-hidpi-audio.mp4" },
];

export interface Content {
  description: string;
  tagline: string;
  links: { label: string; href: string; primary?: boolean }[];
  intro: string;
  targets: ReactNode[];
  hosts: string;
  diagram: string;
  display: string;
  demoHeading: string;
  demos: Record<string, { title: string; caption?: string }>;
  quickStartHeading: string;
  quickStart: ReactNode;
  docs: ReactNode;
  footer: ReactNode;
}

function docs(locale: Locale) {
  const suffix = locale === "en" ? "" : `.${locale}`;
  return {
    readme: `${REPO}/blob/main/README${suffix}.md`,
    guide: `${REPO}/blob/main/docs/guide${suffix}.md`,
    install: `${REPO}/blob/main/docs/install${suffix}.md`,
    wlshare: `https://github.com/andrewtheguy/wlshare${locale === "en" ? "" : `/blob/main/README${suffix}.md`}`,
  };
}

const en = docs("en");
const zhCN = docs("zh-CN");
const zhTW = docs("zh-TW");

export const content: Record<Locale, Content> = {
  en: {
    description:
      "Remote desktop in a browser, for Windows' own Remote Desktop, macOS's built-in Screen Sharing, and Linux through wlshare, our own VNC server for wlroots compositors.",
    tagline:
      "Remote desktop in a browser, for Windows' and macOS's own remote desktop servers, and for Linux through wlshare.",
    links: [
      { label: "Download the latest release", href: RELEASE, primary: true },
      { label: "Source on GitHub", href: REPO },
      { label: "Using zDesk", href: en.guide },
      { label: "Installing zDesk", href: en.install },
    ],
    intro: "zDesk is a small gateway you run next to your machines. It connects to:",
    targets: [
      <><strong>Windows 10 and 11's own Remote Desktop</strong>, over RDP with its modern graphics pipeline.</>,
      <><strong>macOS's built-in Screen Sharing</strong>, in both of its modes: Standard and High Performance.</>,
      <><strong>Linux</strong>, through <a href={en.wlshare}>wlshare</a>, our own VNC server for wlroots compositors.</>,
      <>Other RDP and VNC servers, through each protocol's baseline.</>,
    ],
    hosts:
      "Windows and macOS need nothing installed on the host, only their own sharing switched on. The gateway serves one web page that shows the desktop, so anything with a browser, on Windows, macOS, Linux, iOS or Android, reaches every one of them with no client to install either.",
    diagram: "browser ── HTTPS or localhost ── zDesk ── RDP / VNC ── your desktops",
    display:
      "The display follows the browser window at its screen density, so a Retina or HiDPI display is sharp and shown at its true size. The remote's own picture is decoded in the browser where the host provides one, with sound, clipboard, two displays in two tabs, and a touch-screen interface for phones and tablets.",
    demoHeading: "Demo",
    demos: {
      "windows-to-mac-one-display": { title: "Windows → Mac with one remote virtual display" },
      "windows-to-mac-two-displays": {
        title: "Windows → Mac with two remote virtual displays",
        caption:
          "Two remote virtual displays shown in separate browser tabs, with a window dragged across displays right between the two tabs.",
      },
      "ios-to-windows": {
        title: "iOS → Windows",
        caption:
          "Safari on iOS connected to Windows' own Remote Desktop, scrolling horizontally with a two-finger swipe left or right.",
      },
      "ios-to-mac": {
        title: "iOS → Mac",
        caption:
          "Safari on iOS connected to a Mac's High Performance Screen Sharing, scrolling horizontally, with the network throughput meter shown.",
      },
      "mac-to-windows": {
        title: "Mac → Windows at Retina/HiDPI density with audio",
        caption:
          "Windows' own Remote Desktop shown at the Mac's Retina/HiDPI density, with the remote's sound playing in the browser.",
      },
      "mac-to-linux": {
        title: "Mac → Linux (wlshare on Sway) at Retina/HiDPI density with audio",
        caption:
          "wlshare on Sway shown at the Mac's Retina/HiDPI density, with the remote's sound, and the remote desktop resizing to follow the browser into and out of immersive full screen.",
      },
    },
    quickStartHeading: "Quick start",
    quickStart: (
      <>Install the package for your platform from the <a href={RELEASE}>latest release</a>. On Debian 13 or Ubuntu 24.04 and later:</>
    ),
    docs: (
      <><a href={en.install}>Installing zDesk</a> covers every platform, and <a href={en.guide}>Using zDesk</a> the browser client and setting up Windows, Mac, wlshare and VNC targets.</>
    ),
    footer: (
      <>zDesk is under the <a href={LICENSE}>MIT licence</a>. zDesk is still settling its direction and keeps no backward compatibility between releases; see the <a href={`${REPO}#readme`}>README</a>.</>
    ),
  },
  "zh-CN": {
    description:
      "在浏览器中使用远程桌面，连接 Windows 自带的远程桌面、macOS 内置的屏幕共享，以及 Linux 上的 wlshare，这是我们自己为 wlroots 合成器编写的 VNC 服务器。",
    tagline: "在浏览器中使用远程桌面，连接 Windows 和 macOS 自带的远程桌面服务器，以及 Linux 上的 wlshare。",
    links: [
      { label: "下载最新发布", href: RELEASE, primary: true },
      { label: "GitHub 上的源代码", href: zhCN.readme },
      { label: "使用 zDesk", href: zhCN.guide },
      { label: "安装 zDesk", href: zhCN.install },
    ],
    intro: "zDesk 是一个小型网关，运行在你的机器旁边。它可以连接：",
    targets: [
      <><strong>Windows 10 和 11 自带的远程桌面</strong>，通过 RDP 及其现代图形管道。</>,
      <><strong>macOS 内置的屏幕共享</strong>，两种模式都支持：标准（Standard）和高性能（High Performance）。</>,
      <><strong>Linux</strong>，通过 <a href={zhCN.wlshare}>wlshare</a>，这是我们自己为 wlroots 合成器编写的 VNC 服务器。</>,
      <>其他 RDP 和 VNC 服务器，通过各协议的基础功能。</>,
    ],
    hosts:
      "Windows 和 macOS 主机无需安装任何软件，只需打开系统自带的共享功能。网关提供一个显示桌面的网页，因此任何有浏览器的设备，无论是 Windows、macOS、Linux、iOS 还是 Android，同样无需安装客户端即可访问上述所有桌面。",
    diagram: "浏览器 ── HTTPS 或 localhost ── zDesk ── RDP / VNC ── 你的桌面",
    display:
      "显示器会以浏览器窗口的屏幕密度跟随窗口大小，因此在 Retina 或 HiDPI 显示器上清晰且按真实尺寸显示。主机提供自身画面时，直接在浏览器中解码；并带有声音、剪贴板、分两个标签页显示的两个显示器，以及面向手机和平板的触屏界面。",
    demoHeading: "演示",
    demos: {
      "windows-to-mac-one-display": { title: "Windows → 带一个远程虚拟显示器的 Mac" },
      "windows-to-mac-two-displays": {
        title: "Windows → 带两个远程虚拟显示器的 Mac",
        caption: "两个远程虚拟显示器分别显示在不同的浏览器标签页中，窗口可以在两个标签页之间直接跨显示器拖动。",
      },
      "ios-to-windows": {
        title: "iOS → Windows",
        caption: "iOS 上的 Safari 连接 Windows 自带的远程桌面，双指左右滑动即可水平滚动。",
      },
      "ios-to-mac": {
        title: "iOS → Mac",
        caption: "iOS 上的 Safari 连接 Mac 的高性能模式屏幕共享，支持水平滚动，并显示网络吞吐量指示。",
      },
      "mac-to-windows": {
        title: "Mac → Windows，Retina/HiDPI 密度并带声音",
        caption: "以 Mac 的 Retina/HiDPI 密度显示 Windows 自带的远程桌面，并在浏览器中播放远程的声音。",
      },
      "mac-to-linux": {
        title: "Mac → Linux（Sway 上的 wlshare），Retina/HiDPI 密度并带声音",
        caption:
          "以 Mac 的 Retina/HiDPI 密度显示 Sway 上的 wlshare，带远程的声音，进入和退出沉浸式全屏时远程桌面会随浏览器调整大小。",
      },
    },
    quickStartHeading: "快速开始",
    quickStart: (
      <>从<a href={RELEASE}>最新发布</a>安装适合你平台的软件包。在 Debian 13 或 Ubuntu 24.04 及更高版本上：</>
    ),
    docs: (
      <><a href={zhCN.install}>安装 zDesk</a> 涵盖所有平台；<a href={zhCN.guide}>使用 zDesk</a> 介绍浏览器客户端，以及如何设置 Windows、Mac、wlshare 和 VNC 目标。</>
    ),
    footer: (
      <>zDesk 采用 <a href={LICENSE}>MIT 许可证</a>。zDesk 的方向仍在调整中，版本之间不保证向后兼容；详见 <a href={zhCN.readme}>README</a>。</>
    ),
  },
  "zh-TW": {
    description:
      "在瀏覽器中使用遠端桌面，連線 Windows 內建的遠端桌面、macOS 內建的螢幕共享，以及 Linux 上的 wlshare，這是我們自己為 wlroots 合成器撰寫的 VNC 伺服器。",
    tagline: "在瀏覽器中使用遠端桌面，連線 Windows 和 macOS 內建的遠端桌面伺服器，以及 Linux 上的 wlshare。",
    links: [
      { label: "下載最新發行版", href: RELEASE, primary: true },
      { label: "GitHub 上的原始碼", href: zhTW.readme },
      { label: "使用 zDesk", href: zhTW.guide },
      { label: "安裝 zDesk", href: zhTW.install },
    ],
    intro: "zDesk 是一個小型閘道，執行在你的電腦旁邊。它可以連線到：",
    targets: [
      <><strong>Windows 10 和 11 內建的遠端桌面</strong>，透過 RDP 及其新式圖形管線。</>,
      <><strong>macOS 內建的螢幕共享</strong>，兩種模式都支援：標準（Standard）和高效能（High Performance）。</>,
      <><strong>Linux</strong>，透過 <a href={zhTW.wlshare}>wlshare</a>，這是我們自己為 wlroots 合成器撰寫的 VNC 伺服器。</>,
      <>其他 RDP 和 VNC 伺服器，透過各協定的基本功能。</>,
    ],
    hosts:
      "Windows 和 macOS 主機不需要安裝任何軟體，只要開啟系統內建的共享功能即可。閘道提供一個顯示桌面的網頁，因此任何有瀏覽器的裝置，無論是 Windows、macOS、Linux、iOS 還是 Android，同樣不需要安裝用戶端就能存取上述所有桌面。",
    diagram: "瀏覽器 ── HTTPS 或 localhost ── zDesk ── RDP / VNC ── 你的桌面",
    display:
      "顯示器會以瀏覽器視窗的螢幕密度跟隨視窗大小，因此在 Retina 或 HiDPI 顯示器上清晰且以真實尺寸顯示。主機提供自身畫面時，直接在瀏覽器中解碼；並帶有聲音、剪貼簿、分兩個分頁顯示的兩個顯示器，以及為手機和平板設計的觸控介面。",
    demoHeading: "示範",
    demos: {
      "windows-to-mac-one-display": { title: "Windows → 有一個遠端虛擬顯示器的 Mac" },
      "windows-to-mac-two-displays": {
        title: "Windows → 有兩個遠端虛擬顯示器的 Mac",
        caption: "兩個遠端虛擬顯示器分別顯示在不同的瀏覽器分頁中，視窗可以在兩個分頁之間直接跨顯示器拖曳。",
      },
      "ios-to-windows": {
        title: "iOS → Windows",
        caption: "iOS 上的 Safari 連線到 Windows 內建的遠端桌面，雙指左右滑動即可水平捲動。",
      },
      "ios-to-mac": {
        title: "iOS → Mac",
        caption: "iOS 上的 Safari 連線到 Mac 的高效能模式螢幕共享，支援水平捲動，並顯示網路傳輸量指示。",
      },
      "mac-to-windows": {
        title: "Mac → Windows，Retina/HiDPI 密度並帶聲音",
        caption: "以 Mac 的 Retina/HiDPI 密度顯示 Windows 內建的遠端桌面，並在瀏覽器中播放遠端的聲音。",
      },
      "mac-to-linux": {
        title: "Mac → Linux（Sway 上的 wlshare），Retina/HiDPI 密度並帶聲音",
        caption:
          "以 Mac 的 Retina/HiDPI 密度顯示 Sway 上的 wlshare，帶有遠端的聲音，進入和離開沉浸式全螢幕時，遠端桌面會隨瀏覽器調整大小。",
      },
    },
    quickStartHeading: "快速入門",
    quickStart: (
      <>從<a href={RELEASE}>最新發行版</a>安裝適合你平台的套件。在 Debian 13 或 Ubuntu 24.04 及更新版本上：</>
    ),
    docs: (
      <><a href={zhTW.install}>安裝 zDesk</a> 涵蓋所有平台；<a href={zhTW.guide}>使用 zDesk</a> 說明瀏覽器用戶端，以及如何設定 Windows、Mac、wlshare 和 VNC 目標。</>
    ),
    footer: (
      <>zDesk 採用 <a href={LICENSE}>MIT 授權條款</a>。zDesk 的方向仍在調整中，版本之間不保證回溯相容；詳見 <a href={zhTW.readme}>README</a>。</>
    ),
  },
};

