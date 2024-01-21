<?php


require_once "Models/Clients/API.model.clients.php";  
require_once "Models/Model.php";
require_once "Controllers/Controller.php";


class APIControllerClients {
    
    private $apiModelClients;

    public function __construct()
    {
        $this->apiModelClients = new APIModelClients();
    }

    // public function getClients() {
    //     $clients = $this->apiModelClients->getDBClients();
    //     Model::sendJSON($this->formatDataClients($clients));
    // }

    public function getClient($idClient) {
        $client = $this->apiModelClients->getDBClient($idClient);
        Model::sendJSON($this->formatDataClients($client));
    }

    public function getProduits() {
        $produits = $this->apiModelClients->getDBProduits();
        Model::sendJSON($this->formatDataProduits($produits));
    }

    public function getProduit($idProduit) {
        $produit = $this->apiModelClients->getDBProduit($idProduit);
        Model::sendJSON($this->formatDataProduits($produit));
    }   

    public function getCategories() {
        $categories = $this->apiModelClients->getDBCategories();
        Model::sendJSON($this->formatDataCategories($categories));
    }

    public function getProduitsNom($produitNom) {

        // $produitsNom = $this->apiModelClients->getDBProduitsNom($produitNom);
        // Model::sendJSON($this->formatDataProduits($produitsNom));
        $produitsNomID = $this->apiModelClients->getDBProduitsNomID();
        
        $tab =[];
        foreach ($produitsNomID as $produitNomID) {
            $produitNomID['Nom'] = $this->remplacerCaracteresSpeciaux($produitNomID['Nom']);
            $tab[$produitNomID['ID']] = $produitNomID['Nom'];
        }
        
        foreach ($tab as $cle => $valeur) {
            // Vérifier si la valeur correspond à $fruit
            if ($valeur == $produitNom) {
                // Ajouter la clé au tableau $cles
                $cles[] = $cle;
            }
        }
        
        $produitsNom = $this->apiModelClients->getDBProduitsNom(implode(", ", $cles));
        Model::sendJSON($this->formatDataProduits($produitsNom));
    }
    public function getProduitsNomAutoCompletion() {
        $produitsNomID = $this->apiModelClients->getDBProduitsNomID();
               
        $nomsProduits = array_map(function($produit) {
            return $this->remplacerCaracteresSpeciaux($produit['Nom']);
        }, $produitsNomID);
    
        // Supprimer les doublons
        $arrayUnique = array_unique($nomsProduits);
    
        // Ré-indexer les clés du tableau
        $arraySansCles = array_values($arrayUnique);
    
        Model::sendJSON($arraySansCles);
    }


    public function getProduitsCategories($idCategories) {
        $produitsCategories = $this->apiModelClients->getDBProduitsCategories($idCategories);
        Model::sendJSON($this->formatDataProduits($produitsCategories));
    } 

    public function insertProduitPanier() {
        $produitPanier = Controller::getDonnees();
        $this->apiModelClients->insertDBProduitPanier($produitPanier);
        Controller::sendMessage("Ajouter avec succès");
    }

    public function getProduitsPanier($produitsPanier) {
        $panier = $this->apiModelClients->getDBProduitsPanier($produitsPanier);
        Model::sendJSON($this->formatDataPanier($panier));
    }

    public function getPointsRetrait() {
        $pointsRetrait = $this->apiModelClients->getDBPointsRetrait();
        Model::sendJSON($pointsRetrait);
    }

    public function validerPanier() {
        $validerPanier = Controller::getDonnees();
        $this->apiModelClients->validerDBPanier($validerPanier);
        Controller::sendMessage("Validation du panier !");
    }

    public function deleteProduitPanier() {
        $produit = Controller::getDonnees();
        $this->apiModelClients->deleteDBProduitPanier($produit);
        Controller::sendMessage("Suppression du produit réussi !");
    }

    private function formatDataPanier($panier) {  
        $tab = [];
        foreach($panier as $valeur) {
            if(!array_key_exists($valeur["ID"], $tab)) {
                $tab[] = [
                    "id" => $valeur["ID"],
                    "idProduitVendeur" => $valeur["idProduitVendeur"],
                    "prix" => $valeur["Prix"],
                    "note" => $valeur["Note"],
                    "fraisLivraison" => $valeur["FraisLivraison"],
                    "nomProduit" => $valeur["Nom"],
                    "picture" => $valeur["Picture"],
                    "idVendeur" => $valeur["idVendeur"],
                    "quantiteDisponible" => $valeur["QuantiteDisponible"],
                    "nbProduits" => $valeur["nbProduits"]
                ];
            }
        }
        return $tab;
    }



