import type { ReactNode } from "react";

export type Locale = "en" | "zh-CN" | "zh-TW";
export type Page = "home" | "demo";

// A locale's pages live under its prefix: `/` and `/demo` for English,
// `/zh-CN/` and `/zh-CN/demo` for the others. `short` names the language on a phone's top bar.
export const locales: { id: Locale; prefix: string; label: string; short?: string }[] = [
  { id: "en", prefix: "", label: "English", short: "EN" },
  { id: "zh-CN", prefix: "/zh-CN", label: "简体中文" },
  { id: "zh-TW", prefix: "/zh-TW", label: "繁體中文" },
];

export function pagePath(locale: Locale, page: Page) {
  const { prefix } = locales.find((l) => l.id === locale)!;
  return page === "home" ? `${prefix}/` : `${prefix}/demo`;
}

export function localeForPath(pathname: string): Locale {
  return (
    locales.find((l) => l.prefix && (pathname === l.prefix || pathname.startsWith(`${l.prefix}/`)))?.id ?? "en"
  );
}

const REPO = "https://github.com/andrewtheguy/zdesk";
const RELEASES = `${REPO}/releases`;
// The quick start installs a version the reader picks, 0.0.x standing for it.
const PINNED = `${RELEASES}/download/v0.0.x`;
const LICENSE = `${REPO}/blob/main/LICENSE`;

export type Platform = "linux" | "macos" | "windows";

// The quick start's install, one per platform: docs/install.md in the zdesk repo gives
// the same downloads, installed from the command line.
// macOS and Windows go on to the local control plane, `zdesk tui`. A platform with
// `configure`, Linux, goes first to a gateway served from its own config, as docs/install.md's
// First configuration has it, since the control plane needs a desktop's browser and keychain.
export const installs: { id: Platform; label: string; command: string; configure?: string }[] = [
  {
    id: "linux",
    label: "Linux",
    command: `curl -fsSLO ${PINNED}/zdesk-linux-amd64.deb
sudo apt install ./zdesk-linux-amd64.deb`,
    configure: `sudo install -d -m 700 -o "$(id -un)" -g "$(id -gn)" /etc/zdesk /var/lib/zdesk
sudo install -m 600 -o "$(id -un)" -g "$(id -gn)" \\
  /usr/share/doc/zdesk/zdesk.example.toml /etc/zdesk/zdesk.toml
zdesk gen-passwd admin
\${EDITOR:-vi} /etc/zdesk/zdesk.toml`,
  },
  {
    id: "macos",
    label: "macOS",
    command: `curl -fsSLO ${PINNED}/zdesk-macos-arm64.pkg
open zdesk-macos-arm64.pkg`,
  },
  {
    id: "windows",
    label: "Windows",
    command: `Invoke-WebRequest ${PINNED}/zdesk-windows-x86_64.msi -OutFile zdesk-windows-x86_64.msi
start zdesk-windows-x86_64.msi`,
  },
];

// The served gateway's config once the quick start has been followed, without the example's
// comments: one target for each of Windows, a Mac and wlshare. `zdesk check-config` takes it
// with the elided values filled in.
export const SERVED_CONFIG = `[server]
site_passwd = "admin:$2b$12$…"
master_password_file = "master-password"

[master]
salt = "…"
check = "…"

[passwords]
windows = "$ZD;1;AES-256-GCM;…"
mac = "$ZD;1;AES-256-GCM;…"
linux = "$ZD;1;AES-256-GCM;…"

[[targets]]
name = "windows"
protocol = "rdp"
host = "192.0.2.10"
username = "Administrator"
password_ref = "windows"

[[targets]]
name = "mac"
protocol = "vnc"
subtype = "ard"
host = "192.0.2.11"
username = "me"
password_ref = "mac"

[[targets]]
name = "linux"
protocol = "vnc"
subtype = "wlshare"
host = "192.0.2.12"
username = "me"
password_ref = "linux"`;

export const HERO_VIDEO = { video: "/videos/windows-to-mac-in-chrome.mp4", poster: "/videos/windows-to-mac-in-chrome.jpg", width: 816, height: 686 };

// Each demo's poster is a frame of it beside the video, `<video>.jpg`. A demo with sound has a
// caption file per locale beside its video, `<video>.<locale>.vtt`, describing the sound.
// `width` and `height` are the recording's, and `seconds` its length.
export interface Demo {
  id: string;
  video: string;
  width: number;
  height: number;
  seconds: number;
  captions?: boolean;
}

