/**
 * 02-invoice.js
 */

const dbName = process.env.MONGO_INITDB_DATABASE || 'efes-db';
const logTTLDays = 90;
 
// Helpers
const db = db.getSiblingDB(dbName);
 
function createOrModify(name, options) {
    const existing = db.getCollectionNames();

    if (existing.includes(name)) {
        print(`[~] Collection already exists, updating validator: ${name}`);
        db.runCommand({ collMod: name, ...options });
    } else {
        print(`[+] Creating collection: ${name}`);
        db.createCollection(name, options);
    }
}
 
function ensureIndex(collection, spec, options = {}) {
    db.getCollection(collection).createIndex(spec, { background: true, ...options });
}

// Invoices collection
const invoiceItemSchema = {

};

createOrModify('invoices', {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["customerId", "amount", "status", "createdAt"],
            properties: {
                _id: {
                    bsonType: "objectId",
                    description: "must be an ObjectId and is required"
                },
                customerId: {
                    bsonType: "objectId",
                    description: "must be an ObjectId and is required"
                },
                amount: {
                    bsonType: ["decimal", "double"],
                    description: "must be a double or decimal and is required",
                    minimum: 0
                },
                dueDate: {
                    bsonType: "date",
                    description: "must be a date if the field exists"
                },
                billingAddress: {
                    bsonType: "object",
                    required: ["street", "city", "zip", "country"],
                    properties: {
                        street:  { bsonType: "string" },
                        city:    { bsonType: "string" },
                        zip:     { bsonType: "string" },
                        country: { bsonType: "string", maxLength: 2 },
                    }
                },
                status: {
                    bsonType: "string",
                    enum: ["pending", "paid", "overdue"],
                    description: "must be one of 'pending', 'paid', or 'overdue' and is required"
                },
                items: {
                    bsonType: "array",
                    description: "must be an array of invoice items if the field exists",
                    minItems: 1,
                    items: invoiceItemSchema
                },
                createdAt: {
                    bsonType: "date",
                    description: "must be a date and is required"
                },
                updatedAt: {
                    bsonType: "date",
                    description: "must be a date if the field exists"
                }
            }
        }
    },
    validationLevel: "strict",
    validationAction: "error",
});


print("\nMigration complete.");
print(`  Collections created/updated: invoices`);