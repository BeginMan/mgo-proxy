'use strict';

const koa = require('koa');
const logger = require('koa-logger');
const Router = require('koa-router');
const mongo = require('./mgo');

const app = new koa();

app.use(logger());
app.use(mongo());


// handler errror
const handler = async (ctx, next) => {
  try {
    await next();
  } catch(err) {
    ctx.response.status = err.statusCode || err.status || 500;
    ctx.response.body = {'errmsg': err.message}
    ctx.app.emit('error', err, ctx);
  }
}

app.use(handler);

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

app.listen(8700, () => {
  console.log('listening on port 8700');
});
