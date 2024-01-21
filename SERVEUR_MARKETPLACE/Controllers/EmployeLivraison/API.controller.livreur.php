<?php

require_once "Models/EmployeLivraison/API.model.livreur.php";
require_once "Models/Model.php";
require_once "Controllers/Controller.php";


class APIControllerLivreur {

    private $apiModelLivreur;

    public function __construct()
    {
        $this->apiModelLivreur = new APIModelLivreur();
    }

    public function getLivreur($token) {
        $livreur = $this->apiModelLivreur->getDBLivreur($token);
        Model::sendJSON($livreur);
    }

    public function getColis() {
        $colis = $this->apiModelLivreur->getDBColis();
        Model::sendJSON($colis);
    }

    public function getOneColis($idColis) {
        $oneColis = $this->apiModelLivreur->getDBOneColis($idColis);
        Model::sendJSON($oneColis);
    }

    public function chooseColis() {
        $livreur = Controller::getDonnees();
        $this->apiModelLivreur->chooseDBColis($livreur);
        Controller::sendMessage("Colis choisi avec succès");
    }

    public function colisLivrer() {
        $livreur = Controller::getDonnees();
        $this->apiModelLivreur->DBColisLivrer($livreur);
        Controller::sendMessage("Colis livrer avec succès");
    }

}