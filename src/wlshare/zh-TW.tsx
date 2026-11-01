import { pagePath } from "../content";
import { Cards, Clip, Still, StillPair } from "../guides/visuals";
import type { WlshareText } from "./text";

const WLSHARE = "https://github.com/andrewtheguy/wlshare";
const guide = pagePath("zh-TW", "wlshare-guide");

const text: WlshareText = {
  title: "wlshare",
  description:
    "wlshare 是為 sway、labwc 等 wlroots Wayland 桌面打造的 VNC 伺服器，專為 zDesk 設計：瀏覽器的像素密度、H.264 或無損圖塊、聲音、透過 PipeWire 提供的攝影機和麥克風，以及一個或兩個輸出。",
  tagline: "為 wlroots 桌面打造的 VNC 伺服器，專為 zDesk 設計。",
  intro: (
    <>
      wlshare 透過 RFB 共享 sway、labwc 或其他 wlroots 桌面，並為 zDesk 提供一般 VNC
      無法傳遞的內容：瀏覽器的像素密度、配合連線調整的畫面、桌面的聲音、瀏覽器的攝影機和麥克風，以及在獨立分頁中顯示的第二個輸出。它是自由的開放原始碼軟體，採用{" "}
      <a href={`${WLSHARE}/blob/main/LICENSE`}>MIT 授權條款</a>。
    </>
  ),
  rolling: "wlshare 採用滾動發行：最新發行版就是目前的版本。",
  packages: (
    <>
      在 Debian trixie 上，它需要 wlroots 0.19 以及以它建置的 sway 或 labwc，來自它自己的{" "}
      <a href="#install">APT 套件庫</a>：0.19 讓指標不進入畫面；當 labwc 顯示兩個輸出、每個瀏覽器分頁各顯示一個時，套件庫中的修補讓指標落在正確的輸出上。
    </>
  ),
  heroCaption: "在 Chrome 中以 Mac 的 Retina 密度透過 wlshare 顯示 Sway，畫面上正在播放影片。",
  demoHeading: "示範",
  demoIntro: "從 Mac 上的 Chrome 錄製的 zDesk 工作階段，未安裝任何用戶端：sway 桌面上的 wlshare。",
  features: [
    {
      icon: "size",
      title: "以瀏覽器的密度清晰顯示",
      body: (
        <>
          它告訴用戶端其像素是以什麼密度繪製的，這是標準 RFB
          做不到的，並把瀏覽器的密度當作輸出的縮放比例：Retina 或 HiDPI 螢幕會清晰且以真實尺寸顯示桌面，無頭輸出則會跟隨視窗的大小。
        </>
      ),
    },
    {
      icon: "picture",
      title: "配合連線的畫面",
      body: (
        <>
          由主機硬體編碼器或 libx264 編碼、配合連線調整的整個桌面 H.264；RemoteFX
          Progressive 圖塊；每個移動區域各有一路視訊串流的無損圖塊；或適用於區域網路、全程無損的圖塊。
        </>
      ),
    },
    {
      icon: "sound",
      title: "桌面的聲音",
      body: (
        <>
          有用戶端收聽時，wlshare 自己的 PipeWire 音訊輸出裝置會成為預設，在那裡播放的內容以無損的 FLAC 或 Opus
          傳送。無頭桌面不需要音效卡。
        </>
      ),
    },
    {
      icon: "camera",
      title: "瀏覽器的攝影機和麥克風",
      body: (
        <>
          以 PipeWire 裝置的形式借給桌面使用，只在桌面上有應用程式使用時才在瀏覽器中開啟：在那裡通話或錄製，用的就是你面前的攝影機。
        </>
      ),
    },
    {
      icon: "displays",
      title: "一個或兩個輸出",
      body: (
        <>
          用戶端會收到桌面的輸出清單以供選擇，第二個連線會在第一個旁邊顯示另一個輸出。在 sway
          上，要求兩個虛擬顯示器的用戶端會得到第二個無頭輸出。
        </>
      ),
    },
    {
      icon: "lock",
      title: "指明帳戶的登入",
      body: (
        <>
          以 RSA-AES 透過 PAM 使用帳戶本身的密碼，或使用以 Argon2 雜湊儲存的專屬密碼。傳統 VNC
          認證會把密碼截斷為八個字元，且工作階段以明文傳輸，因此不提供。
        </>
      ),
    },
    {
      icon: "monitor",
      title: "任何 wlroots 合成器",
      body: (
        <>
          sway、labwc 或其他提供 wlroots 協定的合成器，無論是無頭還是接著顯示器。指標不在畫面中，由用戶端繪製；wlshare
          的 APT 套件庫為 Debian trixie 提供了 wlroots 0.19，能讓指標在無頭輸出上也不進入畫面。
        </>
      ),
    },
    {
      icon: "key",
      title: "一次一個用戶端",
      body: (
        <>
          登入的連線會從目前持有桌面的一方接管桌面，就像 Windows 遠端桌面那樣，因此中斷的用戶端不會留下任何東西：再次連線就能取回桌面。
        </>
      ),
    },
  ],
  sections: [
    {
      id: "where-it-runs",
      title: "執行環境",
      body: (
        <>
          <p>示範和本頁圖片背後的桌面，以及各自的設定方式：</p>
          <Cards
            items={[
              {
                title: "開機即啟動的無頭桌面",
                body: (
                  <>
                    sway 或 labwc 以 systemd 使用者服務的形式在 wlroots 的無頭後端上執行，在 lingering
                    下於開機時啟動，不需要任何人登入。wlshare 隨工作階段啟動，並為每個用戶端調整無頭輸出的大小。{" "}
                    <a href={`${guide}#headless`}>做法</a>
                  </>
                ),
              },
              {
                title: "主控台上的桌面，交給用戶端",
                body: (
                  <>
                    在接著顯示器的電腦上，接管桌面的用戶端會看到一個符合其尺寸和密度的無頭輸出，同時顯示器變暗；用戶端離開時，
                    <code>wlshare watch</code> 會把視窗移回顯示器上。<a href={`${guide}#at-the-console`}>做法</a>
                  </>
                ),
              },
              {
                title: "labwc 上的 LXQt",
                body: (
                  <>
                    一個有面板、選單和檔案管理員的堆疊式桌面，執行在 labwc 而非平鋪式合成器上：用的是同一個
                    wlshare，因為每個 wlroots 合成器都是同一類對等端。
                  </>
                ),
              },
              {
                title: "由登入解鎖的金鑰圈",
                body: (
                  <>
                    使用系統登入時，PAM 剛檢查過的密碼會解鎖一個非由顯示管理員啟動的桌面的登入金鑰圈。{" "}
                    <a href={`${guide}#keyring`}>做法</a>
                  </>
                ),
              },
              {
                title: "一個閘道後的多個桌面",
                body: (
                  <>
                    一個 zDesk 閘道，執行在容器或 Kubernetes Pod 中，除了 Windows 和 Mac
                    目標之外，每個桌面各有一個目標，都能從任何瀏覽器連線。
                  </>
                ),
              },
            ]}
          />
          <Still
            name="wlshare-lxqt"
            caption="labwc 上的 LXQt，在使用者管理員下以無頭方式執行，在 Chrome 中以縮放比例 2 顯示：一個檔案管理員和一個終端機。"
          />
        </>
      ),
    },
    {
      id: "through-zdesk",
      title: "透過 zDesk",
      body: (
        <>
          <p>
            設定 <code>subtype = "wlshare"</code> 的 <code>vnc</code>{" "}
            目標會要求以上所有功能。不設定子類型時，同一個伺服器會以任何 VNC 伺服器的方式讀取：以 1x 顯示其像素，沒有聲音。
          </p>
          <StillPair
            items={[
              { name: "wlshare-sway", caption: "設定子類型：縮放比例 2 的輸出以 2x 顯示，完整呈現在視窗中。" },
              {
                name: "wlshare-plain-vnc",
                caption: "不設定子類型：同樣的像素以 1x 顯示，尺寸變為兩倍，視窗中只看得到桌面的四分之一。",
              },
            ]}
          />
          <Clip
            name="wlshare-two-outputs"
            caption={<>無頭 sway 的兩個輸出分別顯示在兩個 Chromium 視窗中：一段影片被移到第二個輸出再移回來。</>}
          />
        </>
      ),
    },
    {
      id: "install",
      title: "安裝",
      body: (
        <>
          <p>
            在 Debian trixie（amd64 或 arm64）上：先從 wlshare 的 APT 套件庫安裝 wlroots 0.19 和 sway 或 labwc，再從其
            <a href={`${WLSHARE}/releases`}>發行版清單</a>安裝 wlshare，以版本號碼取代 <code>0.0.x</code>：
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
          <p>
            在另行設定之前，它監聽回送位址，不需要登入。<a href={guide}>wlshare 指南</a>
            說明了登入、開機即啟動的無頭桌面、輸出、聲音及其他內容。
          </p>
        </>
      ),
    },
  ],
};

export default text;
