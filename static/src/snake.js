/**
 * Created by imsun on 7/6/15.
 */
'use strict'

import _ from './utils.js'

export class Snake {
  constructor() {
    this.id = _.uuid('snake')
    this.length = 1
  }
}
