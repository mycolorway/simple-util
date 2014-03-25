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
