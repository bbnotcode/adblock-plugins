# 去广告插件

个人使用的 Quantumult X 独立重写资源。现阶段收录拼多多底栏与横幅净化，不替换墨鱼配置、节点订阅、分流或证书。

## 推荐：拼多多底栏与横幅净化

直接引用：

https://raw.githubusercontent.com/bbnotcode/adblock-plugins/main/QuantumultX/PinduoduoClean.snippet

在圈 X「重写 → 引用」中添加上面的地址，关闭该引用的资源解析器，开启重写与 HTTPS 解密。需要 Quantumult X build 845 或更新版本，证书应使用自己生成并已信任的证书。

```ini
https://raw.githubusercontent.com/bbnotcode/adblock-plugins/main/QuantumultX/PinduoduoClean.snippet, tag=拼多多底栏与横幅净化, update-interval=86400, opt-parser=false, enabled=true
```

仅当对应接口仍返回这些字段时，规则才会有效：

| 位置 | 处理内容 |
| --- | --- |
| 底部导航 | 过滤 `bottom_tabs` 与 `buffer_bottom_tabs`，仅保留 `index.html`、`chat_list.html`、`personal.html` 对应入口，即首页、聊天、个人中心。保留服务器返回的原有名称和顺序。 |
| 首页 | 删除 `result.dy_module.irregular_banner_dy` 对应的活动/推广横幅。 |
| 个人中心 | 删除 `personal_banner` 对应横幅。 |

不处理搜索结果广告、全部商品推荐、支付页、全部弹窗或内部 H5 页面。不存在的字段不会被创建。App 接口、字段和缓存变化可能使规则失效。

### 避免重复

墨鱼基础配置可以继续使用。不要同时启用其他修改 `api/alexa/homepage/hub` 或 `api/philo/personal/hub` 响应的拼多多净化规则。测试时可暂时关闭整份旧的拼多多页面净化插件，开屏规则可以单独保留。

强制退出拼多多后重新打开，检查底栏、首页和个人中心；页面异常时关闭本引用再重开 App。

## 可选资源

不要同时启用「底栏与横幅净化」与「仅底栏精简」。

| 文件 | 用途 | Raw 地址 |
| --- | --- | --- |
| `QuantumultX/PinduoduoBottomTabs.snippet` | 仅精简底栏，保留其他页面内容 | [直接链接](https://raw.githubusercontent.com/bbnotcode/adblock-plugins/main/QuantumultX/PinduoduoBottomTabs.snippet) |
| `QuantumultX/PinduoduoSplash.snippet` | 两条 IP 开屏素材拦截补充；同时要求 URL 与拼多多 User-Agent 匹配 | [直接链接](https://raw.githubusercontent.com/bbnotcode/adblock-plugins/main/QuantumultX/PinduoduoSplash.snippet) |

开屏补充不包含 QUIC 控制。它不需要资源解析器，不能代替页面净化。

## 来源与验证

- 接口与字段参考 [Thelongdarkorg/loon-plugins 的拼多多插件](https://github.com/Thelongdarkorg/loon-plugins/blob/main/pinduoduo_splash_ad_block.plugin)。本仓库将所需底栏、横幅处理整理为原生圈 X JQ 重写。
- `url-and-header` 与 JQ 重写语法参考 [Quantumult X 官方示例](https://github.com/crossutility/Quantumult-X/blob/master/sample.conf)。
- 已用模拟响应检查底栏过滤、横幅字段删除、无关数据保留及字段缺失情形；开屏条件已做 URL 与 User-Agent 匹配检查。
- 尚未在手机上的当前拼多多版本验证效果，不保证所有广告都能去除。

仓库不包含个人代理配置、节点订阅、访问令牌或 MITM 证书。
