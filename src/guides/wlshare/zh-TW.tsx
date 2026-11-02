import Flow from "../../Flow";
import { pagePath } from "../../content";
import ICON from "../icons";
import { type GuideText } from "../links";
import { Clip, Compare, Mark, Still, StillPair, Table, Tag } from "../visuals";

const WLSHARE = "https://github.com/andrewtheguy/wlshare";
const RELEASES = `${WLSHARE}/releases`;
const wl = (path: string) => `${WLSHARE}/blob/main/${path}`;
const zdeskGuide = pagePath("zh-TW", "zdesk-guide");

const guide: GuideText = {
  intro: (
    <>
      在 sway 或 labwc 等 wlroots 合成器上設定和使用 <a href={pagePath("zh-TW", "wlshare")}>wlshare</a>，也就是 zDesk
      用來連線 Linux 桌面的 VNC 伺服器：它需要什麼、誰可以連線、透過 zDesk 或其他 VNC 用戶端連線、不需要任何人登入就在開機時啟動的桌面，以及它傳送的內容。所有設定項都在附註解的{" "}
      <a href={wl("wlshare.example.toml")}>
        <code>wlshare.example.toml</code>
      </a>
      中，運作方式則在 <a href={wl("docs/architecture.md")}>Architecture</a> 中說明。
    </>
  ),
  sections: [
    {
      id: "what-it-needs",
      title: "需要什麼",
      body: (
        <>
          <p>
            wlshare 以擁有該 Wayland 工作階段的使用者身分，在它所共享的工作階段中執行，並透過 wlroots
            的公開協定與合成器溝通。任何提供這些協定的 wlroots 合成器都是同一類對等端：
          </p>
          <Table
            head={["協定", "用途"]}
            rows={[
              [<code>wlr-screencopy</code>, "畫面，版本 2 或更新；必要"],
              [<code>ext-image-copy-capture</code>, "指標的影像，與畫面分開擷取；必要"],
              [<code>xdg-output</code>, "每個輸出在版面配置中的位置，指標依此定位；版本 3，必要"],
              [<code>wlr-output-management</code>, "為用戶端調整無頭輸出的大小和縮放比例"],
              [
                <>
                  虛擬鍵盤和指標
                </>,
                "用戶端的鍵盤和滑鼠",
              ],
              [<code>wlr-data-control</code>, "雙向剪貼簿"],
            ]}
          />
          <p>
            指標永遠不在擷取的像素中：wlshare 以輸出的密度另外傳送它的影像，用戶端移動指標時不必等待影格。在無頭輸出上，這需要
            wlroots 0.19，它是第一個讓無頭後端把游標放在獨立平面上的版本；0.18
            會把游標畫進擷取的畫面中。聲音、攝影機和麥克風透過 PipeWire 傳遞，套件相依於它。
          </p>
          <Still
            name="wlshare-sway"
            caption={
              <>
                在 Chrome 中以 Mac 的 Retina 密度透過 wlshare 顯示 Sway：<code>wlr-randr</code>{" "}
                回報無頭輸出的縮放比例為 2，<code>wpctl</code> 則在瀏覽器收聽時顯示 wlshare 自己的音訊輸出裝置。
              </>
            }
          />
        </>
      ),
    },
    {
      id: "installing",
      title: "安裝",
      body: (
        <>
          <p className="warning">
            <strong>不保證回溯相容。</strong>wlshare
            的任何版本都可能變更或移除某個設定項、私有擴充的傳輸格式或某項功能，且不再讀取舊的寫法。升級時，請對照{" "}
            <code>/usr/share/doc/wlshare/wlshare.example.toml</code> 檢查你的設定。
          </p>
          <p>
            Debian trixie 隨附以 wlroots 0.18 為基礎的 sway 1.10 和 labwc 0.8.3。wlshare 自己的已簽署 APT
            套件庫提供 sway 1.11、labwc 0.9.7 和 wlroots 0.19，以 Debian 的打包方式為 trixie 原樣重新建置，支援 amd64 和
            arm64，各自的用途如下：
          </p>
          <Table
            head={["套件", "用途"]}
            rows={[
              [<>wlroots 0.19</>, "wlshare 缺少就無法啟動的指標影像擷取（ext-image-copy-capture），以及在無頭輸出上讓指標不進入畫面，0.18 會把指標畫進每一次擷取。wlshare 的套件相依於它。"],
              [<>sway 1.11、labwc 0.9.7</>, "以 wlroots 0.19 建置的版本：trixie 的 sway 1.10 和 labwc 0.8.3 連結的是 0.18，wlshare 無法在其上啟動。"],
            ]}
          />
          <p>它們的版本號排序高於 trixie 的版本，因此不需要設定釘選（pin）：</p>
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
            Ubuntu 26.04（resolute）內建以 wlroots 0.19.2 為基礎的 sway 1.11 和 labwc 0.9.3，wlshare
            可以直接在其上執行，因此套件庫沒有為它提供任何套件：從 Ubuntu 安裝 sway 或 labwc 即可。
          </p>
          <p>
            wlshare 的指標不綁定任何輸出，而是對整個版面配置定位，因此 sway 或 labwc 重新載入設定（<code>swaymsg reload</code>、<code>labwc --reconfigure</code>）雖然會把每個指標重新對應到它所指名的輸出、解除以輸出建立的指標的綁定，對它卻沒有任何影響，在 trixie 和 Ubuntu 26.04 上都一樣。
          </p>
          <p>
            wlshare 本身是放在其<a href={RELEASES}>發行版清單</a>中的套件，不在套件庫裡，每個發行版各有一個：
            <code>trixie</code> 和 <code>resolute</code>，各自相依於自己發行版的函式庫。以版本號碼取代{" "}
            <code>0.0.x</code>，在 Ubuntu 26.04 上以 <code>resolute</code> 取代 <code>trixie</code>，在 arm64
            主機上則以 <code>arm64</code> 取代 <code>amd64</code>：
          </p>
          <pre>
            <code>{`curl -fsSLO ${RELEASES}/download/v0.0.x/wlshare-trixie-amd64.deb
sudo apt install ./wlshare-trixie-amd64.deb`}</code>
          </pre>
          <p>
            它相依於 <code>libwlroots-0.19</code>（在 trixie 上由上述套件庫提供，Ubuntu 則內建），以及 <code>pipewire</code>、
            <code>wireplumber</code> 和 <code>pipewire-pulse</code>。它建議安裝{" "}
            <code>xdg-desktop-portal-gtk</code>，讓桌面上的瀏覽器能找到用戶端的攝影機，以及{" "}
            <code>va-driver-all</code>，用於主機的硬體 H.264 編碼器。
          </p>
          <p>
            zDesk 閘道和 wlshare 必須使用同一個版本的 wlshare 協定，<code>wlshare --version</code>{" "}
            會列出這個版本。連線到另一個版本的 wlshare
            時，工作階段會在連線時失敗，並指明兩個版本；把較舊的那一個升級即可。不變更協定的發行會維持其版本不變。
          </p>
        </>
      ),
    },
    {
      id: "running",
      title: "執行",
      body: (
        <>
          <p>
            設定是一個 TOML 檔案，預設為 <code>$XDG_CONFIG_HOME/wlshare/config.toml</code>
            ，空檔案即採用所有預設值。套件會安裝一個 systemd 使用者單元，在圖形工作階段把{" "}
            <code>WAYLAND_DISPLAY</code> 交給使用者管理員後，隨該工作階段啟動：
          </p>
          <pre>
            <code>{`mkdir -p ~/.config/wlshare
cp /usr/share/doc/wlshare/wlshare.example.toml ~/.config/wlshare/config.toml
systemctl --user enable --now wlshare.service
journalctl --user -u wlshare -f`}</code>
          </pre>
          <p>
            手動執行時，請指明工作階段的通訊端：<code>WAYLAND_DISPLAY=wayland-1 wlshare</code>。它監聽{" "}
            <code>listen</code>（未設定時為 <code>127.0.0.1:5900</code>），並共享合成器的第一個輸出，或{" "}
            <code>output</code> 指明的那一個。
          </p>
          <p>
            同一時間只有一個用戶端在桌面上。完成交握（包括登入）的連線會從目前持有桌面的一方接管桌面，就像 Windows
            遠端桌面那樣，被接管的用戶端會得知是誰接管了它。RFB 的 shared
            旗標不會改變任何事。因此中斷的用戶端不會留下任何東西：再次連線就能取回桌面，舊用戶端按住的按鍵和按鈕也會被放開。唯一的例外是持有者自己的第二個連線，它會顯示另一個輸出（請見
            <a href="#outputs">輸出</a>）。
          </p>
        </>
      ),
    },
    {
      id: "who-may-connect",
      title: "誰可以連線",
      body: (
        <>
          <p>一個設定，三種答案。三者都不提供傳統 VNC 認證。</p>
          <Compare
            items={[
              {
                title: "不要求登入",
                sub: "兩個表格都不設定。",
                rows: [
                  ["登入", <Mark value="no">無</Mark>],
                  ["加密", <Mark value="no">否</Mark>],
                  ["適用於", <>位於回送位址、VPN 位址或 SSH 通道之後的 <code>listen</code></>],
                ],
              },
              {
                title: "系統登入",
                sub: <code>[pam]</code>,
                rows: [
                  ["登入", "wlshare 執行時所用帳戶的使用者名稱和密碼，由 PAM 檢查"],
                  ["加密", <Mark value="yes">RSA-AES</Mark>],
                  ["適用於", "以帳戶密碼作為進入方式、並能用它解鎖金鑰圈的桌面"],
                ],
              },
              {
                title: "專屬密碼",
                sub: <code>[password]</code>,
                rows: [
                  ["登入", "一組密碼，與設定中的 Argon2 雜湊比對"],
                  ["加密", <Mark value="yes">RSA-AES</Mark>],
                  ["適用於", "不應以任何系統帳戶的密碼作為進入方式的主機"],
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
            在 <code>[pam]</code> 下，除了 wlshare
            執行時所用的帳戶之外，任何使用者名稱都會在詢問 PAM 之前被拒絕，因為這個連接埠背後的桌面只屬於那一個使用者。使用{" "}
            <code>[password]</code> 時，<code>wlshare hash-password</code> 會詢問密碼並輸出雜湊，作為{" "}
            <code>hash</code> 貼上；密碼本身永遠不會寫下來。無論哪一種，伺服器的 RSA
            金鑰都會在第一次啟動時於設定旁產生，並記錄其指紋，供你與用戶端顯示的指紋比對：zDesk 閘道會記錄它看到的指紋。
          </p>
          <h3 id="keyring">由登入解鎖的金鑰圈</h3>
          <p>
            由 systemd 啟動的無頭桌面沒有顯示管理員把登入密碼交給金鑰圈，因此登入金鑰圈會一直鎖住，直到有應用程式要求、有人回應提示為止。在{" "}
            <code>[pam]</code> 下，PAM 剛檢查過的密碼可以完成這件事：<code>/etc/pam.d/wlshare</code> 的 auth
            堆疊中，在 <code>common-auth</code> 之後加一行 <code>pam_exec</code>
            ，把密碼交給一個指令碼，由它先後啟動 <code>gnome-keyring-daemon --login</code> 和{" "}
            <code>--start</code>，也就是 <code>pam_gnome_keyring</code> 原本會做的兩半，因為 wlshare 不開啟 PAM
            工作階段，它的 session 掛鉤無從執行：
          </p>
          <pre>
            <code>{`@include common-auth
auth    optional    pam_exec.so expose_authtok quiet /usr/local/lib/wlshare/unlock-keyring
@include common-account`}</code>
          </pre>
          <p>wlshare 及其套件都不提供這個指令碼，內容如下：</p>
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
          <p>把它安裝到上面那一行指定的位置，同時安裝金鑰圈的套件，並遮蔽守護程式的按需啟用：</p>
          <pre>
            <code>{`sudo apt install gnome-keyring libpam-gnome-keyring
sudo install -D -m 755 unlock-keyring /usr/local/lib/wlshare/unlock-keyring
systemctl --user mask gnome-keyring-daemon.socket gnome-keyring-daemon.service`}</code>
          </pre>
          <p>
            設為 <code>optional</code>，因此打不開的金鑰圈只會在工作階段中多一次提示，永遠不會讓 VNC
            登入失敗。請遮蔽（mask）<code>gnome-keyring-daemon.socket</code> 和 <code>.service</code>
            ，讓任何經由啟用機制啟動的常駐程式都不會搶在持有密碼的那一個之前占用 Secret Service。請用{" "}
            <code>passwd</code> 變更帳戶的密碼，它會透過 PAM 重新加密金鑰圈；以其他方式寫入{" "}
            <code>/etc/shadow</code> 的雜湊會讓金鑰圈仍使用舊密碼。
          </p>
        </>
      ),
    },
    {
      id: "through-zdesk",
      title: "透過 zDesk 連線",
      body: (
        <>
          <p>
            zDesk 以設定 <code>subtype = "wlshare"</code> 的 <code>vnc</code> 目標連線 wlshare，這會讓閘道向
            wlshare 要求密度、輸出、畫面、聲音、攝影機和麥克風：
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
                <code>wlshare</code> 目標上的選擇器：尺寸跟隨視窗、聲音可選 Opus 或 FLAC、攝影機和麥克風，以及 wlshare
                的四種畫面。
              </>
            }
          />
          <p>
            工作階段以哪些選項啟動，請見 zDesk 指南中的 <a href={`${zdeskGuide}#wlshare`}>wlshare</a>。
          </p>
          <p>
            沒有 zDesk 時，也可以用其他 VNC 用戶端作為備用方式連線：請見 <a href="#vnc-client">以 VNC 用戶端連線</a>。
          </p>
        </>
      ),
    },
    {
      id: "headless",
      title: "開機即啟動的無頭桌面",
      body: (
        <>
          <p>
            wlroots 的無頭後端不驅動任何顯示器，也不開啟任何輸入裝置，因此合成器不需要 seat 或 logind
            工作階段：它可以是一個 systemd 使用者服務，搭配 lingering 就能在開機時啟動，不需要任何人登入。它建立一個輸出{" "}
            <code>HEADLESS-1</code>，由 wlshare 共享，並為每個用戶端調整大小。示範中的 sway 和 LXQt
            桌面就是這樣執行的。
          </p>
          <Flow
            stages={[
              {
                icon: ICON.terminal,
                title: "使用者管理員",
                body: (
                  <p>
                    由 <code>loginctl enable-linger</code> 在開機時啟動，並啟動合成器的單元
                  </p>
                ),
              },
              {
                icon: ICON.monitor,
                title: "合成器",
                body: (
                  <p>
                    設定 <code>WLR_BACKENDS=headless</code> 的 sway 或 labwc；其通訊端建立後，便啟動它的工作階段 target
                  </p>
                ),
              },
              {
                icon: ICON.gateway,
                title: "wlshare",
                body: (
                  <p>
                    <code>wlshare.service</code>，由工作階段 target 所綁定的 <code>graphical-session.target</code>{" "}
                    帶起
                  </p>
                ),
              },
            ]}
            hops={["開機時，透過 lingering", "隨工作階段"]}
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
            合成器在其通訊端建立後，把環境交給使用者管理員並啟動 target，寫在 sway 設定的最後（labwc 則從{" "}
            <code>~/.config/labwc/autostart</code> 執行同樣的兩行）：
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
            結束時若只停止工作階段 target，wlshare 會對著已經不存在的合成器不斷重新啟動，因此合成器的單元會自行停止{" "}
            <code>graphical-session.target</code>。請在合成器的設定中把 <code>HEADLESS-1</code>{" "}
            固定在原點，讓為第二個顯示器建立的輸出落在它的右側。
          </p>
          <Still
            name="wlshare-lxqt"
            caption={
              <>
                labwc（一個堆疊式合成器）上的 LXQt，在使用者管理員下以無頭方式執行，透過同一個 wlshare，縮放比例為 2。
              </>
            }
          />
        </>
      ),
    },
    {
      id: "outputs",
      title: "輸出",
      body: (
        <>
          <p>
            每個連線顯示一個輸出；輸出永遠不會合併成同一個影格緩衝區。像 zDesk
            這樣會要求的用戶端，會收到工作階段的輸出清單並在其間切換，而同一個用戶端的第二個連線會在第一個旁邊顯示另一個輸出，有自己的尺寸和密度：同時兩個，不會更多。一般
            VNC 用戶端只看到一個，即 <code>output</code> 或上一個用戶端所選的那一個。
          </p>
          <p>
            只有 <code>HEADLESS-*</code> 輸出會為用戶端調整大小或縮放比例；顯示器維持其本身的模式。
            <code>output</code>{" "}
            指明的是偏好而不是要求：合成器沒有該名稱的輸出時，會共享另一個輸出，等該輸出出現時，桌面再移到它上面。
          </p>
          <h3 id="virtual-displays">
            兩個虛擬顯示器 <Tag kind="beta">beta</Tag>
          </h3>
          <p>
            用戶端可以要求一個或兩個虛擬顯示器，就像 RDP 用戶端向 Windows 主機要求其顯示器那樣。在 sway 上，wlshare
            透過 sway 的 IPC（在 <code>SWAYSOCK</code>{" "}
            中找到）建立和拔除無頭輸出，直到數量相符為止，不需要任何設定：設定 <code>virtual_displays = 2</code> 的
            zDesk 目標會得到第二個，下一個只要求一個的工作階段則會將它拔除。在其他合成器上，輸出就是合成器既有的那些。
          </p>
          <Clip
            name="wlshare-two-outputs"
            caption={
              <>
                無頭 sway 的兩個輸出分別顯示在兩個 Chromium 視窗中，每個視窗都是其輸出的尺寸：一段影片以{" "}
                <kbd>$mod</kbd>+<kbd>Shift</kbd>+<kbd>→</kbd> 移到第二個輸出再移回來。
              </>
            }
          />
        </>
      ),
    },
    {
      id: "at-the-console",
      title: "主控台上的桌面也可共享",
      body: (
        <>
          <p>
            真實顯示器上的桌面，可以作為符合用戶端尺寸和密度的無頭輸出交給用戶端，在別處觀看時顯示器變暗，離開時再恢復。wlshare
            在 <code>state_socket</code> 上告知是否有用戶端在桌面上，<code>wlshare watch</code>{" "}
            則從獨立的處理程序追蹤這個狀態，並在每次變化時執行一個命令：
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
              <code>--held</code> 在用戶端接管桌面時執行，<code>--free</code> 則在桌面持續{" "}
              <code>--free-after-secs</code>（5 秒）無人持有時執行，因此在等待時間內重新連線的用戶端不會觸發任何一個。接管不算變化。
            </li>
            <li>
              sway 會把停用的輸出上的工作區移到啟用的輸出上，因此視窗會跟著移到無頭輸出。設定{" "}
              <code>output_wait_secs</code> 時，接管桌面的用戶端會等待 <code>HEADLESS-1</code>{" "}
              啟用，並從它開始，而不是從顯示器開始。
            </li>
            <li>
              常駐程式結束時，無論以何種方式結束，通訊端都會關閉，監看程式會將此視為桌面已被離開：即使 wlshare
              在有用戶端時被終止，顯示器仍會恢復。監看程式每次啟動時都會針對桌面目前的狀態執行對應的命令，因此兩個命令都必須能安全地執行兩次。
            </li>
            <li>
              在工作階段開始時建立 <code>HEADLESS-1</code>（<code>swaymsg create_output</code>
              ），放在不與任何顯示器相鄰、遠在它們左側的位置，讓指標無法從主控台誤移到它上面。
            </li>
          </ul>
          <p>
            變暗的桌面可以從主控台或透過 SSH 恢復，需設定 <code>SWAYSOCK</code>：
            <code>swaymsg 'output * enable'</code>。請把監看程式作為使用者單元執行在 wlshare 的單元旁，屬於{" "}
            <code>graphical-session.target</code>，讓它隨工作階段啟動和停止。
          </p>
        </>
      ),
    },
    {
      id: "sound-camera-microphone",
      title: "聲音、攝影機和麥克風",
      body: (
        <>
          <p>一律開啟，不需要任何設定：由用戶端要求每一項，zDesk 在勾選它們啟動的工作階段中就會要求。</p>
          <Table
            head={["", "在桌面上", "存在期間"]}
            rows={[
              [
                "聲音",
                <>
                  一個 PipeWire 音訊輸出裝置 <em>wlshare remote audio</em>，設為預設；其監聽訊號依用戶端的要求以 FLAC 或
                  Opus 傳送
                </>,
                "有用戶端收聽時",
              ],
              [
                "攝影機",
                <>
                  一個 PipeWire 視訊來源 <em>wlshare remote camera</em>，來自用戶端的 H.264，以系統的 libavcodec 解碼
                </>,
                "有應用程式開啟它時",
              ],
              [
                "麥克風",
                <>
                  一個 PipeWire 音訊來源 <em>wlshare remote microphone</em>，來自用戶端的 16 位元 PCM
                </>,
                "有應用程式錄音時",
              ],
            ]}
          />
          <p>
            有用戶端收聽時，所有跟隨預設的串流都會播放到 wlshare
            的音訊輸出裝置，在主機上不發出聲音；固定到主機某個音訊輸出裝置的應用程式仍會在那裡發聲。最後一個收聽者離開時，該音訊輸出裝置隨之移除，主機自己的又成為預設。無頭桌面不需要音效卡。
          </p>
          <p>
            桌面上的瀏覽器透過 <code>xdg-desktop-portal</code> 的 Camera 介面存取攝影機，這個介面只在搭配實作 Access
            的後端（例如 <code>xdg-desktop-portal-gtk</code>）時才提供；單獨的{" "}
            <code>xdg-desktop-portal-wlr</code> 不行。Chrome 還需要開啟{" "}
            <code>chrome://flags/#enable-webrtc-pipewire-camera</code>。直接開啟 <code>/dev/video*</code>{" "}
            的應用程式看不到它。麥克風兩者都不需要：它是一個一般的 PipeWire 音訊來源。
          </p>
        </>
      ),
    },
    {
      id: "keyboard",
      title: "鍵盤",
      body: (
        <>
          <p>
            用戶端傳送 keysym，wlshare
            透過它作為虛擬鍵盤的鍵盤配置上傳給合成器的 keymap，把 keysym 轉換為 keycode，因此這個 keymap
            也就是工作階段輸入時使用的配置。自訂的配置放在 <code>[xkb]</code> 下，並在單元的環境中以{" "}
            <code>XKB_CONFIG_EXTRA_PATH</code> 指明存放它的目錄：
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
            每個按鍵都必須保留其 keysym，只能增加動作，因為傳入的 keysym 是在同一個 keymap 中查找的。sway
            的修飾鍵就是這樣為遠端桌面移到右 Alt：用一個配置，而不是一行 <code>xkb_options</code>，因為 sway
            對虛擬鍵盤會忽略後者。鎖定鍵不能作為修飾鍵：Caps Lock 會在任何內容傳送之前先鎖定用戶端自己的狀態。
          </p>
        </>
      ),
    },
    {
      id: "the-picture",
      title: "畫面",
      body: (
        <>
          <p>
            wlshare 會告訴有要求的用戶端影格緩衝區是以什麼密度繪製的，這是標準 RFB
            做不到的，並把用戶端的密度當作輸出的縮放比例：2x 的瀏覽器會得到縮放比例 2 的輸出，以真實尺寸清晰顯示。一般 VNC
            用戶端收到同樣的像素，但沒有密度資訊，並以 1x 顯示。
          </p>
          <StillPair
            items={[
              {
                name: "wlshare-sway",
                caption: <>zDesk 工作階段：縮放比例 2 的輸出以 2x 顯示，完整呈現在視窗中。</>,
              },
              {
                name: "wlshare-plain-vnc",
                caption: (
                  <>
                    同一個桌面以一般 VNC 顯示，不設定 <code>subtype = "wlshare"</code>：其像素以 1x
                    顯示，尺寸變為兩倍，視窗中只看得到四分之一。
                  </>
                ),
              },
            ]}
          />
          <p>
            除了標準的 Raw 和 ZRLE，有要求的用戶端會收到 wlshare 自己的其中一種畫面，zDesk
            把它們作為選擇器的 Picture 群組提供（請見<a href={`${zdeskGuide}#wlshare`}>zDesk 指南中的 wlshare</a>
            ）：配合連線調整的整個桌面 H.264；RemoteFX Progressive 圖塊；每個移動區域各有一路視訊串流的無損 PNG
            圖塊；或無論靜止或移動都無損的 planar 圖塊。
          </p>
          <p>
            無論是整個桌面還是移動區域的 H.264，只要 VA-API 找得到主機的硬體編碼器就由它編碼，否則以最快預設的
            libx264 編碼；<code>hardware_h264 = false</code> 會略過硬體。啟動時的探測會先嘗試 Intel
            的低功耗編碼器，讓 GPU 的執行單元留給桌面使用，並記錄它找到的結果：
          </p>
          <pre>
            <code>{`journalctl --user -b -u wlshare | grep h264
# hardware H.264: /dev/dri/renderD128 through VA-API, its low-power encoder`}</code>
          </pre>
          <p>
            沒有視訊編碼器的虛擬機器（例如使用 VirGL 的虛擬機器）會以軟體編碼每個影格：輸出越大，佔用主機處理器越多。
            <code>max_fps</code>（預設 30）限制擷取的影格數；zDesk 頁面最多繪製 30 個影格。
          </p>
        </>
      ),
    },
    {
      id: "vnc-client",
      title: "以 VNC 用戶端連線",
      body: (
        <>
          <p>
            手邊沒有 zDesk 時，任何其他列出 Cursor 偽編碼並能繪製 Raw 矩形的 RFB 3.8
            用戶端都可以連線，以輸出本身的像素顯示，沒有聲音。之所以需要 Cursor，是因為指標永遠不在影格緩衝區中；沒有列出
            wlshare 擴充的用戶端不會收到它們。TigerVNC 的檢視器（1.13 或更新版本）就是其中之一，因為它支援
            RSA-AES。它的 <code>vncviewer</code> 在兩個冒號之後寫連接埠；只寫一個冒號時，後面是從 5900 起算的顯示編號：
          </p>
          <pre>
            <code>{`sudo apt install tigervnc-viewer   # Debian, Ubuntu
vncviewer 192.0.2.12::5900`}</code>
          </pre>
          <p>
            在 <code>[pam]</code> 或 <code>[password]</code> 下，它會先顯示伺服器金鑰的指紋，這應與 wlshare
            啟動時記錄的指紋相同。接著，在 <code>[pam]</code> 下它詢問帳戶的使用者名稱和密碼，在{" "}
            <code>[password]</code> 下只詢問密碼。
          </p>
          <StillPair
            items={[
              {
                name: "wlshare-tigervnc-fingerprint",
                caption: <>TigerVNC 顯示的指紋：也就是 wlshare 產生金鑰時記錄的那一個。</>,
              },
              {
                name: "wlshare-tigervnc-login",
                caption: (
                  <>
                    <code>[pam]</code> 下詢問帳戶的使用者名稱和密碼，此時連線已由 RSA-AES 加密。
                  </>
                ),
              },
            ]}
          />
          <p>
            兩個表都沒有設定時，TigerVNC 不詢問任何東西就連線，而且不加密，所以請透過 SSH 連到位於回送位址上的{" "}
            <code>listen</code>。<code>-via</code> 會建立通道並經由它連線，其後的主機名稱以通道遠端看到的為準，所以{" "}
            <code>localhost</code> 指的是桌面所在的機器：
          </p>
          <pre>
            <code>{`vncviewer -via me@192.0.2.12 localhost::5900`}</code>
          </pre>
          <p>
            只提供傳統 VncAuth 的用戶端找不到共同的安全性類型，會在任何登入之前就被拒絕：限定使用 VncAuth 的 TigerVNC
            會回報 <em>No matching security types</em>。
          </p>
          <p>
            連線之後，TigerVNC 會要求與其視窗相同的大小，wlshare 會把無頭輸出調整成這個大小，縮放比例為
            1。剪貼簿雙向互通。用戶端只看到一個輸出（請見 <a href="#outputs">輸出</a>），沒有聲音、攝影機和麥克風。和任何用戶端一樣，它在登入完成後就從目前持有桌面的一方接管桌面。
          </p>
          <Still
            name="wlshare-tigervnc"
            caption={
              <>
                X 桌面上的 TigerVNC，以 <code>[pam]</code> 登入：sway 的無頭輸出已調整成檢視器視窗的大小，1520×940、縮放比例為
                1，wlshare 的記錄中載有檢視器顯示的指紋。
              </>
            }
          />
        </>
      ),
    },
  ],
};

export default guide;
