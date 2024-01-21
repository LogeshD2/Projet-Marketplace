<?php


require_once "Models/Inscription/API.model.inscription.php";
require_once "Models/Model.php";
require_once "Controllers/Controller.php";


class APIControllerInscription {

    private $apiModelInscription;


    public function __construct() {
        $this->apiModelInscription = new APIModelInscription();
    }   

    public function Inscription() {
        $utilisateur = Controller::getDonnees();
        $this->apiModelInscription->DBInscription($utilisateur);
        Controller::sendMessage("Inscription réussi !");
    }
}