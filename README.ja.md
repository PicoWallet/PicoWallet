# PicoWallet # 

[![PicoWallet](https://i.imgur.com/CSNAtPY.png)](https://picowallet.net)


### PicoWalletを使うには ? ###

以下のリンクはRambleOnが運営しているPicoWalletです。  
[Operation RambleOn](https://app.picowallet.net)


# 開発について #

### ソースコードからのビルド ###

1) npm modulesのインストール:

```
git clone https://github.com/PicoWallet/PicoWallet.git
npm install
```

2) Ionicのインストール:

```
npm install -g ionic
```

3) Ionic Serve:

<pre>ionic serve</pre>

##### または #####

4) Prodビルド:

<pre>ionic build --prod</pre>


# デプロイ  #

### Netlifyへデプロイ  ###

<!-- Markdown snippet -->
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/PicoWallet/PicoWallet)


1) Githubを接続

1. 「Connect to Github」を押す

![Imgur](https://i.imgur.com/hyKqmwS.png)

2) 保存とデプロイ

1. 「Save & Deploy」を押す

![Imgur](https://i.imgur.com/IuTILhm.png)

3) デプロイ設定を編集

1. 「Build & Deploy」を押す
2. 「Edit settings」を押す
3. Build Command に「npm run-script build --prod」を、 Publish directory に「www」を書く
4. 「Save」を押す

![Imgur](https://i.imgur.com/z8QFXxd.png)


4) 再デプロイ

1. 「Deploy settings」を押す
2. 「Trigger deploy」を押す

![Imgur](https://i.imgur.com/6uFDadZ.png)
