<?php

require_once "Models/Connexion/API.model.connexion.php";
require_once "Models/Model.php";
require_once "Controllers/Controller.php";



class APIControllerConnexion {

    private $apiModelConnexion;

    public function __construct() {
        $this->apiModelConnexion = new APIModelConnexion();
    }
    

    public function Connexion() {
        $utilisateur = Controller::getDonnees();
        // $utilisateur =  [
        //     "adresseMail" => "bastien@gmail.com",
        //     "mdp" => "bastien"
        // ];
        $utilisateurConnecte = $this->apiModelConnexion->DBConnexion($utilisateur);
        Model::sendJSON($utilisateurConnecte);
    }
}