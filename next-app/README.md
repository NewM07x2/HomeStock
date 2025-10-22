# Next.js Frontend (next-app)

This is a Next.js project bootstrapped with `create-next-app`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses `next/font` to automatically optimize and load Inter (Google Font).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the Vercel platform. See Next.js deployment docs for details.

## プロジェクト構造 (next-app)

```text
next-app/
├── package.json         # npm manifest
├── package-lock.json    # lockfile
├── next.config.mjs      # Next.js config
├── postcss.config.js    # PostCSS config
├── tailwind.config.ts   # Tailwind config
├── tsconfig.json        # TypeScript config
├── public/              # 静的アセット (favicon, images)
├── node_modules/        # 依存パッケージ
├── .eslintrc.json       # ESLint 設定
├── .gitignore
├── README.md            # このファイル
└── src/
    ├── app/             # Next.js app router (route, pages)
    │   ├── page.tsx
    │   ├── layout.tsx
    │   ├── providers.tsx
    │   ├── error.tsx
    │   ├── not-found.tsx
    │   ├── items/       # item 関連ページ
    │   └── modal-page/
    ├── components/      # UI コンポーネント群
    │   ├── base/
    │   ├── items/
    │   ├── home/
    │   ├── page/
    │   ├── sample/
    │   └── ui/
    ├── lib/             # 共有ライブラリ (api, prisma, urql 等)
    ├── const/           # 定数定義
    ├── model/           # クライアント側モデル定義
    ├── hooks.ts
    ├── store/           # Redux/RTK store と slices
    ├── stories/         # Storybook 用コンポーネント
    └── styles/          # globals.css 等
```

## Development

- Regenerate GraphQL client or other generated code as needed.
- Run tests with:

```bash
yarn test
# or
npm test
```

## License

MIT
