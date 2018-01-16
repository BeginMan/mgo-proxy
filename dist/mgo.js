'use strict';

var MongoDB = require('mongodb');
var MongoClient = MongoDB.MongoClient;
var debug = require('debug')('koa-mongo');
var genericPool = require('generic-pool');

var defaultOptions = {
  host: 'localhost',
  port: 27017,
  db: 'test',
  max: 100,
  min: 1
};

function mongo(options) {
  options = Object.assign({}, defaultOptions, options);
  var mongoUrl = options.uri || options.url;
  if (!mongoUrl) {
    if (options.user && options.pass) {
      mongoUrl = 'mongodb://' + options.user + ':' + options.pass + '@' + options.host + ':' + options.port + '/' + options.db;
    } else {
      mongoUrl = 'mongodb://' + options.host + ':' + options.port + '/' + options.db;
    }
  }

  var mongoPool = genericPool.createPool({
    create: function create() {
      return MongoClient.connect(mongoUrl);
    },
    destroy: function destroy(client) {
      return client.close();
    }
  }, options);

  async function release(resource) {
    await mongoPool.release(resource);
    debug('Release one connection (min: %s, max: %s, poolSize: %s)', options.min, options.max, mongoPool.size);
  }

  return async function koaMongo(ctx, next) {
    return mongoPool.acquire().then(async function (mongo) {
      ctx.mongo = mongo;
      debug('Acquire one connection (min: %s, max: %s, poolSize: %s)', options.min, options.max, mongoPool.size);
      return next();
    }).then(async function () {
      await release(ctx.mongo);
    }).catch(async function (error) {
      await release(ctx.mongo);

      throw error;
    });
  };
}

module.exports = mongo;
Object.assign(module.exports, MongoDB);