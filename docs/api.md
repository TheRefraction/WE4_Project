# API
blah blah blah

## Main
Any request to the backend should be formed as such:
```json
req: {
    user?: {
        userId: Number,
        email: String,
        role: String
    },
    params: {
        id: Number, 
        ...
    },
    body: {
        ...
    }
}
```

A response is of the form:
```json
res: {
    success: Boolean,
    message: String,
    data?: Any
}
```

## Account

### `/register` (POST)

#### Requête
```json
req: {
    params: {},
    body: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String?,
        password: String
    }
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        account: {
            firstName: String,
            lastName: String,
            email: String,
            phone?: String,
            createdAt: Date,
            updatedAt: Date,
            loyaltyPoints: Number,
            role: String
        },
        token: String
    }
}
```

### `/login` (POST)

#### Requête
```json
req: {
    params: {},
    body: {
        email: String,
        password: String
    }
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        account: {
            firstName: String,
            lastName: String,
            email: String,
            phone?: String,
            createdAt: Date,
            updatedAt: Date,
            loyaltyPoints: Number,
            role: String
        },
        token: String
    }
}
```

### `/profile` (GET, Protected)

#### Requête
```json
req: {
    user: {
        userId: Number,
        email: String,
        role: String
    },
    params: {},
    body: {}
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        firstName: String,
        lastName: String,
        email: String,
        phone?: String,
        createdAt: Date,
        updatedAt: Date,
        loyaltyPoints: Number,
        role: String
    }
}
```

### `/profile/:id` (PUT, Protected)

#### Requête
```json
req: {
    user: {
        userId: Number,
        email: String,
        role: String
    },
    params: {
        id: Number
    },
    body: {
        firstName?: String,
        lastName?: String,
        email?: String,
        phone?: String,
        role?: String,
        password?: String
    }
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        firstName: String,
        lastName: String,
        email: String,
        phone?: String,
        createdAt: Date,
        updatedAt: Date,
        loyaltyPoints: Number,
        role: String
    }
}
```

### `/profile/:id` (DELETE, Protected)

#### Requête
```json
req: {
    user: {
        userId: Number,
        email: String,
        role: String
    },
    params: {
        id: Number
    },
    body: {}
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {}
}
```

### `/admin/accounts` (GET, ADMIN)

#### Requête
```json
req: {
    user: {
        userId: Number,
        email: String,
        role: String
    },
    params: {},
    body: {}
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: [
        {
            firstName: String,
            lastName: String,
            email: String,
            phone?: String,
            createdAt: Date,
            updatedAt: Date,
            loyaltyPoints: Number,
            role: String
        }
    ]
}
```

### `/admin/accounts/:id` (GET, ADMIN)

#### Requête
```json
req: {
    params: {
        id: Number
    },
    body: {}
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        firstName: String,
        lastName: String,
        email: String,
        phone?: String,
        createdAt: Date,
        updatedAt: Date,
        loyaltyPoints: Number,
        role: String
    }
}
```

## Category

### `/categories` (GET)

#### Requête
```json
req: {
    params: {},
    body: {}
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: [
        {
            id: Number,
            name: String
        }
    ]
}
```

### `/categories/:id` (GET)

#### Requête
```json
req: {
    params: {
        id: Number
    },
    body: {}
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        id: Number,
        name: String
    }
}
```

### `/categories` (POST, ADMIN)

#### Requête
```json
req: {
    params: {},
    body: {
        name: String
    }
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        id: Number,
        name: String
    }
}
```

### `/categories/:id` (PUT, ADMIN)

#### Requête
```json
req: {
    params: {
        id: Number
    },
    body: {
        name?: String
    }
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        id: Number,
        name: String
    }
}
```

### `/categories/:id` (DELETE, ADMIN)

#### Requête
```json
req: {
    params: {
        id: Number
    },
    body: {}
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {}
}
```

## Supplier

### `/suppliers` (GET)

#### Requête
```json
req: {
    params: {},
    body: {}
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: [
        {
            id: Number,
            name: String,
            contactInfo: {
                email: String,
                phone: String
            },
            productCount?: Number
        }
    ]
}
```

### `/suppliers/:id` (GET)

#### Requête
```json
req: {
    params: {
        id: Number
    },
    body: {}
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        id: Number,
        name: String,
        contactInfo: {
            email: String,
            phone: String
        },
        productCount?: Number
    }
}
```

### `/suppliers` (POST, ADMIN)

#### Requête
```json
req: {
    params: {},
    body: {
        name: String,
        contactInfo: {
            email: String,
            phone: String
        }
    }
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        id: Number,
        name: String,
        contactInfo: {
            email: String,
            phone: String
        },
        productCount?: Number
    }
}
```

### `/suppliers/:id` (PUT, ADMIN)

#### Requête
```json
req: {
    params: {
        id: Number
    },
    body: {
        name?: String,
        contactInfo?: {
            email?: String,
            phone?: String
        }
    }
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        id: Number,
        name: String,
        contactInfo: {
            email: String,
            phone: String
        },
        productCount?: Number
    }
}
```

### `/suppliers/:id` (DELETE, ADMIN)

