// @NOTE: execute the script to create de database and its content -> mongo src/db/mongo-create-db.js or mongo localhost:27017 src/db/mongo-create-db.js
// connect to mongo nsk database
print('Connecting to MongoDB NSK database');
connection = new Mongo();
db = connection.getDB('nsk');

// create bear collection by saving a document
print('Droping existing Bear collection');
db.bears.drop();

print('Creating new Bear collection');
db.bears.save({ name: 'Teddy' });
db.bears.save({ name: 'Mimosín' });
db.bears.save({ name: 'Micha' });

print('Showing Bear documents');
const bearCursor = db.bears.find({});

while (bearCursor.hasNext()) {
  printjson(bearCursor.next());
}
