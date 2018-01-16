# mgo-proxy
Mongodb proxy using restful-api

# Usage:

```bash
$ npm install
$ npm start
```

Specify the mongodb database and collection to query:

```bash
curl 'http://localhost:8765/api/mgo/{DB}/{Collection}'
```

# Example:

```bash
# query all
$  curl 'http://localhost:8765/api/mgo/test/coll'

# query conditions
$  curl 'http://localhost:8765/api/mgo/test/coll?name=Kili'
```