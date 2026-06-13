/**
 * 02-logs.js
 */

const migrate = (db, helpers) => {
    const { createOrModify, ensureIndex } = helpers;

    const logSchema = {
        bsonType: "object",
        required: ["timestamp", "method", "path", "status", "duration"],
        description: "Log entry for an API request",
        properties: {
            timestamp: {
                bsonType: "date",
                description: "Date and time of the request"
            },
            method: {
                bsonType: "string",
                enum: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
                description: "HTTP method used"
            },
            path: {
                bsonType: "string",
                description: "The request path (e.g., /api/v1/invoices)"
            },
            status: {
                bsonType: "int",
                description: "HTTP status code returned to the client"
            },
            duration: {
                bsonType: "int",
                description: "Request processing time in milliseconds"
            },
            userId: {
                bsonType: "string",
                description: "ID of the user making the request (optional)"
            },
            ip: {
                bsonType: "string",
                description: "IP address of the client"
            }
        }
    };

    createOrModify(db, 'logs', {
        validator: {
            $jsonSchema: logSchema
        },
        validationLevel: "strict",
        validationAction: "error"
    });

    ensureIndex(db, 'logs', { timestamp: -1 });
    ensureIndex(db, 'logs', { userId: 1 });
};