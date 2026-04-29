<?php
return [
    'GET' => [
        '/'                             => [
            'controller' => 'HomeController',
            'action' => 'home',
            'access' => ['guest','client']
        ],
        '/sign-in'                      => [
            'controller' => 'AuthController',
            'action' => 'viewSignIn',
            'access' => ['guest']
        ],
        '/sign-up'                      => [
            'controller' => 'AuthController',
            'action' => 'viewSignUp',
            'access' => ['guest']
        ],
        '/sign-out'                     => [
            'controller' => 'AuthController',
            'action' => 'signOut',
            'access' => ['client', 'admin']
        ],
        '/account'                      => [
            'controller' => 'AuthController',
            'action' => 'viewAccount',
            'access' => ['client']
        ],
        '/account-data'                 => [
            'controller' => 'AuthController',
            'action' => 'getAccountData',
            'access' => ['client']
        ],
        '/products'                     => [
            'controller' => 'ProductController',
            'action' => 'viewProducts',
            'access' => ['guest', 'client']
        ],
        '/product'                      => [
            'controller' => 'ProductController',
            'action' => 'viewSingleProduct',
            'access' => ['guest', 'client']
        ],
        '/admin'                        => [
            'controller' => 'AdminController',
            'action' => 'viewAdmin',
            'access' => ['admin']
        ],
        '/admin/access' => [
            'controller' => 'AdminController',
            'action' => 'getAdminAccess',
            'access' => ['admin']
        ],
        '/admin/accounts'               => [
            'controller' => 'AdminController',
            'action' => 'viewAccounts',
            'access' => ['admin']
        ],
        '/admin/accounts/edit/:id'      => [
            'controller' => 'AdminController',
            'action' => 'viewEditAccount',
            'access' => ['admin']
        ],
        '/admin/products'               => [
            'controller' => 'AdminController',
            'action' => 'viewProducts',
            'access' => ['admin']
        ],
        '/admin/products/create'        => [
            'controller' => 'AdminController',
            'action' => 'viewCreateProduct',
            'access' => ['admin']
        ],
        '/admin/products/edit/:id'      => [
            'controller' => 'AdminController',
            'action' => 'viewEditProduct',
            'access' => ['admin']
        ],
        '/admin/suppliers'              => [
            'controller' => 'AdminController',
            'action' => 'viewSuppliers',
            'access' => ['admin']
        ],
        '/admin/suppliers/create'       => [
            'controller' => 'AdminController',
            'action' => 'viewCreateSupplier',
            'access' => ['admin']
        ],
        '/admin/suppliers/edit/:id'     => [
            'controller' => 'AdminController',
            'action' => 'viewEditSupplier',
            'access' => ['admin']
        ],
        '/admin/invoices'               => [
            'controller' => 'AdminController',
            'action' => 'viewInvoices',
            'access' => ['admin']
        ],
        '/admin/invoices/details/:id'   => [
            'controller' => 'AdminController',
            'action' => 'viewInvoiceDetails',
            'access' => ['admin']
        ],
        '/admin/categories'             => [
            'controller' => 'AdminController',
            'action' => 'viewCategories',
            'access' => ['admin']
        ],
    ],
    'POST' => [
        '/sign-in'                      => [
            'controller' => 'AuthController',
            'action' => 'signIn',
            'access' => ['guest']
        ],
        '/sign-up'                      => [
            'controller' => 'AuthController',
            'action' => 'signUp',
            'access' => ['guest']
        ],
        '/update-account'               => [
            'controller' => 'AuthController',
            'action' => 'updateAccount',
            'access' => ['client']
        ],
        '/admin/accounts/update'        => [
            'controller' => 'AdminController',
            'action' => 'updateAccountAdmin',
            'access' => ['admin']
        ],
        '/admin/accounts/delete/:id'    => [
            'controller' => 'AdminController',
            'action' => 'deleteAccount',
            'access' => ['admin']
        ],
        '/admin/products/create'        => [
            'controller' => 'AdminController',
            'action' => 'createProduct',
            'access' => ['admin']
        ],
        '/admin/products/update'        => [
            'controller' => 'AdminController',
            'action' => 'updateProduct',
            'access' => ['admin']
        ],
        '/admin/products/delete/:id'    => [
            'controller' => 'AdminController',
            'action' => 'deleteProduct',
            'access' => ['admin']
        ],
        '/admin/suppliers/create'       => [
            'controller' => 'AdminController',
            'action' => 'createSupplier',
            'access' => ['admin']
        ],
        '/admin/suppliers/update'       => [
            'controller' => 'AdminController',
            'action' => 'updateSupplier',
            'access' => ['admin']
        ],
        '/admin/suppliers/delete/:id'   => [
            'controller' => 'AdminController',
            'action' => 'deleteSupplier',
            'access' => ['admin']
        ],
        '/admin/invoices/update-status' => [
            'controller' => 'AdminController',
            'action' => 'updateInvoiceStatus',
            'access' => ['admin']
        ],
        '/admin/categories/create'      => [
            'controller' => 'AdminController',
            'action' => 'createCategory',
            'access' => ['admin']
        ],
        '/admin/categories/update'      => [
            'controller' => 'AdminController',
            'action' => 'updateCategory',
            'access' => ['admin']
        ],
        '/admin/categories/delete/:id'  => [
            'controller' => 'AdminController',
            'action' => 'deleteCategory',
            'access' => ['admin']
        ],
    ],
];
