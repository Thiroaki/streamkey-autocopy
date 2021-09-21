# streamkey-autocopy
VRChatのログファイルからTopazChatのストリームキーをコピーするアプリです。  
Windowsのクリップボードの履歴を有効にしておくと便利です。  

# 使用方法
- streamkey-autocopy.exeを起動すると、タスクバーのトレイにアイコンが表示されます。
- クリックでメニューが表示され、機能のオンオフを切り替えられます。
- スタートアップをオンにすると、PCの起動と一緒にアプリが起動します。

# 仕様
## コピーされるタイミング
- PlayerにストリーミングURLをセット
- Resync

## スタートアップ
shell:startup
（C:\Users\%username%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup）にショートカットを作成しています。  
もし機能しない場合は、上記のショートカットを削除して再度スタートアップをオンにしてください。  

## コピーされないキー
ストリームキーに所定の単語が含まれていた場合はコピーをスキップします。  
例：`nocopy`, `no_copy`, `priv`, `private`, `secret`  

# 動作確認環境
Windows 10 64bit  
TopazChat Player 3.0 (https://tyounanmoti.booth.pm/items/1752066) 

# ストアページ
https://okou.booth.pm/items/2969654

# 製作者
おこう / Thiroaki  
Twitter: @ookkoouu  
