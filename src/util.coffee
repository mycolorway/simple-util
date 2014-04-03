util =
  os: (->
    return {} unless navigator?

    if /Mac/.test navigator.appVersion
      mac: true
    else if /Linux/.test navigator.appVersion
      linux: true
    else if /Win/.test navigator.appVersion
      win: true
    else if /X11/.test navigator.appVersion
      unix: true
    else
      {}
  )()

  browser: (->
    ua = navigator.userAgent
    ie = /(msie|trident)/i.test(ua)
    chrome = /chrome|crios/i.test(ua)
    safari = /safari/i.test(ua) && !chrome
    firefox = /firefox/i.test(ua)

    if ie
      msie: true
      version: ua.match(/(msie |rv:)(\d+(\.\d+)?)/i)[2]
    else if chrome
      webkit: true
      chrome: true
      version: ua.match(/(?:chrome|crios)\/(\d+(\.\d+)?)/i)[1]
    else if safari
      webkit: true
      safari: true
      version: ua.match(/version\/(\d+(\.\d+)?)/i)[1]
    else if firefox
      mozilla: true
      firefox: true
      version: ua.match(/firefox\/(\d+(\.\d+)?)/i)[1]
    else
      {}
  )()

  preloadImages: (images, callback) ->
    arguments.callee.loadedImages ||= {}
    loadedImages = arguments.callee.loadedImages

    if Object.prototype.toString.call(images) is "[object String]"
      images = [images]
    else if Object.prototype.toString.call(images) isnt "[object Array]"
      return false

    for url in images
      if !loadedImages[url] or callback
        imgObj = new Image()

        if callback and Object.prototype.toString.call(callback) is "[object Function]"
          imgObj.onload = ->
            loadedImages[url] = true
            callback(imgObj)

          imgObj.onerror = ->
            callback()

        imgObj.src = url

  # cross browser transitionend event name (IE10+ Opera12+)
  transitionEnd: () ->
    if simple.browser.webkit
      'webkitTransitionEnd'
    else
      'transitionend'

  prettyDate: (d, format) ->
    return '' unless moment? and typeof moment == 'function'
    date = moment(d, format)
    now = moment()
    delta = now.diff(date)

    if delta < 0
      "刚刚"
    else if date.diff( now.clone().add( "d", -1 ).startOf( "day" )) < 0
      date.format( "M月D日" )
    else if date.diff( now.clone().startOf( "day" )) < 0
      "昨天"
    else if delta < 60000
      "刚刚"
    else if delta >= 60000 && delta < 3600000
      Math.round(delta / 60000).toFixed(0) + "分钟前"
    else if delta >= 3600000 && delta < 86400000
      Math.round(delta / 3600000).toFixed(0) + "小时前"

@simple = {} unless @simple

@simple[k] = v for k, v of util
