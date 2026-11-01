import { pagePath } from "../content";
import { Cards, Clip, Still, StillPair } from "../guides/visuals";
import type { WlshareText } from "./text";

const WLSHARE = "https://github.com/andrewtheguy/wlshare";
const guide = pagePath("zh-CN", "wlshare-guide");

const text: WlshareText = {
  title: "wlshare",
  description:
    "wlshare 是为 zDesk 打造的 VNC 服务器，面向 sway、labwc 等 wlroots Wayland 桌面：浏览器的像素密度、H.264 或无损图块、声音、经由 PipeWire 的摄像头和麦克风，以及一个或两个输出。",
  tagline: "为 zDesk 打造、面向 wlroots 桌面的 VNC 服务器。",
  intro: (
    <>
      wlshare 通过 RFB 共享 sway、labwc 或其他 wlroots 桌面，并为 zDesk 提供普通 VNC 无法承载的内容：浏览器的像素密度、按链路调整的画面、桌面的声音、浏览器的摄像头和麦克风，以及在单独标签页中显示的第二个输出。它是免费的开源软件，采用{" "}
      <a href={`${WLSHARE}/blob/main/LICENSE`}>MIT 许可证</a>。
    </>
  ),
  rolling: "wlshare 采用滚动发布：最新发布就是当前版本。",
  packages: (
    <>
      wlshare 需要 wlroots 0.19 或更高版本，缺少它提供的指针图像捕获就无法启动。在 Debian trixie 上，wlroots 以及基于它构建的
      sway 或 labwc 来自它自己的 <a href="#install">APT 仓库</a>；其中的 wlroots 带有一个补丁：共享两个输出（例如第二个浏览器标签页）时，
      sway 或 labwc 重新加载配置之后，它让客户端的指针仍留在自己的输出上。wlshare 自己也会在一两次移动之内纠正这一点，
      所以使用原版的 wlroots 0.19 或更高版本即可，Ubuntu 26.04 自带的就是如此。
    </>
  ),
  heroCaption: "在 Chrome 中以 Mac 的 Retina 密度通过 wlshare 显示 Sway，正在播放一段视频。",
  demoHeading: "演示",
  demoIntro: "从 Mac 上的 Chrome 录制的 zDesk 会话，未安装任何客户端：sway 桌面上的 wlshare。",
  features: [
    {
      icon: "size",
      title: "按浏览器的密度清晰显示",
      body: (
        <>
          它告诉客户端其像素按什么密度绘制，这是标准 RFB 做不到的，并把浏览器的密度作为输出的缩放：Retina 或 HiDPI 屏幕上的桌面清晰且按真实尺寸显示，无头输出还会跟随窗口的尺寸。
        </>
      ),
    },
    {
      icon: "picture",
      title: "适合链路的画面",
      body: (
        <>
          由主机硬件编码器或 libx264 编码、按链路调整的整个桌面的 H.264；RemoteFX Progressive 图块；每个运动区域各有一路视频流的无损图块；或者全部无损的图块，适用于局域网。
        </>
      ),
    },
    {
      icon: "sound",
      title: "桌面的声音",
      body: (
        <>
          有客户端收听时，wlshare 自己的 PipeWire 音频输出设备成为默认设备，在那里播放的内容以无损的 FLAC 或以 Opus 发送。无头桌面不需要声卡。
        </>
      ),
    },
    {
      icon: "camera",
      title: "浏览器的摄像头和麦克风",
      body: (
        <>
          以 PipeWire 设备的形式提供给桌面，只在桌面上有程序使用时才在浏览器中打开：在那里进行通话或录制，用的是你面前的摄像头。
        </>
      ),
    },
    {
      icon: "displays",
      title: "一个输出或两个",
      body: (
        <>
          客户端会收到桌面的输出列表以供选择，第二个连接显示第一个旁边的另一个输出。在 sway 上，请求两个虚拟显示器的客户端会得到第二个无头输出。
        </>
      ),
    },
    {
      icon: "lock",
      title: "指明账户的登录",
      body: (
        <>
          RSA-AES，通过 PAM 校验账户自己的密码，或使用以 Argon2 哈希保存的独立密码。不提供经典 VncAuth：它把密码截断为八个字符，并让会话以明文传输。
        </>
      ),
    },
    {
      icon: "monitor",
      title: "任何 wlroots 合成器",
      body: (
        <>
          sway、labwc 或其他提供 wlroots 协议的合成器，无头运行或接显示器均可。指针不在画面中，由客户端绘制；wlshare 的 APT 仓库为 Debian trixie 提供了 wlroots 0.19，它在无头输出上也让指针留在画面之外，Ubuntu 26.04 则自带。
        </>
      ),
    },
    {
      icon: "key",
      title: "一次一个客户端",
      body: (
        <>
          登录成功的连接会从当前持有者手中接管桌面，就像 Windows 远程桌面那样，因此崩溃的客户端不会留下任何残留：再次连接即可取回桌面。
        </>
      ),
    },
  ],
  sections: [
    {
      id: "where-it-runs",
      title: "运行环境",
      body: (
        <>
          <p>演示和本页图片背后的桌面，以及各自的设置方式：</p>
          <Cards
            items={[
              {
                title: "开机即启动的无头桌面",
                body: (
                  <>
                    sway 或 labwc 作为 systemd 用户服务运行在 wlroots 的无头后端上，在 lingering 下开机即启动，无需任何人登录。wlshare 随会话启动，并为每个客户端调整无头输出的尺寸。<a href={`${guide}#headless`}>设置方法</a>
                  </>
                ),
              },
              {
                title: "交给客户端的控制台桌面",
                body: (
                  <>
                    在接有显示器的机器上，接管桌面的客户端会看到一个按其自身尺寸和密度显示的无头输出，同时显示器关闭；客户端离开时，<code>wlshare watch</code> 把窗口放回显示器上。<a href={`${guide}#at-the-console`}>设置方法</a>
                  </>
                ),
              },
              {
                title: "labwc 上的 LXQt",
                body: (
                  <>
                    一个带面板、菜单和文件管理器的堆叠式桌面，运行在 labwc 而非平铺式合成器上：用的是同一个 wlshare，因为每个 wlroots 合成器都是同一类对等方。
                  </>
                ),
              },
              {
                title: "由登录解锁的密钥环",
                body: (
                  <>
                    使用系统登录时，PAM 刚校验过的密码会解锁一个并非由显示管理器启动的桌面的登录密钥环。<a href={`${guide}#keyring`}>设置方法</a>
                  </>
                ),
              },
              {
                title: "一个网关后面的多个桌面",
                body: (
                  <>
                    一个运行在容器或 Kubernetes pod 中的 zDesk 网关，为每个桌面配置一个目标，与 Windows 和 Mac 目标并列，每个都可以从任何浏览器访问。
                  </>
                ),
              },
            ]}
          />
          <Still
            name="wlshare-lxqt"
            caption="labwc 上的 LXQt，在用户管理器下无头运行，在 Chrome 中以缩放 2 显示：一个文件管理器和一个终端。"
          />
        </>
      ),
    },
    {
      id: "through-zdesk",
      title: "通过 zDesk 使用",
      body: (
        <>
          <p>
            带 <code>subtype = "wlshare"</code> 的 <code>vnc</code> 目标会请求以上全部功能。不设置子类型时，同一服务器按任何 VNC 服务器的方式读取：其像素按 1x 显示，没有声音。
          </p>
          <StillPair
            items={[
              { name: "wlshare-sway", caption: "设置子类型：缩放为 2 的输出按 2x 显示，完整显示在窗口中。" },
              {
                name: "wlshare-plain-vnc",
                caption: "不设置：同样的像素按 1x 显示，尺寸变为两倍，窗口中只能显示桌面的四分之一。",
              },
            ]}
          />
          <Clip
            name="wlshare-two-outputs"
            caption={
              <>
                无头 sway 的两个输出显示在两个 Chromium 窗口中：一段视频被移到第二个输出再移回来。
              </>
            }
          />
        </>
      ),
    },
    {
      id: "install",
      title: "安装",
      body: (
        <>
          <p>
            在 Debian trixie（amd64 或 arm64）上：从 wlshare 的 APT 仓库安装 wlroots 0.19 以及 sway 或 labwc，再从其<a href={`${WLSHARE}/releases`}>发布页面</a>安装 wlshare，把 <code>0.0.x</code> 换成实际版本：
          </p>
          <pre>
            <code>{`sudo mkdir -p /etc/apt/keyrings
sudo curl -fsSL -o /etc/apt/keyrings/wlshare.gpg https://andrewtheguy.github.io/wlshare/wlshare.gpg
sudo tee /etc/apt/sources.list.d/wlshare.sources <<'EOF'
Types: deb
URIs: https://andrewtheguy.github.io/wlshare
Suites: trixie
Components: main
Signed-By: /etc/apt/keyrings/wlshare.gpg
EOF
sudo apt update && sudo apt install sway
curl -fsSLO ${WLSHARE}/releases/download/v0.0.x/wlshare-trixie-amd64.deb
sudo apt install ./wlshare-trixie-amd64.deb
systemctl --user enable --now wlshare.service`}</code>
          </pre>
          <p>在 Ubuntu 26.04（amd64 或 arm64）上：从 Ubuntu 本身安装 sway 或 labwc，再安装 wlshare 为它准备的软件包：</p>
          <pre>
            <code>{`sudo apt update && sudo apt install sway
curl -fsSLO ${WLSHARE}/releases/download/v0.0.x/wlshare-resolute-amd64.deb
sudo apt install ./wlshare-resolute-amd64.deb
systemctl --user enable --now wlshare.service`}</code>
          </pre>
          <p>
            在另行配置之前，它只监听回环地址，且不要求登录。<a href={guide}>wlshare 指南</a>介绍登录、开机即启动的无头桌面、输出、声音以及其余内容。
          </p>
        </>
      ),
    },
  ],
};

export default text;
