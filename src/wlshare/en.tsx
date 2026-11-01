import { pagePath } from "../content";
import { Cards, Clip, Still, StillPair } from "../guides/visuals";
import type { WlshareText } from "./text";

const WLSHARE = "https://github.com/andrewtheguy/wlshare";
const guide = pagePath("en", "wlshare-guide");

const text: WlshareText = {
  title: "wlshare",
  description:
    "wlshare is a VNC server for wlroots Wayland desktops such as sway and labwc, built for zDesk: the browser's pixel density, H.264 or lossless tiles, sound, the camera and microphone through PipeWire, and one or two outputs.",
  tagline: "A VNC server for wlroots desktops, built for zDesk.",
  intro: (
    <>
      wlshare shares a sway, labwc or other wlroots desktop over RFB, and gives zDesk what plain VNC cannot carry:
      the browser's pixel density, a picture fitted to the link, the desktop's sound, the browser's camera and
      microphone, and a second output in a tab of its own. It is free and open source under the{" "}
      <a href={`${WLSHARE}/blob/main/LICENSE`}>MIT licence</a>.
    </>
  ),
  rolling: "wlshare is on a rolling release: the latest release is the current one.",
  packages: (
    <>
      On Debian trixie it needs wlroots 0.19 and the sway or labwc built on it, from its own{" "}
      <a href="#install">APT repository</a>: 0.19 keeps the pointer out of the picture, and a patch there keeps the
      pointer on the right output when labwc shows two, one in each browser tab.
    </>
  ),
  heroCaption: "Sway through wlshare at a Mac's Retina density, in Chrome, with a video playing.",
  demoHeading: "Demo",
  demoIntro: "A zDesk session recorded from Chrome on a Mac, with no client installed: wlshare on a sway desktop.",
  features: [
    {
      icon: "size",
      title: "Sharp at the browser's density",
      body: (
        <>
          It tells the client the density its pixels are drawn at, which standard RFB cannot, and takes the
          browser's as the output's scale: a Retina or HiDPI screen shows the desktop sharp and at its true size, and
          a headless output follows the window's size.
        </>
      ),
    },
    {
      icon: "picture",
      title: "A picture for the link",
      body: (
        <>
          H.264 of the whole desktop from the host's hardware encoder or libx264, fitted to the link; RemoteFX
          Progressive tiles; lossless tiles with a video stream for each region that moves; or lossless tiles
          throughout, for a LAN.
        </>
      ),
    },
    {
      icon: "sound",
      title: "The desktop's sound",
      body: (
        <>
          While a client listens, a PipeWire sink of wlshare's own is the default, and what plays there is sent as
          lossless FLAC or as Opus. A headless desktop needs no sound card.
        </>
      ),
    },
    {
      icon: "camera",
      title: "The browser's camera and microphone",
      body: (
        <>
          Lent to the desktop as PipeWire devices, and opened in the browser only while an application on the
          desktop uses them: a call or a recording there, with the camera in front of you.
        </>
      ),
    },
    {
      icon: "displays",
      title: "One output or two",
      body: (
        <>
          The client is sent the desktop's outputs to choose from, and a second connection is shown another beside
          the first. On sway, a client that asks for two virtual displays is given a second headless output.
        </>
      ),
    },
    {
      icon: "lock",
      title: "A login that names its account",
      body: (
        <>
          RSA-AES with the account's own password through PAM, or a password of its own kept as an Argon2 hash.
          Classic VncAuth, which cuts the password to eight characters and leaves the session in the clear, is not
          offered.
        </>
      ),
    },
    {
      icon: "monitor",
      title: "Any wlroots compositor",
      body: (
        <>
          sway, labwc or another compositor offering wlroots' protocols, headless or on a monitor. The pointer stays
          out of the picture and the client draws it; wlshare's APT repository has the wlroots 0.19 that keeps it out
          on a headless output, for Debian trixie.
        </>
      ),
    },
    {
      icon: "key",
      title: "One client at a time",
      body: (
        <>
          A connection that logs in takes the desktop from whoever holds it, as Windows Remote Desktop does, so a
          client that died leaves nothing behind: connecting again takes the desktop back.
        </>
      ),
    },
  ],
  sections: [
    {
      id: "where-it-runs",
      title: "Where it runs",
      body: (
        <>
          <p>The desktops behind the demo and the pictures here, and how each is set up:</p>
          <Cards
            items={[
              {
                title: "A headless desktop, up at boot",
                body: (
                  <>
                    sway or labwc as a systemd user service on wlroots' headless backend, started at boot under
                    lingering with nobody logged in. wlshare starts with the session and sizes the headless output
                    for each client. <a href={`${guide}#headless`}>How</a>
                  </>
                ),
              },
              {
                title: "A desktop at the console, handed over",
                body: (
                  <>
                    On a machine with monitors, a client taking the desktop is shown a headless output at its own size
                    and density while the monitors go dark, and <code>wlshare watch</code> puts the windows back on
                    them when it leaves. <a href={`${guide}#at-the-console`}>How</a>
                  </>
                ),
              },
              {
                title: "LXQt on labwc",
                body: (
                  <>
                    A stacking desktop with a panel, a menu and a file manager, on labwc rather than a tiler: the same
                    wlshare, since every wlroots compositor is the same kind of peer.
                  </>
                ),
              },
              {
                title: "The keyring, unlocked by the login",
                body: (
                  <>
                    With the system login, the password PAM has just checked unlocks the login keyring of a desktop no
                    display manager started. <a href={`${guide}#keyring`}>How</a>
                  </>
                ),
              },
              {
                title: "Several desktops behind one gateway",
                body: (
                  <>
                    One zDesk gateway, in a container or a Kubernetes pod, with a target for each desktop beside
                    Windows and Mac targets, each reached from any browser.
                  </>
                ),
              },
            ]}
          />
          <Still
            name="wlshare-lxqt"
            caption="LXQt on labwc, headless under the user manager, at scale 2 in Chrome: a file manager and a terminal."
          />
        </>
      ),
    },
    {
      id: "through-zdesk",
      title: "Through zDesk",
      body: (
        <>
          <p>
            A <code>vnc</code> target with <code>subtype = "wlshare"</code> asks for all of it. Without the subtype the
            same server is read as any VNC server is: its pixels at 1x, with no sound.
          </p>
          <StillPair
            items={[
              { name: "wlshare-sway", caption: "With the subtype: the scale 2 output at 2x, whole in the window." },
              {
                name: "wlshare-plain-vnc",
                caption: "Without it: the same pixels at 1x, twice the size, a quarter of the desktop in the window.",
              },
            ]}
          />
          <Clip
            name="wlshare-two-outputs"
            caption={
              <>
                Two outputs of a headless sway in two Chromium windows: a video moved to the second output and back.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "install",
      title: "Install",
      body: (
        <>
          <p>
            On Debian trixie, amd64 or arm64: wlroots 0.19 and sway or labwc from wlshare's APT repository, then
            wlshare from its <a href={`${WLSHARE}/releases`}>releases</a>, the version in place of <code>0.0.x</code>:
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
            It listens on loopback with no login until told otherwise. The <a href={guide}>wlshare guide</a> covers
            the login, a headless desktop up at boot, outputs, sound and the rest.
          </p>
        </>
      ),
    },
  ],
};

export default text;
