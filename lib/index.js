;(function bootstrap(global, factory) {
  if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = factory()
  } else if (typeof define === 'function' && define.amd) {
    define([], factory())
  } else if (typeof exports === 'object') {
    exports['delegate'] = factory()
  } else {
    global['delegate'] = factory()
  }
})(this, function() {
  const map = Object.create(null)

  const dataPriv = {
    get: function(elem) {
      if (!map[elem]) {
        return this.set(elem)
      } else {
        return map[elem]
      }
    },
    set: function(elem) {
      var o = Object.create(null)
      map[elem] = o

      return o
    },
    remove: function(elem, key) {
      var cache = map[elem]

      if (cache === undefined) {
        return
      }

      if (key !== undefined) {
        cache[key] = undefined
        delete cache[key]
      }
    }
  }

  function handle(event, handlers) {
    var i,
      handleObj,
      sel,
      matchedHandlers,
      matchedSelectors,
      handlerQueue = [],
      delegateCount = handlers.delegateCount,
      cur = event.target

    if (delegateCount && cur.nodeType) {
      for (; cur !== this; cur = cur.parentNode || this) {
        if (cur.nodeType === 1) {
          matchedHandlers = []
          matchedSelectors = Object.create(null)

          for (i = 0; i < delegateCount; i++) {
            handleObj = handlers[i]

            sel = handleObj.selector + ' '

            if (matchedSelectors[sel] === undefined) {
              var els = document.getElementsByClassName(sel)

              var len = 0
              for (var i = 0, il = els.length; i < il; i++) {
                if (els[i] === cur) {
                  len++
                }
              }

              matchedSelectors[sel] = len
            }

            if (matchedSelectors[sel]) {
              matchedHandlers.push(handleObj)
            }
          }

          if (matchedHandlers.length) {
            handlerQueue.push({ elem: cur, handlers: matchedHandlers })
          }
        }
      }
    }

    return handlerQueue
  }

  function dispatch(nativeEvent) {
    var event = nativeEvent

    var i = 0,
      j = 0,
      matched,
      handleObj,
      handlerQueue,
      args = new Array(arguments.length),
      handlers = dataPriv.get(this)['events'][event.type]

    args[0] = event

    for (i = 1; i < arguments.length; i++) {
      args[i] = arguments[i]
    }

    handlerQueue = handle.call(this, event, handlers)

    i = 0
    while ((matched = handlerQueue[i++])) {
      event.currentTarget = matched.elem

      j = 0
      while ((handleObj = matched.handlers[j++])) {
        handleObj.handler.apply(matched.elem, args)
      }
    }
  }

  function on(elem, type, handler, selector) {
    var eventHandle,
      handlers,
      events,
      handleObj,
      elemData = dataPriv.get(elem)

    if (!(events = elemData.events)) {
      events = elemData.events = Object.create(null)
    }

    if (!(eventHandle = elemData.handle)) {
      eventHandle = elemData.handle = function(e) {
        return dispatch.apply(elem, arguments)
      }
    }

    handleObj = {
      type: type,
      handler: handler,
      selector: selector
    }

    if (!(handlers = events[type])) {
      handlers = events[type] = []
      handlers.delegateCount = 0
    }

    elem.addEventListener && elem.addEventListener(type, eventHandle)

    if (selector) {
      handlers.splice(handlers.delegateCount++, 0, handleObj)
    } else {
      handlers.push(handleObj)
    }
  }

  // TODO: off
  function off(elem, type, handler, selector) {}

  return {
    on,
    off
  }
})
