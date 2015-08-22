/**
 * Created by imsun on 7/6/15.
 */
'use strict'

import {_} from './utils.js'
import {Snake} from './Snake.js'

let map

export let Food = {
  current: {},
  set map(value) {
    map = value
  },
  get map() {
    if (!map) throw new Error('Food should be bound to a map.')
    return map;
  },
  isFood(block) {
    return _.hasClass(block, 'food')
  },
  newFood(position) {
    position = position || {}
    let x = position.x || Math.floor(Math.random() * Food.map.width)
    let y = position.y || Math.floor(Math.random() * Food.map.height)
    function genPosition() {
      x = Math.floor(Math.random() * Food.map.width)
      y = Math.floor(Math.random() * Food.map.height)
      if (Snake.isSnake(Food.map.blocks[y][x])) genPosition()
    }
    if (Snake.isSnake(Food.map.blocks[y][x])) genPosition()

    Food.onNewFood({x, y})
    return {x, y}
  },
  putFood(position) {
    _.addClass(Food.map.blocks[position.y][position.x], 'food')
    Food.current = position
  },
  eat() {
    if (Food.isFood(Food.map.blocks[Food.current.y][Food.current.x])) {
      _.removeClass(Food.map.blocks[Food.current.y][Food.current.x], 'food')
    }
    Food.newFood()
  },
  onNewFood() {}
}
