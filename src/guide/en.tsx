import Flow from "../Flow";
import { pagePath, REPO } from "../content";
import ICON from "./icons";
import { repo, type GuideText } from "./links";
import { Compare, DemoClip, Groups, Keys, Mark, Options, Part, Routes, Table, Tag, TwoDisplays } from "./visuals";

const guide: GuideText = {
  intro: (
    <>
      What an operator and a user need to know once the gateway is <a href={repo("docs/install.md")}>installed</a>: how
      the page is reached, what a session is started with, how each kind of target is set up, and the local
      multi-instance control plane. Every configuration key is in the annotated{" "}
      <a href={repo("zdesk.example.toml")}>
        <code>zdesk.example.toml</code>
      </a>
      , and the design behind all of it is in <a href={repo("docs/architecture.md")}>Architecture</a>.
    </>
  ),
  sections: [
    {
      id: "the-client",
      title: "The client",
      body: (
        <>
          <p>The client is the page the gateway serves, compiled into the gateway binary. It needs:</p>
          <p>
            <strong>A secure context.</strong> The gateway speaks plain HTTP and has no TLS listener, so reach it on
            loopback (<code>localhost</code>, <code>127.0.0.1</code>, <code>[::1]</code>, any <code>.localhost</code>{" "}
            name) or through a TLS-terminating reverse proxy. A LAN address over plain <code>http://</code> is refused,
            by name.
          </p>
          <Routes
            routes={[
              {
                ok: true,
                title: "Loopback",
                body: (
                  <>
                    <code>localhost</code>, <code>127.0.0.1</code>, <code>[::1]</code> or any <code>.localhost</code>{" "}
                    name, on the gateway's machine or through an SSH tunnel to its port
                  </>
                ),
              },
              { ok: true, title: "A TLS-terminating reverse proxy", body: "HTTPS of your own in front of the gateway" },
              {
                ok: false,
                title: (
                  <>
                    A LAN address over plain <code>http://</code>
                  </>
                ),
                body: "Refused, by name",
              },
            ]}
          />
          <p>
            <strong>WebCodecs</strong> for the pictures a remote sends as video: <code>VideoDecoder</code> for
            wlshare's H.264, a High Performance Mac's HEVC or H.264 and an RDP host's H.264. The client still starts
            without it, and the gateway's tiles, a Standard Mac's Adaptive picture, wlshare's progressive tiles and an
            RDP pipeline without H.264 work anywhere.
          </p>
          <Groups
            groups={[
              {
                title: (
                  <>
                    Need <code>VideoDecoder</code>
                  </>
                ),
                items: ["wlshare's H.264", "A High Performance Mac's HEVC or H.264", "An RDP host's H.264"],
              },
              {
                title: "Work in any browser",
                items: [
                  "The gateway's tiles",
                  "A Standard Mac's Adaptive picture",
                  "wlshare's progressive tiles",
                  "An RDP pipeline without H.264",
                ],
              },
              {
                title: (
                  <>
                    Need <code>AudioDecoder</code>
                  </>
                ),
                items: ["Opus", "A Mac's AAC-ELD", "FLAC, which Safari's decoder fails"],
              },
            ]}
          />
          <p>
            The page asks the browser's decoder beforehand about the Mac's HEVC and the RDP host's H.264: the picker
            greys them, with the reason, where the decoder refuses them. It asks about wlshare's H.264 too, in both
            profiles wlshare codes: where the decoder refuses either, a <code>wlshare</code> target's Adaptive video and
            its tiles with motion are greyed, leaving its progressive tiles, which the page decodes itself. The Mac's
            H.264 is not asked about: it is offered to every browser with <code>VideoDecoder</code> and greyed without
            one, and a decoder that refuses it says so in the session, by its error. <code>AudioDecoder</code> plays
            Opus, a Mac's AAC-ELD and FLAC; a browser without it (Safari 16.4 to 18) plays no sound, and a later Safari,
            whose <code>AudioDecoder</code> fails FLAC, plays Opus and the Mac's sound.
          </p>

          <h3>On a desktop, a phone or a tablet</h3>
          <p>
            For desktop use, install the page as an app in Chrome or Edge. An app window hands the page the key chords a
            normal tab keeps for itself (⌘W, ⌘T, ⌘N and the like). In a tab, <strong>Menu → Immersive full screen</strong>{" "}
            does the same and adds the keys no window is otherwise given, such as the Super key and Alt+Tab.
          </p>
          <p>
            The desktop is shown at 100%, never scaled to fit: a larger desktop scrolls, and in a session started with
            resize the window drives the remote's size instead. A phone or tablet fits to width and pinch-zooms, with
            fingers as a trackpad and a soft keyboard.
          </p>
          <DemoClip
            locale="en"
            id="ipad-to-windows"
            caption="Safari on an iPad, fitted to width, with the soft keyboard's function, navigation and sticky modifier keys."
          />
          <p>
            An installed app has <strong>Window → Size to <em>width</em>×<em>height</em></strong>, which resizes the
            local window to the remote desktop's size through{" "}
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/resizeTo">
              <code>window.resizeTo()</code>
            </a>
            . It resizes the local window and never scales or resizes the remote desktop. It works in installed Chrome
            and Edge app windows and is best-effort in other browsers; ordinary tabs cannot resize their window, and
            mobile browsers ignore the request.
          </p>
          <p>
            On macOS the window's rounded corners are masked over the page, so a window sized to the desktop loses the
            framebuffer's corner pixels. The radius is a system-wide setting; one point is square enough to see every
            pixel:
          </p>
          <pre>
            <code>defaults write -g NSConvolutionOverride1 -float 1</code>
          </pre>
          <p>
            Quit and reopen the browser app to pick it up. <code>defaults delete -g NSConvolutionOverride1</code>{" "}
            restores Apple's radius: 26 points on macOS 26, 10 before it.
          </p>
        </>
      ),
    },
    {
      id: "starting-a-session",
      title: "Starting a session",
      body: (
        <>
          <p>
            After login the page shows the target picker. Picking a target opens it, its options show under it, and
            Start connects with them. They are chosen per session, held for its life, and remembered by the browser per
            target; none is a config key.
          </p>
          <Options
            items={[
              { id: "size", icon: "size", title: "Size", body: "Keep one size, or follow the window" },
              { id: "sound", icon: "sound", title: "Sound", body: "Off, Opus or lossless FLAC" },
              { id: "passthrough", icon: "picture", title: "Passthrough", body: "The remote's own stream, or the gateway's tiles" },
              { id: "displays", icon: "displays", title: "Displays", body: "A Mac's screens, one at a time or combined" },
              { id: "graphics", icon: "graphics", title: "Graphics", body: "How an RDP host draws its pipeline" },
              { id: "devices", icon: "camera", title: "Camera and Microphone", body: "This browser's, offered to the remote" },
            ]}
          />
          <Table
            head={["Target", "Window drives the size", "Sound", "Passthrough", "Graphics"]}
            rows={[
              [
                <code>rdp</code>,
                <Mark value="yes">yes</Mark>,
                "off, Opus or FLAC",
                "the graphics pipeline, always passed",
                "high quality or adaptive H.264",
              ],
              [
                <>
                  <code>rdp</code> with <code>egfx = false</code>
                </>,
                <Mark value="no">no</Mark>,
                "off, Opus or FLAC",
                <Mark value="none" />,
                <Mark value="none" />,
              ],
              [<code>vnc</code>, <Mark value="no">no</Mark>, "none", <Mark value="none" />, <Mark value="none" />],
              [
                <>
                  <code>vnc</code>, <code>wlshare</code>
                </>,
                <Mark value="yes">yes</Mark>,
                "off, Opus or FLAC",
                "its H.264 video, its progressive tiles (alpha), or its tiles with motion, always passed",
                <Mark value="none" />,
              ],
              [
                <>
                  <code>vnc</code>, <code>ard</code>
                </>,
                <Mark value="no">no</Mark>,
                "none",
                "the Mac's Adaptive picture, passed (beta), or none: the gateway's tiles of the Mac's Full quality",
                <Mark value="none" />,
              ],
              [
                <>
                  <code>vnc</code>, <code>ard</code> with <code>virtual_display</code>
                </>,
                <Mark value="yes">yes</Mark>,
                "none",
                <>
                  as <code>ard</code>
                </>,
                <Mark value="none" />,
              ],
              [
                <>
                  <code>vnc</code>, <code>ard-high-performance</code>
                </>,
                <Mark value="yes">yes</Mark>,
                "always carried",
                "the Mac's HEVC, or its H.264 (beta), always passed",
                <Mark value="none" />,
              ],
            ]}
          />

          <Part id="size" icon="size">
            Size
          </Part>
          <p>
            A desktop either keeps one size, the target's <code>size = "1920x1080"</code> or 1440×900 where it sets
            none, or follows the window: the remote is asked to render at the window's size and the browser's density,
            rather than being scaled on the client. A kept size follows the browser's density too. A phone is offered
            the kept sizes only. A plain <code>vnc</code> target and <code>ard</code> on the Mac's physical displays are
            shown at the remote's own size and take no <code>size</code>.
          </p>

          <Part id="sound" icon="sound">
            Sound
          </Part>
          <p>
            Opus, or FLAC, which is lossless. A session started without sound asks the remote for none, so the host
            keeps playing where it did. In the session, Mute and Unmute change only whether this browser listens. A
            phone, a tablet and Safari start muted. A browser without <code>AudioDecoder</code> greys Sound, and Safari,
            whose <code>AudioDecoder</code> fails FLAC, greys FLAC, so ticking Sound there takes Opus. On a High
            Performance Mac the menu's Audio button reads <em>Audio not supported</em> in such a browser, and{" "}
            <em>AAC-ELD not supported</em> in one that cannot decode the Mac's AAC-ELD.
          </p>

          <Part id="passthrough" icon="picture">
            Passthrough
          </Part>
          <p>
            Sends the remote's own stream to the browser as it came instead of tiles coded by the gateway. A High
            Performance Mac's picture is always passed, and which stream is the choice: its HEVC, greyed where the
            browser cannot take it, or its H.264 (beta), which is offered to every browser with a{" "}
            <code>VideoDecoder</code> and needs no HEVC decoder in the page. On an <code>rdp</code> target with the
            pipeline on it is no choice: the picker says it is always passed, with no box to tick, and a browser that
            cannot compose the pipeline cannot start the target. A passed RDP pipeline follows the browser's link: the
            Windows host draws fewer frames for a browser that falls behind, and under Adaptive coarser ones too. A
            Mac's passed stream does not: the Mac sends at its own rate, little on a still screen and much with motion.
          </p>
          <p>
            On an <code>ard</code> target the Picture group is <em>Apple's Adaptive (beta), passed through</em>, the
            default, or <em>Gateway adaptive, settles to lossless</em>.
          </p>
          <Compare
            items={[
              {
                title: "Apple's Adaptive",
                tag: <Tag kind="beta">beta</Tag>,
                sub: "The default. The Mac's own 8×8 tiles, which this page decodes.",
                rows: [
                  ["Each change", "A coarse pass, then its refinement"],
                  ["On a slower link", "The same precision, fewer updates, refined once the screen is still"],
                  ["Lossless", <Mark value="no">never</Mark>],
                  ["Browser comes back", "Started over, not resumed"],
                ],
              },
              {
                title: "Gateway adaptive",
                sub: "The Mac's lossless Full quality, which the gateway inflates and sends as its tiles.",
                rows: [
                  ["Each change", "JPEG while a region changes, exact once it has settled"],
                  ["On a slower link", "Fitted to the link"],
                  ["Lossless", <Mark value="yes">once settled</Mark>],
                  ["Browser comes back", "Resumed"],
                ],
              },
            ]}
          />
          <p>Apple's Adaptive is greyed under Combined Display (below), which is the gateway's tiles too.</p>
          <p>
            On a <code>wlshare</code> target every picture is wlshare's own and passed through, which the labels leave
            unsaid: the Picture group is <em>Adaptive video</em>, the default, wlshare's H.264 of the whole desktop,{" "}
            <em>Progressive tiles (alpha)</em>, its tiles fitted to the link as a Windows host draws without H.264, or{" "}
            <em>Tiles with motion (LAN)</em>, wlshare's own tiles, for a LAN: see <a href="#wlshare">wlshare</a>.
          </p>

          <Part id="displays" icon="displays">
            Displays
          </Part>
          <p>
            On an <code>ard</code> target sharing the Mac's physical screens: <em>One at a time</em> (beta), the
            default, starts on the main screen and offers the others in the display menu, in the picture chosen above;{" "}
            <em>Combined</em> (alpha) shows every screen at once, as Apple's viewer's Combined Display, and offers no
            single screen. Combined Display asks the Mac for its Full quality, which the gateway decodes, composes and
            sends as its tiles, following the browser's link as any picture coded here does. On a 1x browser a 2x
            screen is scaled down to 1x by the gateway, so it costs the link a quarter of its own pixels; a 2x browser is
            sent the Mac's own pixels and draws a 1x screen up itself. Screen Sharing Standard's alone. See{" "}
            <a href={repo("docs/architecture.md#a-passed-stream-and-the-browsers-link")}>
              A passed stream and the browser's link
            </a>
            .
          </p>

          <Part id="graphics" icon="graphics">
            Graphics
          </Part>
          <p>
            How an RDP host draws its pipeline. Adaptive is greyed in a browser whose <code>VideoDecoder</code> cannot
            decode the host's H.264. See <a href="#an-exact-picture">An exact picture</a> for having the host draw
            losslessly.
          </p>
          <Compare
            items={[
              {
                title: "High quality",
                sub: "The default. The pipeline's codecs without H.264, for a LAN.",
                rows: [["On a slow link", "Fewer frames, none of them coarser"]],
              },
              {
                title: "Adaptive",
                tag: <Tag kind="alpha">alpha</Tag>,
                sub: "H.264 the host fits to the browser's link.",
                rows: [
                  ["On a slow link", "Coarser on a slow link, finer on a fast one"],
                  ["H.264 full screen", "The default: the whole desktop in H.264"],
                  ["H.264 region", "Only what moves like video, the rest as High quality draws it: text stays sharp, but it adapts less"],
                ],
              },
            ]}
          />

          <Part id="devices" icon="camera">
            Camera and Microphone <Tag kind="experimental">experimental</Tag>
          </Part>
          <p>
            On an <code>rdp</code> or <code>wlshare</code> target, ticks that offer the remote this browser's camera and
            microphone for the whole session, each opening only while an application on the remote uses it. See{" "}
            <a href="#camera-and-microphone">Camera and microphone</a>.
          </p>

          <h3>One session per gateway</h3>
          <p>
            One gateway holds one session. A reload or a dropped connection normally resumes it; an RDP session with the
            graphics pipeline on or a Standard Mac's Adaptive session instead reconnects the engine, because the
            browser's compositor or decoder state is gone. A different browser that finds the owner attached is asked
            whether to take over; one arriving during the owner's reattach grace may claim the slot directly. Either
            starts at the picker with its own choices. The remote keeps its own desktop, so starting the target again
            returns to the same windows.
          </p>
          <p>
            See{" "}
            <a href={repo("docs/architecture.md#what-a-session-is-started-with")}>What a session is started with</a>.
          </p>
        </>
      ),
    },
    {
      id: "target-passwords",
      title: "Target passwords",
      body: (
        <>
          <p>
            A target never writes its password. It names it, and the config keeps it encrypted in{" "}
            <code>[passwords]</code> under that name:
          </p>
          <Flow
            stages={[
              {
                icon: ICON.gateway,
                title: "The target names it",
                body: (
                  <p>
                    <code>password_ref = "workstation"</code> in its <code>[[targets]]</code>
                  </p>
                ),
              },
              {
                icon: ICON.lock,
                title: "The config keeps it encrypted",
                body: (
                  <p>
                    <code>workstation = "$ZD;1;AES-256-GCM;…"</code> under <code>[passwords]</code>
                  </p>
                ),
              },
              {
                icon: ICON.key,
                title: "Under your master password",
                body: (
                  <p>
                    Checked by <code>[master]</code>, and read from a file or, under <code>zdesk tui</code>, the keychain
                  </p>
                ),
              },
            ]}
            hops={[
              "by name",
              "AES-256-GCM, with the config's own salt",
            ]}
          />
          <pre>
            <code>{`[[targets]]
name = "workstation"
protocol = "rdp"
host = "192.0.2.10"
username = "Administrator"
password_ref = "workstation"`}</code>
          </pre>
          <p>The two tables are printed for you to paste, never typed:</p>
          <pre>
            <code>{`zdesk password master create -c zdesk.toml   # once: writes the master password file, prints [master]
zdesk password master show -c zdesk.toml     # each further config: prints [master] under it
zdesk password encrypt -c zdesk.toml         # prints one value for [passwords]`}</code>
          </pre>
          <pre>
            <code>{`[master]
salt = "…"
check = "…"

[passwords]
workstation = "$ZD;1;AES-256-GCM;…"`}</code>
          </pre>
          <p>
            <code>password encrypt</code> asks for the password twice, or reads one line from a pipe, and encrypts it
            under the <code>[master]</code> already in the config, which it only reads. The name is yours to give when
            pasting, and it is what <code>password_ref</code> says. <code>vnc_password_ref</code> names a VNC server's
            own password the same way. Nothing secret is in either output, so it can go wherever the config is
            assembled: an editor, a Helm values file, a templated ConfigMap. A local instance's config is the TUI's to
            write: its <kbd>p</kbd> asks for the name and the password and writes both tables itself.
          </p>
          <p>
            A value may also be left empty, <code>workstation = ""</code>, as a placeholder for a password not set yet:
            the target answers with the empty password until the real value is pasted over it, and a config whose names
            are all placeholders needs no <code>[master]</code> or master password.
          </p>
          <h3>The master password</h3>
          <p>
            Every other value is AES-256-GCM under a key derived from your <strong>master password</strong> and the
            config's own salt. A served gateway reads it from a file named by{" "}
            <code>[server].master_password_file</code>: a container secret, a systemd credential, or a file only the
            gateway's account can read. The file holds the master password alone; a trailing newline is ignored.{" "}
            <code>password master create</code> writes it, readable by its user alone, and refuses to replace one that
            exists unless given <code>--force</code>, after which every value encrypted under the old one stops opening;{" "}
            <code>password master show</code> prints a <code>[master]</code> block under the one already there. The TUI
            keeps its own in the keychain (the macOS Keychain, Windows Credential Manager, or a Linux desktop's Secret
            Service: GNOME Keyring, KWallet), read once when the TUI starts and generated then if there is none, so you
            never type it. Nothing but the TUI reads the keychain.
          </p>
          <Table
            head={["Started as", "Master password from"]}
            rows={[
              [
                <code>zdesk serve</code>,
                <>
                  <code>[server].master_password_file</code>; refused without it when a target names an encrypted value,
                  never asked
                </>,
              ],
              [
                <code>zdesk tui</code>,
                "the keychain, read when the TUI starts; generated and kept there when it has none; refused when the keychain will not answer, never asked",
              ],
              [
                <code>zdesk password</code>,
                <>
                  <code>[server].master_password_file</code>, else asked; <code>password master create</code> asks twice
                  and writes that file
                </>,
              ],
            ]}
          />
          <p>
            A local instance has no <code>[server]</code> block, so its master password always comes from the keychain.
          </p>
          <p>
            A wrong master password is reported as one at start-up. Changing the master password means setting each
            password again under a new <code>[master]</code>.
          </p>
        </>
      ),
    },
    {
      id: "windows",
      title: (
        <>
          Windows (<code>rdp</code>)
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
            The RDP client is the gateway's own, tested against Windows 10 and 11's Remote Desktop over NLA. It carries
            the desktop, pointer, keyboard, mouse, resize, the clipboard, sound, and the browser's camera and
            microphone. It does not carry touch. Windows Home cannot be reached: it does not host Remote Desktop.
          </p>
          <DemoClip
            locale="en"
            id="mac-to-windows"
            caption="Windows' own Remote Desktop at a Mac's Retina density, with its sound in the browser."
          />
          <ul>
            <li>
              The host draws through the graphics pipeline (MS-RDPEGFX), which every session passes to the browser to
              compose. That takes nearly all of the picture's work off the gateway. It needs WebGL 2 and a cross-origin
              isolated page, which a proxy that drops the gateway's two isolation headers undoes; a browser without them
              cannot start the target. How the host draws the pipeline, high quality or adaptive H.264 (alpha), is
              chosen at the picker.
            </li>
            <li>
              <code>egfx = false</code> makes the host draw with bitmap updates instead, which the gateway sends as
              tiles: the target for a browser that cannot compose the pipeline. The desktop then keeps its size: without
              the pipeline Windows resizes by rebuilding the share, which this gateway does not take.
            </li>
          </ul>

          <h3 id="two-displays">
            Two displays <Tag kind="beta">beta</Tag>
          </h3>
          <p>
            <code>virtual_displays = 2</code> asks the host for two displays, each the session's size. Where the second
            sits against the first is chosen under the target at the picker, <strong>Second display</strong>: right,
            left, top or bottom, to match where the client's own second display is.
          </p>
          <TwoDisplays
            first={
              <>
                <strong>Display 1</strong> stays on the session's page
              </>
            }
            second={
              <>
                <strong>Display 2</strong> opens at <code>/display/2</code> in a new tab
              </>
            }
            drag="A window dragged over the edge between the two tabs arrives on the other display."
          />
          <p>
            The session starts on <em>All Displays</em>, in the floating menu's Display picker, which keeps the first
            display here and links to the second, <strong>Open Display 2 ↗</strong> under the menu's Display button: it
            opens at <code>/display/2</code> in a new tab of the same browser, just that display, with its own pointer
            and keyboard, and clicked again it brings that tab to the front. The picker's <code>Display 1</code> and{" "}
            <code>Display 2</code> show one display alone on this page. A window dragged over the edge between the two
            tabs arrives on the other display, as the pointer does, however their windows are arranged. With each tab
            full screen on a display of its own the edges meet, so it arrives where it was dragged to; with anything
            between the two pictures it arrives short by that much.
          </p>
          <p>
            While <em>All Displays</em> is chosen the Display picker and the menu's <strong>Info</strong> carry the same
            link. The page shows the display as it opens. On a session that follows the window, that tab's window sizes
            display 2. It needs the login of the browser holding the session and is shown in one tab at a time: a tab
            opening it while another shows it says it is in use and asks before it <strong>Take</strong>s it{" "}
            <strong>over</strong>, as a browser asks before taking a session, and the tab it was taken from says so and
            offers <strong>Take it back</strong>. That tab's menu <strong>Disconnect</strong>s it, and choosing one
            display alone closes it. Opened while it is not shown, it says it is not available. With the pipeline on,
            the browser holding the session composes both displays once and shows one; the second display's tab is
            painted from that same picture, so nothing is decoded twice. Checked against one Windows 11 host, the
            passthrough over two displays by a headless browser's sockets only, not yet by eye.
          </p>
          <p>
            The second display's tab has a menu of its own, behind a button showing the display's number, 2, where the
            session's page shows 1 instead of ☰. It holds what is that tab's alone,{" "}
            <strong>Immersive full screen</strong>, that display's size and density, and <strong>Disconnect</strong>;
            everything else stays in the menu on the session's page.
          </p>
          <p>
            The second display's tab is for a client with two physical displays, one for each. A client with one leaves
            the tab unopened, and has the first display here as it would alone, or picks a display. The tab is not
            supported on a phone or tablet, though nothing there stops you opening it.
          </p>

          <h3 id="an-exact-picture">An exact picture</h3>
          <p>
            By default a Windows host draws much of its desktop lossily, as RemoteFX Progressive and ClearCodec's
            NSCodec, which blur text and colours slightly. Its own policy decides that, and no setting in zDesk
            overrides it. To have it draw every pixel exactly:
          </p>
          <ol className="steps">
            <li>
              <p>
                On the host, open the Local Group Policy Editor (<code>gpedit.msc</code>) and go to Computer
                Configuration &gt; Administrative Templates &gt; Windows Components &gt; Remote Desktop Services &gt;
                Remote Desktop Session Host &gt; Remote Session Environment. Enable{" "}
                <em>Configure image quality for RemoteFX Adaptive Graphics</em> and set it to <strong>Lossless</strong>.
                A Windows edition without the editor takes the same setting in the registry, from an elevated prompt:
              </p>
              <pre>
                <code>{`reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows NT\\Terminal Services" /v ImageQuality /t REG_DWORD /d 1 /f`}</code>
              </pre>
              <p>A domain's Group Policy, where one sets it, wins over either.</p>
            </li>
            <li>
              <p>
                Run <code>gpupdate /force</code>, then start a new session: one already running keeps the quality it
                started with.
              </p>
            </li>
            <li>
              <p>
                At the picker, keep <strong>Graphics</strong> on <em>High quality</em>. The host then draws only exact
                codecs, planar and uncompressed rectangles, and passes them to the browser as they are.
              </p>
            </li>
            <li>
              <p>
                In the session, open the menu's <strong>Info</strong>: the <em>Host's picture</em> row reads{" "}
                <em>Lossless (Planar)</em> or similar. <em>Lossy (…)</em> names what the host drew with instead, and
                means the policy has not reached the session.
              </p>
            </li>
          </ol>
          <p>
            Lossless is costly, because the host draws what moves exactly too: the opening desktop alone is about 7.6
            MB, and a video in a window about 19 MB a second, before the host's own compression, which reaches the
            browser with them and takes about a third off planar drawing and half off scrolling. That suits a LAN.
            Adaptive H.264 changes nothing on such a host: it draws no H.264 under Lossless. See{" "}
            <a href={repo("docs/rdp-client.md#lossless-by-the-hosts-policy")}>Lossless, by the host's policy</a> for
            what was measured.
          </p>
          <p>
            Another RDP server, an older Windows or xrdp say, may happen to work but is not tested against. See{" "}
            <a href={repo("docs/rdp-client.md")}>The RDP client</a>.
          </p>
        </>
      ),
    },
    {
      id: "macs",
      title: (
        <>
          Macs (<code>vnc</code> with an Apple subtype)
        </>
      ),
      body: (
        <>
          <pre>
            <code>{`[[targets]]
name = "mac"
protocol = "vnc"
subtype = "ard"   # or "ard-high-performance"
host = "192.0.2.11"
username = "andrew"
password_ref = "mac"`}</code>
          </pre>
          <p>
            A Mac needs no additional software. Give the target the Mac <em>account's</em> username and password, not a
            Screen Sharing password: that selects Apple Remote Desktop authentication, so the connection lands at the
            user's own screen rather than a login window. The Mac must grant that account Observe and Control in Remote
            Management's per-user access list; the default "All users" setting rejects the connection with the same
            error as wrong credentials. See{" "}
            <a href={repo("docs/apple-vnc-889.md#remote-management-access")}>Remote Management access</a>.
          </p>
          <Compare
            items={[
              {
                title: "Standard",
                sub: <code>subtype = "ard"</code>,
                rows: [
                  ["Displays", "The Mac's physical displays, one at a time or combined"],
                  ["Follows the window", <Mark value="no">no</Mark>],
                  ["Sound", <Mark value="no">none; the Mac keeps playing</Mark>],
                  ["Picture", "Apple's Adaptive (beta), passed, or the gateway's tiles"],
                ],
              },
              {
                title: "Standard on a virtual display",
                tag: <Tag kind="unofficial">unofficial</Tag>,
                sub: (
                  <>
                    <code>subtype = "ard"</code>, <code>virtual_display = true</code>
                  </>
                ),
                rows: [
                  ["Displays", "One virtual display, the physical ones disabled meanwhile"],
                  ["Follows the window", <Mark value="yes">yes</Mark>],
                  ["Sound", <Mark value="no">none</Mark>],
                  ["Picture", <>as <code>ard</code></>],
                ],
              },
              {
                title: "High Performance",
                sub: <code>subtype = "ard-high-performance"</code>,
                rows: [
                  ["Displays", "One virtual display up to 3840×2160 backing pixels, or two (beta)"],
                  ["Follows the window", <Mark value="yes">yes</Mark>],
                  ["Sound", <Mark value="yes">always, AAC-ELD</Mark>],
                  ["Picture", "HEVC, or H.264 (beta), passed"],
                ],
              },
            ]}
          />
          <h3>Standard</h3>
          <p>
            <strong>
              <code>subtype = "ard"</code>
            </strong>{" "}
            is Screen Sharing's Standard mode: the Mac's physical displays, one at a time or all of them, at their own
            density. A session of one screen at a time is started with the picker's Adaptive (beta), the default, which
            passes the Mac's own Adaptive picture for the page to decode, or Gateway adaptive, the gateway's tiles of the
            Mac's lossless Full quality. Both have been tried on a virtual Mac alone. A session of Combined Display
            (alpha) is the gateway's tiles of every screen at once. It has no resize and no sound; the Mac keeps playing
            on its own output.
          </p>
          <p>
            <strong>
              A Mac with more than one display connected is best given <code>virtual_display = true</code>
            </strong>{" "}
            (below), which sizes one display to the browser window. Combined Display, every screen at once, is shown at
            100%, so it works well only for two small displays side by side that fit one browser window, and anything
            larger has to be scrolled constantly. It has no picture ceiling: every screen is shown whole, however many
            there are and whatever they come to, at the pixels the browser's density gives it, so a 1x browser still has
            a 2x screen scaled down by the gateway (above). Tried on a virtual Mac alone.
          </p>
          <p>Every Apple subtype carries the Mac's native pasteboard.</p>

          <h3>High Performance</h3>
          <p>
            <strong>
              <code>subtype = "ard-high-performance"</code>
            </strong>{" "}
            is High Performance mode as Apple's viewer has it. The Mac disables its physical displays and puts every
            window on one virtual display, sized by the session, up to 3840×2160 backing pixels. Picture and sound come
            over the Mac's media stream, HEVC and AAC-ELD over SRTP:
          </p>
          <ul>
            <li>
              <Tag kind="beta">beta</Tag> <code>virtual_displays = 2</code> asks the Mac for two virtual displays, Apple's
              viewer's "2 Virtual Displays", the second to the right of the first: the Mac places it, so the picker
              offers no other side. To have it on another side, arrange the displays on the Mac while the session is
              open, in System Settings → Displays → Arrange: drag the second display to the left of the first, above it
              or below it. The session follows — each tab keeps its own display and the pointer crosses the edge they
              now share — and the Mac may keep the arrangement for the next session; when it has not, it is on the
              right again. The session starts on the Display picker's <em>All Displays</em>, which keeps the first here
              and opens the second at <code>/display/2</code> in a new tab of the same browser, as on an RDP target, and
              the picker shows either alone; on a session that follows the window that tab's window sizes the second
              display. The Mac sends a stream for each display, the second to UDP port 5902, and the gateway passes only
              the displays shown. As on RDP, a window dragged over the edge between the two tabs arrives on the other
              display, and the second display's tab is not recommended on a client with one physical display, and not
              supported on a phone or tablet.
            </li>
          </ul>
          <DemoClip
            locale="en"
            id="windows-to-mac-two-displays"
            caption="A High Performance Mac's two virtual displays in two Chrome tabs on Windows, one on each of the client's displays."
          />
          <ul>
            <li>
              The Mac sends to the gateway's UDP ports 5900 and 5901, and 5902 for a second display, so a firewall or
              NAT between them must let that through.
            </li>
            <li>
              <Tag kind="qa">QA only</Tag> Where it cannot, as for a virtual Mac behind its host's NAT,{" "}
              <code>relay = "host:port"</code> reaches the Mac through{" "}
              <a href={repo("crates/zdesk-relay/README.md")}>
                <code>zdesk-relay</code>
              </a>
              , run on a machine that reaches both, with <code>host</code> the Mac as the relay reaches it. The gateway
              only connects out, to the relay's one TCP port, which carries the media stream too. The relay has no
              authentication yet.
            </li>
            <li>
              A Linux gateway needs <code>net.core.rmem_max</code> of at least 4194304 for the picture's socket, and the
              log warns when it is lower: the stock 212992 loses keyframes at Retina sizes.
            </li>
            <li>
              The gateway decodes neither of the Mac's streams: the picture is passed, as the HEVC or the H.264 chosen at
              the picker.
            </li>
            <li>
              The H.264 passthrough needs nothing added in the page: the Mac is asked for H.264 in place of its HEVC, and
              the browser decodes it with its own decoder, which more browsers have for H.264 than for HEVC. So a
              default build serves the target, with no software decoder, to any browser that has{" "}
              <code>VideoDecoder</code>, Firefox included, and the picker offers the H.264 only in those browsers;
              without <code>VideoDecoder</code> it is greyed. The picker does not ask the decoder itself: a browser
              whose decoder does not take the Mac's H.264 says so in the session, by the decoder's error.
            </li>
            <li>
              The HEVC passthrough sends the HEVC only when the page's startup probe finds a decoder path. Support
              depends on the browser, platform and GPU, so the picker is authoritative. The gateway can also serve the
              optional software picture decoder described in{" "}
              <a href={repo("zdesk.example.toml")}>
                <code>zdesk.example.toml</code>
              </a>
              .
            </li>
            <li>
              The Mac mutes its own speakers while it streams, so a session always carries AAC-ELD sound. The page
              probes that separately; if it cannot decode the sound, the session continues without audio and the menu
              says why.
            </li>
          </ul>

          <h3>
            Standard on a virtual display <Tag kind="unofficial">unofficial</Tag>
          </h3>
          <p>
            <code>virtual_display = true</code> on an <code>ard</code> target opens Standard mode on such a virtual
            display, with resize and without the media stream or sound, the physical displays disabled meanwhile. It is
            the recommended way to reach a Mac with more than one display connected, whose Combined Display is
            impractical in a browser past two small screens. Apple's viewer never offers this combination; it was tested
            on macOS 26 only.
          </p>
          <p className="note">
            Apple documents none of this protocol. Both modes are reverse engineered and only as correct as the Macs they
            were measured against, and a macOS update is free to change any of it. See{" "}
            <a href={repo("docs/apple-vnc-889.md")}>Apple RFB 003.889, as measured</a>.
          </p>
        </>
      ),
    },
    {
      id: "wlshare",
      title: (
        <>
          wlshare (<code>vnc</code>, <code>subtype = "wlshare"</code>)
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
            <a href="https://github.com/andrewtheguy/wlshare">wlshare</a> is this project's own VNC server for
            wlroots-based Wayland desktops. The subtype makes the gateway list wlshare's private RFB extensions: its
            H.264 stream of the whole desktop, which is passed through untouched and paced to the browser's link, pixel
            density, the output list, sound, and, in a session started with them, the browser's camera and microphone as
            PipeWire devices on the desktop. Without the subtype the same server is read as any VNC server is.
          </p>
          <h3>The picture</h3>
          <p>
            The picker's Picture group has three, all passed through, so no label says so, and no key tunes any of them:
            wlshare codes each one way.
          </p>
          <Compare
            items={[
              {
                title: "Adaptive video",
                sub: "The default. wlshare's H.264 of the whole desktop, 4:2:0, at the quality wlshare decides.",
                rows: [
                  ["On a slower link", "Fewer frames rather than coarser ones"],
                  ["Host's processor", "The lighter; the host's hardware encoder where it has one"],
                  ["Text", "Can be less crisp"],
                  ["Lossless", <Mark value="no">never</Mark>],
                ],
              },
              {
                title: "Progressive tiles",
                tag: <Tag kind="alpha">alpha</Tag>,
                sub: "For a link that is not always wide: every tile RemoteFX Progressive, as a Windows host draws over RDP without H.264.",
                rows: [
                  ["On a slower link", "Coarser first passes and fewer frames"],
                  ["Host's processor", "More than the video, coded in software"],
                  ["Text", "Crisper"],
                  ["Lossless", <Mark value="no">never</Mark>],
                ],
              },
              {
                title: "Tiles with motion",
                tag: <span className="tag">LAN</span>,
                sub: "What is still as lossless PNG, and a video stream of its own for each region that moves.",
                rows: [
                  ["Link", "Room to spare: several times the video's bytes, tens of Mbit/s while something large moves"],
                  ["Moving regions", "H.264 from the host's hardware encoder or libx264"],
                  ["Text", "Exact once still"],
                  ["Lossless", <Mark value="yes">once a region stops</Mark>],
                ],
              },
            ]}
          />
          <p>
            Progressive tiles are coarse first and refined in place once still, what moves sent as the change from what
            the page holds. The page decodes them itself, as it composes an RDP host's pipeline, so they need no video
            decoder, and are greyed where the page cannot compose one. Tiles with motion send each region that moves
            lossless again once it stops.
          </p>
          <h3>
            Two outputs <Tag kind="beta">beta</Tag>
          </h3>
          <p>
            A desktop with exactly two outputs, monitors or headless ones, is listed with <em>All Displays</em> and
            starts on it: the first stays here and the second opens at <code>/display/2</code> in a new tab of the same
            browser, with its own pointer and keyboard, as on an <code>rdp</code> target with{" "}
            <a href="#two-displays">two virtual displays</a>. <code>virtual_displays = 2</code> asks wlshare for two, as
            it asks a Windows host or a Mac: on sway wlshare has the compositor make a second headless output, and a
            session started with two and asked for one, the default, keeps one; on another compositor the outputs are
            what the compositor has.
          </p>
          <h3>Logging in and versions</h3>
          <p>
            The example uses the account wlshare runs as, checked through PAM over RSA-AES. If wlshare instead uses its{" "}
            <code>[password]</code> table, keep that password under <code>password_ref</code> and omit{" "}
            <code>username</code>: RSA-AES then sends the password alone. wlshare does not offer classic VNC
            authentication, so <code>vnc_password_ref</code> does not apply to it.
          </p>
          <p>
            The gateway and wlshare must speak the same version of wlshare's protocol; <code>wlshare --version</code>{" "}
            names the one a wlshare speaks. A session against a wlshare of another version fails at connect, naming
            both, and is fixed by upgrading whichever of the two is older. A wlshare release that changes nothing of the
            protocol keeps its version.
          </p>
          <p>
            See <a href={repo("docs/wlshare-density.md")}>density</a>, <a href={repo("docs/wlshare-outputs.md")}>outputs</a>
            , <a href={repo("docs/wlshare-audio.md")}>audio</a>, <a href={repo("docs/wlshare-camera.md")}>camera</a> and{" "}
            <a href={repo("docs/wlshare-microphone.md")}>microphone</a>.
          </p>
        </>
      ),
    },
    {
      id: "other-vnc-servers",
      title: (
        <>
          Other VNC servers (<code>vnc</code>)
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
            A plain target takes <code>vnc_password_ref</code> for classic VNC authentication, or <code>username</code>{" "}
            and <code>password_ref</code> for RSA-AES. For a password-only RSA-AES server, use <code>password_ref</code>{" "}
            without <code>username</code>. The gateway asks for ZRLE, which every current VNC server has, and reads
            nothing else but Raw; the older standard encodings, Tight and the other vendor or lossy ones are not listed.
            The target is shown at its server's own size, at 1x, and carries no sound, camera or microphone. Standard RFB
            cannot say that its pixels are HiDPI; see{" "}
            <a href={repo("docs/standard-rfb-hidpi.md")}>HiDPI over standard RFB</a>.
          </p>
        </>
      ),
    },
    {
      id: "camera-and-microphone",
      title: "Camera and microphone",
      body: (
        <>
          <p>
            <strong>Camera</strong> and <strong>Microphone</strong> are ticks at the picker on an <code>rdp</code> or{" "}
            <code>wlshare</code> target, which offer the remote this browser's camera and microphone. Both are{" "}
            <Tag kind="experimental">experimental</Tag>, off until ticked and remembered per target as every choice is. A
            session started with the camera gives the remote a camera as it connects, and this browser's camera opens
            only while an application on the remote uses it, so its light is off the rest of the time; the Info card's
            Camera row says which. The microphone is the same: plugged in as the session connects, and this browser's
            microphone open only while something on the remote records, as the Info card's Microphone row says. They are
            for someone who needs one for a while, a call or a recording, and are sent as cheaply as that allows: H.264
            from the browser passed untranscoded, and mono speech Opus at a low fixed bitrate. An Apple target and a
            plain <code>vnc</code> target offer neither.
          </p>
          <Table
            head={["Target", "Camera", "Microphone"]}
            rows={[
              [
                <code>rdp</code>,
                <Mark value="yes">a Windows host that redirects cameras</Mark>,
                <Mark value="yes">started once something on the host records</Mark>,
              ],
              [
                <>
                  <code>vnc</code>, <code>wlshare</code>
                </>,
                <Mark value="yes">a PipeWire camera on the desktop</Mark>,
                <Mark value="yes">an ordinary PipeWire source</Mark>,
              ],
              [
                <>
                  <code>vnc</code>, Apple subtypes
                </>,
                <Mark value="no" />,
                <Mark value="no" />,
              ],
              [<code>vnc</code>, <Mark value="no" />, <Mark value="no" />],
            ]}
          />
          <p>
            On RDP the camera needs a Windows host that redirects cameras: a workstation, or a Windows Server carrying
            the Remote Desktop Session Host role. A Windows host starts the microphone only once something on it records.
          </p>
          <p>
            On wlshare the camera is a PipeWire camera on the desktop, and a browser there reaches it only through{" "}
            <code>xdg-desktop-portal</code> with <code>xdg-desktop-portal-gtk</code>, which wlshare's package recommends;
            Chrome also needs <code>chrome://flags/#enable-webrtc-pipewire-camera</code> turned on. Without them a page
            that asks for a camera finds none. The microphone needs neither: it is an ordinary PipeWire source.
          </p>
        </>
      ),
    },
    {
      id: "local-instances",
      title: "Local instances",
      body: (
        <>
          <p>
            Native installs include a terminal control plane that runs several gateways on one machine, each with its own
            config and browser origin:
          </p>
          <pre>
            <code>zdesk tui</code>
          </pre>
          <Flow
            stages={[
              {
                icon: ICON.browser,
                title: "Your browser",
                body: (
                  <p>
                    The landing page at <code>zdesk.localhost:52380</code>, each instance at{" "}
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
                body: <p>Owns the port on loopback, logs a browser in with a PIN, and proxies each subdomain</p>,
              },
              {
                icon: ICON.gateway,
                title: "Instances",
                body: <p>One gateway each, with its own config, started and stopped from the TUI</p>,
              },
            ]}
            hops={["loopback only", "each its private Unix socket or named pipe"]}
          />
          <p>
            It listens on loopback only, on port 52380 unless <code>--port</code> or <code>ZDESK_TUI_PORT</code> says
            otherwise, and refuses to start on a port something else is serving. Open{" "}
            <a href="http://zdesk.localhost:52380">http://zdesk.localhost:52380</a>; each running instance is at{" "}
            <code>{"http://<instance>.zdesk.localhost:52380"}</code>. It answers only those names at its own port.{" "}
            <code>localhost</code>, <code>127.0.0.1</code> and <code>[::1]</code> at that port are redirected to{" "}
            <code>zdesk.localhost</code>. Any other host or port is refused, so a tunnel or port forward that arrives
            under another name or port does not reach the TUI. One that arrives as <code>zdesk.localhost</code> at this
            port, or rewrites the host to it, does.
          </p>
          <DemoClip
            locale="en"
            id="mac-to-linux"
            caption={
              <>
                An instance, <code>instance3</code>, open in Chrome at <code>instance3.zdesk.localhost:52380</code>.
              </>
            }
          />
          <h3>Keys</h3>
          <Keys
            head={["Key", "Action"]}
            rows={[
              [["↑", "↓", "k", "j"], "select an instance"],
              [["n"], "create an instance"],
              [
                ["e"],
                <>
                  edit its <code>zdesk.toml</code> in <code>$VISUAL</code> or <code>$EDITOR</code> (<code>vi</code>, or
                  Notepad on Windows); the edit is checked, and applies when the instance is restarted
                </>,
              ],
              [
                ["p"],
                <>
                  encrypt a password into its <code>[passwords]</code>, asking for the name and the password; a config
                  without <code>[master]</code> gets one first
                </>,
              ],
              [["s", "x", "r"], "start, stop, restart it"],
              [["a"], "start every stopped one"],
              [["o"], "open a running one in the browser"],
              [["Enter"], "show its settings"],
              [["R"], "rescan the instances directory"],
              [["P"], "show a new login PIN for the next browser, its time started again"],
              [["?"], "list every key"],
              [["q", "Esc"], "stop every instance and quit"],
            ]}
          />
          <h3>Instances and their passwords</h3>
          <p>Each immediate subdirectory of the instances root is one instance:</p>
          <Table
            head={["Platform", "Instances root"]}
            rows={[
              [
                "Linux",
                <>
                  <code>~/.local/share/zdesk/instances</code> (or <code>$XDG_DATA_HOME/zdesk/instances</code>)
                </>,
              ],
              ["macOS", <code>~/Library/Application Support/zdesk/instances</code>],
              ["Windows", <code>%LOCALAPPDATA%\zdesk\instances</code>],
            ]}
          />
          <p>
            <code>--instances-dir</code> chooses another. The root is private to your account, because the configs hold
            credentials. An instance's config has the same <code>[branding]</code> and <code>[[targets]]</code> as a
            gateway's and no <code>[server]</code> block: the TUI owns the port and proxies each subdomain to that
            instance's private Unix socket or named pipe.
          </p>
          <p>
            A config that names encrypted passwords needs the master password to start (see{" "}
            <a href="#target-passwords">Target passwords</a>). The TUI takes it from the keychain, generating one there
            the first time, then hands each worker only the key to its own config. An instance config copied from
            another account's keychain does not open under this one: remove its <code>[master]</code> and{" "}
            <code>[passwords]</code> and set each password again with <kbd>p</kbd>.
          </p>
          <h3>Logging in with a PIN</h3>
          <Flow
            stages={[
              {
                icon: ICON.pin,
                title: "A PIN is shown",
                body: (
                  <p>
                    Six digits, <code>123-456</code>, in the access panel above the instance list, with the clock time it
                    expires, ten minutes on
                  </p>
                ),
              },
              {
                icon: ICON.browser,
                title: "One browser logs in",
                body: <p>That login reaches the landing page and every instance, until the TUI quits</p>,
              },
              {
                icon: ICON.key,
                title: (
                  <>
                    <kbd>P</kbd> for the next browser
                  </>
                ),
                body: <p>A used, expired or withdrawn PIN no longer works; a new one starts its time again</p>,
              },
            ]}
            hops={["entered once, with or without its dash", "the panel shows the login in place of the PIN"]}
          />
          <p>
            A browser logs in with a PIN. The TUI's access panel, above the instance list, shows a six-digit PIN and the
            clock time it expires, ten minutes after it is generated. The PIN is printed as <code>123-456</code> in a
            colour of its own, one word for a double-click, and <kbd>c</kbd> sends it in that form to the clipboard
            through the terminal (OSC 52), which reaches your own clipboard over SSH. Inside tmux it goes into a tmux
            buffer, which tmux passes on to the terminal's clipboard under its default <code>set-clipboard</code>{" "}
            setting. No terminal confirms the write, and Apple's Terminal.app drops it, so if a paste does not give the
            PIN, select it instead. The PIN field takes the PIN with or without its dash. The PIN is entered once, on
            whichever page the browser opened, the landing page or an instance, and the browser stays there. That one
            login reaches the landing page and every instance. A PIN page left open in another tab offers to continue
            instead once you switch back to it.
          </p>
          <p>
            The PIN is one-time: it admits one new browser. Once it has, the access panel shows that a browser logged in
            and when, in place of the PIN, and the PIN no longer works. <kbd>P</kbd> shows a new PIN for the next browser
            and starts its time again. After five wrong entries the PIN is withdrawn, and every entry is refused until{" "}
            <kbd>P</kbd> shows a new one. The PIN form says which it was: used, expired or withdrawn. The PIN guards only
            new logins. A browser that has logged in stays logged in when the PIN is used, expires or is replaced, and
            when its instances restart. Only quitting the TUI logs it out.
          </p>
          <p className="warning">
            The PIN keeps out anyone who cannot see the TUI's terminal, with one gap. A cookie ignores the port, so
            another account on the machine that serves a page at <code>zdesk.localhost</code>, or a name under it, on
            another port, and gets you to open a link to it, can take a logged-in browser's login.{" "}
            <strong>
              Do not run <code>zdesk tui</code> on a machine shared with users who must not reach those desktops.
            </strong>
          </p>
          <p>
            The private files and worker endpoints keep credentials from other local users. A browser never holds a
            worker's token: the TUI presents it for a logged-in browser. A browser gets in to a gateway one of two ways:
            this PIN, or a served gateway's username and password.
          </p>
          <p>
            See{" "}
            <a href={repo("docs/architecture.md#local-multi-instance-control-plane")}>
              Local multi-instance control plane
            </a>
            . For installing zDesk, see the <a href={`${pagePath("en", "home")}#quick-start`}>quick start</a> or{" "}
            <a href={repo("docs/install.md")}>Installing zDesk</a> in the <a href={REPO}>repository</a>.
          </p>
        </>
      ),
    },
  ],
};

export default guide;
