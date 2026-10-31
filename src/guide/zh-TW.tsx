import Flow from "../Flow";
import { pagePath, REPO } from "../content";
import ICON from "./icons";
import { repo, type GuideText } from "./links";
import { Compare, Groups, Keys, Mark, Options, Part, Routes, Still, Table, Tag, TwoDisplays } from "./visuals";

const guide: GuideText = {
  intro: (
    <>
      閘道<a href={repo("docs/install.zh-TW.md")}>安裝</a>
      好之後，維運人員和使用者需要了解的內容：如何存取頁面、工作階段以哪些選項啟動、各類目標如何設定，以及本機多執行個體控制平面。所有設定項都在附註解的{" "}
      <a href={repo("zdesk.example.toml")}>
        <code>zdesk.example.toml</code>
      </a>{" "}
      中，背後的設計請見 <a href={repo("docs/architecture.md")}>Architecture</a>
      。本頁連結的其他文件除安裝文件外都只有英文版。
    </>
  ),
  sections: [
    {
      id: "the-client",
      title: "用戶端",
      body: (
        <>
          <p>用戶端就是閘道提供的頁面，編譯在閘道的二進位檔中。它需要：</p>
          <p>
            <strong>安全環境（secure context）。</strong>閘道只使用純 HTTP，沒有 TLS
            監聽器，因此需要透過回送位址（<code>localhost</code>、<code>127.0.0.1</code>、<code>[::1]</code>、任何{" "}
            <code>.localhost</code> 名稱）或終止 TLS 的反向代理伺服器存取。透過純 <code>http://</code>{" "}
            存取區域網路位址會被拒絕，頁面會說明原因。
          </p>
          <Routes
            routes={[
              {
                ok: true,
                title: "回送位址",
                body: (
                  <>
                    <code>localhost</code>、<code>127.0.0.1</code>、<code>[::1]</code> 或任何 <code>.localhost</code>{" "}
                    名稱，在閘道所在的電腦上，或透過連到其連接埠的 SSH 通道
                  </>
                ),
              },
              { ok: true, title: "終止 TLS 的反向代理伺服器", body: "在閘道前面架設你自己的 HTTPS" },
              {
                ok: false,
                title: (
                  <>
                    透過純 <code>http://</code> 存取區域網路位址
                  </>
                ),
                body: "會被拒絕，並說明原因",
              },
            ]}
          />
          <p>
            <strong>WebCodecs</strong>，用於遠端以視訊形式傳送的畫面：<code>VideoDecoder</code> 用於 wlshare 的
            H.264、高效能模式 Mac 的 HEVC 或 H.264，以及 RDP 主機的
            H.264。沒有它時，用戶端仍然可以啟動，閘道的圖塊、標準模式 Mac 的 Adaptive 畫面、wlshare 的漸進式圖塊以及不含
            H.264 的 RDP 管線在任何瀏覽器中都能運作。
          </p>
          <Groups
            groups={[
              {
                title: (
                  <>
                    需要 <code>VideoDecoder</code>
                  </>
                ),
                items: ["wlshare 的 H.264", "高效能模式 Mac 的 HEVC 或 H.264", "RDP 主機的 H.264"],
              },
              {
                title: "在任何瀏覽器中都能運作",
                items: ["閘道的圖塊", "標準模式 Mac 的 Adaptive 畫面", "wlshare 的漸進式圖塊", "不含 H.264 的 RDP 管線"],
              },
              {
                title: (
                  <>
                    需要 <code>AudioDecoder</code>
                  </>
                ),
                items: ["Opus", "Mac 的 AAC-ELD", "FLAC，Safari 的解碼器無法解碼"],
              },
            ]}
          />
          <p>
            頁面會事先詢問瀏覽器的解碼器能否解碼 Mac 的 HEVC 和 RDP 主機的
            H.264：解碼器拒絕時，選擇器會將其變灰並說明原因。它也會詢問 wlshare 的 H.264，涵蓋 wlshare
            編碼的兩種設定檔（profile）：解碼器拒絕其中任何一種時，<code>wlshare</code> 目標的 Adaptive video
            和帶移動視訊的圖塊會變灰，只剩下由頁面自行解碼的漸進式圖塊。Mac 的 H.264 不事先詢問：它提供給所有具備{" "}
            <code>VideoDecoder</code> 的瀏覽器，沒有時變灰；解碼器不接受它時，會在工作階段中以解碼器的錯誤說明。
            <code>AudioDecoder</code> 播放 Opus、Mac 的 AAC-ELD 和 FLAC；沒有它的瀏覽器（Safari 16.4 到
            18）不播放聲音，較新的 Safari 的 <code>AudioDecoder</code> 無法解碼 FLAC，但可以播放 Opus 和 Mac 的聲音。
          </p>

          <h3>在電腦、手機或平板上</h3>
          <p>
            在電腦上使用時，請在 Chrome 或 Edge 中把頁面安裝為應用程式。應用程式視窗會把一般分頁自己保留的快速鍵（⌘W、⌘T、⌘N
            等）交給頁面。在分頁中，<strong>Menu → Immersive full screen</strong>{" "}
            也能做到這一點，而且還能收到視窗通常收不到的按鍵，例如 Super 鍵和 Alt+Tab。
          </p>
          <p>
            桌面以 100%
            顯示，從不縮放以符合視窗：較大的桌面會捲動；而在啟用調整尺寸的工作階段中，則由視窗決定遠端的尺寸。手機或平板會符合寬度並支援雙指縮放，手指作為觸控板，並提供螢幕鍵盤。
          </p>
          <Still
            name="ipad-soft-keyboard"
            caption="iPad 上的 Safari，符合寬度顯示，螢幕鍵盤提供功能鍵、導覽鍵和相黏輔助按鍵。"
          />
          <p>
            已安裝的應用程式有{" "}
            <strong>
              Window → Size to <em>width</em>×<em>height</em>
            </strong>
            ，它透過{" "}
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/resizeTo">
              <code>window.resizeTo()</code>
            </a>{" "}
            把本機視窗調整為遠端桌面的尺寸。它只調整本機視窗，從不縮放或調整遠端桌面。它在已安裝的 Chrome 和 Edge
            應用程式視窗中有效，在其他瀏覽器中則盡力而為；一般分頁無法調整視窗尺寸，行動瀏覽器會忽略這個要求。
          </p>
          <p>
            在 macOS
            上，視窗的圓角會遮住頁面，因此與桌面同尺寸的視窗會遺失影格緩衝區四角的像素。圓角半徑是系統層級的設定；設為 1
            點就夠方正，每個像素都看得到：
          </p>
          <pre>
            <code>defaults write -g NSConvolutionOverride1 -float 1</code>
          </pre>
          <p>
            結束並重新開啟瀏覽器應用程式後生效。<code>defaults delete -g NSConvolutionOverride1</code>{" "}
            會恢復 Apple 的半徑：macOS 26 上為 26 點，之前為 10 點。
          </p>
        </>
      ),
    },
    {
      id: "starting-a-session",
      title: "啟動工作階段",
      body: (
        <>
          <p>
            登入後頁面會顯示目標選擇器。點選一個目標會將它展開，下方顯示其選項，按下 Start
            即以這些選項連線。這些選項依工作階段選擇，在工作階段期間維持不變，並由瀏覽器依目標記住；它們都不是設定項。
          </p>
          <Still name="rdp-picker" caption={<><code>rdp</code> 目標的選擇器：尺寸跟隨視窗，聲音使用 FLAC，圖形管線始終直通，並以 High quality 繪製。</>} />
          <Options
            items={[
              { id: "size", icon: "size", title: "尺寸", body: "維持一個尺寸，或跟隨視窗" },
              { id: "sound", icon: "sound", title: "聲音", body: "關閉、Opus 或無損的 FLAC" },
              { id: "passthrough", icon: "picture", title: "直通", body: "遠端自己的串流，或閘道的圖塊" },
              { id: "displays", icon: "displays", title: "顯示器", body: "Mac 的螢幕，一次一個或合併顯示" },
              { id: "graphics", icon: "graphics", title: "圖形", body: "RDP 主機如何繪製其管線" },
              { id: "devices", icon: "camera", title: "攝影機和麥克風", body: "這個瀏覽器的裝置，提供給遠端" },
            ]}
          />
          <Table
            head={["目標", "視窗決定尺寸", "聲音", "直通", "圖形"]}
            rows={[
              [
                <code>rdp</code>,
                <Mark value="yes">是</Mark>,
                "關閉、Opus 或 FLAC",
                "圖形管線，一律直通",
                "高品質或自適應 H.264",
              ],
              [
                <>
                  <code>rdp</code> 且 <code>egfx = false</code>
                </>,
                <Mark value="no">否</Mark>,
                "關閉、Opus 或 FLAC",
                <Mark value="none" />,
                <Mark value="none" />,
              ],
              [<code>vnc</code>, <Mark value="no">否</Mark>, "無", <Mark value="none" />, <Mark value="none" />],
              [
                <>
                  <code>vnc</code>，<code>wlshare</code>
                </>,
                <Mark value="yes">是</Mark>,
                "關閉、Opus 或 FLAC",
                "其 H.264 視訊、其漸進式圖塊（alpha）或其帶移動視訊的圖塊，一律直通",
                <Mark value="none" />,
              ],
              [
                <>
                  <code>vnc</code>，<code>ard</code>
                </>,
                <Mark value="no">否</Mark>,
                "無",
                "Mac 的 Adaptive 畫面直通（beta），或不直通：閘道針對 Mac Full 品質編碼的圖塊",
                <Mark value="none" />,
              ],
              [
                <>
                  <code>vnc</code>，<code>ard</code> 且 <code>virtual_display</code>
                </>,
                <Mark value="yes">是</Mark>,
                "無",
                <>
                  同 <code>ard</code>
                </>,
                <Mark value="none" />,
              ],
              [
                <>
                  <code>vnc</code>，<code>ard-high-performance</code>
                </>,
                <Mark value="yes">是</Mark>,
                "一律傳輸",
                "Mac 的 HEVC，或其 H.264（beta），一律直通",
                <Mark value="none" />,
              ],
            ]}
          />

          <Part id="size" icon="size">
            尺寸（Size）
          </Part>
          <p>
            桌面要不是維持一個尺寸，即目標的 <code>size = "1920x1080"</code>，未設定時為
            1440×900；就是跟隨視窗：要求遠端依視窗的尺寸和瀏覽器的密度算繪，而不是在用戶端縮放。維持的尺寸同樣跟隨瀏覽器的密度。手機只提供維持尺寸的選項。一般{" "}
            <code>vnc</code> 目標以及使用 Mac 實體顯示器的 <code>ard</code> 依遠端自身的尺寸顯示，不接受{" "}
            <code>size</code>。
          </p>

          <Part id="sound" icon="sound">
            聲音（Sound）
          </Part>
          <p>
            Opus，或無損的 FLAC。不帶聲音啟動的工作階段不向遠端要求聲音，因此主機會繼續在原本的地方播放。工作階段中的 Mute
            和 Unmute 只改變這個瀏覽器是否收聽。手機、平板和 Safari 以靜音啟動。沒有 <code>AudioDecoder</code>{" "}
            的瀏覽器會把 Sound 變灰；Safari 的 <code>AudioDecoder</code> 無法解碼 FLAC，會把 FLAC 變灰，因此在那裡勾選
            Sound 就是使用 Opus。在高效能模式 Mac 上，這類瀏覽器中選單的 Audio 按鈕會顯示{" "}
            <em>Audio not supported</em>，無法解碼 Mac 的 AAC-ELD 的瀏覽器中則顯示 <em>AAC-ELD not supported</em>。
          </p>

          <Part id="passthrough" icon="picture">
            直通（Passthrough）
          </Part>
          <p>
            把遠端自己的串流原封不動地傳給瀏覽器，而不是由閘道編碼成圖塊。高效能模式 Mac
            的畫面一律直通，可以選擇的是哪一路串流：其 HEVC，瀏覽器無法接收時會變灰；或其 H.264（beta），它提供給所有具備{" "}
            <code>VideoDecoder</code> 的瀏覽器，頁面中不需要 HEVC 解碼器。在啟用管線的 <code>rdp</code>{" "}
            目標上，這不是一個選項：選擇器會說明它一律直通，沒有可勾選的方塊，無法合成管線的瀏覽器不能啟動該目標。直通的 RDP
            管線會跟隨瀏覽器的連線：瀏覽器跟不上時，Windows 主機會繪製較少的影格，在 Adaptive 下還會較粗糙。Mac
            直通的串流則不會：Mac 依自己的速率傳送，靜止畫面時很少，有移動時很多。
          </p>
          <p>
            在 <code>ard</code> 目標上，Picture 群組為 <em>Apple's Adaptive (beta), passed through</em>
            （預設）或 <em>Gateway adaptive, settles to lossless</em>。
          </p>
          <Compare
            items={[
              {
                title: "Apple's Adaptive",
                tag: <Tag kind="beta">beta</Tag>,
                sub: "預設。Mac 自己的 8×8 圖塊，由本頁面解碼。",
                rows: [
                  ["每次變化", "先來一遍粗略的，接著是它的細化"],
                  ["在較慢的連線上", "精細度相同，更新較少，畫面靜止後再細化"],
                  ["無損", <Mark value="no">永不</Mark>],
                  ["瀏覽器回來時", "重新開始，而不是恢復"],
                ],
              },
              {
                title: "Gateway adaptive",
                sub: "Mac 的無損 Full 品質，由閘道解壓縮後以其圖塊傳送。",
                rows: [
                  ["每次變化", "區域變化時用 JPEG，穩定後變為無損"],
                  ["在較慢的連線上", "配合連線調整"],
                  ["無損", <Mark value="yes">穩定後</Mark>],
                  ["瀏覽器回來時", "恢復"],
                ],
              },
            ]}
          />
          <p>在 Combined Display（請見下文）下 Apple's Adaptive 會變灰，因為 Combined Display 同樣是閘道的圖塊。</p>
          <p>
            在 <code>wlshare</code> 目標上，每種畫面都是 wlshare
            自己的，而且一律直通，因此標籤不再註明：Picture 群組為 <em>Adaptive video</em>（預設），即 wlshare
            針對整個桌面編碼的 H.264；<em>Progressive tiles (alpha)</em>，即依連線調整的圖塊，就像 Windows 主機在沒有
            H.264 時那樣繪製；或 <em>Tiles with motion (LAN)</em>，即 wlshare 自己的圖塊，適用於區域網路：請見{" "}
            <a href="#wlshare">wlshare</a>。
          </p>

          <Part id="displays" icon="displays">
            顯示器（Displays）
          </Part>
          <p>
            在共享 Mac 實體螢幕的 <code>ard</code> 目標上：<em>One at a time</em>
            （beta，預設）從主螢幕開始，在顯示器選單中提供其他螢幕，畫面採用上面選擇的方式；<em>Combined</em>
            （alpha）同時顯示所有螢幕，相當於 Apple 檢視器的 Combined Display，不提供單一螢幕。Combined Display 向 Mac
            要求 Full 品質，由閘道解碼、合成並以其圖塊傳送，與閘道編碼的任何畫面一樣跟隨瀏覽器的連線。在 1x 瀏覽器上，2x
            螢幕由閘道縮小為 1x，因此只占用其自身像素四分之一的連線頻寬；2x 瀏覽器收到 Mac 原生的像素，1x
            螢幕由瀏覽器自己放大繪製。僅螢幕共享的標準模式提供。請見{" "}
            <a href={repo("docs/architecture.md#a-passed-stream-and-the-browsers-link")}>
              A passed stream and the browser's link
            </a>
            。
          </p>

          <Part id="graphics" icon="graphics">
            圖形（Graphics）
          </Part>
          <p>
            RDP 主機如何繪製其管線。在 <code>VideoDecoder</code> 無法解碼主機 H.264 的瀏覽器中，Adaptive
            會變灰。要讓主機無損繪製，請見<a href="#a-lossless-picture">無損畫面</a>。
          </p>
          <Compare
            items={[
              {
                title: "High quality",
                sub: "預設。管線中除了 H.264 以外的編碼，適用於區域網路。",
                rows: [["在慢速連線上", "影格較少，但都不會較粗糙"]],
              },
              {
                title: "Adaptive",
                tag: <Tag kind="alpha">alpha</Tag>,
                sub: "主機依瀏覽器連線調整的 H.264。",
                rows: [
                  ["在慢速連線上", "慢速連線較粗糙，快速連線較精細"],
                  ["H.264 full screen", "預設：用 H.264 繪製整個桌面"],
                  ["H.264 region", "只有像影片那樣移動的部分用 H.264，其餘依 High quality 的方式繪製：文字保持清晰，但自適應較少"],
                ],
              },
            ]}
          />

          <Part id="devices" icon="camera">
            攝影機和麥克風（Camera、Microphone） <Tag kind="experimental">實驗性</Tag>
          </Part>
          <p>
            在 <code>rdp</code> 或 <code>wlshare</code>{" "}
            目標上，這兩個勾選項會在整個工作階段中向遠端提供這個瀏覽器的攝影機和麥克風，各自只在遠端有應用程式使用時才開啟。請見
            <a href="#camera-and-microphone">攝影機和麥克風</a>。
          </p>

          <h3>每個閘道一個工作階段</h3>
          <p>
            一個閘道只持有一個工作階段。重新載入或連線中斷通常會恢復工作階段；啟用圖形管線的 RDP 工作階段以及標準模式 Mac 的
            Adaptive
            工作階段則會重新連線引擎，因為瀏覽器的合成器或解碼器狀態已經遺失。另一個瀏覽器若發現擁有者仍連線中，會被詢問是否接管；在擁有者重新連線的寬限期內到達的瀏覽器可以直接占用該位置。兩種情況都從選擇器開始，使用它自己的選項。遠端會保留自己的桌面，因此再次啟動該目標會回到相同的視窗。
          </p>
          <p>
            請見{" "}
            <a href={repo("docs/architecture.md#what-a-session-is-started-with")}>What a session is started with</a>
            。
          </p>
        </>
      ),
    },
    {
      id: "target-passwords",
      title: "目標密碼",
      body: (
        <>
          <p>
            目標從不寫出自己的密碼。它只指明密碼的名稱，設定在 <code>[passwords]</code> 中以該名稱儲存加密後的密碼：
          </p>
          <Flow
            stages={[
              {
                icon: ICON.gateway,
                title: "目標指明名稱",
                body: (
                  <p>
                    在其 <code>[[targets]]</code> 中寫 <code>password_ref = "workstation"</code>
                  </p>
                ),
              },
              {
                icon: ICON.lock,
                title: "設定以加密形式保存",
                body: (
                  <p>
                    在 <code>[passwords]</code> 下寫 <code>workstation = "$ZD;1;AES-256-GCM;…"</code>
                  </p>
                ),
              },
              {
                icon: ICON.key,
                title: "以你的主密碼加密",
                body: (
                  <p>
                    由 <code>[master]</code> 檢驗，從檔案讀取，或在 <code>zdesk tui</code> 下從鑰匙圈讀取
                  </p>
                ),
              },
            ]}
            hops={["依名稱", "AES-256-GCM，搭配設定自己的 salt"]}
          />
          <pre>
            <code>{`[[targets]]
name = "workstation"
protocol = "rdp"
host = "192.0.2.10"
username = "Administrator"
password_ref = "workstation"`}</code>
          </pre>
          <p>這兩個表格由指令輸出供你貼上，從不手動輸入：</p>
          <pre>
            <code>{`zdesk password master create -c zdesk.toml   # 一次：寫入主密碼檔案，輸出 [master]
zdesk password master show -c zdesk.toml     # 之後每個設定：輸出該主密碼下的 [master]
zdesk password encrypt -c zdesk.toml         # 輸出 [passwords] 的一個值`}</code>
          </pre>
          <pre>
            <code>{`[master]
salt = "…"
check = "…"

[passwords]
workstation = "$ZD;1;AES-256-GCM;…"`}</code>
          </pre>
          <p>
            <code>password encrypt</code> 會要求輸入兩次密碼，或從管道讀取一行，並用設定中已有的 <code>[master]</code>{" "}
            加密，它只讀取設定。名稱在貼上時由你決定，也就是 <code>password_ref</code> 寫的名稱。
            <code>vnc_password_ref</code> 以同樣方式指明 VNC
            伺服器自己的密碼。兩個輸出中都沒有機密資訊，因此可以放在任何組裝設定的地方：編輯器、Helm values
            檔案、範本化的 ConfigMap。本機執行個體的設定由 TUI 負責寫入：它的 <kbd>p</kbd>{" "}
            會詢問名稱和密碼，並自己寫入兩個表格。
          </p>
          <p>
            值也可以留空，<code>workstation = ""</code>
            ，作為尚未設定之密碼的預留位置：在貼上真實的值之前，目標以空白密碼回應；如果本機執行個體設定中的名稱全是這樣的預留位置，就不需要{" "}
            <code>[master]</code> 或主密碼。
          </p>
          <p>
            獨立閘道的網頁登入也以同樣方式保存：<code>[server].site_username</code> 指定唯一的使用者，
            <code>[server].site_passwd_enc</code> 保存其密碼，值為 <code>password encrypt</code> 輸出的內容，貼在那裡而不是{" "}
            <code>[passwords]</code> 下。它用同一個 <code>[master]</code> 開啟，因此獨立閘道的設定一定需要主密碼。
          </p>
          <h3>主密碼</h3>
          <p>
            其他所有值都用 AES-256-GCM 加密，金鑰由你的<strong>主密碼</strong>和設定自己的 salt
            衍生。獨立閘道從 <code>[server].master_password_file</code> 指定的檔案讀取主密碼：可以是容器的
            secret、systemd 的 credential，或只有閘道帳號能讀取的檔案。該檔案只包含主密碼；結尾的換行會被忽略。
            <code>password master create</code> 寫入該檔案，只有其使用者能讀取；檔案已存在時拒絕取代，除非指定{" "}
            <code>--force</code>，取代後用舊主密碼加密的每個值都無法再開啟；<code>password master show</code>{" "}
            輸出既有主密碼下的 <code>[master]</code> 區塊。TUI 把自己的主密碼儲存在鑰匙圈中（macOS 鑰匙圈、Windows
            認證管理員，或 Linux 桌面的 Secret Service：GNOME Keyring、KWallet），在 TUI
            啟動時讀取一次，沒有時在那時產生，因此你從不需要輸入。除了 TUI 以外，沒有任何東西會讀取鑰匙圈。
          </p>
          <Table
            head={["啟動方式", "主密碼來源"]}
            rows={[
              [
                <code>zdesk serve</code>,
                <>
                  <code>[server].master_password_file</code>；網頁登入的密碼一定是加密的，因此未設定它時拒絕啟動，從不詢問
                </>,
              ],
              [
                <code>zdesk tui</code>,
                "鑰匙圈，在 TUI 啟動時讀取；沒有時產生並儲存在那裡；鑰匙圈無回應時拒絕啟動，從不詢問",
              ],
              [
                <code>zdesk password</code>,
                <>
                  <code>[server].master_password_file</code>，否則詢問；<code>password master create</code>{" "}
                  詢問兩次並寫入該檔案
                </>,
              ],
            ]}
          />
          <p>
            本機執行個體沒有 <code>[server]</code> 區塊，因此其主密碼一律來自鑰匙圈。
          </p>
          <p>
            主密碼錯誤會在啟動時回報。更換主密碼代表要在新的 <code>[master]</code> 下重新設定每個密碼。
          </p>
        </>
      ),
    },
    {
      id: "windows",
      title: (
        <>
          Windows（<code>rdp</code>）
        </>
      ),
      body: (
        <>
          <pre>
            <code>{`[[targets]]
name = "workstation"
protocol = "rdp"
host = "192.0.2.10"
username = "Administrator"
password_ref = "workstation"`}</code>
          </pre>
          <p>
            RDP 用戶端是閘道自己實作的，已針對 Windows 10 和 11
            的遠端桌面（NLA）測試。它傳輸桌面、指標、鍵盤、滑鼠、調整尺寸、剪貼簿、聲音，以及瀏覽器的攝影機和麥克風。不傳輸觸控。無法連線到
            Windows 家用版：它無法作為遠端桌面主機。
          </p>
          <Still
            name="windows-retina"
            caption="以 Mac 的 Retina 密度顯示 Windows 內建的遠端桌面：主機上的 Chrome 回報裝置像素比為 2。"
          />
          <ul>
            <li>
              主機透過圖形管線（MS-RDPEGFX）繪製，每個工作階段都把它直通給瀏覽器合成。這幾乎把畫面的所有工作都從閘道上拿走了。它需要
              WebGL 2
              和跨來源隔離（cross-origin isolated）的頁面；如果代理伺服器丟掉了閘道的兩個隔離回應標頭，就會破壞這一點；不符合條件的瀏覽器不能啟動該目標。主機如何繪製管線，高品質或自適應
              H.264（alpha），在選擇器中選擇。
            </li>
            <li>
              <code>egfx = false</code>{" "}
              讓主機改用點陣圖更新繪製，由閘道以圖塊傳送：適用於無法合成管線的瀏覽器。這時桌面維持固定尺寸：沒有管線時，Windows
              透過重建共享來調整尺寸，而本閘道不接受這種方式。
            </li>
          </ul>

          <h3 id="two-displays">
            兩個顯示器 <Tag kind="beta">beta</Tag>
          </h3>
          <p>
            <code>virtual_displays = 2</code>{" "}
            要求主機提供兩個顯示器，每個都是工作階段的尺寸。第二個相對於第一個的位置在選擇器中該目標下的{" "}
            <strong>Second display</strong> 選擇：右、左、上或下，與用戶端自己第二個顯示器的位置對應。
          </p>
          <TwoDisplays
            first={
              <>
                <strong>顯示器 1</strong> 留在工作階段的頁面上
              </>
            }
            second={
              <>
                <strong>顯示器 2</strong> 在新分頁中於 <code>/display/2</code> 開啟
              </>
            }
            drag="拖過兩個分頁之間邊緣的視窗會出現在另一個顯示器上。"
          />
          <p>
            工作階段從浮動選單 Display 選擇器中的 <em>All Displays</em>{" "}
            開始，它在此處保留第一個顯示器，並在選單的 Display 按鈕下連結到第二個，即{" "}
            <strong>Open Display 2 ↗</strong>：它在同一個瀏覽器的新分頁中開啟 <code>/display/2</code>
            ，只顯示該顯示器，有自己的指標和鍵盤；再按一次會把那個分頁切到前景。選擇器中的 <code>Display 1</code> 和{" "}
            <code>Display 2</code>{" "}
            在本頁面單獨顯示一個顯示器。拖過兩個分頁之間邊緣的視窗會出現在另一個顯示器上，指標也一樣，無論它們的視窗如何擺放。當每個分頁都在各自的顯示器上全螢幕時，邊緣相接，視窗會出現在拖到的位置；兩個畫面之間隔著什麼，視窗就差多少。
          </p>
          <p>
            選擇 <em>All Displays</em> 時，Display 選擇器和選單的 <strong>Info</strong>{" "}
            也提供同樣的連結。頁面開啟時就顯示該顯示器。在跟隨視窗的工作階段中，那個分頁的視窗決定顯示器 2
            的尺寸。它需要持有工作階段之瀏覽器的登入，而且一次只在一個分頁中顯示：另一個分頁正在顯示它時，新開啟的分頁會提示它正在使用中，並在{" "}
            <strong>Take over</strong>
            （接管）之前詢問，就像瀏覽器接管工作階段前會詢問一樣；被接管的分頁會說明這一點並提供{" "}
            <strong>Take it back</strong>。那個分頁選單中的 <strong>Disconnect</strong>{" "}
            會中斷它，單獨選擇一個顯示器會關閉它。在它沒有被顯示時開啟，會提示無法使用。啟用管線時，持有工作階段的瀏覽器只合成兩個顯示器一次並顯示其中一個；第二個顯示器的分頁從同一個畫面繪製，因此沒有任何東西被解碼兩次。已在一台
            Windows 11 主機上檢驗，其中兩個顯示器的直通只透過無頭瀏覽器的通訊端檢驗過，尚未用肉眼檢查。
          </p>
          <p>
            第二個顯示器的分頁有自己的選單，位於一個顯示該顯示器編號 2 的按鈕後面，而工作階段頁面上這個按鈕顯示 1 而不是
            ☰。選單裡只有該分頁自己的內容：<strong>Immersive full screen</strong>、該顯示器的尺寸和密度，以及{" "}
            <strong>Disconnect</strong>；其他所有內容都留在工作階段頁面的選單中。
          </p>
          <p>
            第二個顯示器的分頁適用於有兩個實體顯示器的用戶端，每個顯示器顯示一個。只有一個顯示器的用戶端不開啟該分頁，在此處像只有一個顯示器時那樣使用第一個，或者選擇一個顯示器。手機或平板上不支援該分頁，儘管那裡沒有任何東西阻止你開啟它。
          </p>

          <h3 id="a-lossless-picture">無損畫面</h3>
          <p>
            預設情況下，Windows 主機以有損方式繪製大部分桌面，使用 RemoteFX Progressive 和 ClearCodec 的
            NSCodec，會讓文字和顏色稍微模糊。這由主機自己的原則決定，zDesk 中沒有任何設定能覆寫它。要讓它無損繪製每個像素：
          </p>
          <ol className="steps">
            <li>
              <p>
                在主機上開啟本機群組原則編輯器（<code>gpedit.msc</code>），前往「電腦設定 &gt; 系統管理範本 &gt; Windows
                元件 &gt; 遠端桌面服務 &gt; 遠端桌面工作階段主機 &gt; 遠端工作階段環境」（Computer Configuration &gt;
                Administrative Templates &gt; Windows Components &gt; Remote Desktop Services &gt; Remote Desktop
                Session Host &gt; Remote Session Environment）。啟用{" "}
                <em>設定 RemoteFX Adaptive Graphics 的影像品質</em>（
                <em>Configure image quality for RemoteFX Adaptive Graphics</em>），並設為
                <strong>不失真</strong>（<strong>Lossless</strong>
                ）。沒有群組原則編輯器的 Windows 版本，可以在以系統管理員身分執行的命令提示字元中透過登錄進行同樣的設定：
              </p>
              <pre>
                <code>{`reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows NT\\Terminal Services" /v ImageQuality /t REG_DWORD /d 1 /f`}</code>
              </pre>
              <p>如果網域的群組原則設定了該項，則以網域的群組原則為準。</p>
            </li>
            <li>
              <p>
                執行 <code>gpupdate /force</code>，然後啟動新的工作階段：已在執行的工作階段維持它啟動時的品質。
              </p>
            </li>
            <li>
              <p>
                在選擇器中，把 <strong>Graphics</strong> 保持為 <em>High quality</em>
                。這樣主機只使用無損的編碼，即 planar 和未壓縮的矩形，並原封不動地傳給瀏覽器。
              </p>
            </li>
            <li>
              <p>
                在工作階段中開啟選單的 <strong>Info</strong>：<em>Host's picture</em> 一列會顯示{" "}
                <em>Lossless (Planar)</em> 或類似內容。<em>Lossy (…)</em>{" "}
                則列出主機改用的編碼，表示原則還沒有套用到該工作階段。
              </p>
            </li>
          </ol>
          <p>
            無損的代價很高，因為主機也會無損繪製移動中的內容：光是開啟時的桌面就約 7.6 MB，視窗中的影片約每秒 19
            MB，這還是主機自身壓縮之前的數字；該壓縮隨資料一起到達瀏覽器，可讓 planar
            繪製減少約三分之一，捲動減少約一半。這適合區域網路。在這樣的主機上，自適應 H.264 不會改變任何東西：Lossless
            下它不繪製 H.264。測量資料請見{" "}
            <a href={repo("docs/rdp-client.md#lossless-by-the-hosts-policy")}>Lossless, by the host's policy</a>。
          </p>
          <p>
            其他 RDP 伺服器，例如較舊的 Windows 或 xrdp，或許剛好能用，但未經測試。請見{" "}
            <a href={repo("docs/rdp-client.md")}>The RDP client</a>。
          </p>
        </>
      ),
    },
    {
      id: "macs",
      title: (
        <>
          Mac（<code>vnc</code> 加 Apple 子類型）
        </>
      ),
      body: (
        <>
          <pre>
            <code>{`[[targets]]
name = "mac"
protocol = "vnc"
subtype = "ard"   # 或 "ard-high-performance"
host = "192.0.2.11"
username = "andrew"
password_ref = "mac"`}</code>
          </pre>
          <p>
            Mac 不需要安裝額外的軟體。為目標提供 Mac <em>帳號</em>的使用者名稱和密碼，而不是螢幕共享密碼：這樣會選擇 Apple
            Remote Desktop 認證，連線會進入該使用者自己的螢幕，而不是登入視窗。Mac 必須在遠端管理（Remote
            Management）的個別使用者存取清單中授予該帳號觀察（Observe）和控制（Control）權限；預設的「所有使用者」設定會拒絕連線，回報的錯誤與憑證錯誤相同。請見{" "}
            <a href={repo("docs/apple-vnc-889.md#remote-management-access")}>Remote Management access</a>。
          </p>
          <Compare
            items={[
              {
                title: "標準模式",
                sub: <code>subtype = "ard"</code>,
                rows: [
                  ["顯示器", "Mac 的實體顯示器，一次一個或合併顯示"],
                  ["跟隨視窗", <Mark value="no">否</Mark>],
                  ["聲音", <Mark value="no">無；Mac 繼續播放</Mark>],
                  ["畫面", "Apple's Adaptive（beta）直通，或閘道的圖塊"],
                ],
              },
              {
                title: "虛擬顯示器上的標準模式",
                tag: <Tag kind="unofficial">非官方</Tag>,
                sub: (
                  <>
                    <code>subtype = "ard"</code>，<code>virtual_display = true</code>
                  </>
                ),
                rows: [
                  ["顯示器", "一個虛擬顯示器，期間停用實體顯示器"],
                  ["跟隨視窗", <Mark value="yes">是</Mark>],
                  ["聲音", <Mark value="no">無</Mark>],
                  ["畫面", <>同 <code>ard</code></>],
                ],
              },
              {
                title: "高效能模式",
                sub: <code>subtype = "ard-high-performance"</code>,
                rows: [
                  ["顯示器", "一個最大 3840×2160 後備像素的虛擬顯示器，或兩個（beta）"],
                  ["跟隨視窗", <Mark value="yes">是</Mark>],
                  ["聲音", <Mark value="yes">一律提供，AAC-ELD</Mark>],
                  ["畫面", "HEVC 或 H.264（beta），直通"],
                ],
              },
            ]}
          />
          <h3>標準模式</h3>
          <p>
            <strong>
              <code>subtype = "ard"</code>
            </strong>{" "}
            是螢幕共享的標準模式：Mac 的實體顯示器，一次一個或全部，依其自身密度顯示。一次一個螢幕的工作階段以選擇器中的
            Adaptive（beta，預設）啟動，它直通 Mac 自己的 Adaptive 畫面供頁面解碼；或以 Gateway adaptive 啟動，即閘道針對
            Mac 無損 Full 品質編碼的圖塊。兩者都只在虛擬 Mac 上試過。Combined
            Display（alpha）工作階段是閘道同時編碼所有螢幕的圖塊。它不支援調整尺寸，也沒有聲音；Mac 繼續在自己的輸出裝置上播放。
          </p>
          <p>
            <strong>
              連接了多個顯示器的 Mac 最好設定 <code>virtual_display = true</code>
            </strong>
            （請見下文），它把一個顯示器調整為瀏覽器視窗的尺寸。Combined Display 同時顯示所有螢幕，以 100%
            顯示，因此只適合兩個並排、能放進一個瀏覽器視窗的小顯示器，再大就得不停捲動。它沒有畫面上限：每個螢幕都完整顯示，無論有多少個、加起來多大，都以瀏覽器密度對應的像素顯示，因此
            1x 瀏覽器上的 2x 螢幕仍由閘道縮小（請見上文）。只在虛擬 Mac 上試過。
          </p>
          <p>所有 Apple 子類型都傳輸 Mac 原生的剪貼板。</p>

          <h3>高效能模式</h3>
          <p>
            <strong>
              <code>subtype = "ard-high-performance"</code>
            </strong>{" "}
            是 Apple 檢視器中的高效能模式。Mac
            會停用其實體顯示器，把所有視窗放到一個由工作階段決定尺寸的虛擬顯示器上，最大 3840×2160 後備像素。畫面和聲音透過
            Mac 的媒體串流傳輸，即透過 SRTP 的 HEVC 和 AAC-ELD：
          </p>
          <ul>
            <li>
              <Tag kind="beta">beta</Tag> <code>virtual_displays = 2</code> 要求 Mac 提供兩個虛擬顯示器，即 Apple
              檢視器的「2 Virtual Displays」，第二個在第一個右側：位置由 Mac
              決定，因此選擇器不提供其他方向。要放到其他方向，請在工作階段開啟期間到 Mac 的「系統設定 → 顯示器 →
              排列」中調整：把第二個顯示器拖到第一個的左側、上方或下方。工作階段會跟著變化，每個分頁維持自己的顯示器，指標穿過它們現在共用的那條邊；Mac
              可能會為下一次工作階段保留這個排列，沒有保留時它又回到右側。工作階段從 Display 選擇器的{" "}
              <em>All Displays</em> 開始，它在此處保留第一個顯示器，並在同一個瀏覽器的新分頁中開啟{" "}
              <code>/display/2</code> 顯示第二個，與 RDP
              目標一樣，選擇器也可以單獨顯示其中任一個；在跟隨視窗的工作階段中，那個分頁的視窗決定第二個顯示器的尺寸。Mac
              為每個顯示器傳送一路串流，第二路傳到 UDP 連接埠 5902，閘道只直通正在顯示的顯示器。與 RDP
              一樣，拖過兩個分頁之間邊緣的視窗會出現在另一個顯示器上；不建議在只有一個實體顯示器的用戶端上使用第二個顯示器的分頁，手機或平板上也不支援。
            </li>
          </ul>
          <Still
            name="mac-two-displays"
            caption="高效能模式 Mac 的兩個虛擬顯示器顯示在 Windows 上的兩個 Chrome 分頁中，一個視窗正從第一個顯示器的分頁拖到第二個。"
          />
          <ul>
            <li>
              Mac 向閘道的 UDP 連接埠 5900 和 5901 傳送資料，有第二個顯示器時還有 5902，因此兩者之間的防火牆或 NAT
              必須放行。
            </li>
            <li>
              <Tag kind="qa">僅限 QA</Tag> 無法放行時，例如虛擬 Mac 位於其主機的 NAT 之後，可以設定{" "}
              <code>relay = "host:port"</code>，透過在能同時連到兩者的機器上執行的{" "}
              <a href={repo("crates/zdesk-relay/README.md")}>
                <code>zdesk-relay</code>
              </a>{" "}
              連到 Mac，此時 <code>host</code> 是中繼看到的 Mac 位址。閘道只需向外連線到中繼的一個 TCP
              連接埠，媒體串流也經由它傳輸。中繼目前沒有驗證機制。
            </li>
            <li>
              Linux 閘道的 <code>net.core.rmem_max</code> 至少要
              4194304，供畫面的通訊端使用，低於該值時記錄檔會發出警告：預設的 212992 在 Retina 尺寸下會遺失關鍵影格。
            </li>
            <li>閘道不解碼 Mac 的任何一路串流：畫面以選擇器中選擇的 HEVC 或 H.264 直通。</li>
            <li>
              H.264 直通不需要在頁面中加入任何東西：閘道要求 Mac 用 H.264 取代 HEVC，瀏覽器用自己的解碼器解碼，而能解碼
              H.264 的瀏覽器比能解碼 HEVC 的多。因此預設建置不需要軟體解碼器，就能為任何具備 <code>VideoDecoder</code>{" "}
              的瀏覽器（包括 Firefox）提供該目標；選擇器也只在這些瀏覽器中提供 H.264，沒有 <code>VideoDecoder</code>{" "}
              時會變灰。選擇器不詢問解碼器本身：解碼器不接受 Mac 的 H.264 的瀏覽器會在工作階段中以解碼器的錯誤說明。
            </li>
            <li>
              HEVC 直通只有在頁面啟動時的探測找到解碼路徑時才傳送 HEVC。支援情況取決於瀏覽器、平台和
              GPU，因此以選擇器為準。閘道還可以提供{" "}
              <a href={repo("zdesk.example.toml")}>
                <code>zdesk.example.toml</code>
              </a>{" "}
              中描述的選用軟體畫面解碼器。
            </li>
            <li>
              Mac 推送串流時會把自己的喇叭靜音，因此工作階段一律傳輸 AAC-ELD
              聲音。頁面會單獨探測它；如果無法解碼聲音，工作階段會在沒有音訊的情況下繼續，並在選單中說明原因。
            </li>
          </ul>

          <h3>
            虛擬顯示器上的標準模式 <Tag kind="unofficial">非官方</Tag>
          </h3>
          <p>
            在 <code>ard</code> 目標上設定 <code>virtual_display = true</code>
            ，會在這樣的虛擬顯示器上以標準模式開啟，支援調整尺寸，但沒有媒體串流和聲音，期間實體顯示器會被停用。這是存取連接了多個顯示器之
            Mac 的建議方式，因為超過兩個小螢幕時，Combined Display 在瀏覽器中並不實用。Apple
            的檢視器從不提供這種組合；只在 macOS 26 上測試過。
          </p>
          <p className="note">
            Apple 沒有公開這個協定的任何文件。兩種模式都是逆向工程而來，只在測量過的 Mac 上保證正確，macOS
            的更新隨時可能改變其中任何部分。請見 <a href={repo("docs/apple-vnc-889.md")}>Apple RFB 003.889, as measured</a>
            。
          </p>
        </>
      ),
    },
    {
      id: "wlshare",
      title: (
        <>
          wlshare（<code>vnc</code>，<code>subtype = "wlshare"</code>）
        </>
      ),
      body: (
        <>
          <pre>
            <code>{`[[targets]]
name = "wayland"
protocol = "vnc"
subtype = "wlshare"
host = "192.0.2.12"
username = "me"
password_ref = "wayland"`}</code>
          </pre>
          <p>
            <a href="https://github.com/andrewtheguy/wlshare/blob/main/README.zh-TW.md">wlshare</a> 是本專案自己的 VNC
            伺服器，針對以 wlroots 為基礎的 Wayland 桌面。這個子類型讓閘道列出 wlshare 的私有 RFB
            擴充：它針對整個桌面的 H.264
            串流，原封不動地直通並依瀏覽器的連線調節節奏；像素密度；輸出清單；聲音；以及在勾選後啟動的工作階段中，作為桌面上
            PipeWire 裝置的瀏覽器攝影機和麥克風。不設定子類型時，同一個伺服器會以任何 VNC 伺服器的方式讀取。
          </p>
          <Still name="wlshare-retina" caption={<>Sway 上的 wlshare，以 Mac 的 Retina 密度顯示：<code>wlr-randr</code> 回報其無頭輸出的縮放比例為 2，瀏覽器進入沉浸式全螢幕後，尺寸從 3456×1802 變為 3456×2168。</>} />
          <h3>畫面</h3>
          <p>
            選擇器的 Picture 群組有三種，全都直通，因此沒有標籤註明這一點，也沒有任何設定項能調整它們：wlshare
            對每一種都只有一種編碼方式。
          </p>
          <Compare
            items={[
              {
                title: "Adaptive video",
                sub: "預設。wlshare 針對整個桌面編碼的 H.264，4:2:0，品質由 wlshare 決定。",
                rows: [
                  ["在較慢的連線上", "影格較少，而不是較粗糙"],
                  ["主機處理器", "負擔較輕；主機有硬體編碼器時由硬體編碼"],
                  ["文字", "可能不夠清晰"],
                  ["無損", <Mark value="no">永不</Mark>],
                ],
              },
              {
                title: "Progressive tiles",
                tag: <Tag kind="alpha">alpha</Tag>,
                sub: "適用於頻寬並非一直充裕的連線：每個圖塊都是 RemoteFX Progressive，就像 Windows 主機在沒有 H.264 時透過 RDP 繪製的那樣。",
                rows: [
                  ["在較慢的連線上", "首遍較粗糙，影格也較少"],
                  ["主機處理器", "比視訊多，以軟體編碼"],
                  ["文字", "較清晰"],
                  ["無損", <Mark value="no">永不</Mark>],
                ],
              },
              {
                title: "Tiles with motion",
                tag: <span className="tag">區域網路</span>,
                sub: "靜止的部分為無損的 PNG，每個移動的區域有自己的一路視訊串流。",
                rows: [
                  ["連線", "需要充裕的頻寬：位元組數是視訊的數倍，大面積移動時達每秒數十 Mbit"],
                  ["移動的區域", "由主機硬體編碼器或 libx264 編碼的 H.264"],
                  ["文字", "靜止後無損"],
                  ["無損", <Mark value="yes">區域停下後</Mark>],
                ],
              },
            ]}
          />
          <p>
            漸進式圖塊先送粗略的一遍，靜止後就地細化，移動的部分以相對於頁面所持內容的變更傳送。頁面自己解碼它們，就像它合成
            RDP
            主機的管線那樣，因此不需要視訊解碼器；在頁面無法合成管線時會變灰。帶移動視訊的圖塊會在每個移動區域停下後，再以無損方式重送。
          </p>
          <h3>
            兩個輸出 <Tag kind="beta">beta</Tag>
          </h3>
          <p>
            剛好有兩個輸出（顯示器或無頭輸出）的桌面會列出 <em>All Displays</em>{" "}
            並從它開始：第一個留在此處，第二個在同一個瀏覽器的新分頁中開啟 <code>/display/2</code>
            ，有自己的指標和鍵盤，與有<a href="#two-displays">兩個虛擬顯示器</a>的 <code>rdp</code> 目標一樣。
            <code>virtual_displays = 2</code> 要求 wlshare 提供兩個，就像要求 Windows 主機或 Mac 那樣：在 sway
            上，wlshare
            會讓合成器建立第二個無頭輸出，以兩個啟動的工作階段在要求一個（預設）時維持一個；在其他合成器上，輸出就是合成器既有的那些。
          </p>
          <h3>登入與版本</h3>
          <p>
            範例使用 wlshare 執行時所用的帳號，透過 RSA-AES 上的 PAM 驗證。如果 wlshare 改用其{" "}
            <code>[password]</code> 表格，請用 <code>password_ref</code> 指明該密碼，並省略{" "}
            <code>username</code>：此時 RSA-AES 只傳送密碼。wlshare 不提供傳統 VNC 認證，因此{" "}
            <code>vnc_password_ref</code> 不適用於它。
          </p>
          <p>
            閘道和 wlshare 必須使用同一個版本的 wlshare 協定；<code>wlshare --version</code> 會列出某個 wlshare
            所使用的版本。連線到另一個版本的 wlshare
            時，工作階段會在連線時失敗，並指明兩個版本；把兩者中較舊的那一個升級即可解決。不變更協定的 wlshare
            發行會維持其版本不變。
          </p>
          <p>
            請見<a href={repo("docs/wlshare-density.md")}>密度</a>、<a href={repo("docs/wlshare-outputs.md")}>輸出</a>
            、<a href={repo("docs/wlshare-audio.md")}>音訊</a>、<a href={repo("docs/wlshare-camera.md")}>攝影機</a>和
            <a href={repo("docs/wlshare-microphone.md")}>麥克風</a>。
          </p>
        </>
      ),
    },
    {
      id: "other-vnc-servers",
      title: (
        <>
          其他 VNC 伺服器（<code>vnc</code>）
        </>
      ),
      body: (
        <>
          <pre>
            <code>{`[[targets]]
name = "workstation-vnc"
protocol = "vnc"
host = "192.0.2.13"
vnc_password_ref = "workstation-vnc"`}</code>
          </pre>
          <p>
            一般目標用 <code>vnc_password_ref</code> 進行傳統 VNC 認證，或用 <code>username</code> 和{" "}
            <code>password_ref</code> 進行 RSA-AES 認證。只要求密碼的 RSA-AES 伺服器使用 <code>password_ref</code>
            ，不設定 <code>username</code>。閘道會要求 ZRLE，所有現行的 VNC 伺服器都支援它，此外只讀取
            Raw；較舊的標準編碼、Tight 以及其他廠商的或有損的編碼都不在清單中。目標依伺服器自身的尺寸、以 1x
            顯示，不傳輸聲音、攝影機或麥克風。標準 RFB 無法表明其像素是 HiDPI；請見{" "}
            <a href={repo("docs/standard-rfb-hidpi.md")}>HiDPI over standard RFB</a>。
          </p>
        </>
      ),
    },
    {
      id: "camera-and-microphone",
      title: "攝影機和麥克風",
      body: (
        <>
          <p>
            <strong>Camera</strong> 和 <strong>Microphone</strong> 是 <code>rdp</code> 或 <code>wlshare</code>{" "}
            目標在選擇器中的勾選項，用於向遠端提供這個瀏覽器的攝影機和麥克風。兩者都是
            <Tag kind="experimental">實驗性</Tag>
            功能，勾選前為關閉，並像其他選項一樣依目標記住。勾選攝影機啟動的工作階段在連線時就給遠端一台攝影機，這個瀏覽器的攝影機只在遠端有應用程式使用它時才開啟，其餘時間指示燈不亮；資訊卡片的
            Camera
            一列會說明目前狀態。麥克風也一樣：工作階段連線時就接上，這個瀏覽器的麥克風只在遠端有程式錄音時才開啟，資訊卡片的
            Microphone 一列會說明。它們針對臨時需要的情境，例如一次通話或錄製，並以盡可能低的負擔傳送：瀏覽器的 H.264
            不經轉碼直通，以及低固定位元率的單聲道語音 Opus。Apple 目標和一般 <code>vnc</code> 目標都不提供這兩項。
          </p>
          <Table
            head={["目標", "攝影機", "麥克風"]}
            rows={[
              [
                <code>rdp</code>,
                <Mark value="yes">會重新導向攝影機的 Windows 主機</Mark>,
                <Mark value="yes">主機上有程式錄音時才啟動</Mark>,
              ],
              [
                <>
                  <code>vnc</code>，<code>wlshare</code>
                </>,
                <Mark value="yes">桌面上的 PipeWire 攝影機</Mark>,
                <Mark value="yes">一般的 PipeWire 音訊來源</Mark>,
              ],
              [
                <>
                  <code>vnc</code>，Apple 子類型
                </>,
                <Mark value="no" />,
                <Mark value="no" />,
              ],
              [<code>vnc</code>, <Mark value="no" />, <Mark value="no" />],
            ]}
          />
          <p>
            在 RDP 上，攝影機需要一台會重新導向攝影機的 Windows 主機：工作站版本的 Windows，或安裝了遠端桌面工作階段主機角色的
            Windows Server。Windows 主機只有在上面有程式錄音時才會啟動麥克風。
          </p>
          <p>
            在 wlshare 上，攝影機是桌面上的一個 PipeWire 攝影機，桌面上的瀏覽器只能透過搭配{" "}
            <code>xdg-desktop-portal-gtk</code> 的 <code>xdg-desktop-portal</code> 存取它，wlshare
            的套件建議安裝這兩者；Chrome 還需要開啟 <code>chrome://flags/#enable-webrtc-pipewire-camera</code>
            。缺少它們時，要求攝影機的網頁找不到任何攝影機。麥克風兩者都不需要：它是一個一般的 PipeWire 音訊來源。
          </p>
        </>
      ),
    },
    {
      id: "local-instances",
      title: "本機執行個體",
      body: (
        <>
          <p>原生安裝包含一個終端機控制平面，可以在一台電腦上執行多個閘道，每個都有自己的設定和瀏覽器來源（origin）：</p>
          <pre>
            <code>zdesk tui</code>
          </pre>
          <Flow
            stages={[
              {
                icon: ICON.browser,
                title: "你的瀏覽器",
                body: (
                  <p>
                    首頁位於 <code>zdesk.localhost:52380</code>，每個執行個體位於{" "}
                    <code>{"<instance>.zdesk.localhost:52380"}</code>
                  </p>
                ),
              },
              {
                icon: ICON.terminal,
                title: (
                  <>
                    <code>zdesk tui</code>
                  </>
                ),
                body: <p>在回送位址上占用連接埠，以 PIN 讓瀏覽器登入，並代理每個子網域</p>,
              },
              {
                icon: ICON.gateway,
                title: "執行個體",
                body: <p>每個都是一個閘道，有自己的設定，從 TUI 啟動和停止</p>,
              },
            ]}
            hops={["僅限回送位址", "各自透過私有的 Unix 通訊端或具名管道"]}
          />
          <p>
            它只監聽回送位址，預設連接埠為 52380，可以用 <code>--port</code> 或 <code>ZDESK_TUI_PORT</code>{" "}
            變更；連接埠已被其他程式占用時拒絕啟動。開啟{" "}
            <a href="http://zdesk.localhost:52380">http://zdesk.localhost:52380</a>；每個執行中的執行個體位於{" "}
            <code>{"http://<instance>.zdesk.localhost:52380"}</code>
            。它只回應這些名稱，而且只在自己的連接埠上回應。該連接埠上的 <code>localhost</code>、<code>127.0.0.1</code>{" "}
            和 <code>[::1]</code> 會被重新導向到 <code>zdesk.localhost</code>
            。其他主機名稱或連接埠一律拒絕，因此以其他主機名稱或連接埠到達的通道或連接埠轉送進不了 TUI；但以該連接埠上的{" "}
            <code>zdesk.localhost</code> 到達、或把主機名稱改寫成它的通道或轉送，仍然可以進入。
          </p>
          <Still
            name="local-instance"
            caption={
              <>
                執行個體 <code>instance3</code>，在 Chrome 中以 <code>instance3.zdesk.localhost:52380</code> 開啟。
              </>
            }
          />
          <h3>按鍵</h3>
          <Keys
            head={["按鍵", "操作"]}
            rows={[
              [["↑", "↓", "k", "j"], "選擇執行個體"],
              [["n"], "建立執行個體"],
              [
                ["e"],
                <>
                  用 <code>$VISUAL</code> 或 <code>$EDITOR</code>（<code>vi</code>，Windows 上為記事本）編輯其{" "}
                  <code>zdesk.toml</code>；編輯會經過檢查，在執行個體重新啟動後生效
                </>,
              ],
              [
                ["p"],
                <>
                  把密碼加密到其 <code>[passwords]</code> 中，會詢問名稱和密碼；沒有 <code>[master]</code>{" "}
                  的設定會先得到一個
                </>,
              ],
              [["s", "x", "r"], "啟動、停止、重新啟動執行個體"],
              [["a"], "啟動所有已停止的執行個體"],
              [["o"], "在瀏覽器中開啟執行中的執行個體"],
              [["Enter"], "顯示其設定"],
              [["R"], "重新掃描執行個體目錄"],
              [["P"], "為下一個瀏覽器顯示新的登入 PIN，並重新開始計時"],
              [["?"], "列出所有按鍵"],
              [["q", "Esc"], "停止所有執行個體並離開"],
            ]}
          />
          <h3>執行個體及其密碼</h3>
          <p>執行個體根目錄下的每個直接子目錄就是一個執行個體：</p>
          <Table
            head={["平台", "執行個體根目錄"]}
            rows={[
              [
                "Linux",
                <>
                  <code>~/.local/share/zdesk/instances</code>（或 <code>$XDG_DATA_HOME/zdesk/instances</code>）
                </>,
              ],
              ["macOS", <code>~/Library/Application Support/zdesk/instances</code>],
              ["Windows", <code>%LOCALAPPDATA%\zdesk\instances</code>],
            ]}
          />
          <p>
            可以用 <code>--instances-dir</code>{" "}
            指定其他目錄。根目錄只有你的帳號能存取，因為設定中包含憑證。執行個體的設定與閘道的設定有相同的{" "}
            <code>[branding]</code> 和 <code>[[targets]]</code>，但沒有 <code>[server]</code> 區塊：TUI
            占用連接埠，並把每個子網域代理到該執行個體私有的 Unix 通訊端或具名管道。
          </p>
          <p>
            指明了加密密碼的設定需要主密碼才能啟動（請見<a href="#target-passwords">目標密碼</a>）。TUI
            從鑰匙圈中取得主密碼，第一次時在那裡產生，然後只把每個 worker
            自己設定的金鑰交給它。從另一個帳號的鑰匙圈複製來的執行個體設定在本帳號下無法開啟：刪除其{" "}
            <code>[master]</code> 和 <code>[passwords]</code>，再用 <kbd>p</kbd> 重新設定每個密碼。
          </p>
          <h3>以 PIN 登入</h3>
          <Flow
            stages={[
              {
                icon: ICON.pin,
                title: "顯示 PIN",
                body: (
                  <p>
                    六位數，形如 <code>123-456</code>，顯示在執行個體清單上方的存取面板中，附上它到期的時刻，即十分鐘後
                  </p>
                ),
              },
              {
                icon: ICON.browser,
                title: "一個瀏覽器登入",
                body: <p>這次登入可進入首頁和所有執行個體，直到 TUI 結束</p>,
              },
              {
                icon: ICON.key,
                title: (
                  <>
                    按 <kbd>P</kbd> 給下一個瀏覽器
                  </>
                ),
                body: <p>已使用、已到期或已撤銷的 PIN 不再有效；新的 PIN 會重新開始計時</p>,
              },
            ]}
            hops={["只需輸入一次，帶不帶連字號皆可", "面板改為顯示這次登入，取代 PIN"]}
          />
          <p>
            瀏覽器以 PIN 登入。TUI 執行個體清單上方的存取面板會顯示一組六位數 PIN
            以及它到期的時刻，也就是產生後十分鐘。PIN 以 <code>123-456</code>{" "}
            的形式、用獨立的顏色顯示，連按兩下即可選取整組；<kbd>c</kbd> 會以同樣的形式透過終端機（OSC
            52）把它送到剪貼簿，透過 SSH 時也能送到你自己的剪貼簿。在 tmux 中，它會進入 tmux 緩衝區，tmux 在預設的{" "}
            <code>set-clipboard</code>{" "}
            設定下會再把它傳給終端機的剪貼簿。沒有任何終端機會確認這次寫入，Apple 的 Terminal.app
            則會直接丟棄它，因此如果貼上後得不到 PIN，請改為選取它。PIN 欄位接受帶或不帶連字號的 PIN。PIN
            只需輸入一次，直接在瀏覽器開啟的頁面上輸入即可，首頁或執行個體頁面皆可，登入後瀏覽器仍停留在原頁面。這一次登入對首頁和所有執行個體都有效。其他分頁中仍停在
            PIN 頁面的，切換回去後會改為提示直接繼續。
          </p>
          <p>
            PIN 是一次性的，只能讓一個新瀏覽器登入：登入成功後，存取面板不再顯示這組
            PIN，改為顯示有瀏覽器在何時登入，這組 PIN 也隨之失效。<kbd>P</kbd> 為下一個瀏覽器顯示新的 PIN
            並重新開始計時。輸錯五次後 PIN 會被撤銷，在以 <kbd>P</kbd> 顯示新的 PIN 之前，所有輸入都會被拒絕。PIN
            表單會說明原因：已使用、已到期或已撤銷。PIN 只保護新的登入。已經登入的瀏覽器在 PIN
            被使用、到期或被取代後、在其執行個體重新啟動後都維持登入。只有結束 TUI 才會讓它登出。
          </p>
          <p className="warning">
            PIN 能擋住看不到 TUI 終端機的人，但有一個缺口：cookie
            不區分連接埠，電腦上的其他帳號如果在另一個連接埠以 <code>zdesk.localhost</code>{" "}
            或其下的名稱提供頁面，並讓你開啟指向它的連結，就能取得已登入瀏覽器的登入。
            <strong>
              不要在與不應存取這些桌面的使用者共用的電腦上執行 <code>zdesk tui</code>。
            </strong>
          </p>
          <p>
            私有檔案和 worker 端點可以防止其他本機使用者取得憑證。瀏覽器從不持有 worker 的權杖：TUI
            代替已登入的瀏覽器出示它。瀏覽器進入閘道只有兩種方式：這組 PIN，或獨立閘道的使用者名稱和密碼。
          </p>
          <p>
            請見{" "}
            <a href={repo("docs/architecture.md#local-multi-instance-control-plane")}>
              Local multi-instance control plane
            </a>
            。安裝 zDesk 的方法，請見<a href={`${pagePath("zh-TW", "home")}#quick-start`}>快速入門</a>，或
            <a href={REPO}>儲存庫</a>中的<a href={repo("docs/install.zh-TW.md")}>安裝 zDesk</a>。
          </p>
        </>
      ),
    },
  ],
};

export default guide;
