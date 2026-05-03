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
            'access' => ['guest', 'client', 'admin']
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
        '/admin/products/edit/:id/customize'      => [
            'controller' => 'AdminController',
            'action' => 'viewEditProductCustomization',
            'access' => ['admin']
        ],
        '/admin/products/edit/:id/slot/:slot_id'      => [
            'controller' => 'AdminController',
            'action' => 'viewEditCustomizationSlot',
            'access' => ['admin']
        ],
        '/admin/products/edit/:id/option/:option_id'      => [
            'controller' => 'AdminController',
            'action' => 'viewEditCustomizationOption',
            'access' => ['admin']
        ],
        '/admin/categories'             => [
            'controller' => 'AdminController',
            'action' => 'viewCategories',
            'access' => ['admin']
        ],
        '/admin/menus'                  => [
            'controller' => 'AdminController',
            'action' => 'viewMenus',
            'access' => ['admin']
        ],
        '/admin/menus/create'           => [
            'controller' => 'AdminController',
            'action' => 'viewCreateMenu',
            'access' => ['admin']
        ],
        '/admin/menus/edit/:id'         => [
            'controller' => 'AdminController',
            'action' => 'viewEditMenu',
            'access' => ['admin']
        ],
        '/admin/menus/edit/:id/slot/:slot_id'         => [
            'controller' => 'AdminController',
            'action' => 'viewEditMenuSlot',
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
        '/gdpr' => [
            'controller' => 'HomeController',
            'action' => 'gdpr',
            'access' => ['guest', 'client', 'admin']
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
        '/admin/products/:product_id/slot/create'  => [
            'controller' => 'AdminController',
            'action' => 'createCustomizationSlot',
            'access' => ['admin']
        ],
        '/admin/products/:product_id/slot/update'  => [
            'controller' => 'AdminController',
            'action' => 'updateCustomizationSlot',
            'access' => ['admin']
        ],
        '/admin/products/:product_id/slot/delete/:id' => [
            'controller' => 'AdminController',
            'action' => 'deleteCustomizationSlot',
            'access' => ['admin']
        ],
        '/admin/products/:product_id/option/create' => [
            'controller' => 'AdminController',
            'action' => 'createCustomizationOption',
            'access' => ['admin']
        ],
        '/admin/products/:product_id/option/update' => [
            'controller' => 'AdminController',
            'action' => 'updateCustomizationOption',
            'access' => ['admin']
        ],
        '/admin/products/:product_id/option/delete/:id' => [
            'controller' => 'AdminController',
            'action' => 'deleteCustomizationOption',
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
        '/admin/menus/create'           => [
            'controller' => 'AdminController',
            'action' => 'createMenu',
            'access' => ['admin']
        ],
        '/admin/menus/update'           => [
            'controller' => 'AdminController',
            'action' => 'updateMenu',
            'access' => ['admin']
        ],
        '/admin/menus/delete/:id'       => [
            'controller' => 'AdminController',
            'action' => 'deleteMenu',
            'access' => ['admin']
        ],
        '/admin/menus/:menu_id/slot/create'           => [
            'controller' => 'AdminController',
            'action' => 'createMenuSlot',
            'access' => ['admin']
        ],
        '/admin/menus/:menu_id/slot/delete/:id'       => [
            'controller' => 'AdminController',
            'action' => 'deleteMenuSlot',
            'access' => ['admin']
        ],
        '/admin/menus/:menu_id/slot/:slot_id/product/add' => [
            'controller' => 'AdminController',
            'action' => 'addProductToMenuSlot',
            'access' => ['admin']
        ],
        '/admin/menus/:menu_id/slot/:slot_id/product/remove' => [
            'controller' => 'AdminController',
            'action' => 'removeProductFromMenuSlot',
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
    ],
];
