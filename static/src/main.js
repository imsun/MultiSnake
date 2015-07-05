/**
 * Created by imsun on 6/24/15.
 */
'use strict'

import {GameMap} from './GameMap.js'

var map = new GameMap()
window.map = map
document.body.appendChild(map.domElement)
