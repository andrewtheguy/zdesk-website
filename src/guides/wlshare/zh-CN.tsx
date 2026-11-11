import Flow from "../../Flow";
import { pagePath } from "../../content";
import ICON from "../icons";
import { type GuideText } from "../links";
import { Clip, Compare, Mark, Still, StillPair, Table, Tag } from "../visuals";

const WLSHARE = "https://github.com/andrewtheguy/wlshare";
const RELEASES = `${WLSHARE}/releases`;
const wl = (path: string) => `${WLSHARE}/blob/main/${path}`;
const zdeskGuide = pagePath("zh-CN", "zdesk-guide");

const guide: GuideText = {
  intro: (
    <>
      如何在 sway 或 labwc 等 wlroots 合成器上设置和使用 <a href={pagePath("zh-CN", "wlshare")}>wlshare</a>，即 zDesk 连接 Linux 桌面所经由的 VNC 服务器：它需要什么、谁可以连接、通过 zDesk 或其他 VNC 客户端连接、无人登录时也在开机后就绪的桌面，以及它承载的内容。所有设置项都在带注释的{" "}
      <a href={wl("wlshare.example.toml")}>
        <code>wlshare.example.toml</code>
      </a>
      中，工作原理见<a href={wl("docs/architecture.md")}>架构</a>。
    </>
  ),
  sections: [
    {
      id: "what-it-needs",
      title: "它需要什么",
      body: (
        <>
          <p>
            wlshare 运行在它所共享的 Wayland 会话之内，以拥有该会话的用户身份运行，并通过 wlroots 的公开协议与合成器通信。任何提供这些协议的 wlroots 合成器都是同一类对等方：
          </p>
          <Table
            head={["协议", "用途"]}
            rows={[
              [<code>wlr-screencopy</code>, "画面，版本 2 或更高；必需"],
              [<code>ext-image-copy-capture</code>, "指针的图像，与画面分开捕获；必需"],
              [<code>xdg-output</code>, "每个输出在布局中的位置，指针按此定位；版本 3，必需"],
              [<code>wlr-output-management</code>, "为客户端调整无头输出的尺寸和缩放"],
              [
                <>
                  虚拟键盘和虚拟指针
                </>,
                "客户端的键盘和鼠标",
              ],
              [<code>wlr-data-control</code>, "双向剪贴板"],
            ]}
          />
          <p>
            指针从不出现在捕获的像素中：wlshare 按输出的密度单独发送它的图像，客户端移动指针时无需等待新的一帧。在无头输出上，这需要 wlroots 0.19，它是第一个让无头后端把光标放在独立平面上的版本；0.18 会把光标画进捕获的画面。声音、摄像头和麦克风都经由 PipeWire，软件包依赖它。
          </p>
          <p>
            wlshare 在 sway 上能做的最多，因为 sway 接受的每条命令都可以在运行时通过它的 IPC 发送：客户端的第二个虚拟显示器主流 Wayland 协议没有简便的办法实现，在 sway 上无需再安装任何东西即可获得。wlshare 用 sway 做什么，以及示例，见{" "}
            <a href={wl("docs/sway.md")}>Sway（英文）</a>。
          </p>
          <Still
            name="wlshare-sway"
            caption={
              <>
                在 Chrome 中以 Mac 的 Retina 密度通过 wlshare 显示 Sway：<code>wlr-randr</code> 报告无头输出的缩放为 2，<code>wpctl</code> 显示浏览器收听时 wlshare 自己的音频输出设备。
              </>
            }
          />
        </>
      ),
    },
    {
      id: "installing",
      title: "安装",
      body: (
        <>
          <p className="warning">
            <strong>不保证向后兼容。</strong>wlshare 的某个发布可能会更改或移除某个设置项、某个私有扩展的传输格式或某项功能，并且不再读取旧的形式。升级时，请对照{" "}
            <code>/usr/share/doc/wlshare/wlshare.example.toml</code> 检查你的配置。
          </p>
          <p>
            Debian trixie 提供基于 wlroots 0.18 的 sway 1.10 和 labwc 0.8.3。wlshare 自己的签名 APT 仓库提供依据 Debian 的打包为 trixie 原样重新构建的 sway 1.11、labwc 0.9.7 和 wlroots 0.19，支持 amd64 和 arm64，各自的用途如下：
          </p>
          <Table
            head={["软件包", "用途"]}
            rows={[
              [<>wlroots 0.19</>, "wlshare 缺少就无法启动的指针图像捕获（ext-image-copy-capture），以及在无头输出上让指针不进入画面，0.18 会把指针画进每一次捕获。wlshare 的软件包依赖它。"],
              [<>sway 1.11、labwc 0.9.7</>, "基于 wlroots 0.19 构建的版本：trixie 的 sway 1.10 和 labwc 0.8.3 链接的是 0.18，wlshare 在其上无法启动。"],
            ]}
          />
          <p>它们的版本号排在 trixie 的版本之上，因此无需设置 pin：</p>
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
sudo apt update && sudo apt install sway  # or labwc`}</code>
          </pre>
          <p>
            Ubuntu 26.04（resolute）自带基于 wlroots 0.19.2 的 sway 1.11 和 labwc 0.9.3，wlshare 可以直接在其上运行，因此该仓库没有为它提供任何软件包：从 Ubuntu 安装 sway 或 labwc 即可。
          </p>
          <p>
            wlshare 的指针不绑定任何输出，而是对整个布局定位，因此 sway 或 labwc 重新加载配置（<code>swaymsg reload</code>、<code>labwc --reconfigure</code>）虽然会把每个指针重新映射到它所指明的输出、解除用输出创建的指针的绑定，对它却没有任何影响，在 trixie 和 Ubuntu 26.04 上都一样。
          </p>
          <p>
            wlshare 本身是其<a href={RELEASES}>发布页面</a>上的软件包，不在该仓库中，每个发行版各有一个：<code>trixie</code> 和 <code>resolute</code>，各自依赖自己发行版的库。把 <code>0.0.x</code> 换成实际版本；在 Ubuntu 26.04 上，把 <code>trixie</code> 换成 <code>resolute</code>；在 arm64 主机上，把 <code>amd64</code> 换成 <code>arm64</code>：
          </p>
          <pre>
            <code>{`curl -fsSLO ${RELEASES}/download/v0.0.x/wlshare-trixie-amd64.deb
sudo apt install ./wlshare-trixie-amd64.deb`}</code>
          </pre>
          <p>
            它依赖 <code>libwlroots-0.19</code>（在 trixie 上由上面的仓库提供，Ubuntu 则自带），以及{" "}
            <code>pipewire</code>、<code>wireplumber</code> 和 <code>pipewire-pulse</code>。它推荐安装{" "}
            <code>xdg-desktop-portal-gtk</code>，让桌面上的浏览器能找到客户端的摄像头，以及{" "}
            <code>va-driver-all</code>，用于主机的硬件 H.264 编码器。
          </p>
          <p>
            zDesk 网关和 wlshare 必须使用同一个版本的 wlshare 协议，<code>wlshare --version</code> 会给出该版本。连接到另一个版本的 wlshare 时，会话会在连接时失败，并指明两个版本；把两者中较旧的那一个升级即可。不改动协议的发布会保持其版本不变。
          </p>
        </>
      ),
    },
    {
      id: "running",
      title: "运行",
      body: (
        <>
          <p>
            配置是一个 TOML 文件，默认为 <code>$XDG_CONFIG_HOME/wlshare/config.toml</code>，空文件即采用所有默认值。软件包安装了一个 systemd 用户单元，在图形会话把 <code>WAYLAND_DISPLAY</code> 交给用户管理器之后随会话启动：
          </p>
          <pre>
            <code>{`mkdir -p ~/.config/wlshare
cp /usr/share/doc/wlshare/wlshare.example.toml ~/.config/wlshare/config.toml
systemctl --user enable --now wlshare.service
journalctl --user -u wlshare -f`}</code>
          </pre>
          <p>
            手动运行时，需指明会话的套接字：<code>WAYLAND_DISPLAY=wayland-1 wlshare</code>。它监听{" "}
            <code>listen</code>，未设置时为 <code>127.0.0.1:5900</code>，并共享合成器的第一个输出，或 <code>output</code> 指定的那个输出。
          </p>
          <p>
            同一时间只有一个客户端在桌面上。完成握手（包括登录）的连接会从当前持有者手中接管桌面，就像 Windows 远程桌面那样，被接管的客户端会被告知是谁接管了它。RFB 的 shared 标志不起任何作用。因此崩溃的客户端不会留下任何残留：再次连接即可取回桌面，旧连接按住的按键和鼠标按钮都会被释放。唯一的例外是持有者自己的第二个连接，它会显示另一个输出（见
            <a href="#outputs">输出</a>）。
          </p>
        </>
      ),
    },
    {
      id: "who-may-connect",
      title: "谁可以连接",
      body: (
        <>
          <p>一个设置，三种选择。任何一种都不提供经典 VncAuth。</p>
          <Compare
            items={[
              {
                title: "不要求登录",
                sub: "两个表都不设置。",
                rows: [
                  ["登录", <Mark value="no">无</Mark>],
                  ["加密", <Mark value="no">否</Mark>],
                  ["适用于", <><code>listen</code> 位于回环地址或 VPN 地址上，或在 SSH 隧道之后</>],
                ],
              },
              {
                title: "系统登录",
                sub: <code>[pam]</code>,
                rows: [
                  ["登录", "wlshare 运行所用账户的用户名和密码，由 PAM 校验"],
                  ["加密", <Mark value="yes">RSA-AES</Mark>],
                  ["适用于", "以账户密码作为入口、并能用它解锁密钥环的桌面"],
                ],
              },
              {
                title: "独立的密码",
                sub: <code>[password]</code>,
                rows: [
                  ["登录", "一个密码，与配置中的 Argon2 哈希比对"],
                  ["加密", <Mark value="yes">RSA-AES</Mark>],
                  ["适用于", "不应以任何系统账户的密码作为入口的主机"],
                ],
              },
            ]}
          />
          <pre>
            <code>{`listen = "[::]:5900"

[pam]
# service = "wlshare"   # /etc/pam.d/wlshare, from the package`}</code>
          </pre>
          <p>
            在 <code>[pam]</code> 下，wlshare 运行所用账户之外的任何用户名都会在询问 PAM 之前被拒绝，因为端口背后的桌面属于这一个用户。对于 <code>[password]</code>，
            <code>wlshare hash-password</code> 会询问密码，并输出要作为 <code>hash</code> 粘贴的哈希；密码本身从不写下来。无论哪种方式，服务器的 RSA 密钥都会在首次启动时生成在配置旁边，其指纹会写入日志，供与客户端显示的指纹比对：zDesk 网关会在日志中记录它看到的指纹。
          </p>
          <h3 id="keyring">由登录解锁的密钥环</h3>
          <p>
            由 systemd 启动的无头桌面没有显示管理器把登录密码交给密钥环，因此登录密钥环会一直锁定，直到有程序请求它并有人在提示框中输入密码。在{" "}
            <code>[pam]</code> 下，PAM 刚校验过的密码可以完成这件事：在 <code>/etc/pam.d/wlshare</code> 的 auth 栈中、<code>common-auth</code> 之后加一行 <code>pam_exec</code>，把密码交给一个脚本，由它先后启动 <code>gnome-keyring-daemon --login</code> 和 <code>--start</code>，即{" "}
            <code>pam_gnome_keyring</code> 会做的两部分工作，因为 wlshare 不打开 PAM 会话，其 session 钩子无处运行：
          </p>
          <pre>
            <code>{`@include common-auth
auth    optional    pam_exec.so expose_authtok quiet /usr/local/lib/wlshare/unlock-keyring
@include common-account`}</code>
          </pre>
          <p>wlshare 及其软件包都不提供这个脚本，内容如下：</p>
          <pre>
            <code>{`#!/bin/sh
# /usr/local/lib/wlshare/unlock-keyring: run by pam_exec from /etc/pam.d/wlshare
# with the password PAM has just checked on stdin. It starts the keyring daemon
# with it, both halves of what pam_gnome_keyring does, since wlshare opens no
# PAM session.
set -eu
XDG_RUNTIME_DIR="/run/user/$(id -u)"
DBUS_SESSION_BUS_ADDRESS="unix:path=$XDG_RUNTIME_DIR/bus"
export XDG_RUNTIME_DIR DBUS_SESSION_BUS_ADDRESS

# A daemon already holding the Secret Service: an earlier login unlocked it.
owner=$(busctl --user list --no-legend 2>/dev/null |
    awk '$1 == "org.freedesktop.secrets" && $2 != "-" { print $2 }')
[ -z "$owner" ] || exit 0

# In a scope of its own, so that restarting wlshare does not take it down.
systemd-run --user --scope --quiet --collect --unit=gnome-keyring-login \\
    /usr/bin/gnome-keyring-daemon --daemonize --login --components=pkcs11,secrets

# --start only once that daemon listens, or it starts a second one.
i=0
while [ ! -S "$XDG_RUNTIME_DIR/keyring/control" ] && [ "$i" -lt 50 ]; do
    i=$((i + 1)); sleep 0.1
done
[ -S "$XDG_RUNTIME_DIR/keyring/control" ] || exit 0
exec /usr/bin/gnome-keyring-daemon --start >/dev/null 2>&1`}</code>
          </pre>
          <p>把它安装到上面那一行指定的位置，同时安装密钥环的软件包，并屏蔽守护进程的按需激活：</p>
          <pre>
            <code>{`sudo apt install gnome-keyring libpam-gnome-keyring
sudo install -D -m 755 unlock-keyring /usr/local/lib/wlshare/unlock-keyring
systemctl --user mask gnome-keyring-daemon.socket gnome-keyring-daemon.service`}</code>
          </pre>
          <p>
            设为 <code>optional</code>，这样打不开的密钥环只会让会话内多一个提示框，而不会让 VNC 登录失败。屏蔽（mask）<code>gnome-keyring-daemon.socket</code> 和 <code>.service</code>，以免某个由激活启动的守护进程在持有密码的那个守护进程之前占用 Secret Service。用 <code>passwd</code> 更改账户密码，它会通过 PAM 重新加密密钥环；以其他方式写入{" "}
            <code>/etc/shadow</code> 的哈希会让密钥环仍停留在旧密码之下。
          </p>
        </>
      ),
    },
    {
      id: "through-zdesk",
      title: "通过 zDesk 连接",
      body: (
        <>
          <p>
            zDesk 以带 <code>subtype = "wlshare"</code> 的 <code>vnc</code> 目标连接 wlshare，这让网关请求 wlshare 的密度、输出、画面、声音、摄像头和麦克风：
          </p>
          <pre>
            <code>{`[[targets]]
name = "wayland"
protocol = "vnc"
subtype = "wlshare"
host = "192.0.2.12"
username = "me"          # leave out under [password]
password_ref = "wayland"
# virtual_displays = 2   # on sway, a second headless output`}</code>
          </pre>
          <Still
            name="wlshare-picker"
            caption={
              <>
                <code>wlshare</code> 目标上的选择器：跟随窗口的尺寸、Opus 或 FLAC 的声音、摄像头和麦克风，以及 wlshare 的四种画面。
              </>
            }
          />
          <p>
            会话以哪些选项启动，见 zDesk 指南中的 <a href={`${zdeskGuide}#wlshare`}>wlshare</a>。
          </p>
          <p>
            没有 zDesk 时，也可以用其他 VNC 客户端作为备用方式连接：见 <a href="#vnc-client">用 VNC 客户端连接</a>。
          </p>
        </>
      ),
    },
    {
      id: "headless",
      title: "开机即启动的无头桌面",
      body: (
        <>
          <p>
            wlroots 的无头后端不驱动任何显示器，也不打开任何输入设备，因此合成器不需要 seat，也不需要 logind 会话：它可以作为 systemd 用户服务运行，开启 lingering 后，无需任何人登录即可在开机时启动。它创建一个输出 <code>HEADLESS-1</code>，由 wlshare 共享，并为每个客户端调整尺寸。演示中的 sway 和 LXQt 桌面就是这样运行的。
          </p>
          <Flow
            stages={[
              {
                icon: ICON.terminal,
                title: "用户管理器",
                body: (
                  <p>
                    由 <code>loginctl enable-linger</code> 在开机时启动，并启动合成器的单元
                  </p>
                ),
              },
              {
                icon: ICON.monitor,
                title: "合成器",
                body: (
                  <p>
                    设置了 <code>WLR_BACKENDS=headless</code> 的 sway 或 labwc；套接字创建后，它启动自己的会话 target
                  </p>
                ),
              },
              {
                icon: ICON.gateway,
                title: "wlshare",
                body: (
                  <p>
                    <code>wlshare.service</code>，由 <code>graphical-session.target</code> 拉起，会话 target 绑定到后者
                  </p>
                ),
              },
            ]}
            hops={["开机时，经由 lingering", "随会话启动"]}
          />
          <pre>
            <code>{`# ~/.config/systemd/user/sway-headless.service
[Unit]
Description=sway (headless)
After=dbus.socket

[Service]
Environment=WLR_BACKENDS=headless
Environment=WLR_LIBINPUT_NO_DEVICES=1
ExecStart=/usr/bin/sway
# graphical-session.target is what wlshare is reached through: stop it with the compositor
ExecStopPost=-/usr/bin/systemctl --user stop graphical-session.target
Restart=on-failure

[Install]
WantedBy=default.target`}</code>
          </pre>
          <pre>
            <code>{`# ~/.config/systemd/user/sway-session.target
[Unit]
Description=sway session
BindsTo=graphical-session.target`}</code>
          </pre>
          <p>
            合成器在 sway 配置的末尾把自己的环境交给用户管理器，并在套接字创建后启动该 target（labwc 在 <code>~/.config/labwc/autostart</code> 中运行同样的两行）：
          </p>
          <pre>
            <code>{`exec systemctl --user import-environment WAYLAND_DISPLAY SWAYSOCK XDG_CURRENT_DESKTOP \\
    && systemctl --user start sway-session.target`}</code>
          </pre>
          <pre>
            <code>{`loginctl enable-linger "$USER"
systemctl --user daemon-reload
systemctl --user enable --now sway-headless.service wlshare.service`}</code>
          </pre>
          <p>
            退出时如果只停止会话 target，wlshare 会对着已经消失的合成器不断重启，所以合成器的单元自己停止 <code>graphical-session.target</code>。在合成器的配置中把{" "}
            <code>HEADLESS-1</code> 固定在原点，这样为第二个显示器创建的输出会落在它的右边。
          </p>
          <Still
            name="wlshare-lxqt"
            caption={
              <>
                labwc（一个堆叠式合成器）上的 LXQt，在用户管理器下无头运行，通过同一个 wlshare，以缩放 2 显示。
              </>
            }
          />
        </>
      ),
    },
    {
      id: "outputs",
      title: "输出",
      body: (
        <>
          <p>
            每个连接显示一个输出；输出从不合并成一个帧缓冲区。像 zDesk 这样提出请求的客户端会收到会话的输出列表，并在其间切换；同一客户端的第二个连接会在第一个旁边显示另一个输出，有自己的尺寸和密度：最多同时两个。普通 VNC 客户端只能看到一个，即 <code>output</code> 指定的那个，或上一个客户端选择的那个。
          </p>
          <p>
            只有 <code>HEADLESS-*</code> 输出会为客户端调整尺寸或缩放；显示器保持其自身的模式。
            <code>output</code> 表示偏好而非要求：合成器没有该名称的输出时，共享的是另一个输出，等它出现后桌面再移到它上面。
          </p>
          <h3 id="virtual-displays">
            两个虚拟显示器 <Tag kind="beta">beta</Tag>
          </h3>
          <p>
            客户端可以请求一个或两个虚拟显示器，就像 RDP 客户端向 Windows 主机请求其显示器那样。在 sway 上，wlshare 通过 <code>SWAYSOCK</code> 中给出的 sway IPC 创建和拔除无头输出，直到数量符合请求，无需任何配置：设置了 <code>virtual_displays = 2</code> 的 zDesk 目标会得到第二个输出，下一个只请求一个的会话会让它被拔除。在其他合成器上，输出就是合成器已有的那些。
          </p>
          <Clip
            name="wlshare-two-outputs"
            caption={
              <>
                无头 sway 的两个输出显示在两个 Chromium 窗口中，每个窗口与各自输出的尺寸相同：一段视频用 <kbd>$mod</kbd>+<kbd>Shift</kbd>+<kbd>→</kbd> 移到第二个输出再移回来。
              </>
            }
          />
        </>
      ),
    },
    {
      id: "at-the-console",
      title: "也在控制台使用的桌面",
      body: (
        <>
          <p>
            接在真实显示器上的桌面可以作为一个与客户端尺寸和密度相同的无头输出交给客户端：在别处观看时显示器关闭，离开后显示器恢复。wlshare 在 <code>state_socket</code> 上报告是否有客户端在桌面上，<code>wlshare watch</code> 在单独的进程中跟踪这一状态，并为每种状态运行一条命令：
          </p>
          <pre>
            <code>{`# config.toml
output = "HEADLESS-1"
state_socket = "wlshare/state.sock"
output_wait_secs = 5`}</code>
          </pre>
          <pre>
            <code>{`wlshare watch \\
    --held "swaymsg 'output HEADLESS-1 enable, output DP-1 disable'" \\
    --free "swaymsg 'output DP-1 enable, output HEADLESS-1 disable'"`}</code>
          </pre>
          <ul>
            <li>
              <code>--held</code> 在客户端接管桌面时运行，<code>--free</code> 在 <code>--free-after-secs</code>（5）秒内无人持有桌面时运行，因此在等待时间内重新连接的客户端不会触发任何一条。接管不算状态变化。
            </li>
            <li>
              sway 会把被禁用输出上的工作区移到已启用的输出上，因此窗口会跟着移到无头输出上。设置 <code>output_wait_secs</code> 后，接管桌面的客户端会等待{" "}
              <code>HEADLESS-1</code> 启用，并从它而不是显示器开始。
            </li>
            <li>
              守护进程退出时，无论以何种方式退出，套接字都会关闭，监视进程会将其视为桌面已被离开：即使 wlshare 在有客户端在桌面上时被杀死，显示器也会恢复。监视进程每次启动时都会按桌面当前的状态运行对应的命令，因此两条命令都必须能安全地重复运行。
            </li>
            <li>
              在会话开始时创建 <code>HEADLESS-1</code>（<code>swaymsg create_output</code>），放在不与任何显示器相邻的位置，远在它们的左侧，这样指针不会从控制台游移到它上面。
            </li>
          </ul>
          <p>
            保持关闭的桌面可以在控制台或通过 SSH 恢复，需设置 <code>SWAYSOCK</code>：
            <code>swaymsg 'output * enable'</code>。把监视进程作为用户单元与 wlshare 的单元并列运行，作为{" "}
            <code>graphical-session.target</code> 的一部分，让它随会话启动和停止。
          </p>
        </>
      ),
    },
    {
      id: "sound-camera-microphone",
      title: "声音、摄像头和麦克风",
      body: (
        <>
          <p>
            始终开启，无需任何配置：客户端逐项请求，zDesk 在勾选了它们启动的会话中会请求。
          </p>
          <Table
            head={["", "在桌面上", "何时存在"]}
            rows={[
              [
                "声音",
                <>
                  一个 PipeWire 音频输出设备 <em>wlshare remote audio</em>，设为默认；其监听流按客户端的请求以 FLAC 或 Opus 发送
                </>,
                "有客户端收听时",
              ],
              [
                "摄像头",
                <>
                  一个 PipeWire 视频源 <em>wlshare remote camera</em>，来自客户端的 H.264，由系统的 libavcodec 解码
                </>,
                "有程序打开它时",
              ],
              [
                "麦克风",
                <>
                  一个 PipeWire 音频源 <em>wlshare remote microphone</em>，来自客户端的 16 位 PCM
                </>,
                "有程序录音时",
              ],
            ]}
          />
          <p>
            有客户端收听时，每个跟随默认设备的音频流都播放到 wlshare 的输出设备，在主机上静音；固定到主机某个输出设备的程序仍在主机上播放。最后一个收听者离开后，该输出设备随之消失，主机自己的设备重新成为默认。无头桌面不需要声卡。
          </p>
          <p>
            桌面上的浏览器通过 <code>xdg-desktop-portal</code> 的 Camera 接口访问摄像头，该接口只在有实现 Access 的后端（例如 <code>xdg-desktop-portal-gtk</code>）时提供；
            只有 <code>xdg-desktop-portal-wlr</code> 是不够的。Chrome 还需要打开{" "}
            <code>chrome://flags/#enable-webrtc-pipewire-camera</code>。直接打开{" "}
            <code>/dev/video*</code> 的程序看不到它。麦克风两者都不需要：它是一个普通的 PipeWire 音频源。
          </p>
        </>
      ),
    },
    {
      id: "keyboard",
      title: "键盘",
      body: (
        <>
          <p>
            客户端发送 keysym，wlshare 通过它作为虚拟键盘的 keymap 上传给合成器的那个 keymap，把它们转换为 keycode，因此会话的输入也按这个 keymap 进行。自定义布局放在 <code>[xkb]</code> 下，并在单元的环境中用 <code>XKB_CONFIG_EXTRA_PATH</code> 指定存放它的目录：
          </p>
          <pre>
            <code>{`[xkb]
layout = "swayvnc"`}</code>
          </pre>
          <pre>
            <code>{`systemctl --user edit wlshare.service
# [Service]
# Environment=XKB_CONFIG_EXTRA_PATH=/etc/xkb`}</code>
          </pre>
          <p>
            每个键都必须保留自己的 keysym，只能增加动作，因为传入的 keysym 是在同一个 keymap 中查找的。远程桌面上把 sway 的修饰键移到右 Alt 就是这样做的：用一个布局，而不是一行{" "}
            <code>xkb_options</code>，因为 sway 对虚拟键盘会忽略它。锁定键不能作为修饰键：Caps Lock 在任何内容发送之前就会锁定客户端自己的大写状态。
          </p>
        </>
      ),
    },
    {
      id: "the-picture",
      title: "画面",
      body: (
        <>
          <p>
            wlshare 会告诉提出请求的客户端帧缓冲区按什么密度绘制，这是标准 RFB 做不到的，并把客户端的密度作为输出的缩放：2x 的浏览器得到缩放为 2 的输出，按真实尺寸清晰显示。普通 VNC 客户端收到同样的像素但没有密度信息，按 1x 显示。
          </p>
          <StillPair
            items={[
              {
                name: "wlshare-sway",
                caption: <>zDesk 会话：缩放为 2 的输出按 2x 显示，完整显示在窗口中。</>,
              },
              {
                name: "wlshare-plain-vnc",
                caption: (
                  <>
                    同一桌面作为普通 VNC，没有 <code>subtype = "wlshare"</code>：其像素按 1x 显示，尺寸变为两倍，窗口中只能显示四分之一。
                  </>
                ),
              },
            ]}
          />
          <p>
            除了标准的 Raw 和 ZRLE，提出请求的客户端会收到 wlshare 自己的某种画面，zDesk 把它们作为选择器的 Picture 组提供（见
            <a href={`${zdeskGuide}#wlshare`}>zDesk 指南中的 wlshare</a>）：按链路调整的整个桌面的 H.264；RemoteFX Progressive 图块；每个运动区域各有一路视频流的无损 PNG 图块；或者无论静止还是运动都无损的图块，运动的部分用中值预测器编码。
          </p>
          <p>
            H.264，无论是整个桌面的还是运动区域的，在 VA-API 找到硬件编码器时由主机的硬件编码器编码，否则由 libx264 编码；<code>hardware_h264 = false</code> 跳过硬件。启动时的探测会先尝试 Intel 的低功耗编码器，它把 GPU 的执行单元留给桌面，并把找到的结果写入日志：
          </p>
          <pre>
            <code>{`journalctl --user -b -u wlshare | grep h264
# hardware H.264: /dev/dri/renderD128 through VA-API, its low-power encoder`}</code>
          </pre>
          <p>
            没有视频编码器的虚拟机（例如使用 VirGL 的虚拟机）以软件编码每一帧：输出越大，占用的主机处理器越多。<code>max_fps</code>（默认 30）限制捕获的帧数；zDesk 页面最多绘制 30 帧。
          </p>
        </>
      ),
    },
    {
      id: "vnc-client",
      title: "用 VNC 客户端连接",
      body: (
        <>
          <p>
            手边没有 zDesk 时，任何其他列出 Cursor 伪编码并能绘制 Raw 矩形的 RFB 3.8 客户端都可以连接，按输出自身的像素显示，没有声音。之所以需要 Cursor，是因为指针从不出现在帧缓冲区中；不列出 wlshare 扩展的客户端不会收到这些扩展。TigerVNC 的查看器（1.13 或更高版本）就是其中之一，因为它支持 RSA-AES。它的 <code>vncviewer</code> 在两个冒号之后写端口；只写一个冒号时，后面是从 5900 起算的显示编号：
          </p>
          <pre>
            <code>{`sudo apt install tigervnc-viewer   # Debian, Ubuntu
vncviewer 192.0.2.12::5900`}</code>
          </pre>
          <p>
            在 <code>[pam]</code> 或 <code>[password]</code> 下，它会先显示服务器密钥的指纹，该指纹应与 wlshare 启动时记入日志的相同。随后，在 <code>[pam]</code> 下它询问账户的用户名和密码，在 <code>[password]</code> 下只询问密码。
          </p>
          <StillPair
            items={[
              {
                name: "wlshare-tigervnc-fingerprint",
                caption: <>TigerVNC 显示的指纹：即 wlshare 生成密钥时记入日志的那个。</>,
              },
              {
                name: "wlshare-tigervnc-login",
                caption: (
                  <>
                    <code>[pam]</code> 下询问账户的用户名和密码，此时连接已由 RSA-AES 加密。
                  </>
                ),
              },
            ]}
          />
          <p>
            两个表都未设置时，TigerVNC 不询问任何内容就连接，且不加密，因此应通过 SSH 连接位于回环地址上的 <code>listen</code>。<code>-via</code> 会建立隧道并经由它连接，其后的主机名按隧道远端看到的来解析，所以 <code>localhost</code> 指的是桌面所在的机器：
          </p>
          <pre>
            <code>{`vncviewer -via me@192.0.2.12 localhost::5900`}</code>
          </pre>
          <p>
            只提供经典 VncAuth 的客户端找不到共同的安全类型，会在任何登录之前被拒绝：限定为 VncAuth 的 TigerVNC 会报告 <em>No matching security types</em>。
          </p>
          <p>
            连接之后，TigerVNC 会请求与其窗口相同的尺寸，wlshare 将无头输出调整到该尺寸，缩放为 1。剪贴板双向互通。客户端只看到一个输出（见 <a href="#outputs">输出</a>），没有声音、摄像头和麦克风。和任何客户端一样，它在登录完成后就从当前持有者手中接管桌面。
          </p>
          <Still
            name="wlshare-tigervnc"
            caption={
              <>
                X 桌面上的 TigerVNC，以 <code>[pam]</code> 登录：sway 的无头输出已调整为查看器窗口的尺寸，1520×940、缩放为 1，wlshare 的日志中记有查看器显示的指纹。
              </>
            }
          />
        </>
      ),
    },
  ],
};

export default guide;
