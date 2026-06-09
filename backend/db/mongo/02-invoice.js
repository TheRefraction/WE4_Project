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
const invoiceOptionSchema = {
    bsonType: "object",
    required: ["name", "item"],
    description: "An option slot for a product",
    properties: {
        name: {
            bsonType: "string",
            description: "Name of the current option slot"
        },
        item: {
            bsonType: "object",
            required: ["name", "delta", "quantity"],
            description: "The chosen option",
            properties: {
                name: {
                    bsonType: "string",
                    description: "Name of product"
                },
                delta: {
                    bsonType: "double",
                    description: "Price increase or decrease on the product"
                },
                quantity: {
                    bsonType: "int",
                    description: "Number of options selected (between min_select and max_select)",
                    minimum: 0 
                },
            }
        }
    }
};

const invoiceOptionsSchema = {
    bsonType: "array",
    description: "Array of options on a given product (optional)",
    items: invoiceOptionSchema
};

const invoiceMenuSlotSchema = {
    bsonType: "object",
    required: ["name", "item"],
    description: "A menu slot",
    properties: {
        name: {
            bsonType: "string",
            description: "Name of the current slot in the menu"
        },
        item: {
            bsonType: "object",
            required: ["name", "delta", "quantity"],
            description: "What product has been chosen for this slot",
            properties: {
                name: {
                    bsonType: "string",
                    description: "Name of product"
                },
                delta: {
                    bsonType: "double",
                    description: "Price increase or decrease on the product"
                },
                quantity: {
                    bsonType: "int",
                    description: "Number of products selected (between min_select and max_select)",
                    minimum: 0 // For instance, a dessert can be optional whence the threshold
                },

                // Selected options if any (optional)
                options: invoiceOptionsSchema
            }
        }
    }
};

const invoiceMenuSlotsSchema = {
    bsonType: "array",
    description: "Used when the item is a menu. Array of menu slots (optional)",
    items: invoiceMenuSlotSchema
};

const invoiceItemSchema = {
    bsonType: "object",
    required: ["type", "name", "price", "quantity"],
    description: "A given line in the invoice which corresponds to a given item",
    properties: {
        type: {
            bsonType: "string",
            enum: ["product", "menu"],
            description: "Current item is either a product or a menu"
        },
        name: {
            bsonType: "string",
            description: "This is the name of the item"
        },
        price: {
            bsonType: "double",
            description: "The unit price, must be non negative", // For a menu, the prices of products within are not taken into account
            minimum: 0
        },
        quantity: {
            bsonType: "int",
            description: "Quantity of the ordered item, at least 1",
            minimum: 1
        },

        // Present when type=product
        options: invoiceOptionsSchema,

        // Present when type=menu
        slots: invoiceMenuSlotsSchema
    }
};

const invoiceSchema = {
    bsonType: "object",
    required: ["_id", "items"],
    properties: {
        _id: {
            bsonType: "int",
            description: "Mirrors the Postgres invoice.id"
        },
        items: {
            bsonType: "array",
            description: "An array of invoices items (at least one line)",
            minItems: 1,
            items: invoiceItemSchema
        }
    }
};

createOrModify('invoices', {
    validator: {
        $jsonSchema: invoiceSchema
    },
    validationLevel: "strict",
    validationAction: "error"
});


print("\nMigration complete.");
print(`  Collections created/updated: invoices`);