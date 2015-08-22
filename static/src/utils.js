/**
 * Created by imsun on 7/6/15.
 */
'use strict'

let uuid = {}

export let _ = {
  uid: (nameSpace = 'uid') => {
    uuid[nameSpace] = uuid[nameSpace] || 0
    return nameSpace + uuid[nameSpace]
  },
  hasClass: (e, className) => !!e.className.match(new RegExp(`(^| )${className}($| )`)),
  addClass: (e, className) => e.className = _.removeClass(e, className) + ` ${className}`,
  removeClass: (e, className) => e.className = e.className.replace(new RegExp(`(^| )${className}($| )`, 'g'), ' ').replace(/ +/g, ' ')
}
