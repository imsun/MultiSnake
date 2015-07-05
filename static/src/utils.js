/**
 * Created by imsun on 7/6/15.
 */
'use strict'

let uuid = {}

export let _ = {
  uuid: (nameSpace = 'uuid') => {
    uuid[nameSpace] = uuid[nameSpace] || 0
    return nameSpace + uuid[nameSpace]
  }
}
