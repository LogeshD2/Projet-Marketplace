<?php

require_once "Models/Vendeurs/API.model.admin.php";
require_once "Models/Model.php";


class APIControllerAdmin {
    
    private $apiModelAdmin;

    public function __construct()
    {
        $this->apiModelAdmin = new APIModelAdmin();
    }

    public function getAdmin() {
        $admin = $this->apiModelAdmin->getDBAdmin();
        Model::sendJSON($this->formatDataAdmin($admin));
    }

    public function insertProduit() {
        $produit = Controller::getDonnees();
        $this->apiModelAdmin->insertDBProduit($produit);
        Controller::sendMessage("Création du produit avec succès");
    }

    public function updateProduit() {
        $produit = Controller::getDonnees();
        $this->apiModelAdmin->updateDBProduit($produit);
        Controller::sendMessage("Modification du produit avec succès");
    }

    public function deleteProduit() {
        $produit = Controller::getDonnees();
        $this->apiModelAdmin->deleteDBProduit($produit);
        Controller::sendMessage("Suppression du produit avec succès");
    }

    public function insertPointRetrait() {
        $pointRetrait = Controller::getDonnees();
        $this->apiModelAdmin->insertDBPointRetrait($pointRetrait);
        Controller::sendMessage("Création du point de retrait avec succès");
    }

    public function updatePointRetrait() {
        $pointRetrait = Controller::getDonnees();
        $this->apiModelAdmin->updateDBPointRetrait($pointRetrait);
        Controller::sendMessage("Modification du point de retrait avec succès avec succès");
    }

    public function deletePointRetrait() {
        $pointRetrait = Controller::getDonnees();
        $this->apiModelAdmin->deleteDBPointRetrait($pointRetrait);
        Controller::sendMessage("Supression du point de retrait avec succès avec succès");
    }

    public function insertCategorie() {
        $categorie = Controller::getDonnees();
        $this->apiModelAdmin->insertDBCategorie($categorie);
        Controller::sendMessage("Insertion de la catégorie avec succès avec succès");
    }

    public function updateCategorie() {
        $categorie = Controller::getDonnees();
        $this->apiModelAdmin->updateDBCategorie($categorie);
        Controller::sendMessage("Supression de la catégorie avec succès avec succès");
    }

    public function deleteCategorie() {
        $categorie = Controller::getDonnees();
        $this->apiModelAdmin->deleteDBCategorie($categorie);
        Controller::sendMessage("Supression de la catégorie avec succès avec succès");
    }


    public function formatDataAdmin($admin) {
        $tab=[
            'treasury'=>json_decode($admin[0]),
            'products'=>json_decode($admin[1]),
            'sold'=>json_decode($admin[2]),
            'contracts'=>json_decode($admin[3]),
            'user'=>json_decode($admin[4]),
            'category'=>json_decode($admin[5]),
            'deliveryAddress'=>json_decode($admin[6])
        ];
        return $tab;
    }

}