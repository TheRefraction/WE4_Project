<?php

$cart = new Cart();
$SESSION['cart'] = $cart;

class Cart
{
    public $product_list = [];

    public function addProduct($product_id){
        if(array_key_exists($this->product_list[$product_id], $this->product_list)){
            $this->product_list[$product_id]++;
        }
        else{
            $this->product_list[$product_id] = 1;
        }
    }

    public function removeProduct($product_id){
        if($this->product_list[$product_id] > 1){
            $this->product_list[$product_id]--;
        }
        else{
            unset($this->product_list[$product_id]);
        }
    }

}