export const demos: Demo[] = [
  { id: "windows-to-mac-one-display", video: "windows-to-mac-one-display.mp4", width: 1920, height: 1080, seconds: 98, captions: true },
  { id: "windows-to-mac-two-displays", video: "windows-to-mac-two-displays.mp4", width: 3840, height: 1080, seconds: 103 },
  { id: "ios-to-windows", video: "ios-to-windows.mp4", width: 1180, height: 2556, seconds: 117 },
  { id: "ios-to-mac", video: "ios-to-mac.mp4", width: 1180, height: 2556, seconds: 151 },
  { id: "ipad-to-windows", video: "ipad-to-windows.mp4", width: 2266, height: 1488, seconds: 93 },
  { id: "mac-to-windows", video: "mac-to-windows-hidpi-audio.mp4", width: 3456, height: 2234, seconds: 99, captions: true },
  { id: "mac-to-linux", video: "mac-to-linux-wlshare-hidpi-audio.mp4", width: 3456, height: 2234, seconds: 85, captions: true },
];

export type FeatureIcon = "monitor" | "terminal" | "globe" | "sharp" | "play" | "code";

export interface Content {
  description: string;
  nav: Record<Page, string>;
  // The language menu's accessible name, given the current language's name.
  language: (current: string) => string;
  tagline: string;
  intro: string;
  getStarted: string;
  seeInAction: string;
  source: { label: string; href: string };
  rolling: string;
  heroVideo: string;
  features: { icon: FeatureIcon; title: string; body: ReactNode }[];
  howHeading: string;
  how: string;
  diagram: string;
  quickStartHeading: string;
  noCompat: ReactNode;
  quickStart: ReactNode;
  installNotes: Record<Platform, ReactNode>;
  serve: { heading: ReactNode; intro: ReactNode; edit: ReactNode; secrets: ReactNode; example: ReactNode; steps: ReactNode };
  tui: { heading: ReactNode; intro: ReactNode; desktop: ReactNode; steps: ReactNode };
  docs: ReactNode;
  footer: ReactNode;
  demoTitle: string;
  demoDescription: string;
  demoIntro: string;
  // Marks a demo recorded with the remote's sound.
  demoSound: string;
  demos: Record<string, { title: string; caption?: string }>;
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
    nav: { home: "Home", demo: "Demo" },
    language: (current) => `Language: ${current}`,
    tagline:
      "Remote desktop in a browser, for Windows' and macOS's own remote desktop servers, and for Linux through wlshare.",
    intro:
      "zDesk is a small gateway you run next to your machines. No plugins or client software are needed: a browser on Windows, macOS, Linux, iOS or Android is all it takes to reach your desktops, and Windows and macOS need nothing installed on the host either.",
    getStarted: "Get Started",
    seeInAction: "See It in Action",
    source: { label: "Source Code", href: REPO },
    rolling: "zDesk is on a rolling release: the latest release is the current one.",
    heroVideo: "A Mac's Screen Sharing in a Chrome tab on Windows.",
    features: [
      {
        icon: "monitor",
        title: "Built for Windows' and macOS's own servers",
        body: (
          <>Windows 10 and 11's own <strong>Remote Desktop</strong>, over RDP with its modern graphics pipeline, and macOS's built-in <strong>Screen Sharing</strong> in both its Standard and High Performance modes. The host needs only its own sharing switched on.</>
        ),
      },
      {
        icon: "terminal",
        title: "Linux through wlshare",
        body: (
          <><a href={en.wlshare}>wlshare</a> is our own VNC server for wlroots compositors, and it gives zDesk what plain VNC lacks: screen density, sound and a choice of outputs. Other RDP and VNC servers connect through each protocol's baseline.</>
        ),
      },
      {
        icon: "code",
        title: "A small, unprivileged gateway",
        body: (
          <>One Rust binary serving one session at a time, and once installed it runs as an ordinary user account, with no root or administrator rights. With the picture and sound decoded in the browser, it holds no decoder for them, so its memory footprint stays low. zDesk is free and open source under the <a href={LICENSE}>MIT licence</a>.</>
        ),
      },
      {
        icon: "globe",
        title: "Your desktops from anywhere",
        body: (
          <>The client is the web page the gateway serves, so your desktops are not tied to one device or place: wherever a browser can reach the gateway, you have your machines. Chrome, Edge or Safari on a desktop, Chrome on Android, and Safari on an iPhone or iPad, with no client to install. On a phone or tablet, fingers act as a trackpad, with pinch zoom and a soft keyboard.</>
        ),
      },
      {
        icon: "sharp",
        title: "Sharp at its true size",
        body: (
          <>Windows, a High Performance Mac and wlshare follow the browser window at its screen density, so a Retina or HiDPI display shows them sharp and at their true size, with a second display (beta) in a tab of its own. A Standard Mac shows its displays at the density it reports, and plain VNC at 1x and the server's own size.</>
        ),
      },
      {
        icon: "play",
        title: "The remote's own picture, decoded in the browser",
        body: (
          <>Where the host provides its own picture, it is passed through untouched and decoded in the browser, with the remote's sound and the clipboard in both directions.</>
        ),
      },
    ],
    howHeading: "How it works",
    how: "The gateway serves one web page that shows the desktop, and speaks RDP or VNC to your machines.",
    diagram: "browser ── HTTPS or localhost ── zDesk ── RDP / VNC ── your desktops",
    quickStartHeading: "Quick start",
    noCompat: (
      <><strong>No backward compatibility.</strong> A release may change or remove a configuration key, the protocol or a feature, with nothing that reads the old form. Install a specific version and stay on it until you choose to upgrade; before you do, check your config against the <code>zdesk.example.toml</code> the new release ships.</>
    ),
    quickStart: (
      <>zDesk runs either as a <strong>served gateway</strong>, <code>zdesk serve</code>, from a config you write, or under the <strong>control plane</strong>, <code>zdesk tui</code>, a terminal interface that runs gateways on the machine you use, each with its own config. The Linux tab shows both, and the macOS and Windows tabs the control plane. Pick a version from the <a href={RELEASES}>releases</a> and put its number in place of <code>0.0.x</code>:</>
    ),
    installNotes: {
      linux: (
        <>On Debian 13 or Ubuntu 24.04 and later. On an arm64 host, use <code>zdesk-linux-arm64.deb</code>; the release also has an <code>.rpm</code> for <code>dnf</code>.</>
      ),
      macos: (
        <>On a Mac with Apple silicon; <code>open</code> starts Installer with the package. The package is unsigned, so fetch it with <code>curl</code> as shown rather than in a browser, which quarantines the download.</>
      ),
      windows: (
        <>On Windows x86-64, from PowerShell; <code>start</code> opens the install wizard, which asks for administrator rights. The package is unsigned, so SmartScreen asks before it runs.</>
      ),
    },
    serve: {
      heading: <>Served gateway: <code>zdesk serve</code></>,
      intro: "Once it is installed, create the config as the account that will run the gateway, generate a web login and open the config to edit:",
      edit: (
        <>Paste the generated <code>admin:$2b$...</code> value into <code>[server].site_passwd</code>, set <code>master_password_file = "master-password"</code> under <code>[server]</code>, and replace the example <code>[[targets]]</code> entry with the remote desktop to reach. Its password is kept encrypted under a master password (see <a href={`${en.guide}#target-passwords`}>Target passwords</a>):</>
      ),
      secrets: (
        <><code>password master create</code> asks for a new master password, writes it to that file, readable by you alone, and prints a <code>[master]</code> block for the config; <code>password encrypt</code> prints the value to add under <code>[passwords]</code>, by the name the target's <code>password_ref</code> gives, so run it once for each target. Without the example's comments, the finished config reads like this, here with a Windows, a Mac and a wlshare target:</>
      ),
      example: (
        <>For a Mac in High Performance mode, set <code>subtype = "ard-high-performance"</code>; <a href={en.guide}>Using zDesk</a> covers setting up each kind of target. Then start the gateway:</>
      ),
      steps: (
        <>It listens on loopback, at <code>http://localhost:52380</code>. The page needs a secure context, so from another machine reach it through an SSH tunnel to that port or a TLS-terminating reverse proxy; see <a href={`${en.guide}#the-client`}>The client</a>.</>
      ),
    },
    tui: {
      heading: <>Control plane: <code>zdesk tui</code></>,
      intro: (
        <>A served gateway runs here too, set up as <a href={`${en.install}#first-configuration`}>First configuration</a> in Installing zDesk has it. For the control plane, open a new terminal once it is installed and start it; it runs gateways on this machine, each with its own config:</>
      ),
      desktop: "On a Linux desktop, with a browser and a keychain (GNOME Keyring or KWallet) on the same machine, the control plane can run gateways instead, each with its own config:",
      steps: (
        <>It listens on loopback only, at <code>http://zdesk.localhost:52380</code>. Press <kbd>n</kbd> to create an instance, <kbd>e</kbd> to add a target to its config, <kbd>p</kbd> to encrypt the target's password, <kbd>s</kbd> to start the instance and <kbd>o</kbd> to open it in the browser. <a href={`${en.guide}#local-instances`}>Local instances</a> lists every key.</>
      ),
    },
    docs: (
      <>For the full details, see the <a href={REPO}>source code on GitHub</a>: <a href={en.install}>Installing zDesk</a> covers every platform, and <a href={en.guide}>Using zDesk</a> the browser client and setting up Windows, Mac, wlshare and VNC targets.</>
    ),
    footer: (
      <>zDesk is under the <a href={LICENSE}>MIT licence</a>. It is released on a rolling basis, still settling its direction, and keeps no backward compatibility between releases; see the <a href={`${REPO}#readme`}>README</a>.</>
    ),
    demoTitle: "Demo",
    demoDescription:
      "zDesk sessions recorded from a browser: Windows to a Mac on one or two virtual displays, iOS to Windows and to a Mac, an iPad to Windows at Retina/HiDPI density, and a Mac to Windows and to Linux at Retina/HiDPI density with sound.",
    demoIntro:
      "zDesk sessions recorded from a browser, to Windows' own Remote Desktop, a Mac's Screen Sharing and wlshare on Linux.",
    demoSound: "With sound",
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
      "ipad-to-windows": {
        title: "iPad → Windows at Retina/HiDPI density",
        caption:
          "Safari on an iPad connected to Windows' own Remote Desktop at the iPad's Retina/HiDPI density, typing on the soft keyboard with its function, navigation and sticky modifier keys.",
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
  },
  "zh-CN": {
    description:
      "在浏览器中使用远程桌面，连接 Windows 自带的远程桌面、macOS 内置的屏幕共享，以及 Linux 上的 wlshare，这是我们自己为 wlroots 合成器编写的 VNC 服务器。",
    nav: { home: "首页", demo: "演示" },
    language: (current) => `语言：${current}`,
    tagline: "在浏览器中使用远程桌面，连接 Windows 和 macOS 自带的远程桌面服务器，以及 Linux 上的 wlshare。",
    intro:
      "zDesk 是一个小型网关，运行在你的机器旁边。无需插件或客户端软件：在 Windows、macOS、Linux、iOS 或 Android 上，只要有浏览器就能访问你的桌面；Windows 和 macOS 主机也无需安装任何软件。",
    getStarted: "开始使用",
    seeInAction: "观看实际效果",
    source: { label: "源代码", href: zhCN.readme },
    rolling: "zDesk 采用滚动发布：最新发布就是当前版本。",
    heroVideo: "Windows 上 Chrome 标签页中的 Mac 屏幕共享。",
    features: [
      {
        icon: "monitor",
        title: "为 Windows 和 macOS 自带的服务器打造",
        body: (
          <>Windows 10 和 11 自带的<strong>远程桌面</strong>，通过 RDP 及其现代图形管道；以及 macOS 内置的<strong>屏幕共享</strong>，标准和高性能两种模式都支持。主机只需打开系统自带的共享功能。</>
        ),
      },
      {
        icon: "terminal",
        title: "通过 wlshare 连接 Linux",
        body: (
          <><a href={zhCN.wlshare}>wlshare</a> 是我们自己为 wlroots 合成器编写的 VNC 服务器，它为 zDesk 补上了普通 VNC 所缺少的功能：屏幕密度、声音和输出选择。其他 RDP 和 VNC 服务器通过各协议的基础功能连接。</>
        ),
      },
      {
        icon: "code",
        title: "小巧、无需特权的网关",
        body: (
          <>一个 Rust 二进制文件，一次服务一个会话；安装后以普通用户账户运行，无需 root 或管理员权限。画面和声音在浏览器中解码，网关无需为它们保留解码器，因此内存占用很低。zDesk 是自由开源软件，采用 <a href={LICENSE}>MIT 许可证</a>。</>
        ),
      },
      {
        icon: "globe",
        title: "随时随地访问你的桌面",
        body: (
          <>客户端就是网关提供的网页，因此你的桌面不局限于某一台设备或某个地点：只要浏览器能访问网关，就能使用你的机器。桌面上的 Chrome、Edge 或 Safari，Android 上的 Chrome，以及 iPhone 或 iPad 上的 Safari，均无需安装客户端。在手机或平板上，手指就像触控板，并支持双指缩放和软键盘。</>
        ),
      },
      {
        icon: "sharp",
        title: "按真实尺寸清晰显示",
        body: (
          <>Windows、高性能模式的 Mac 和 wlshare 以浏览器窗口的屏幕密度跟随窗口大小，因此在 Retina 或 HiDPI 显示器上清晰且按真实尺寸显示；第二个显示器（测试版）可在单独的标签页中显示。标准模式的 Mac 按其报告的密度显示其显示器，普通 VNC 则以 1x 和服务器自身的尺寸显示。</>
        ),
      },
      {
        icon: "play",
        title: "远程自身的画面，在浏览器中解码",
        body: <>主机提供自身画面时，画面原样传递并在浏览器中解码，同时带有远程的声音和双向剪贴板。</>,
      },
    ],
    howHeading: "工作原理",
    how: "网关提供一个显示桌面的网页，并通过 RDP 或 VNC 连接你的机器。",
    diagram: "浏览器 ── HTTPS 或 localhost ── zDesk ── RDP / VNC ── 你的桌面",
    quickStartHeading: "快速开始",
    noCompat: (
      <><strong>不保证向后兼容。</strong>任何版本都可能更改或移除某个配置项、协议或某项功能，且不再读取旧的写法。请安装一个指定版本，并一直使用它，直到你决定升级；升级前，请对照新版本附带的 <code>zdesk.example.toml</code> 检查你的配置。</>
    ),
    quickStart: (
      <>zDesk 有两种运行方式：作为<strong>独立网关</strong>（<code>zdesk serve</code>）运行，读取你自己编写的配置；或在<strong>控制面</strong>（<code>zdesk tui</code>）下运行，这是一个终端界面，在你使用的机器上运行网关，每个网关都有自己的配置。Linux 标签页介绍了这两种方式，macOS 和 Windows 标签页介绍控制面。从<a href={RELEASES}>发布列表</a>中选一个版本，用它的版本号替换 <code>0.0.x</code>：</>
    ),
    installNotes: {
      linux: (
        <>适用于 Debian 13 或 Ubuntu 24.04 及更高版本。在 arm64 主机上请使用 <code>zdesk-linux-arm64.deb</code>；发布中也提供供 <code>dnf</code> 使用的 <code>.rpm</code>。</>
      ),
      macos: (
        <>适用于 Apple 芯片的 Mac；<code>open</code> 会用“安装器”打开该软件包。该软件包未签名，因此请如上用 <code>curl</code> 下载，而不要用浏览器下载，浏览器下载的文件会被隔离。</>
      ),
      windows: (
        <>适用于 Windows x86-64，在 PowerShell 中执行；<code>start</code> 会打开安装向导，向导会请求管理员权限。该软件包未签名，因此 SmartScreen 会在运行前询问。</>
      ),
    },
    serve: {
      heading: <>独立网关：<code>zdesk serve</code></>,
      intro: "安装完成后，以将要运行网关的账户创建配置，生成网页登录凭据，然后打开配置进行编辑：",
      edit: (
        <>将生成的 <code>admin:$2b$...</code> 值粘贴到 <code>[server].site_passwd</code>，在 <code>[server]</code> 下设置 <code>master_password_file = "master-password"</code>，并把示例中的 <code>[[targets]]</code> 条目替换为要连接的远程桌面。其密码用主密码加密保存（见<a href={`${zhCN.guide}#目标密码`}>目标密码</a>）：</>
      ),
      secrets: (
        <><code>password master create</code> 询问新的主密码，把它写入该文件（只有你能读取），并输出配置所需的 <code>[master]</code> 块；<code>password encrypt</code> 输出要添加到 <code>[passwords]</code> 下的值，键名为目标的 <code>password_ref</code>，因此每个目标都要运行一次。去掉示例中的注释后，完成的配置如下，这里有一个 Windows 目标、一个 Mac 目标和一个 wlshare 目标：</>
      ),
      example: (
        <>对于高性能模式的 Mac，请设置 <code>subtype = "ard-high-performance"</code>；<a href={zhCN.guide}>使用 zDesk</a> 介绍了如何设置每一种目标。然后启动网关：</>
      ),
      steps: (
        <>它监听回环地址，位于 <code>http://localhost:52380</code>。该页面需要安全上下文，因此从其他机器访问时，请通过到该端口的 SSH 隧道或终止 TLS 的反向代理；详见<a href={`${zhCN.guide}#客户端`}>客户端</a>。</>
      ),
    },
    tui: {
      heading: <>控制面：<code>zdesk tui</code></>,
      intro: (
        <>这里也可以运行独立网关，按照“安装 zDesk”中的<a href={`${zhCN.install}#首次配置`}>首次配置</a>进行设置。若使用控制面，请在安装完成后打开一个新的终端并启动它；它在本机运行网关，每个网关都有自己的配置：</>
      ),
      desktop: "在 Linux 桌面上，浏览器和密钥环（GNOME Keyring 或 KWallet）都在本机，也可以改用控制面来运行网关，每个网关都有自己的配置：",
      steps: (
        <>它只监听回环地址，位于 <code>http://zdesk.localhost:52380</code>。按 <kbd>n</kbd> 创建实例，按 <kbd>e</kbd> 在其配置中添加目标，按 <kbd>p</kbd> 加密目标的密码，按 <kbd>s</kbd> 启动实例，按 <kbd>o</kbd> 在浏览器中打开它。<a href={`${zhCN.guide}#本地实例`}>本地实例</a>列出了所有按键。</>
      ),
    },
    docs: (
      <>完整细节请查看 GitHub 上的<a href={zhCN.readme}>源代码</a>：<a href={zhCN.install}>安装 zDesk</a> 涵盖所有平台；<a href={zhCN.guide}>使用 zDesk</a> 介绍浏览器客户端，以及如何设置 Windows、Mac、wlshare 和 VNC 目标。</>
    ),
    footer: (
      <>zDesk 采用 <a href={LICENSE}>MIT 许可证</a>，以滚动方式发布，方向仍在调整中，版本之间不保证向后兼容；详见 <a href={zhCN.readme}>README</a>。</>
    ),
    demoTitle: "演示",
    demoDescription:
      "从浏览器录制的 zDesk 会话：Windows 连接带一个或两个虚拟显示器的 Mac，iOS 连接 Windows 和 Mac，iPad 以 Retina/HiDPI 密度连接 Windows，以及 Mac 以 Retina/HiDPI 密度带声音连接 Windows 和 Linux。",
    demoIntro: "从浏览器录制的 zDesk 会话，连接 Windows 自带的远程桌面、Mac 的屏幕共享，以及 Linux 上的 wlshare。",
    demoSound: "有声音",
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
      "ipad-to-windows": {
        title: "iPad → Windows，Retina/HiDPI 密度",
        caption: "iPad 上的 Safari 以 iPad 的 Retina/HiDPI 密度连接 Windows 自带的远程桌面，用带功能键、导航键和粘滞修饰键的软键盘输入。",
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
  },
  "zh-TW": {
    description:
      "在瀏覽器中使用遠端桌面，連線 Windows 內建的遠端桌面、macOS 內建的螢幕共享，以及 Linux 上的 wlshare，這是我們自己為 wlroots 合成器撰寫的 VNC 伺服器。",
    nav: { home: "首頁", demo: "示範" },
    language: (current) => `語言：${current}`,
    tagline: "在瀏覽器中使用遠端桌面，連線 Windows 和 macOS 內建的遠端桌面伺服器，以及 Linux 上的 wlshare。",
    intro:
      "zDesk 是一個小型閘道，執行在你的電腦旁邊。不需要外掛程式或用戶端軟體：在 Windows、macOS、Linux、iOS 或 Android 上，只要有瀏覽器就能存取你的桌面；Windows 和 macOS 主機也不需要安裝任何軟體。",
    getStarted: "開始使用",
    seeInAction: "觀看實際效果",
    source: { label: "原始碼", href: zhTW.readme },
    rolling: "zDesk 採用滾動發行：最新發行版就是目前的版本。",
    heroVideo: "在 Windows 的 Chrome 分頁中顯示 Mac 的螢幕共享。",
    features: [
      {
        icon: "monitor",
        title: "為 Windows 和 macOS 內建的伺服器打造",
        body: (
          <>Windows 10 和 11 內建的<strong>遠端桌面</strong>，透過 RDP 及其新式圖形管線；以及 macOS 內建的<strong>螢幕共享</strong>，標準和高效能兩種模式都支援。主機只要開啟系統內建的共享功能即可。</>
        ),
      },
      {
        icon: "terminal",
        title: "透過 wlshare 連線 Linux",
        body: (
          <><a href={zhTW.wlshare}>wlshare</a> 是我們自己為 wlroots 合成器撰寫的 VNC 伺服器，為 zDesk 補足一般 VNC 缺少的功能：螢幕密度、聲音和輸出選擇。其他 RDP 和 VNC 伺服器透過各協定的基本功能連線。</>
        ),
      },
      {
        icon: "code",
        title: "小巧、不需特殊權限的閘道",
        body: (
          <>一個 Rust 執行檔，一次服務一個工作階段；安裝後以一般使用者帳戶執行，不需要 root 或系統管理員權限。畫面和聲音在瀏覽器中解碼，閘道不需要為它們保留解碼器，因此記憶體用量很低。zDesk 是自由的開放原始碼軟體，採用 <a href={LICENSE}>MIT 授權條款</a>。</>
        ),
      },
      {
        icon: "globe",
        title: "隨時隨地存取你的桌面",
        body: (
          <>用戶端就是閘道提供的網頁，因此你的桌面不侷限於某一台裝置或某個地點：只要瀏覽器能連到閘道，就能使用你的電腦。桌面上的 Chrome、Edge 或 Safari，Android 上的 Chrome，以及 iPhone 或 iPad 上的 Safari，都不需要安裝用戶端。在手機或平板上，手指就像觸控板，並支援雙指縮放和螢幕鍵盤。</>
        ),
      },
      {
        icon: "sharp",
        title: "以真實尺寸清晰顯示",
        body: (
          <>Windows、高效能模式的 Mac 和 wlshare 以瀏覽器視窗的螢幕密度跟隨視窗大小，因此在 Retina 或 HiDPI 顯示器上清晰且以真實尺寸顯示；第二個顯示器（Beta 版）可在獨立的分頁中顯示。標準模式的 Mac 以其回報的密度顯示其顯示器，一般 VNC 則以 1x 和伺服器本身的尺寸顯示。</>
        ),
      },
      {
        icon: "play",
        title: "遠端自身的畫面，在瀏覽器中解碼",
        body: <>主機提供自身畫面時，畫面原封不動地傳遞並在瀏覽器中解碼，同時帶有遠端的聲音和雙向剪貼簿。</>,
      },
    ],
    howHeading: "運作方式",
    how: "閘道提供一個顯示桌面的網頁，並透過 RDP 或 VNC 連線到你的電腦。",
    diagram: "瀏覽器 ── HTTPS 或 localhost ── zDesk ── RDP / VNC ── 你的桌面",
    quickStartHeading: "快速入門",
    noCompat: (
      <><strong>不保證回溯相容。</strong>任何版本都可能變更或移除某個設定項、協定或某項功能，且不再讀取舊的寫法。請安裝一個指定的版本，並持續使用它，直到你決定升級為止；升級前，請對照新版本隨附的 <code>zdesk.example.toml</code> 檢查你的設定。</>
    ),
    quickStart: (
      <>zDesk 有兩種執行方式：作為<strong>獨立閘道</strong>（<code>zdesk serve</code>）執行，讀取你自己撰寫的設定；或在<strong>控制平面</strong>（<code>zdesk tui</code>）下執行，這是一個終端機介面，在你使用的電腦上執行閘道，每個閘道都有自己的設定。Linux 分頁介紹了這兩種方式，macOS 和 Windows 分頁介紹控制平面。從<a href={RELEASES}>發行版清單</a>中挑選一個版本，以它的版本號碼取代 <code>0.0.x</code>：</>
    ),
    installNotes: {
      linux: (
        <>適用於 Debian 13 或 Ubuntu 24.04 及更新版本。在 arm64 主機上請改用 <code>zdesk-linux-arm64.deb</code>；發行版中也提供給 <code>dnf</code> 使用的 <code>.rpm</code>。</>
      ),
      macos: (
        <>適用於搭載 Apple 晶片的 Mac；<code>open</code> 會以「安裝程式」開啟此套件。此套件未經簽署，因此請如上用 <code>curl</code> 下載，不要透過瀏覽器下載，瀏覽器下載的檔案會被隔離。</>
      ),
      windows: (
        <>適用於 Windows x86-64，在 PowerShell 中執行；<code>start</code> 會開啟安裝精靈，精靈會要求系統管理員權限。此套件未經簽署，因此 SmartScreen 會在執行前詢問。</>
      ),
    },
    serve: {
      heading: <>獨立閘道：<code>zdesk serve</code></>,
      intro: "安裝完成後，以將要執行閘道的帳戶建立設定，產生網頁登入憑證，然後開啟設定進行編輯：",
      edit: (
        <>將產生的 <code>admin:$2b$...</code> 值貼到 <code>[server].site_passwd</code>，在 <code>[server]</code> 下設定 <code>master_password_file = "master-password"</code>，並把範例中的 <code>[[targets]]</code> 項目換成要連線的遠端桌面。其密碼會用主密碼加密儲存（請見<a href={`${zhTW.guide}#目標密碼`}>目標密碼</a>）：</>
      ),
      secrets: (
        <><code>password master create</code> 詢問新的主密碼，把它寫入該檔案（只有你能讀取），並輸出設定所需的 <code>[master]</code> 區塊；<code>password encrypt</code> 輸出要加到 <code>[passwords]</code> 下的值，鍵名為目標的 <code>password_ref</code>，因此每個目標都要執行一次。拿掉範例中的註解後，完成的設定如下，這裡有一個 Windows 目標、一個 Mac 目標和一個 wlshare 目標：</>
      ),
      example: (
        <>若是高效能模式的 Mac，請設定 <code>subtype = "ard-high-performance"</code>；<a href={zhTW.guide}>使用 zDesk</a> 說明了如何設定每一種目標。然後啟動閘道：</>
      ),
      steps: (
        <>它監聽回送位址，位於 <code>http://localhost:52380</code>。此網頁需要安全環境，因此從其他電腦存取時，請透過連到該連接埠的 SSH 通道或終止 TLS 的反向代理伺服器；詳見<a href={`${zhTW.guide}#用戶端`}>用戶端</a>。</>
      ),
    },
    tui: {
      heading: <>控制平面：<code>zdesk tui</code></>,
      intro: (
        <>這裡也可以執行獨立閘道，依照「安裝 zDesk」中的<a href={`${zhTW.install}#首次設定`}>首次設定</a>進行設定。若使用控制平面，請在安裝完成後開啟一個新的終端機並啟動它；它在本機執行閘道，每個閘道都有自己的設定：</>
      ),
      desktop: "在 Linux 桌面上，瀏覽器和金鑰圈（GNOME Keyring 或 KWallet）都在本機，也可以改用控制平面來執行閘道，每個閘道都有自己的設定：",
      steps: (
        <>它只監聽回送位址，位於 <code>http://zdesk.localhost:52380</code>。按 <kbd>n</kbd> 建立執行個體，按 <kbd>e</kbd> 在其設定中新增目標，按 <kbd>p</kbd> 加密目標的密碼，按 <kbd>s</kbd> 啟動執行個體，按 <kbd>o</kbd> 在瀏覽器中開啟它。<a href={`${zhTW.guide}#本機執行個體`}>本機執行個體</a>列出了所有按鍵。</>
      ),
    },
    docs: (
      <>完整細節請參閱 GitHub 上的<a href={zhTW.readme}>原始碼</a>：<a href={zhTW.install}>安裝 zDesk</a> 涵蓋所有平台；<a href={zhTW.guide}>使用 zDesk</a> 說明瀏覽器用戶端，以及如何設定 Windows、Mac、wlshare 和 VNC 目標。</>
    ),
    footer: (
      <>zDesk 採用 <a href={LICENSE}>MIT 授權條款</a>，以滾動方式發行，方向仍在調整中，版本之間不保證回溯相容；詳見 <a href={zhTW.readme}>README</a>。</>
    ),
    demoTitle: "示範",
    demoDescription:
      "從瀏覽器錄製的 zDesk 工作階段：Windows 連線到有一個或兩個虛擬顯示器的 Mac，iOS 連線到 Windows 和 Mac，iPad 以 Retina/HiDPI 密度連線到 Windows，以及 Mac 以 Retina/HiDPI 密度帶聲音連線到 Windows 和 Linux。",
    demoIntro: "從瀏覽器錄製的 zDesk 工作階段，連線到 Windows 內建的遠端桌面、Mac 的螢幕共享，以及 Linux 上的 wlshare。",
    demoSound: "有聲音",
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
      "ipad-to-windows": {
        title: "iPad → Windows，Retina/HiDPI 密度",
        caption: "iPad 上的 Safari 以 iPad 的 Retina/HiDPI 密度連線到 Windows 內建的遠端桌面，用有功能鍵、導覽鍵和相黏輔助按鍵的螢幕鍵盤輸入。",
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
  },
};
