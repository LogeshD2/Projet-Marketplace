<?php

abstract class Model {
    
    private static $pdo;

    private static function setBdd() {
        // self::$pdo = new PDO("mysql:host=localhost;dbname=Project_Marketplace;charset=utf8", "root", "");
        // self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
        try{
            self::$pdo = new PDO("mysql:host=localhost;dbname=Project_Marketplace;charset=utf8", "root", "");
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
        }catch(PDOException $e){
            die('Erreur de la connexion de la base de données');
        }
    }

    protected function getBdd() {
        if(self::$pdo === null) {
            self::setBdd();     
        }
        return self::$pdo;
    }
        

    public static function sendJSON($data) {
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json");
        echo json_encode($data);
    }
}