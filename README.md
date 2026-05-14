# YouTube Like Hotkey

给 YouTube 网页版添加一个“点赞快捷键”的 Tampermonkey 用户脚本。

默认快捷键是 `G`。按下后会给当前视频点赞；如果视频已经点赞，脚本不会再次点击，因此不会取消点赞。

## 功能

- 按 `G` 点赞当前 YouTube 视频
- 已点赞时再次按下不会取消点赞
- 自动避开搜索框、评论框、输入框等正在输入文字的地方
- 支持在 Tampermonkey 菜单里修改快捷键
- 支持通过 GitHub Raw 地址自动更新

## 安装

1. 安装浏览器扩展 [Tampermonkey](https://www.tampermonkey.net/)。
2. 打开脚本 Raw 地址：
   [youtube-like-hotkey.user.js](https://raw.githubusercontent.com/snape2019/youtube-like-hotkey/main/youtube-like-hotkey.user.js)
3. Tampermonkey 会弹出安装页面，点击安装即可。

## 使用

打开 YouTube 视频页面后，按 `G` 即可点赞。

如果想修改快捷键：

1. 点击浏览器右上角的 Tampermonkey 图标。
2. 找到 `YouTube Like Hotkey`。
3. 点击“设置 YouTube 点赞快捷键”。
4. 输入一个单个字母或数字，例如 `Q`、`Z`、`1`。

## 更新

脚本已经配置了 `@updateURL` 和 `@downloadURL`，Tampermonkey 可以从 GitHub Raw 地址检查更新。

如果自动更新没有立刻出现，可以在 Tampermonkey 管理页面手动点击“检查用户脚本更新”，或者重新打开 Raw 地址覆盖安装。

## 注意事项

- 需要登录 YouTube 后才能点赞。
- 脚本只是模拟点击 YouTube 页面上的点赞按钮，不会绕过 YouTube 的限制。
- YouTube 页面结构可能会变化。如果快捷键失效，可以更新到最新版本。
