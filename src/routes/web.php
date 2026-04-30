<?php
return [
    'GET' => [
        '/'                 => ['HomeController', 'home'],
        '/sign-in'          => ['AuthController', 'viewSignIn'],
        '/sign-up'          => ['AuthController', 'viewSignUp'],
        '/sign-out'         => ['AuthController', 'signOut'],
        '/account'          => ['AuthController', 'viewAccount'],
        '/account-data'     => ['AuthController', 'getAccountData'],
        '/products'         => ['ProductController', 'viewProducts'],
        '/product'          => ['ProductController', 'viewSingleProduct'],
        '/cart'             => ['CartController', 'viewCart'],
    ],
    'POST' => [
        '/sign-in'          => ['AuthController', 'signIn'],
        '/sign-up'          => ['AuthController', 'signUp'],
        '/cart'             => ['CartController', 'cartAction'],
    ],
];
