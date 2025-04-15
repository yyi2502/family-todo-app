# TODO チャレンジ

「TODO チャレンジ」は、こどもが楽しみながらタスクを管理できるToDoアプリです。  
親子でタスクを共有し、やる気を引き出す仕組みを取り入れています。  
親子のポジティブなコミュニケーションを通じて、やる気・自主性・達成感をサポート！

<img src="https://github.com/user-attachments/assets/1cbd5118-5a67-4681-8f36-c0fffdf95180" width="50%" />

## Overview（アプリ概要）
### ターゲット
小学生の子ども ＆ 子育て中の保護者  
子どもが日々のお手伝いを「楽しい習慣」として続けられるようサポートします。

### 解決したい課題
- 日々のタスク管理の難しさ・やる気の持続
- 子どもがお手伝いを面倒に感じ、やる気が続かない
- 親が「何度言ってもやらない」「どうやって習慣化させるか分からない」と悩む
  
**自身で「やる」「やった」ボタンを押すゲーム感覚 × 紙吹雪での演出 × ポイント制で成長実感 で、楽しく解決！**

### 特徴
- ポイント制  
  お手伝いを完了するとポイントGET！  
  ごほうび以上に「頑張った実感」を可視化。

- 紙吹雪（Confetti）演出  
  お手伝い完了時に、アプリ画面上で紙吹雪が舞う！  
  成功体験を演出し、達成感をアップ。

### 使い方イメージ
- 朝の準備  
  「ランドセルを整理」「テーブルを拭く」など、登校前タスクをミッション化！
- 夕食前のお手伝い  
  「お皿を並べる」「お米を研ぐ」など、家族の時間も楽しいチャレンジタイムに。
- 休日のお手伝いイベント  
「大掃除チャレンジ」「おでかけ準備ミッション」など特別感のあるタスクも設定可能。


## Screen Captures（スクリーンキャプチャ）

### ▼ログイン後 ユーザー切り替え画面
<img src="https://github.com/user-attachments/assets/37e52013-8a35-493e-af7e-7f19ed5fb264" width="50%" />


### ▼こどもユーザーTOP
<img src="https://github.com/user-attachments/assets/fd342e43-a97e-4c14-b734-c1c1e78659c0" width="50%" />


### ▼「やった！」ボタンクリック後の紙吹雪演出
<img src="https://github.com/user-attachments/assets/8511e6b1-ee48-4c60-a24d-ef0e4715c454" width="50%" />


## Demo（デモURL）
https://family-todo-app-git-master-yamadays-projects.vercel.app/
```
メールアドレス：test@test.com
パスワード：test@test.com
```

## Features（機能一覧）
| 機能 | 概要 |
| --- | --- |
| 会員登録・ログイン・ログアウト | メールアドレスによる登録 |
| こどもユーザー追加 | 親（ログイン）アカウントのみ、追加・削除が可能 |
| タスク登録 | タイトル・説明・ポイントを設定可能 |
| ステータス管理 | pending / processing / completed で進捗管理 |
| こどもユーザーの進捗操作 | 「やる！」「やった！」ボタンで操作 |
| ポイント制 | 完了時にポイント加算、紙吹雪演出あり |
| タスク管理 | 親（ログイン）アカウントのみ、登録・編集・削除可能 |
| リワード管理 | 親（ログイン）アカウントのみ、登録・編集・削除可能 |


## Requirements（必須環境）
- next: 15.2.3
- react: 19.0.0
- tailwindcss: 4

## Technology Stack（技術構成）
| カテゴリ | 使用技術 |
| --- | --- |
| フレームワーク | Next.js v15.2.3 |
| 言語 | TypeScript 5.x |
| スタイリング | Tailwind CSS 4.x, daisyUI 5.x |
| バリデーション | Zod 3.24 |
| フォーム | react-hook-form 7.54 + resolvers |
| 認証・DB | Supabase 2.49 + ssr |
| 状態管理 | zustand 5.0 |
| 紙吹雪演出 | canvas-confetti 1.9 |
| アイコン | lucide-react 0.483 |

## Directory Structure（ディレクトリ構成）
```
/app              ... App Router 用ルーティングとレイアウト定義  
/components       ... 再利用可能なUIコンポーネント群  
/hooks            ... カスタムフック（データ取得やアクション）  
/stores           ... Zustand によるグローバル状態管理  
/utils            ... 共通ユーティリティ（Supabase操作や演出など）  
/schemas          ... Zodによるバリデーションスキーマ  
/types            ... 型定義（TypeScript）  
/public           ... 静的ファイル（背景画像など）  
```


## Future Plans（実装予定機能）
- タスクに期限を設定
- 画像追加機能（ユーザープロフィール・タスクイメージなど）
- タスクソート・フィルター機能
- ユーザー情報更新



## Utilities（よく使うコマンド）
```
npm run dev       # ローカル開発
npm run build     # 本番ビルド
npm run lint      # Lintチェック
```

## Getting Started（ローカル環境構築）
```
git clone https://github.com/yyi2502/family-todo-app.git
cd your-repo
npm install
npm run dev
```

## Deployment（デプロイ方法）
Vercelに接続してデプロイ
