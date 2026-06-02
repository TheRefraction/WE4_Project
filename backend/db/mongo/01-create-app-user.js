const dbName = process.env.MONGO_INITDB_DATABASE || 'efes-db';
const appUser = process.env.MONGO_APP_USER;
const appPassword = process.env.MONGO_APP_PASSWORD;

if (!appUser) {
  throw new Error('missing MONGO_APP_USER');
}

if (!appPassword) {
  throw new Error('missing MONGO_APP_PASSWORD');
}

db = db.getSiblingDB(dbName);

db.createUser({
  user: appUser,
  pwd: appPassword,
  roles: [
    { role: 'readWrite', db: dbName }
  ]
});