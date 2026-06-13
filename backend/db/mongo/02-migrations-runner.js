/**
 * 02-migrations-runner.js
 */

const dbName = process.env.MONGO_INITDB_DATABASE || 'efes-db';
const targetDb = db.getSiblingDB(dbName);

const migrations = [
    '01-invoice.js',
    '02-logs.js',
];

// Helper functions
const createOrModify = (db, name, options) => {
    const existing = db.getCollectionNames();

    if (existing.includes(name)) {
        print(`[~] Collection already exists, updating validator: ${name}`);
        db.runCommand({ collMod: name, ...options });
    } else {
        print(`[+] Creating collection: ${name}`);
        db.createCollection(name, options);
    }
};
 
const ensureIndex = (db, collection, spec, options = {}) => {
    db.getCollection(collection).createIndex(spec, { background: true, ...options });
};

// Running part
print("=== Migrating MongoDB ===");

migrations.forEach(scriptName => {
    try {
        print(`\n=> Loading: ${scriptName}`);

        load(`/docker-entrypoint-initdb.d/migrations/${scriptName}`);
        migrate(targetDb, { createOrModify, ensureIndex });

        print(`[+] ${scriptName} applied`);
    } catch (e) {
        print(`[!] Error when running ${scriptName}: ${e}`);
        quit(1);
    }
});

print("\n=== Migrations successful ===");