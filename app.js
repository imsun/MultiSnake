/**
 * Created by imsun on 6/24/15.
 */
'use strict'

var _ = require('koa-route')
var koa = require('koa')
var app = koa()

var sendFile = require('koa-file-server')({
  index: 'index.html'
}).send

var fileRouter = function *() {
  var path = this.request.path.substr(1)
  if (path.split('/')[0] !== 'node_modules') path = 'static/' + path
  yield* sendFile(this, path)
}

app.use(_.get(/.*/, fileRouter))

app.listen(3000)
console.log('Listening on port 3000')
