/**
 * Created by imsun on 7/6/15.
 */
'use strict'

import {_} from './utils.js'
import {Food} from './Food.js'

let snakes = {}

export class Snake {
  static get snakes() {
    return snakes
  }
  static isSnake(block) {
    return _.hasClass(block, 'snake')
  }
  static directionForKeyCode(keyCode) {
    let direction
    switch(keyCode) {
      case Snake.key.UP:
        direction = {x: 0, y: -1}
        break
      case Snake.key.LEFT:
        direction = {x: -1, y: 0}
        break
      case Snake.key.DOWN:
        direction = {x: 0, y: 1}
        break
      case Snake.key.RIGHT:
        direction = {x: 1, y: 0}
        break
    }
    return direction
  }
  constructor(config) {
    Object.assign(this, {
      id: _.uid('snake'),
      direction: {
        x: 1,
        y: 0
      },
      head: {
        x: 4,
        y: 4
      }
    }, config)

    snakes[this.id] = this

    if (!this.map) {
      throw new Error('Snake should init with map.')
    }

    let headBlock = this.map.blocks[this.head.y][this.head.x]
    _.addClass(headBlock, 'snake')
    _.addClass(headBlock, this.className)
    this.length = 1
    this.body = [Object.assign({}, this.head)]
  }
  get tail() {
    return this.body[0]
  }
  go(direction) {
    if (direction && direction.x + this.direction.x === 0 && direction.y + this.direction.y === 0) return
    direction = direction || {}
    Object.assign(this.direction, direction)
    this.head.x += this.direction.x
    this.head.y += this.direction.y

    if (!(this.head.x >= 0
      && this.head.x < this.map.width
      && this.head.y >=0
      && this.head.y < this.map.height
      && !Snake.isSnake(this.map.blocks[this.head.y][this.head.x]))) {
      if (this.onDead) {
        this.onDead(this)
      }
      return
    }

    let headBlock = this.map.blocks[this.head.y][this.head.x]
    let tailBlock = this.map.blocks[this.tail.y][this.tail.x]

    this.body.push(Object.assign({}, this.head))
    _.addClass(headBlock, 'snake')
    _.addClass(headBlock, this.className)

    if (Food.isFood(headBlock)) Food.eat()
    else {
      this.body.shift()
      _.removeClass(tailBlock, 'snake')
      _.removeClass(tailBlock, this.className)
    }
  }
  goOnKey(keyCode) {
    this.go(Snake.directionForKeyCode(keyCode))
  }
}

Snake.key = {
  UP: 119, // 'w'
  LEFT: 97, // 'a'
  DOWN: 115, // 's'
  RIGHT: 100 // 'd'
}
