'use strict';

const koa = require('koa');
const logger = require('koa-logger');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mongo = require('./mgo');

const app = new koa();

app.use(logger());
app.use(mongo());
app.use(bodyParser());


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


function parseType(type) {
  switch (type) {
    case 'int':
    return parseInt
    case 'float':
    return parseFloat
    case 'bool':
    return eval
    default:
      console.error(`unsupport type:${type}`)
      return eval
  }
}

app.use(handler);

var router = new Router({
  prefix: '/api/mgo'
});

router.get('/:db/:collection', async (ctx, next) =>{
  ctx.response.type = 'json';
  let queryData = ctx.request.query;
  let typeFlag = queryData.type
  if (typeFlag !== undefined && typeFlag !== 'string') {
    delete queryData.type;
    for(let k in queryData) {
      queryData[k] = parseType(typeFlag)(queryData[k])
    }
  }
  const collection = ctx.mongo.db(ctx.params.db).collection(ctx.params.collection);
  let res = await collection.find(queryData).toArray();
  ctx.body = {'data': res}
});

router.post('/:db/:collection', async (ctx, next) =>{
  ctx.response.type = 'json';
  const collection = ctx.mongo.db(ctx.params.db).collection(ctx.params.collection);
  let body = ctx.request.body;
  let res = await collection.find(body).toArray();
  ctx.body = {'data': res}
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8700, () => {
  console.log('listening on port 8700');
});
