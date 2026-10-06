# 拼多多页面净化（Quantumult X）

独立补充墨鱼配置，不替换主配置、订阅或证书。v1 用户反馈底栏未生效；v2 改用响应脚本，并加入命中日志。尚未在当前手机 App 上验证，不能保证有效。

## 直接引用

[底栏与横幅净化 v2](https://raw.githubusercontent.com/bbnotcode/adblock-plugins/main/QuantumultX/PinduoduoClean.snippet)

圈 X「重写 → 引用」添加，关闭本引用的资源解析器。开启重写、HTTPS 解密并信任自己的证书，确认解密列表包含 `api.pinduoduo.com`、`api.yangkeduo.com`。关闭其他修改同一拼多多接口响应的插件。

```ini
https://raw.githubusercontent.com/bbnotcode/adblock-plugins/main/QuantumultX/PinduoduoClean.snippet, tag=拼多多页面净化v2, update-interval=86400, opt-parser=false, enabled=true
```

更新引用，并刷新脚本缓存（如果客户端提供该选项），然后强制退出拼多多再打开。

## 参照其他规则处理的内容

| 位置 | 字段与处理 |
| --- | --- |
| 底栏 | `result.bottom_tabs` 和 `result.buffer_bottom_tabs`，保留首页、聊天、个人中心；未找到全部三个入口时保留原数组，避免空底栏。 |
| 首页 | 删除 `icon_set`、`search_bar_hot_query`、`dy_module.irregular_banner_dy`、`dy_module.recommend_fresh_info`；删除 `all_top_opts` 内的推广图片尺寸字段。 |
| 个人中心 | 删除 `monthly_card_entrance`、`personal_center_style_v2_vo`、`personal_banner`、`icon_set.icons`、`icon_set.top_personal_icons`。部分功能入口也会隐藏。 |
| 商品页 | 删除 `bottom_section_list`、`ui.bottom_section`、`ui.live_section.float_info`。 |
| 订单接口 | 删除 `marketing_banner_vo` 和 `shipping.banner_above_recommend`。 |

仅处理已知字段，不按名字递归删除任意数据，不拦截支付或整个首页接口。App 可能使用缓存、其他接口或其他字段。

## 如果还是完全没有变化

在圈 X 请求记录中找 `/api/alexa/homepage/hub`，并查看响应脚本日志：

- 没有 `[PDD Clean v2] homepage`：检查重写、证书信任、MITM 域名、规则冲突或是否仍使用缓存。只看到连接记录并不等于成功解密。
- 有日志且 `tabs=0`：可能没有广告导航，或返回的导航字段/链接已变化，或缺少三个核心入口。
- 日志显示删除了导航但界面不变：可能另有导航来源或 App 缓存。
- `response not processed`：响应无法按 JSON 处理，保留原响应。

日志不记录请求参数、正文或个人信息。需要进一步适配时，只提供脱敏的导航数组及日志；不要公开完整配置、Cookie、令牌或证书。

## 可选连接规则

其他规则也拦截 `titan.pinduoduo.com`，但未确认它是 v1 失效原因。

[可选分流引用](https://raw.githubusercontent.com/bbnotcode/adblock-plugins/main/Filters/PinduoduoTransport.list)：添加到「分流 → 引用」，关闭解析器。墨鱼或现有广告分流已拦截该域名时不要重复添加；连接异常时关闭此补充。

旧的 `PinduoduoBottomTabs.snippet` 为 v1 JQ 写法，不要与 v2 同时启用。`PinduoduoSplash.snippet` 是独立开屏补充，不处理页面底栏。

## 参考与验证

- [ZenmoFeiShi/Qx 原生圈 X 拼多多规则](https://github.com/ZenmoFeiShi/Qx/blob/main/Pinduoduo.snippet)，文件注明 2025-11-01、App 7.79.0。
- [Thelongdarkorg/loon-plugins 拼多多规则](https://github.com/Thelongdarkorg/loon-plugins/blob/main/pinduoduo_splash_ad_block.plugin)，文件注明更新 2026-09-18。
- [Quantumult X 官方配置示例](https://github.com/crossutility/Quantumult-X/blob/master/sample.conf)。

参考接口和字段后独立实现响应脚本。已检查模拟底栏、推广位、无关数据保留、缺失字段、JSON 解析失败回退和 URL 匹配；模拟测试不代表当前手机 App 效果。
