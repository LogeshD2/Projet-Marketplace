<?php

abstract class Controller {

    public static function getDonnees() {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: access");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
        // header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-A11ow-Headers: Content-Type,
        Access-Control-Allow-Headers, Authorization, X-Requested-With");


        $donnees = json_decode(file_get_contents('php://input'));
        return $donnees;
    }

    public static function sendMessage($message)  {
        $response = array('message' => $message);
        echo json_encode($response);
    }

}