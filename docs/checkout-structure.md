# Cart structure

On the frontend, the Cart should be stored as a JSON document, which follows the following structure:

```json
{
    customerId: 1000,
    items: [
        // Structure in the `invoice-document-example.md` file
    ]
}
```

# What JSON document to POST to the backend server?

The invoice must first be created in the database. Then items are registered as a JSON document within MongoDB. Finally a payment is issued and linked to the invoice record created. The status of the invoice passes from `draft` to `pending`. Once the payment is successful, it finally updates to `paid` or `cancelled` depending on the outcome.

The REST API requires the following structure to establish an invoice and shall return the invoice ID when successfully created:
```json
{
    customerId: 1000,
    items: [ ... ],
    amount: 15.0,
    billingAddress: {
        street: "13 rue des Capucins",
        city: "Belfort",
        zip: "90000",
        country: "FR"
    }
}
```
> TODO
> The following structure is required to establish a payment in Postgres:
```json
{
    invoiceId: 2067,
    mode: "card",
    date: "2026-06-07T09:58:00Z" // ISODate --> Date of payment
}
```