    private function formatDataClients($clients) {
        $tab = [];
        foreach($clients as $client) {
            if(!array_key_exists("0", $tab)) {
                $tab[0] = [
                    "id" => $client["idClient"],
                    "prenom" => $client["Prenom"],
                    "nomUtilisateur" => $client["NomUtilisateur"],
                    "adresse" => $client["Adresse"],
                    "adresseMail" => $client["AdresseMail"],
                    "telephone" => $client["TEL"],
                    "mdp" => $client["MDP"],
                    "estAbonne" => $client["estAbonne"],
                    
                    "panier" => [
                        "idPanier" => $client["panierID"],
                        "estValide" => $client["estValide"],
                        "quantite" => $client["Quantite"],
                        "note" => $client["Note"],
                        
                    ]
                ];
            }


            $tab[0]["panier"]["produits"][] = [
                "quantiteDisponible" => $client["QuantiteDisponible"],
                "prix" => $client["Prix"],
                "estDisponible" => $client["estDisponible"],
                "dateEstimeLivraison" => $client["dateEstimeLivraison"],
                "fraisLivraison" => $client["FraisLivraison"],
                "nomProduit" => $client["NomProduit"],
                "picture" => $client["Picture"],
                "description" => $client["Description_Prod"],
                "poid" => $client["Poid"],
                "note" => $client["Note"],
                "categorie" => $client["Categorie"]
            ];
        }
        return $tab;
    }

    private function formatDataProduits($produits) {
        $tab = [];
        foreach($produits as $produit) {
            if(!array_key_exists($produit["ID"], $tab)) {
                $tab[] = [
                    "idProduitVendeur" => $produit["ID"],
                    "quantiteDisponible" => $produit["QuantiteDisponible"],
                    "prix" => $produit["Prix"],
                    "estDisponible" => $produit["estDisponible"],
                    "quantiteVendu" => $produit["QuantiteVendu"],
                    "prixVendu" => $produit["PrixVendu"],
                    "dateEstimeLivraison" => $produit["dateEstimeLivraison"],
                    "fraisLivraison" => $produit["FraisLivraison"],
                    "idProduit" => $produit["idProduit"],   
                    "nomProduit" => $produit["NomProduit"],
                    "picture" => $produit["Picture"],
                    "description" => $produit["Description_Prod"],
                    "poid" => $produit["Poid"],
                    "note" => $produit["Note"],
                    "categorie" => $produit["Categorie"]
                ];
            }  
        }
        return $tab;
    }

    private function formatDataCategories($categories) {
        $tab = [];
        foreach($categories as $categorie) {
            if(!array_key_exists($categorie["ID"], $tab)) {
                $tab[] = [
                    "id" => $categorie["ID"],
                    "nomCategorie" => $categorie["Categorie"]
                ];
            }
        }
        return $tab;
    }

    // Fonction pour remplacer les caractères spéciaux par leur lettre initiale, supprimer les espaces et mettre en minuscules
    function remplacerCaracteresSpeciaux($str)
    {
        // Tableau de correspondance pour les caractères spéciaux
        $correspondances = array(
            'à' => 'a',
            'â' => 'a',
            'ä' => 'a',
            'á' => 'a',
            'æ' => 'ae',
            'ç' => 'c',
            'è' => 'e',
            'é' => 'e',
            'ê' => 'e',
            'ë' => 'e',
            'î' => 'i',
            'ï' => 'i',
            'í' => 'i',
            'ô' => 'o',
            'ö' => 'o',
            'ò' => 'o',
            'ó' => 'o',
            'œ' => 'oe',
            'ù' => 'u',
            'û' => 'u',
            'ü' => 'u',
            'ú' => 'u',
            'ÿ' => 'y',
            // Ajoutez d'autres correspondances si nécessaire
        );

        // Remplacer les caractères spéciaux par leur lettre initiale
        $str = strtr($str, $correspondances);

        // Supprimer les espaces
        $str = str_replace(' ', '', $str);

        // Mettre en minuscules
        $str = strtolower($str);

        // Retourner la chaîne modifiée
        return $str;
    }




    
   

    // public function sendMessage()
    // {
       
    //     $messageRetour = [
    //         // 'from' => $obj->email,
    //         // 'to' => ""
    //         "message" => "Reçu avec succès"
    //     ];  

    //     header("Content-Type: application/json;charset=utf-8");
    //     echo json_encode($messageRetour, JSON_UNESCAPED_UNICODE);
    // }

    
}