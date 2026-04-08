<?php
return [
    'GET' => [
        '/'             => ['HomeController', 'home'],
        '/sign-in'      => ['HomeController', 'viewSignIn'],
        '/sign-up'      => ['HomeController', 'viewSignUp'],
        '/account'      => ['HomeController', 'viewAccount'],
    ],
    'POST' => [

    ],
];