# NSK - Node/Express Starter Kit 

### Features:
- Static web server
- Dynamic web server (MVC): uses MongoDB for the models, pug for the views
- Rest API server: mocking functionality included
- Socket Server: uses socketIO
- Databases: connection: MongoDB, InfluxDB.

### Installation:
##### Clone the repository 
_$ git clone url_repo target_folder/_

##### Install Node JS
_$ brew install node_
 
##### Install project dependencies
_$ cd target_folder_<br/>
_$ npm install_

##### Start the development server (this npm task launches it with nodemon watcher)
_$ npm start_

##### Install MongoDB, start the service  and run the initialize DB script
_$ brew install mongo_<br/>
_$ brew services start mongo_<br/>
_$ mongo localhost:27017 src/db/mongo/mongo-create-db.js_<br/>

##### Install InfluxDB and start the service (install other Influx Data TICK products if needed)
_$ brew install influxdb_<br/>
_$ brew services start influxdb_<br/>
_$ influxdb_<br/>
_$influx -import -path=src/db/influx/influx-create-db.sql -precision=s_


### Test the features
- Access MVC test page with the browser<br/>
_http://localhost:4000/test_

- Access API Rest test webservice with the browser (or any other app such as Postman)<br/>
_http://localhost:4000/api_

- Access API Rest test mock with the browser (or any other app such as Postman)<br/>
_http://localhost:4000/api/test_

- Access socket demo application with the browser<br/>
_http://localhost:4000/socket-test_

- Access MongoDB Bear test collection documents (or any other app such as Postman)<br/>
_http://localhost:4000/api/bears_

_* To test API Endpoints (API and MongoDB) you can use the provided Postman Collection file (api/NSK.postman_collection.json)._ 


### Configuration
You can change NSK's configuration to suit your needs. Configuration options include:

- Development server: port
- Development SSL server: enable and port
- Database: enable, host, and database name and type
- Socket server: enable and port
- Routers (static/dynamic/api/mock): enable, host and prefix 

_* Config file located at src/config/server.js_

