
[日本語のREADME.mdはこちら](https://github.com/PicoWallet/PicoWallet/blob/master/README.ja.md)

# PicoWallet # 

[![PicoWallet](https://i.imgur.com/CSNAtPY.png)](https://picowallet.net)


### How to use PicoWallet ? ###

For now, if you want to use a moving wallet please click the link below.  
[Operation RambleOn](https://app.picowallet.net)


# Developers #

### Build from source ###

1) Install npm modules:

```
git clone https://github.com/PicoWallet/PicoWallet.git
npm install
```

2) Install Ionic:

```
npm install -g ionic
```

3) Serve:

<pre>ionic serve</pre>

##### OR #####

4) Prod Build:

<pre>ionic build --prod</pre>


# Deploy  #

### How to deploy on Netlify  ###

<!-- Markdown snippet -->
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/PicoWallet/PicoWallet)


1)Connect to Github  

1. Click 「Connect to Github」

![Imgur](https://i.imgur.com/hyKqmwS.png)

2)Save & Deploy  

1. Click 「Save & Deploy」

![Imgur](https://i.imgur.com/IuTILhm.png)

3)Build & Deploy Setting  

1. Click 「Build & Deploy」
2. Click 「Edit settings」
3. Write Build Command 「npm run-script build --prod」, Write Publish directory 「www」
4. Click 「Save」

![Imgur](https://i.imgur.com/z8QFXxd.png)


4) Deploy

1. Click 「Deploy settings」
2. Click 「Trigger deploy」

![Imgur](https://i.imgur.com/6uFDadZ.png)
