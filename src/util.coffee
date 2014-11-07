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
    el = document.createElement('fakeelement')
    transitions =
      'transition':'transitionend'
      'MozTransition':'transitionend'
      'WebkitTransition':'webkitTransitionEnd'

    for t of transitions
      if el.style[t] isnt undefined
        return transitions[t]

  readableDate: (date, opts) ->
    return '' unless moment? and typeof moment == 'function'
    return '' unless date.isValid()

    defaultOpts =
      defaultFormat: false
      currentWeek: false
      nextWeek: false

    defaultOpts[key] = val for key, val of opts
    opts = defaultOpts

    date = date.clone().startOf('day')
    if date._z
      today = moment.tz(date._z.name).startOf('d')
    else
      today = moment().startOf('d')
    tomorrow = today.clone().add(1, 'd')
    yesterday = today.clone().add(-1, 'd')

    return "今天" if date.isSame(today)
    return "明天" if date.isSame(tomorrow)
    return "昨天" if date.isSame(yesterday)

    if opts.currentWeek and date.isSame(today, 'isoweek')
      return "本周#{ moment.weekdaysMin()[date.isoWeekday()%7] }"

    if opts.nextWeek and date.isSame(today.add(1, 'week'), 'isoweek')
      return "下周#{ moment.weekdaysMin()[date.isoWeekday()%7] }"

    if opts.defaultFormat
      return date.format(opts.defaultFormat)

    unless date.isSame(today, 'year')
      return date.format('YY年M月D日')

    date.format('M月D日')

  readableTime: (datetime) ->
    return '' unless moment? and typeof moment == 'function'
    return '' unless datetime.isValid()

    if datetime._z
      now = moment.tz(datetime._z.name)
    else
      now = moment()
    yesterday = now.clone().startOf('day').add(-1, 'd')
    delta = now.diff(datetime)

    return '刚刚' if now.diff(datetime, 'minutes') < 1
    return "昨天" if yesterday.isSame(datetime.clone().startOf('day'))

    if now.diff(datetime, 'hours') < 1
      return "#{ now.diff(datetime, 'minutes') }分钟前"

    if now.diff(datetime, 'days') < 1
      return "#{ now.diff(datetime, 'hours') }小时前"

    if now.diff(datetime, 'years') < 1
      return datetime.format('M月D日')

    datetime.format('YY年M月D日')

  # a wrapper of localStorage & sessionStorage
  storage:
    supported: () ->
      try
        localStorage.setItem '_storageSupported', 'yes'
        localStorage.removeItem '_storageSupported'
        return true
      catch e
        return false
    set: (key, val, session = false) ->
      return unless @supported()
      storage = if session then sessionStorage else localStorage
      storage.setItem key, val

    get: (key, session = false) ->
      return unless @supported()
      storage = if session then sessionStorage else localStorage
      storage[key]

    remove: (key, session = false) ->
      return unless @supported()
      storage = if session then sessionStorage else localStorage
      storage.removeItem key


