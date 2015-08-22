/**
 * Created by imsun on 6/24/15.
 */
'use strict'

import {GameMap} from './GameMap.js'
import {Snake} from './Snake.js'
import {Food} from './Food.js'

let socket = window.socket = io()

let Game = {
  status: 0,
  get hasStarted() {
    return Game.status > 0
  },
  get hasEnded() {
    return Game.status === 2
  },
  start() {
    Game.status = 1
  },
  end() {
    Game.status = 2
  },
  create() {
    let map = new GameMap()
    window.map = map

    window.hostSnake = new Snake({
      id: User.id,
      map,
      className: 'host'
    })
    window.hostSnake.onDead = function() {
      Game.end()
      notice('你输了');
    }

    Food.map = map

    $('#mapBg').html(map.domElement)
  }
}

let User = {
  loginResolve: null,
  checkLogin() {
    let uid = localStorage.getItem('uid')
    if (!uid) {
      $('#loginModal').modal()
      return new Promise(function(resolve) {
        User.loginResolve = resolve
      })
    }
    else {
      return new Promise(resolve => resolve({
        id: localStorage.getItem('uid'),
        name: localStorage.getItem('uname')
      }))
    }
  }
}
let Room = {
  id: null,
  roomResolve: null,
  create(userInfo) {
    return new Promise(resolve => {
      Room.roomResolve = resolve
      socket.emit('room', {
        userId: User.id
      })
    })
  }
}

socket.on('room', function(msg) {
  Room.id = msg.roomId
  Room.roomResolve(msg.roomId)
})

$('#loginBtn').on('click', function() {
  $.post('/user', {
    name: $('#loginName').val()
  }, function(res) {
    if (res.code) {
      alert(res.msg)
    }
    else {
      User.id = res.data.id
      User.name = res.data.name
      localStorage.setItem('uid', res.data.id)
      localStorage.setItem('uname', res.data.name)

      $('#loginModal').modal('hide')
      if (User.loginResolve) {
        User.loginResolve(res.data)
      }
    }
  })
})

$('#newGameBtn').on('click', function() {
  User.checkLogin()
    .then(function(user) {
      Object.assign(User, user)
      return Room.create(user)
    })
    .then(function(roomId) {
      $('#roomHref').text(location.href + '#' + roomId)
      $('#roomHref').attr('href', location.href + '#' + roomId)
      $('#roomModal').modal()
      Game.create()
    })
})

function notice(msg) {
  $('#noticeMsg').text(msg)
  $('#noticeModal').modal()
}

document.body.addEventListener('keypress', function(event) {
  if (!Game.hasStarted) return
  let direction = Snake.directionForKeyCode(event.keyCode)
  socket.emit('move', {
    userId: User.id,
    roomId: Room.id,
    keyCode: event.keyCode
  })
})

Food.onNewFood = function(position) {
  socket.emit('food', {
    roomId: Room.id,
    position
  })
}

socket.on('action', function(msg) {
  if (Game.hasEnded) return
  console.log(msg)
  if (!msg[msg.host]) Snake.snakes[msg.host].go()
  else Snake.snakes[msg.host].go(Snake.directionForKeyCode(msg[msg.host]))
  if (!msg[msg.client]) Snake.snakes[msg.client].go()
  else Snake.snakes[msg.client].go(Snake.directionForKeyCode(msg[msg.client]))
  if (msg.food) {
    Food.putFood(msg.food)
  }
  $('#countDownLabel').text('剩余时间：' + msg.countDown)
  if (msg.countDown <= 0) {
    if (window.hostSnake.body.length === window.clientSnake.body.length) {
      notice('平局')
    }
    else {
      let longestSnake
      if (window.hostSnake.body.length > window.clientSnake.body.length) longestSnake = window.hostSnake
      else longestSnake = window.hostSnake

      if (longestSnake.id == User.id) notice('你赢了')
      else notice('你输了')
    }
    Game.end()
  }
})

socket.on('client ready', function(msg) {
  window.clientSnake = new Snake({
    id: msg.client,
    head: {
      x: map.width - 5,
      y: map.height - 5
    },
    direction: {
      x: -1,
      y: 0
    },
    map,
    className: 'client'
  })
  window.clientSnake.onDead = function() {
    Game.end()
    notice('你赢了')
  }
  $('#gameBar').show()
})

socket.on('client', function(msg) {
  let map = new GameMap()
  window.hostSnake = new Snake({
    id: msg.host,
    map,
    className: 'host'
  })
  window.hostSnake.onDead = function() {
    Game.end()
    notice('你赢了');
  }

  window.clientSnake = new Snake({
    id: User.id,
    head: {
      x: map.width - 5,
      y: map.height - 5
    },
    direction: {
      x: -1,
      y: 0
    },
    map,
    className: 'client'
  })
  window.clientSnake.onDead = function() {
    Game.end()
    notice('你输了')
  }

  Food.map = map
  Food.newFood()

  $('#mapBg').html(map.domElement)
})

$('#startGameBtn').on('click', function() {
  Game.start()
  socket.emit('start', {
    roomId: Room.id
  })
})

User.checkLogin()
  .then(function(user) {
    Object.assign(User, user)
    $('#userNameLabel').text(user.name)
    if (location.hash) {
      Room.id = location.hash.substr(1)
      socket.emit('join', {
        userId: User.id,
        roomId: Room.id
      })
    }
  })
