# mgo-proxy
Mongodb proxy using restful-api

# Usage:

```bash
$ npm install
$ npm start
```

Specify the mongodb database and collection to query:

```bash
curl 'http://localhost:8700/api/mgo/{DB}/{Collection}'
```

# Example:

```bash
# query all
$  curl 'http://localhost:8700/api/mgo/test/coll'

# query conditions
$  curl 'http://localhost:8700/api/mgo/test/coll?name=Kili'

# query by type, default is string
$ curl "127.0.0.1:8700/api/mgo/test/coll?age=50&type=int"

# post query
$ curl -H 'Content-Type:application/json' -X POST http://localhost:8700/api/mgo/test/coll -d '{"age":{"$gt": 50}}'
```
