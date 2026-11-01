import Flow from "../../Flow";
import { pagePath } from "../../content";
import ICON from "../icons";
import { type GuideText } from "../links";
import { Clip, Compare, Mark, Still, StillPair, Table, Tag } from "../visuals";

const WLSHARE = "https://github.com/andrewtheguy/wlshare";
const RELEASES = `${WLSHARE}/releases`;
const wl = (path: string) => `${WLSHARE}/blob/main/${path}`;
const zdeskGuide = pagePath("en", "zdesk-guide");

const guide: GuideText = {
  intro: (
    <>
      Setting up <a href={pagePath("en", "wlshare")}>wlshare</a>, the VNC server zDesk reaches a Linux desktop
      through, on a wlroots compositor such as sway or labwc: what it needs, who may connect, a desktop that is up
      at boot with nobody logged in, and what it carries. Every setting is in the annotated{" "}
      <a href={wl("wlshare.example.toml")}>
        <code>wlshare.example.toml</code>
      </a>
      , and how it works in <a href={wl("docs/architecture.md")}>Architecture</a>.
    </>
  ),
  sections: [
    {
      id: "what-it-needs",
      title: "What it needs",
      body: (
        <>
          <p>
            The wlshare daemon runs inside the Wayland session it shares, as the user who owns it, and speaks to the compositor
            through wlroots' public protocols. Any wlroots compositor that offers them is the same kind of peer:
          </p>
          <Table
            head={["Protocol", "For"]}
            rows={[
              [<code>wlr-screencopy</code>, "the picture, version 2 or later; required"],
              [<code>ext-image-copy-capture</code>, "the pointer's image, captured apart from the picture; required"],
              [<code>wlr-output-management</code>, "resizing and rescaling a headless output for the client"],
              [
                <>
                  virtual keyboard and pointer
                </>,
                "the client's keyboard and mouse",
              ],
              [<code>wlr-data-control</code>, "the clipboard, both ways"],
            ]}
          />
          <p>
            The pointer is never in the captured pixels: wlshare sends its image apart, at the output's density,
            and the client moves it without waiting for a frame. On a headless output that takes wlroots 0.19, the
            first whose headless backend keeps the cursor on a plane of its own; 0.18 paints it into the capture. The
            sound, the camera and the microphone go through PipeWire, which the package depends on.
          </p>
          <Still
            name="wlshare-sway"
            caption={
              <>
                Sway through wlshare at a Mac's Retina density, in Chrome: <code>wlr-randr</code> reports the headless
                output at scale 2, and <code>wpctl</code> wlshare's own sink while the browser listens.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "installing",
      title: "Installing",
      body: (
        <>
          <p className="warning">
            <strong>No backward compatibility.</strong> A wlshare release may change or remove a setting, a private
            extension's wire format or a feature, with nothing that reads the old form. Check{" "}
            <code>/usr/share/doc/wlshare/wlshare.example.toml</code> against your config when you upgrade.
          </p>
          <p>
            Debian trixie ships sway 1.10 and labwc 0.8.3 on wlroots 0.18, and wlshare's own signed APT repository has
            sway 1.11, labwc 0.9.7 and wlroots 0.19 rebuilt for trixie from Debian's packaging, for amd64 and arm64,
            and this is what needs each:
          </p>
          <Table
            head={["Package", "What needs it"]}
            rows={[
              [<>wlroots 0.19</>, "The cursor capture, ext-image-copy-capture, that wlshare does not start without, and the pointer kept out of a headless output's picture, which 0.18 paints into every capture. The wlshare package depends on it."],
              [<>wlroots' one patch</>, "On labwc with two outputs, the client's pointer where it is put after labwc reloads its configuration (labwc --reconfigure). labwc then maps every pointer back to the output it names, which wlshare's has none of, and stretches its positions across the whole layout, on both outputs, until the outputs are next laid out anew; wlshare makes its pointer again on every change to the layout, on any wlroots, but a reload changes none. A desktop with one output, and sway, need no patch: a stock wlroots 0.19 or later is enough."],
              [<>sway 1.11, labwc 0.9.7</>, "The releases built against wlroots 0.19, rebuilt unchanged: trixie's sway 1.10 and labwc 0.8.3 link 0.18, which wlshare does not start on."],
            ]}
          />
          <p>Their versions sort above trixie's, so no pin is needed:</p>
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
            Ubuntu 26.04 (resolute) ships sway 1.11 and labwc 0.9.3 on wlroots 0.19.2, which wlshare runs on as they
            are, so the repository has nothing for it: install sway or labwc from Ubuntu. Its wlroots does not carry the
            patch above, so on labwc with two outputs a reload leaves the pointer stretched across the layout until the
            outputs are next laid out anew, as when a client resizes one; sway, and labwc with one output, are as on
            trixie.
          </p>
          <p>
            The wlshare package itself is on its <a href={RELEASES}>releases</a>, not in the repository, one for each:{" "}
            <code>trixie</code> and <code>resolute</code>, each naming its own distribution's libraries. Put the version
            in place of <code>0.0.x</code>, <code>resolute</code> for <code>trixie</code> on Ubuntu 26.04, and{" "}
            <code>arm64</code> for <code>amd64</code> on an arm64 host:
          </p>
          <pre>
            <code>{`curl -fsSLO ${RELEASES}/download/v0.0.x/wlshare-trixie-amd64.deb
sudo apt install ./wlshare-trixie-amd64.deb`}</code>
          </pre>
          <p>
            It depends on <code>libwlroots-0.19</code>, which the repository above provides on trixie and Ubuntu
            ships itself, and on{" "}
            <code>pipewire</code>, <code>wireplumber</code> and <code>pipewire-pulse</code>. It recommends{" "}
            <code>xdg-desktop-portal-gtk</code>, for a browser on the desktop to find the client's camera, and{" "}
            <code>va-driver-all</code>, for the host's hardware H.264 encoder.
          </p>
          <p>
            The zDesk gateway and wlshare must speak the same version of wlshare's protocol, which{" "}
            <code>wlshare --version</code> names. A session against a wlshare of another version fails at connect,
            naming both; upgrade whichever is older. A release that changes nothing of the protocol keeps its
            version.
          </p>
        </>
      ),
    },
    {
      id: "running",
      title: "Running it",
      body: (
        <>
          <p>
            The configuration is one TOML file, <code>$XDG_CONFIG_HOME/wlshare/config.toml</code> by default, and an
            empty file takes every default. The package installs a systemd user unit, started with the graphical
            session once the session has handed <code>WAYLAND_DISPLAY</code> to the user manager:
          </p>
          <pre>
            <code>{`mkdir -p ~/.config/wlshare
cp /usr/share/doc/wlshare/wlshare.example.toml ~/.config/wlshare/config.toml
systemctl --user enable --now wlshare.service
journalctl --user -u wlshare -f`}</code>
          </pre>
          <p>
            By hand, name the session's socket: <code>WAYLAND_DISPLAY=wayland-1 wlshare</code>. It listens on{" "}
            <code>listen</code>, <code>127.0.0.1:5900</code> unless set, and shares the compositor's first output, or
            the one <code>output</code> names.
          </p>
          <p>
            One client is on the desktop at a time. A connection that finishes the handshake, login included, takes
            the desktop from whoever holds it, as Windows Remote Desktop does, and the client it was taken from is told
            who took it. The RFB shared flag changes nothing. So a client that died leaves nothing behind: connecting
            again takes the desktop back, with the keys and buttons the old one held released. The one exception is
            the holder's own second connection, which is shown another output (see{" "}
            <a href="#outputs">Outputs</a>).
          </p>
        </>
      ),
    },
    {
      id: "who-may-connect",
      title: "Who may connect",
      body: (
        <>
          <p>One setting, with three answers. Classic VncAuth is offered under none of them.</p>
          <Compare
            items={[
              {
                title: "Nobody asked",
                sub: "Neither table set.",
                rows: [
                  ["Login", <Mark value="no">none</Mark>],
                  ["Encrypted", <Mark value="no">no</Mark>],
                  ["For", <>a <code>listen</code> on loopback, a VPN address or behind an SSH tunnel</>],
                ],
              },
              {
                title: "The system login",
                sub: <code>[pam]</code>,
                rows: [
                  ["Login", "the username and password of the account wlshare runs as, checked by PAM"],
                  ["Encrypted", <Mark value="yes">RSA-AES</Mark>],
                  ["For", "a desktop whose account password is the way in, and can unlock its keyring"],
                ],
              },
              {
                title: "A password of its own",
                sub: <code>[password]</code>,
                rows: [
                  ["Login", "one password, checked against an Argon2 hash in the config"],
                  ["Encrypted", <Mark value="yes">RSA-AES</Mark>],
                  ["For", "a host where no system account's password should be the way in"],
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
            Under <code>[pam]</code> any username but the account wlshare runs as is refused before PAM is asked
            anything, since the desktop behind the port is that one user's. For <code>[password]</code>,{" "}
            <code>wlshare hash-password</code> asks for the password and prints the hash to paste as{" "}
            <code>hash</code>; the password itself is never written down. Either way the server's RSA key is
            generated on first start beside the config, and its fingerprint is logged, for comparing with the one the
            client shows: the zDesk gateway logs the one it saw.
          </p>
          <h3 id="keyring">The keyring, unlocked by the login</h3>
          <p>
            A headless desktop started by systemd has no display manager to hand the login password to the keyring,
            so the login keyring stays locked until an application asks and someone answers a prompt. Under{" "}
            <code>[pam]</code> the password PAM has just checked can do it: a <code>pam_exec</code> line in{" "}
            <code>/etc/pam.d/wlshare</code>'s auth stack, after <code>common-auth</code>, passes it to a script that
            starts <code>gnome-keyring-daemon --login</code> and then <code>--start</code>, both halves of what{" "}
            <code>pam_gnome_keyring</code> would do, since wlshare opens no PAM session for its session hook to run in:
          </p>
          <pre>
            <code>{`@include common-auth
auth    optional    pam_exec.so expose_authtok quiet /usr/local/lib/wlshare/unlock-keyring
@include common-account`}</code>
          </pre>
          <p>Neither wlshare nor its package supplies that script; this is it:</p>
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
          <p>Install it where the line names it, with the keyring's packages, and mask the daemon's activation:</p>
          <pre>
            <code>{`sudo apt install gnome-keyring libpam-gnome-keyring
sudo install -D -m 755 unlock-keyring /usr/local/lib/wlshare/unlock-keyring
systemctl --user mask gnome-keyring-daemon.socket gnome-keyring-daemon.service`}</code>
          </pre>
          <p>
            <code>optional</code>, so a keyring that will not open costs a prompt inside the session, never the VNC
            login. Mask <code>gnome-keyring-daemon.socket</code> and <code>.service</code>, so no daemon started by
            activation owns the Secret Service before the one holding the password. Change the account's password
            with <code>passwd</code>, which re-encrypts the keyring through PAM; a hash written into{" "}
            <code>/etc/shadow</code> any other way leaves the keyring under the old one.
          </p>
        </>
      ),
    },
    {
      id: "headless",
      title: "A headless desktop, up at boot",
      body: (
        <>
          <p>
            wlroots' headless backend drives no display and opens no input device, so the compositor needs no seat and
            no logind session: it can be a systemd user service, and with lingering it comes up at boot with nobody
            logged in. It makes one output, <code>HEADLESS-1</code>, which wlshare shares and resizes for each client.
            This is how the demo's sway and LXQt desktops run.
          </p>
          <Flow
            stages={[
              {
                icon: ICON.terminal,
                title: "The user manager",
                body: (
                  <p>
                    Started at boot by <code>loginctl enable-linger</code>, and starts the compositor's unit
                  </p>
                ),
              },
              {
                icon: ICON.monitor,
                title: "The compositor",
                body: (
                  <p>
                    sway or labwc with <code>WLR_BACKENDS=headless</code>; once its socket exists it starts its
                    session target
                  </p>
                ),
              },
              {
                icon: ICON.gateway,
                title: "wlshare",
                body: (
                  <p>
                    <code>wlshare.service</code>, wanted by <code>graphical-session.target</code>, which the session
                    target binds to
                  </p>
                ),
              },
            ]}
            hops={["at boot, lingering", "with the session"]}
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
            The compositor hands its environment to the user manager and starts the target once its socket exists, at
            the end of sway's config (labwc runs the same two lines from <code>~/.config/labwc/autostart</code>):
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
            Stopping only the session target on the way out would leave wlshare restarting against a compositor that is
            gone, which is why the compositor's unit stops <code>graphical-session.target</code> itself. Pin{" "}
            <code>HEADLESS-1</code> at the origin in the compositor's config, so an output made for a second display
            lands to its right.
          </p>
          <Still
            name="wlshare-lxqt"
            caption={
              <>
                LXQt on labwc, a stacking compositor, headless under the user manager and through the same wlshare,
                at scale 2.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "outputs",
      title: "Outputs",
      body: (
        <>
          <p>
            Each connection shows one output; outputs are never joined into one framebuffer. A client that asks, as
            zDesk does, is sent the list of the session's outputs and switches among them, and the same client's
            second connection is shown another output beside the first, with its own size and density: two at once,
            and no more. A plain VNC client sees one, <code>output</code> or the one the last client chose.
          </p>
          <p>
            Only a <code>HEADLESS-*</code> output is resized or rescaled for a client; a monitor keeps its modes.{" "}
            <code>output</code> names a preference, not a requirement: while the compositor has no output of that name
            another is shared, and the desktop moves to it when it appears.
          </p>
          <h3 id="virtual-displays">
            Two virtual displays <Tag kind="beta">beta</Tag>
          </h3>
          <p>
            A client may ask for one virtual display or two, as an RDP client asks a Windows host for its monitors. On
            sway wlshare makes and unplugs headless outputs through sway's IPC, found in <code>SWAYSOCK</code>, until
            there are that many, with nothing to configure: a zDesk target with <code>virtual_displays = 2</code> is
            given a second, and the next session asking for one has it unplugged. On another compositor the outputs
            are what the compositor has.
          </p>
          <Clip
            name="wlshare-two-outputs"
            caption={
              <>
                Two outputs of a headless sway in two Chromium windows, each its own output's size: a video moved to
                the second output with <kbd>$mod</kbd>+<kbd>Shift</kbd>+<kbd>→</kbd> and back.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "at-the-console",
      title: "A desktop at the console too",
      body: (
        <>
          <p>
            A desktop on a real monitor can be handed to a client as a headless output of its own size and density,
            with the monitors dark while it is watched from elsewhere and back when it is left. The daemon says whether a client is on the desktop on <code>state_socket</code>, and <code>wlshare watch</code> follows that from a
            process of its own and runs a command for each:
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
              <code>--held</code> runs when a client takes the desktop, and <code>--free</code> when nobody has held
              it for <code>--free-after-secs</code> (5), so neither runs for a client that reconnects inside the
              wait. A takeover is not a change.
            </li>
            <li>
              sway moves a disabled output's workspaces to an enabled one, so the windows follow onto the headless
              output. With <code>output_wait_secs</code> the client taking the desktop waits for{" "}
              <code>HEADLESS-1</code> to be enabled, and starts on it rather than on the monitor.
            </li>
            <li>
              The socket closes when the daemon goes, however it went, and the watcher reads that as the desktop left:
              a wlshare killed with a client on the desktop still gives the monitors back. The watcher runs the
              command for where the desktop stands whenever it starts, so both must be safe to run twice.
            </li>
            <li>
              Create <code>HEADLESS-1</code> at session start (<code>swaymsg create_output</code>) where no monitor
              is adjacent, far to the left of them, so the pointer cannot wander onto it from the console.
            </li>
          </ul>
          <p>
            A desktop left dark comes back from a console or over SSH, with <code>SWAYSOCK</code> set:{" "}
            <code>swaymsg 'output * enable'</code>. Run the watcher as a user unit beside wlshare's, part of{" "}
            <code>graphical-session.target</code>, so it starts and stops with the session.
          </p>
        </>
      ),
    },
    {
      id: "sound-camera-microphone",
      title: "Sound, camera and microphone",
      body: (
        <>
          <p>
            Always on, with nothing to configure: a client asks for each, and zDesk does in a session started with
            them.
          </p>
          <Table
            head={["", "On the desktop", "While"]}
            rows={[
              [
                "Sound",
                <>
                  a PipeWire sink, <em>wlshare remote audio</em>, made the default; its monitor sent as FLAC or Opus,
                  whichever the client asked for
                </>,
                "a client listens",
              ],
              [
                "Camera",
                <>
                  a PipeWire video source, <em>wlshare remote camera</em>, from the client's H.264, decoded with the
                  system's libavcodec
                </>,
                "an application has it open",
              ],
              [
                "Microphone",
                <>
                  a PipeWire audio source, <em>wlshare remote microphone</em>, from the client's 16-bit PCM
                </>,
                "an application records",
              ],
            ]}
          />
          <p>
            While a client listens, every stream that follows the default plays into wlshare's sink and is silent on
            the host; an application pinned to a sink of the host's is still heard there. When the last listener
            goes, the sink goes and the host's own is the default again. A headless desktop needs no sound card.
          </p>
          <p>
            A browser on the desktop reaches the camera through <code>xdg-desktop-portal</code>'s Camera interface,
            offered only beside a backend that implements Access, such as <code>xdg-desktop-portal-gtk</code>;{" "}
            <code>xdg-desktop-portal-wlr</code> alone does not. Chrome also needs{" "}
            <code>chrome://flags/#enable-webrtc-pipewire-camera</code>. An application that opens{" "}
            <code>/dev/video*</code> directly does not see it. The microphone needs neither: it is an ordinary PipeWire
            source.
          </p>
        </>
      ),
    },
    {
      id: "keyboard",
      title: "The keyboard",
      body: (
        <>
          <p>
            The client sends keysyms, which wlshare turns into keycodes through the keymap it uploads to the
            compositor as the virtual keyboard's, so that keymap is also what the session types under. A custom layout
            goes under <code>[xkb]</code>, with <code>XKB_CONFIG_EXTRA_PATH</code> in the unit's environment naming the
            directory that holds it:
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
            Each key must keep its keysym and only gain an action, since the incoming keysyms are looked up in the same
            keymap. That is how sway's modifier is moved to Right Alt for a remote desktop: a layout rather than an{" "}
            <code>xkb_options</code> line, which sway ignores for a virtual keyboard. A lock key cannot be the
            modifier: Caps Lock latches the client's own lock before anything is sent.
          </p>
        </>
      ),
    },
    {
      id: "the-picture",
      title: "The picture",
      body: (
        <>
          <p>
            To a client that asks, wlshare gives the density the framebuffer is drawn at, which standard RFB cannot, and
            takes the client's density as the output's scale: a 2x browser gets a scale 2 output shown sharp at its
            true size. A plain VNC client is sent the same pixels with no density, and shows them at 1x.
          </p>
          <StillPair
            items={[
              {
                name: "wlshare-sway",
                caption: <>A zDesk session: the scale 2 output at 2x, whole in the window.</>,
              },
              {
                name: "wlshare-plain-vnc",
                caption: (
                  <>
                    The same desktop as plain VNC, without <code>subtype = "wlshare"</code>: its pixels at 1x, twice
                    the size, a quarter of it in the window.
                  </>
                ),
              },
            ]}
          />
          <p>
            Beside the standard Raw and ZRLE, a client that asks is sent one of wlshare's own pictures, which zDesk
            offers as its picker's Picture group (see{" "}
            <a href={`${zdeskGuide}#wlshare`}>wlshare in the zDesk guide</a>): its H.264 of the whole desktop, fitted
            to the link; RemoteFX Progressive tiles; lossless PNG tiles with a video stream for each region that
            moves; or lossless planar tiles, still or moving.
          </p>
          <p>
            The H.264, of the whole desktop or of a moving region, is the host's hardware encoder where VA-API finds
            one, and libx264 at its fastest preset otherwise; <code>hardware_h264 = false</code> skips the hardware.
            The startup probe tries Intel's low-power encoder first, which leaves the GPU's execution units to the
            desktop, and logs what it found:
          </p>
          <pre>
            <code>{`journalctl --user -b -u wlshare | grep h264
# hardware H.264: /dev/dri/renderD128 through VA-API, its low-power encoder`}</code>
          </pre>
          <p>
            A VM without a video encoder, such as one on VirGL, codes every frame in software: the larger the output,
            the more of the host's processor that takes. <code>max_fps</code>, 30 by default, caps the frames
            captured; the zDesk page draws at most 30.
          </p>
        </>
      ),
    },
    {
      id: "clients",
      title: "Clients",
      body: (
        <>
          <p>
            zDesk reaches wlshare as a <code>vnc</code> target with <code>subtype = "wlshare"</code>, which makes the
            gateway ask for wlshare's density, outputs, pictures, sound, camera and microphone:
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
                The picker on a <code>wlshare</code> target: the size following the window, sound as Opus or FLAC, the
                camera and microphone, and wlshare's four pictures.
              </>
            }
          />
          <p>
            Any other RFB 3.8 client that lists the Cursor pseudo-encoding and draws Raw rectangles can connect, at the
            output's own pixels and without sound: TigerVNC, for one, which speaks RSA-AES. Cursor is
            required because the pointer is never in the framebuffer. A client that does not list wlshare's
            extensions is not sent them. See <a href={`${zdeskGuide}#wlshare`}>wlshare</a> in the zDesk guide for
            what a session is started with.
          </p>
        </>
      ),
    },
  ],
};

export default guide;
