# Example of document for invoices


```json
{
  _id: 1042, // ID of invoice in Postgres
  items: [
    // A standalone product with options
    {
      type: "product",
      name: "Burger Classic",
      price: 12.00,
      quantity: 2,
      options: [
        {
          name: "Sauce",        // customization slot name
          item: {
            name: "BBQ Sauce",  // chosen option product name
            delta: 0.50,
            quantity: 1
          }
        },
        {
          name: "Extras",
          item: {
            name: "Extra Cheese",
            delta: 1.00,        // An extra 1.00€
            quantity: 2         // min_select=0, max_select=3 -> user picked 2
          }
        }
      ]
    },

    // A menu with slots, each slot's product having its own options
    {
      type: "menu",
      name: "Menu Midi",
      price: 15.00,
      quantity: 1,
      slots: [
        {
          name: "Main",         // menu slot name
          item: {
            name: "Grilled Salmon",
            delta: 2.00,        // upgrade cost from menu_slot_product.price_delta
            quantity: 1,
            options: [
              {
                name: "Cooking",
                item: {
                  name: "Medium",
                  delta: 0.00,
                  quantity: 1
                }
              }
            ]
          }
        },
        {
          name: "Side",
          item: {
            name: "French Fries",
            delta: 0.00,
            quantity: 1,
            options: []
          }
        },
        {
          name: "Dessert",      // optional slot - quantity: 0 means skipped
          item: {
            name: "Chocolate Tart",
            delta: 0.00,
            quantity: 0
          }
        }
      ]
    }

  ]
} 
```