/**
 * 01-invoice.js
 */

const migrate = (db, helpers) => {
    const { createOrModify } = helpers;

    const invoiceOptionSchema = {
        bsonType: "object",
        required: ["name", "item"],
        description: "An option slot for a product",
        properties: {
            name: {
                bsonType: "string"
            },
            item: {
                bsonType: "object",
                required: ["name", "delta", "quantity"],
                properties: {
                    name: { bsonType: "string" },
                    delta: { bsonType: "double" },
                    quantity: { bsonType: "int", minimum: 0 }
                }
            }
        }
    };

    const invoiceItemSchema = {
        bsonType: "object",
        required: ["type", "name", "price", "quantity"],
        properties: {
            type: {
                enum: ["product"], // Restreint au type "product" uniquement
                bsonType: "string"
            },
            name: { bsonType: "string" },
            price: { bsonType: "double", minimum: 0 },
            quantity: { bsonType: "int", minimum: 1 },
            options: {
                bsonType: "array",
                items: invoiceOptionSchema
            }
        }
    };

    const invoiceSchema = {
        bsonType: "object",
        required: ["_id", "items"],
        properties: {
            _id: { bsonType: "int" },
            items: {
                bsonType: "array",
                minItems: 1,
                items: invoiceItemSchema
            }
        }
    };

    createOrModify(db, 'invoices', {
        validator: {
            $jsonSchema: invoiceSchema
        },
        validationLevel: "strict",
        validationAction: "error"
    });
}