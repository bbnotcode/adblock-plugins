/*
 * 拼多多页面净化 v2 - Quantumult X
 * 字段参考 ZenmoFeiShi/Qx/Pinduoduo.snippet 与 Thelongdarkorg/loon-plugins。
 * 只处理已知字段；不记录 URL 参数、用户数据或响应正文。
 */
(function () {
  var counts = { tabs: 0, fields: 0 };
  function remove(obj, key) {
    if (obj && typeof obj === 'object' && Object.prototype.hasOwnProperty.call(obj, key)) {
      delete obj[key]; counts.fields++;
    }
  }
  function tabs(obj, key) {
    if (!obj || !Array.isArray(obj[key])) return;
    var original = obj[key];
    var allowed = ['index.html', 'chat_list.html', 'personal.html'];
    var kept = original.filter(function (tab) {
      return tab && typeof tab.link === 'string' && allowed.indexOf(tab.link.split(/[?#]/)[0]) !== -1;
    });
    // 未找到全部三个核心入口时保留原数组，避免接口变更后产生空底栏。
    if (!allowed.every(function (link) { return kept.some(function (tab) { return tab.link.split(/[?#]/)[0] === link; }); })) return;
    counts.tabs += original.length - kept.length;
    obj[key] = kept;
  }
  try {
    var body = JSON.parse($response.body);
    var path = $request.url.replace(/^https?:\/\/[^/]+/, '').split('?')[0];
    var name = 'unknown';
    if (/^\/api\/alexa\/homepage\/hub\/?$/.test(path)) {
      name = 'homepage';
      var result = body.result;
      tabs(result, 'bottom_tabs'); tabs(result, 'buffer_bottom_tabs');
      remove(result, 'icon_set'); remove(result, 'search_bar_hot_query');
      if (result) {
        remove(result.dy_module, 'irregular_banner_dy');
        remove(result.dy_module, 'recommend_fresh_info');
        if (Array.isArray(result.all_top_opts)) result.all_top_opts.forEach(function (opt) {
          ['selected_image', 'image', 'height', 'width'].forEach(function (key) { remove(opt, key); });
        });
      }
    } else if (/^\/api\/philo\/personal\/hub\/?$/.test(path)) {
      name = 'personal';
      ['monthly_card_entrance', 'personal_center_style_v2_vo', 'personal_banner'].forEach(function (key) { remove(body, key); });
      remove(body.icon_set, 'icons'); remove(body.icon_set, 'top_personal_icons');
    } else if (/^\/api\/oak\/integration\/render\/?$/.test(path)) {
      name = 'goods';
      remove(body, 'bottom_section_list'); remove(body.ui, 'bottom_section');
      if (body.ui) remove(body.ui.live_section, 'float_info');
    } else if (/^\/order\//.test(path)) {
      name = 'order'; remove(body, 'marketing_banner_vo'); remove(body.shipping, 'banner_above_recommend');
    }
    console.log('[PDD Clean v2] ' + name + ': removed tabs=' + counts.tabs + ', fields=' + counts.fields);
    $done({ body: JSON.stringify(body) });
  } catch (error) {
    console.log('[PDD Clean v2] response not processed; original body retained');
    $done({});
  }
})();
