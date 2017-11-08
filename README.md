<p align="center">
<img alt="BLAC" src="https://raw.githubusercontent.com/yamorijp/quac/master/capture.png" width="600"/>
</p>


QUAC (Quoine API Console) は 仮想通貨取引所 [QUOINEX](https://ja.quoinex.com) が提供する
[Quoine Exchange API](https://bitflyer.jp/docs) を使用した非公式のCLIツールパッケージです。

Quoine Exchange APIクライアントを統合したjavascriptの対話型コンソールプログラム、
リアルタイム更新の板表示プログラム、約定履歴表示プログラムとティッカー表示プログラムを含みます。

当プログラムは"experimental"です。  
十分なテストが行われていません。オーダー発行を行う場合は最初に少額でお試しください。


姉妹品としてbitFlyer Lightning APIを使用した [BLAC](https://github.com/yamorijp/blac)もあります。



## 導入手順

当プログラムはNode.jsで動作するjsスクリプトです。  
実行には[Node.js](https://nodejs.org) が必要です。バージョン6.10.0以上を導入してください。

また、サードパーティ製のnpmモジュールに依存しています。
[npm](https://www.npmjs.com/) か [yarn](https://yarnpkg.com/) を使用してインストールを行ってください。

    $ npm install
    


## プログラムの実行方法

nodeコマンドでスクリプトを実行します。

    $ node console.js

いくつかコマンドラインオプションがあります。`-h`オプションで確認してください。

    $ node console.js -h
    

## 対話型コンソール (console.js)

Quoine Exchange APIクライアントを統合したREPLコンソールプログラムです。  
対話型シェルでjavascriptを使用した注文発注や取消等、Quoine Exchange APIの呼び出しが行えます。

残高の確認やオーダー発行などAuthenticated APIに属する機能の呼び出しにはAPI Token IDとAPI secretが必要になります。
[QUOINEX](https://trade.quoinex.com)にログイン後、設定の[APIアクセス](https://accounts.quoinex.com/settings/api)からAPIトークンを作成してください。

API Token IDとAPI secretは`.qc_set_key`コマンドで設定します。設定した認証情報はプログラム終了時まで有効です。

    > .qc_set_key YOUR_API_TOKEN_ID YOUR_API_SECRET
    
`.qc_store_key`コマンドで書き出しを行っておくと起動時に自動で読み込みます。（※平文で保存されます。セキュリティに注意）


APIの詳細は、[Quoine Exchange API Reference](https://developers.quoine.com)を参照してください。


      オプション:
    
        -n, --no-banner  スタートアップバナーを表示しない
    
      例:
    
        $ node console.js -n



## 板表示プログラム (book.js)

リアルタイム更新の板表示プログラムです。  
値段範囲で注文をまとめるグルーピング表示に対応しています。(`-g`オプション）


      オプション:
        
        -p, --product <code>  通貨ペアコード (デフォルト: BTCJPY)
        -r, --row <n>         買いと売り注文の表示行数 (デフォルト: 20)
        -g, --group <n>       指定範囲の注文をまとめて表示 (デフォルト: 無効)
        
      例:
        
        $ node book.js -p BTC_JPY -r 32 -g 100
      

## 約定履歴表示プログラム (executions.js)

リアルタイム更新の約定履歴表示プログラムです。


      オプション:
    
        -p, --product <code>  通貨ペアコード (デフォルト: BTCJPY)
        -r, --row <n>         履歴の表示行数 (デフォルト: 40)
    
      例:
    
        $ node executions.js -p ETH_BTC -r 20


# ティッカー表示プログラム (ticker.js)

リアルタイム更新のティッカー表示プログラムです。


      オプション:
    
        -p, --product <code>  カンマ区切りの通貨ペアコード (デフォルト: "BTCJPY,ETHJPY,BCHJPY,ETHBTC,BTCUSD")
    
      例:
    
        $ node ticker.js -p "BTCUSD,ETHBTC"



## ライセンス

MIT


bitcoin: `1BpLZm4JEFiDqAnaexuYMhGJZKdRQJKixP`  
monacoin: `MEaJSzymtvpB7AtrryVzn9LeZYhCrustpJ`
