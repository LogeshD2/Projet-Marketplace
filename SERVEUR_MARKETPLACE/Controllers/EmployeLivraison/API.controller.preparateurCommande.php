<?php

require_once "Models/EmployeLivraison/API.model.preparateurCommande.php";
require_once "Models/Model.php";
require_once "Controllers/Controller.php";


class APIControllerPreparateurCommande {

    private $apiModelPreparateurCommande;

    public function __construct()
    {
        $this->apiModelPreparateurCommande = new APIModelPreparateurCommande();
    }

    public function getPreparateurCommande($token) {
        $preparateurCommande = $this->apiModelPreparateurCommande->getDBPreparateurCommande($token);
        Model::sendJSON($preparateurCommande);
    }

    public function getCommandes() {
        $commande = $this->apiModelPreparateurCommande->getDBCommandes();
        Model::sendJSON($commande);
    }

    public function getCommande($idCommande) {
        $commande = $this->apiModelPreparateurCommande->getDBCommande($idCommande);
        Model::sendJSON($commande);
    }

    public function chooseCommande() {
        $preparateurCommande = Controller::getDonnees();
        $this->apiModelPreparateurCommande->chooseDBCommande($preparateurCommande);
        Controller::sendMessage("Commande choisi avec succès");
    }

    public function estPrepare() {
        $preparateurCommande = Controller::getDonnees();
        $this->apiModelPreparateurCommande->DBestPrepare($preparateurCommande);
        Controller::sendMessage("Préparation de la commande réalisé avec succès");
    }

}

