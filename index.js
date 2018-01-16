'use strict';

const koa = require('koa');
const logger = require('koa-logger');
const Router = require('koa-router');
const mongo = require('./mgo');

const app = new koa();

app.use(logger());
app.use(mongo());

var router = new Router({
  prefix: '/api/mgo'
});

router.get('/:db/:collection', async (ctx, next) =>{
  ctx.response.type = 'json';
  const collection = ctx.mongo.db(ctx.params.db).collection(ctx.params.collection);
  ctx.body = await collection.find(ctx.request.query).toArray();
});
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8765, () => {
  console.log('listening on port 8765');
});