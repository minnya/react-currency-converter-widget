# ベースイメージとしてNodeを使用
FROM node:18

# アプリケーションの作業ディレクトリを作成
WORKDIR /app

# 依存関係のファイルをコピー
COPY package.json package-lock.json ./

# 依存関係をインストール
RUN npm install

# アプリのソースコードをコピー
COPY . .

# アプリをビルド
# RUN npm run build

# ポート3000を公開
EXPOSE 3000

# アプリを起動
CMD ["npm", "start"]