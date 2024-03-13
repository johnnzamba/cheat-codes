//     Device.js
//     (c) 2012 Matthew Hudson
//     Webpipe.js is freely distributable under the MIT license.
//     For all details and documentation:
//     http://www.matthewghudson.com/projects/device.js/
(function () {
  // Baseline setup
  // --------------

  // Establish the root object, 'window' in the browser,
  // or 'global' on the server.
  const root = this

  // Create a reference to the device object for use below.
  const device = {}

  // The <html> element.
  const docElement = window.document.documentElement

  // The client UserAgent string.
  const userAgent = window.navigator.userAgent.toLowerCase()

  // Export the Webpipe object for **Node.js**, with
  // backwards-compatibility for the old 'require()' API. If we're in
  // the browser, add 'device' as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = device
    }
    exports.device = device
  } else {
    root.device = device
  }

  // Main functions
  // --------------

  device.ios = function () {
    return (device.iphone() || device.ipod() || device.ipad())
  }

  device.iphone = function () {
    return !!userAgent.match(/iphone/i)
  }

  device.ipod = function () {
    return !!userAgent.match(/ipod/i)
  }

  device.ipad = function () {
    return !!userAgent.match(/ipad/i)
  }

  device.android = function () {
    return !!userAgent.match(/android/i)
  }

  device.androidPhone = function () {
    return !!((device.android() && userAgent.match(/mobile/i)))
  }

  // See: http://android-developers.blogspot.com/2010/12/android-browser-user-agent-issues.html
  device.androidTablet = function () {
    return !!((device.android() && !userAgent.match(/mobile/i)))
  }

  device.blackberry = function () {
    return !!userAgent.match(/blackberry/i)
  }

  device.blackberryPhone = function () {
    return !!((device.blackberry() && !userAgent.match(/tablet/i)))
  }

  // See: http://supportforums.blackberry.com/t5/Web-and-WebWorks-Development/How-to-detect-the-BlackBerry-Browser/ta-p/559862
  device.blackberryTablet = function () {
    return !!userAgent.match(/rim tablet/i)
  }

  device.windowsPhone = function () {
    return !!userAgent.match(/windows phone/i)
  }

  device.mobile = function () {
    return (device.androidPhone() || device.iphone() || device.ipod() || device.windowsPhone() || device.blackberryPhone())
  }

  device.tablet = function () {
    return (device.ipad() || device.androidTablet() || device.blackberryTablet())
  }

  device.portrait = function () {
    return Math.abs(window.orientation) !== 90
  }

  device.landscape = function () {
    return Math.abs(window.orientation) === 90
  }

  // Private Utility
  // ---------------

  // If #debug selector exists, insert debug information.
  const debug = function () {
    const debugElement = window.document.getElementById('debug')
    if (debugElement) {
      debugElement.innerHTML =
        '<h4>DEBUG</h4>' +
        '<p>UA String: ' + userAgent + '</p>' +
        '<p>Dimensions: ' + window.innerWidth + 'x' + window.innerHeight + '</p>' +
        '<p>Orientation: ' + window.orientation + '</p>' +
        '<p>CSS Classes: ' + docElement.className + '</p>'
    }
  }

  // Check if docElement already has a given class.
  const hasClass = function (className) {
    const regex = new RegExp(className, 'i')
    return docElement.className.match(regex)
  }

  // Add one or more CSS classes to the <html> element.
  const addClass = function (className) {
    if (!hasClass(className)) {
      docElement.className += ' ' + className
    }
  }

  // Remove single CSS class from the <html> element.
  const removeClass = function (className) {
    if (hasClass(className)) {
      docElement.className = docElement.className.replace(className, '')
    }
  }

  // HTML Element Handling
  // ---------------------

  // Insert the appropriate CSS class based on the UserAgent.
  if (device.ios()) {
    if (device.ipad()) {
      addClass('ios ipad tablet')
    } else if (device.iphone()) {
      addClass('ios iphone mobile')
    } else if (device.ipod()) {
      addClass('ios ipod mobile')
    }
  } else if (device.android()) {
    if (device.androidTablet()) {
      addClass('android tablet')
    } else {
      addClass('android mobile')
    }
  } else if (device.blackberry()) {
    if (device.blackberryTablet()) {
      addClass('blackberry tablet')
    } else {
      addClass('blackberry mobile')
    }
  } else if (device.windowsPhone()) {
    addClass('windows mobile')
  } else {
    addClass('desktop')
  }

  // Orientation Handling
  // --------------------

  // Handle device orientation changes
  const checkOrientation = function () {
    if (device.landscape()) {
      removeClass('portrait')
      addClass('landscape')
    } else {
      removeClass('landscape')
      addClass('portrait')
    }
    debug()
  }

  // Detect whether device supports orientationchange event,
  // otherwise fall back to the resize event.
  const supportsOrientationChange = 'onorientationchange' in window
  const orientationEvent = supportsOrientationChange ? 'orientationchange' : 'resize'

  // Listen for changes in orientation.
  window.addEventListener(orientationEvent, checkOrientation, false)

  checkOrientation()
}).call(this)