#### Requête
```json
req: {
    params: {
        id: Number
    },
    body: {}
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {}
}
```

## Product customizations

### `/slots` (GET)

#### Requête
```json
req: {
    params: {},
    body: {}
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: [
        {
           id: Number,
           productId: Number,
           categoryId: Number,
           minSelect: Number,
           maxSelect: Number,
           displayOrder: Number 
        }
    ]
}
```

### `/slots/product/:id` (GET)

#### Requête
```json
req: {
    params: {
        id: Number
    },
    body: {}
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: [
        {
           id: Number,
           productId: Number,
           categoryId: Number,
           minSelect: Number,
           maxSelect: Number,
           displayOrder: Number 
        }
    ]
}
```

### `/slots/product/:id/detail` (GET)

#### Requête
```json
req: {
    params: {
        id: Number
    },
    body: {}
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: [
        {
            id: Number,
            productId: Number,
            categoryId: Number,
            minSelect: Number,
            maxSelect: Number,
            displayOrder: Number,
            options: [
                {
                    slotId: Number,
                    productId: Number,
                    priceDelta: Number,
                    isDefault: Boolean,
                    displayOrder: Number,
                    name: String
                }
            ]
        }
    ]
}
```

### `/slots` (POST, ADMIN)

#### Requête
```json
req: {
    params: {},
    body: {
        productId: Number,
        categoryId: Number,
        minSelect: Number,
        maxSelect: Number,
        displayOrder: Number
    }
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        id: Number,
        productId: Number,
        categoryId: Number,
        minSelect: Number,
        maxSelect: Number,
        displayOrder: Number
    }
}
```

### `/slots/:id` (PUT, ADMIN)

#### Requête
```json
req: {
    params: {
        id: Number
    },
    body: {
        productId?: Number,
        categoryId?: Number,
        minSelect?: Number,
        maxSelect?: Number,
        displayOrder?: Number
    }
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        id: Number,
        productId: Number,
        categoryId: Number,
        minSelect: Number,
        maxSelect: Number,
        displayOrder: Number
    }
}
```

### `/slots/:id` (DELETE, ADMIN)

#### Requête
```json
req: {
    params: {
        id: Number
    },
    body: {}
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {}
}
```

### `/slots/:id/options` (POST, ADMIN)

#### Requête
```json
req: {
    params: {
        id: Number
    },
    body: {
        productId: Number,
        priceDelta: Number,
        isDefault: Boolean,
        displayOrder: Number
    }
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        slotId: Number,
        productId: Number,
        priceDelta: Number,
        isDefault: Boolean,
        displayOrder: Number
    }
}
```

### `/slots/:id/options` (PUT, ADMIN)

#### Requête
```json
req: {
    params: {
        id: Number
    },
    body: {
        productId: Number,
        priceDelta?: Number,
        isDefault?: Boolean,
        displayOrder?: Number
    }
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        slotId: Number,
        productId: Number,
        priceDelta: Number,
        isDefault: Boolean,
        displayOrder: Number
    }
}
```

### `/slots/:id/options` (DELETE, ADMIN)

#### Requête
```json
req: {
    params: {
        id: Number
    },
    body: {
        productId: Number
    }
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {}
}
```

## Product

### `/products` (GET)

#### Requête
```json
req: {
    params: {},
    body: {}
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: [
        {
            id: Number,
            name: String,
            description?: String,
            price: Number,
            supplierId?: Number,
            hidden: Boolean 
        }
    ]
}
```

### `/products/:id` (GET)

#### Requête
```json
req: {
    params: {
        id: Number
    },
    body: {}
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        id: Number,
        name: String,
        description?: String,
        price: Number,
        supplierId?: Number,
        hidden: Boolean 
    }
}
```

### `/products/:id/detail` (GET)

#### Requête
```json
req: {
    params: {
        id: Number
    },
    body: {}
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        id: Number,
        name: String,
        description?: String,
        price: Number,
        supplierId?: Number,
        hidden: Boolean,
        customizations?: [
            {
                id: Number,
                productId: Number,
                categoryId: Number,
                minSelect: Number,
                maxSelect: Number,
                displayOrder: Number,
                options: [
                    {
                        slotId: Number,
                        productId: Number,
                        priceDelta: Number,
                        isDefault: Boolean,
                        displayOrder: Number,
                        name: String
                    }
                ]
            }
        ],
        categories?: [
            {
                id: Number,
                name: String
            }
        ],
        supplier?: {
            id: Number,
            name: String,
            contactInfo: {
                email: String,
                phone: String
            }
        }
    }
}
```

### `/products` (POST, ADMIN)

#### Requête
```json
req: {
    params: {},
    body: {
        name: String,
        description?: String,
        price: Number,
        supplierId?: Number,
        hidden: Boolean,
        categoryIds?: Number[]
    }
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        id: Number,
        name: String,
        description?: String,
        price: Number,
        supplierId?: Number,
        hidden: Boolean 
    }
}
```

### `/products/:id` (PUT, ADMIN)

