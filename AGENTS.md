# Repository instructions

Keep this file to rules that change how work is performed. What the site
contains and how it is built belong in the README.

- Strict no backward-compatibility or legacy paths: a page or file that moves
  or is renamed leaves no redirect or alias behind.
- Every page is in English, Simplified Chinese (`zh-CN`) and Traditional
  Chinese (`zh-TW`); a change to the text of one changes all three.
- Translate Simplified (`zh-CN`) and Traditional (`zh-TW`) Chinese each from the
  English, never one by converting the other's characters: their technical terms
  differ (网关/閘道, 配置/設定, 软件包/套件, 会话/工作階段, 文件/檔案), so each
  keeps its own vocabulary.
- Name the product zDesk in prose and on the page, and zdesk where it is a
  command, path or identifier.
- After a change run `npm run typecheck`, `npm run lint` and `npm run build`.
  Check a page in the prerendered `build/client`, served by `npm run preview`,
  not through the Vite dev server.
