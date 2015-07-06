/**
 * Created by imsun on 7/6/15.
 */
'use strict'

import {_} from './utils.js'
import {Food} from './Food.js'

export class Snake {
  static isSnake(block) {
    return _.hasClass(block, 'snake')
  }
  constructor(config) {
    Object.assign(this, {
      id: _.uuid('snake'),
      direction: {
        x: 1,
        y: 0
      },
      head: {
        x: 4,
        y: 4
      }
    }, config)

    if (!this.map) {
      throw new Error('Snake should init with map.')
    }

    let headBlock = this.map.blocks[this.head.y][this.head.x]
    _.addClass(headBlock, 'snake')
    _.addClass(headBlock, this.id)
    this.length = 1
    this.body = [Object.assign({}, this.head)]
  }
  get tail() {
    return this.body[0]
  }
  go(direction) {
    Object.assign(this.direction, direction)
    this.head.x += this.direction.x
    this.head.y += this.direction.y

    if (!(this.head.x >= 0
      && this.head.x < this.map.width
      && this.head.y >=0
      && this.head.y < this.map.height
      && !Snake.isSnake(map.blocks[this.head.y][this.head.x]))) {
      alert(`${this.id} died!`)
      return
    }

    let headBlock = map.blocks[this.head.y][this.head.x]
    let tailBlock = map.blocks[this.tail.y][this.tail.x]

    this.body.push(Object.assign({}, this.head))
    _.addClass(headBlock, 'snake')
    _.addClass(headBlock, this.id)

    if (Food.isFood(headBlock)) Food.eat()
    else {
      this.body.shift()
      _.removeClass(tailBlock, 'snake')
      _.removeClass(tailBlock, this.id)
    }
  }
}