#### Requête
```json
req: {
    params: {
        id: Number
    },
    body: {
        name?: String,
        description?: String,
        price?: Number,
        supplierId?: Number,
        hidden?: Boolean,
        categoryIds?: Number[]
    }
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        id: Number,
        name: String,
        description?: String,
        price: Number,
        supplierId?: Number,
        hidden: Boolean 
    }
}
```


### `/products/:id` (DELETE, ADMIN)

#### Requête
```json
req: {
    params: {
        id: Number
    },
    body: {}
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {}
}
```

## Payment

### `/payments` (GET, Protected)

#### Requête
```json
req: {
    params: {},
    body: {}
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: [
        {
            id: Number,
            mode: String,
            status: String,
            paymentDate: Date,
            createdAt: Date,
            updatedAt: Date
        }
    ]
}
```

### `/payments/:id` (GET, Protected)

#### Requête
```json
req: {
    params: {},
    body: {}
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        id: Number,
        mode: String,
        status: String,
        paymentDate: Date,
        createdAt: Date,
        updatedAt: Date
    }
}
```

### `/payments` (POST, Protected)

#### Requête
```json
req: {
    params: {},
    body: {
        mode: String,
        status?: String,
        paymentDate?: Date,
    }
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        id: Number,
        mode: String,
        status: String,
        paymentDate: Date,
        createdAt: Date,
        updatedAt: Date
    }
}
```

### `/payments` (PUT, Protected)

#### Requête
```json
req: {
    params: {
        id: Number
    },
    body: {
        mode?: String,
        status?: String,
        paymentDate?: Date,
    }
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        id: Number,
        mode: String,
        status: String,
        paymentDate: Date,
        createdAt: Date,
        updatedAt: Date
    }
}
```

## Invoices

### `/invoices/:id` (GET, Protected)

#### Requête
```json
req: {
    params: {
        id: Number
    },
    body: {}
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        id: Number,
        accountId: Number,
        amount: Number,
        billingAddress: {
            street: String,
            city: String,
            zip: String,
            country: String
        },
        items: [
            {
                type: 'product',
                name: String,
                price: Number,
                quantity: Number,
                options?: [
                    {
                        name: String,
                        item: {
                            name: String,
                            delta: Number,
                            quantity: Number
                        }
                    }
                ]
            }
        ],
        status: String
        paymentId?: Number,
        payment?: {
            id: Number,
            mode: String,
            status: String,
            paymentDate: Date,
            createdAt: Date,
            updatedAt: Date
        },
        createdAt: Date,
        updatedAt: Date
    }
}
```

### `/invoices` (POST, Protected)

#### Requête
```json
req: {
    params: {},
    body: {
        accountId: Number,
        amount: Number,
        billingAddress: {
            street: String,
            city: String,
            zip: String,
            country: String
        },
        items: [
            {
                type: 'product',
                name: String,
                price: Number,
                quantity: Number,
                options?: [
                    {
                        name: String,
                        item: {
                            name: String,
                            delta: Number,
                            quantity: Number
                        }
                    }
                ]
            }
        ]
    }
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        id: Number,
        accountId: Number,
        amount: Number,
        billingAddress: {
            street: String,
            city: String,
            zip: String,
            country: String
        },
        items: [
            {
                type: 'product',
                name: String,
                price: Number,
                quantity: Number,
                options?: [
                    {
                        name: String,
                        item: {
                            name: String,
                            delta: Number,
                            quantity: Number
                        }
                    }
                ]
            }
        ],
        status: String
        paymentId?: Number,
        payment?: {
            id: Number,
            mode: String,
            status: String,
            paymentDate: Date,
            createdAt: Date,
            updatedAt: Date
        },
        createdAt: Date,
        updatedAt: Date
    }
}
```

### `/invoices/:id` (PUT, Protected)

#### Requête
```json
req: {
    params: {
        id: Number
    },
    body: {
        amount?: Number,
        billingAddress?: {
            street?: String,
            city?: String,
            zip?: String,
            country?: String
        },
        items?: [
            {
                type: 'product',
                name: String,
                price: Number,
                quantity: Number,
                options?: [
                    {
                        name: String,
                        item: {
                            name: String,
                            delta: Number,
                            quantity: Number
                        }
                    }
                ]
            }
        ]
    }
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {
        id: Number,
        accountId: Number,
        amount: Number,
        billingAddress: {
            street: String,
            city: String,
            zip: String,
            country: String
        },
        items: [
            {
                type: 'product',
                name: String,
                price: Number,
                quantity: Number,
                options?: [
                    {
                        name: String,
                        item: {
                            name: String,
                            delta: Number,
                            quantity: Number
                        }
                    }
                ]
            }
        ],
        status: String
        paymentId?: Number,
        payment?: {
            id: Number,
            mode: String,
            status: String,
            paymentDate: Date,
            createdAt: Date,
            updatedAt: Date
        },
        createdAt: Date,
        updatedAt: Date
    }
}
```

### `/invoices/:id` (DELETE, Protected)

#### Requête
```json
req: {
    params: {
        id: Number
    },
    body: {}
}
```

#### Sortie
```json
res: {
    success: Boolean,
    message: String,
    data: {}
}
```