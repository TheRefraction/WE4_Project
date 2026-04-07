<?php
require_once __DIR__ . '/../models/TestModel.php';

class TestController {
    public function test() {
        $title = "This is a test!";
        $testModel = new TestModel();
        require __DIR__ . '/../views/test.php';
    }

    public function test2() {
        $title = "This is another test!";
        $testModel = new TestModel();
        require __DIR__ . '/../views/test.php';
    }
}