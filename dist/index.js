'use strict';

var koa = require('koa');
var logger = require('koa-logger');
var Router = require('koa-router');
var mongo = require('./mgo');

var app = new koa();

app.use(logger());
app.use(mongo());

var router = new Router({
  prefix: '/api/mgo'
});

router.get('/:db/:collection', async function (ctx, next) {
  ctx.response.type = 'json';
  var collection = ctx.mongo.db(ctx.params.db).collection(ctx.params.collection);
  ctx.body = await collection.find(ctx.request.query).toArray();
});
app.use(router.routes()).use(router.allowedMethods());

app.listen(8765, function () {
  console.log('listening on port 8765');
});