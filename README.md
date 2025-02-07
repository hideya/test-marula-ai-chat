# AI Chat Application

GPT-4を活用したTypeScript/Reactベースのチャットボットアプリケーション。

## 主要機能

- 💬 GPT-4による高度な対話機能
- 🔒 セキュアなユーザー認証システム
- 📝 Markdownフォーマットのサポート
- 💾 PostgreSQLによるチャット履歴の永続化
- 🎨 モダンなUI/UXデザイン
- 🔄 リアルタイムのプログレスインジケーター

## 技術スタック

### フロントエンド
- React
- TypeScript
- TanStack Query（データフェッチング）
- Tailwind CSS（スタイリング）
- shadcn/ui（UIコンポーネント）
- React Markdown（マークダウンレンダリング）

### バックエンド
- Express.js
- PostgreSQL
- Drizzle ORM
- OpenAI API

### 認証
- Passport.js
- セッションベースの認証

## 環境構築

1. 必要な環境変数の設定:
```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=your-api-key
```

2. 依存関係のインストール:
```bash
npm install
```

3. データベースのセットアップ:
```bash
npm run db:push
```

4. 開発サーバーの起動:
```bash
npm run dev
```

## 使用方法

1. アプリケーションにアクセスし、アカウントを作成またはログイン
2. 「New Chat」ボタンをクリックして新しい会話を開始
3. メッセージを入力して送信
4. AIからの返答を待つ（プログレスインジケーターが表示されます）
5. 会話履歴は自動的に保存され、左側のサイドバーで過去の会話にアクセス可能

## 機能の詳細

### チャット機能
- リアルタイムのユーザーインターフェース
- Markdown形式でのメッセージ表示
- 会話コンテキストの維持
- 自動タイトル生成

### ユーザー管理
- ユーザー登録・ログイン機能
- セッション管理
- セキュアなパスワード保存

### データ永続化
- PostgreSQLによるデータベース管理
- 効率的なクエリ処理
- セッション情報の永続化
