/**
 * Created by imsun on 6/24/15.
 */
'use strict'

var app = require('koa.io')()
var router = require('koa-router')()
var bodyParser = require('koa-body-parser')

var Rooms = {}
var Users = {}
var UserNameMap = {}

var sendFile = require('koa-file-server')({
  index: 'index.html'
}).send

var fileRouter = function *() {
  var path = this.request.path.substr(1)
  if (path.split('/')[0] !== 'node_modules') path = 'static/' + path
  yield* sendFile(this, path)
}

app.io.route('start', function *(next, msg) {
  var room = Rooms[msg.roomId]
  if (!room.client) return

  room.countDown = 120

  var start = (function() {
    var res = {
      host: room.host,
      client: room.client,
      countDown: room.countDown,
      food: room.food
    }
    res[room.host] = room[room.host]
    res[room.client] = room[room.client]
    room.hostSocket.emit('action', res)
    room.clientSocket.emit('action', res)

    room[room.host] = null
    room[room.client] = null
    room.food = null
    if (room.countDown-- <= 0) clearInterval(interval)
  }).bind(this)
  var interval = setInterval(start, 200)
})

app.io.route('room', function *(next, msg) {
  var roomId
  do {
    roomId = Math.floor(Math.random() * 10000000).toString()
  } while (Rooms[roomId])
  Rooms[roomId] = {
    host: msg.userId,
    hostSocket: this
  }
  this.emit('room', {
    roomId: roomId
  })
})

app.io.route('join', function *(next, msg) {
  var room = Rooms[msg.roomId]
  room.client = msg.userId
  room.clientSocket = this
  room.clientSocket.emit('client', {
    host: room.host,
    client: room.client
  })
  room.hostSocket.emit('client ready', {
    host: room.host,
    client: room.client
  })
})

app.io.route('move', function *(next, msg) {
  Rooms[msg.roomId][msg.userId] = msg.keyCode
})

app.io.route('food', function *(next, msg) {
  Rooms[msg.roomId].food = msg.position
})

app.use(bodyParser())

router
  .post('/user', function *() {
    var query = this.request.body
    var res = {}
    if (UserNameMap[query.name]) {
      res = {
        code: 1,
        msg: '用户名已被占用'
      }
    }
    else {
      var user = {
        id: Math.random().toString(),
        name: query.name
      }
      Users[user.id] = user
      UserNameMap[user.name] = user
      res = {
        code: 0,
        data: {
          id: user.id,
          name: user.name
        }
      }
    }
    this.body = res
  })
  .get(/.*/, fileRouter)

app.use(router.routes())

app.listen(3000)
console.log('Listening on port 3000')
