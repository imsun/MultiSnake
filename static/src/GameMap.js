/**
 * Created by imsun on 7/6/15.
 */
'use strict'

import {_} from './utils.js'

export class GameMap {
  constructor(config) {
    Object.assign(this, {
      id: _.uid('map'),
      width: 50,
      height: 30,
      domElement: (() => {
        let e = document.createElement('div')
        e.className = 'game-map'

        return e
      })()
    }, config)

    this.blocks = (new Array(this.height))
      .fill(null)
      .map(() =>
        (new Array(this.width))
          .fill(null)
          .map(() => {
            let e = document.createElement('div')
            e.className = 'game-map-block'
            this.domElement.appendChild(e)
            return e
          })
      )
  }
}
