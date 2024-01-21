<?php

require_once "Models/Model.php";


class APIModelAdmin extends Model {

    public function getDBAdmin() {
        $token = 1;
        $stmt = $this->getBdd()->prepare("SELECT * FROM Vendeur WHERE idUtilisateur= :id") ;
        $stmt->bindParam(':id', $token);
        $stmt->execute();
        $data1 = $stmt->fetch(PDO::FETCH_ASSOC);
        
        //comparaison idvendeur avant sa suppréssion
        $ID=$data1["ID"];
        if (!empty($data1)) {       
            unset($data["ID"]);
            unset($data["idUtilisateur"]);
        }
        $json1=json_encode($data1, JSON_PRETTY_PRINT);


        //récupération de tous les produits de ce vendeur
        $stmt = $this->getBdd()->prepare("SELECT Produit.ID as ID, Produit.Nom, Produit.Picture, 
        Produit_Vendeur.ID as idProduitVendeur, Produit_Vendeur.QuantiteDisponible, Produit_Vendeur.Prix, Produit_Vendeur.QuantiteVendu, Produit_Vendeur.PrixVendu, 
        Produit.Description_Prod, Categorie.Categorie, Produit.Poid 
        FROM Produit 
        INNER JOIN Produit_Vendeur 
        ON Produit.ID = Produit_Vendeur.idProduit 
        INNER JOIN Vendeur ON Produit.idVendeur=Vendeur.ID 
        INNER JOIN Categorie ON Produit.idCategorie = Categorie.ID 
        WHERE Produit.idVendeur= :id") ;
        $stmt->bindParam(':id', $ID);
        $stmt->execute();
        $data2 = array();
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data2[]=$row;
        }
        $json2=json_encode($data2, JSON_PRETTY_PRINT);


        //récupération historique des ventes
        $stmt = $this->getBdd()->prepare("SELECT Vente.DateTransaction, Produit.ID, Produit.Nom, Produit_Vendeur.QuantiteVendu, Produit_Vendeur.PrixVendu FROM Vente INNER JOIN Produit_Vendeur ON Vente.idProduit_Vendeur = Produit_Vendeur.ID INNER JOIN Produit ON Produit_Vendeur.idProduit = Produit.ID WHERE Vente.idVendeur = :id") ;
        $stmt->bindParam(':id', $ID);
        $stmt->execute();
        $data3 = array();
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data3[]=$row;
        }
        $json3=json_encode($data3, JSON_PRETTY_PRINT);


        //récupération Contract
        $stmt = $this->getBdd()->prepare("SELECT Contrat.DureeContrat,Vendeur_Externe.nomShop,Contrat.estActif , Contrat.DateFin, Contrat.TempsRestant, Contrat.Commission FROM Vendeur_Externe INNER JOIN Contrat ON Vendeur_Externe.idContrat=Contrat.ID") ;
        $stmt->execute();
        $data4 = array();
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data4[]=$row;
        }

        //rajout du lien de la boutique
        if (!empty($data4)) {
            foreach ($data4 as &$data) {
                $data["shopLink"]="/Vendeur/".$data["nomShop"];
            }
        }

        //classement en fonction de si les contrats sont actifs ou non
        $data5 = array(
            'inActivity' => array(),
            'inDemand' => array()
        );

        $stmt = $this->getBdd()->prepare("SELECT Contrat.DureeContrat,Contrat.estActif , Contrat.DateFin, Contrat.TempsRestant, Contrat.Commission FROM Vendeur_Interne INNER JOIN Contrat ON Vendeur_Interne.idContrat=Contrat.ID") ;
        $stmt->execute();
        $interne = array();
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $interne[]=$row;
        }
        array_push($data5['inActivity'], $interne);

        if (!empty($data4)) {
            foreach ($data4 as &$data) {
                if ($data["estActif"] == 1) {
                    array_push($data5['inActivity'], $data);
                }
                else{
                    array_push($data5['inDemand'], $data);   
                }
            }
        }

        $json4=json_encode($data5, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);


        $stmt = $this->getBdd()->prepare("SELECT * FROM Utilisateur WHERE ID= :id") ;
        $stmt->bindParam(':id', $token);
        $stmt->execute();
        $data5=$stmt->fetch(PDO::FETCH_ASSOC);
        $json5=json_encode($data5, JSON_PRETTY_PRINT);

            //récupération des Catégories
        $stmt = $this->getBdd()->prepare("SELECT ID, Categorie FROM Categorie") ;
        $stmt->execute();
        $data6=array();
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data6[]=$row;
        }
        $json6=json_encode($data6, JSON_PRETTY_PRINT);

        $stmt = $this->getBdd()->prepare("SELECT ID, adresseRetrait FROM Point_Retrait") ;
        $stmt->execute();
        $data7=array();
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data7[]=$row;
        }
        $json7=json_encode($data7, JSON_PRETTY_PRINT);

        $contacts = array(
            $json1,
            $json2,
            $json3,
            $json4,
            $json5,
            $json6,
            $json7
        );
        // $json=json_encode($contacts,JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        return $contacts;
    }

    public function insertDBProduit($produit) {
        $req = "INSERT INTO Produit (Nom, Picture, Description_Prod, Poid, Note, idVendeur, idCategorie)
        VALUES (:nom, :picture, :description, :poid, :note, :idvendeur, :idcategorie)";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":nom", $produit->productName);
        $stmt->bindValue(":picture", $produit->image);
        $stmt->bindValue(":description", $produit->description);
        $stmt->bindValue(":poid", $produit->weight);
        $stmt->bindValue(":note", "0/0/0");
        $stmt->bindValue(":idvendeur", $produit->idSolder);
        $stmt->bindValue(":idcategorie", $produit->category);
        $stmt->execute();
        $idProduit = $this->getBdd()->lastInsertId();

       

        
        $req = "INSERT INTO Produit_Vendeur (QuantiteDisponible, Prix, EstDisponible, QuantiteVendu, PrixVendu, dateEstimeLivraison, FraisLivraison, idProduit) 
            VALUES (:quantiteDisponible, :prix, :estDisponible, :quantiteVendu, :prixVendu, :dateEstimeLivraison, :fraisLivraison, :idProduit)";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":quantiteDisponible", $produit->quantity);
        $stmt->bindValue(":prix", $produit->price);
        $stmt->bindValue(":estDisponible", 1);
        $stmt->bindValue(":quantiteVendu", 0);
        $stmt->bindValue(":prixVendu", 0);
        $stmt->bindValue(":dateEstimeLivraison", NULL);
        $stmt->bindValue(":fraisLivraison", 5);
        $stmt->bindValue(":idProduit", $idProduit);
        $stmt->execute();
    }

    public function updateDBProduit($produit) {
        $req = "UPDATE Produit SET Nom = :nom, Picture = :picture, Description_Prod = :description, Poid = :poid, idCategorie = :idcategorie
        WHERE ID = :id";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":nom", $produit->productName);
        $stmt->bindValue(":picture", $produit->image);
        $stmt->bindValue(":description", $produit->description);
        $stmt->bindValue(":poid", $produit->weight);
        $stmt->bindValue(":idcategorie", $produit->category);
        $stmt->bindValue(":id", $produit->idProduct);
        $stmt->execute();


        $req = "UPDATE Produit_Vendeur 
            SET QuantiteDisponible = :quantiteDisponible,
            Prix = :prix
            WHERE ID = :id";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":quantiteDisponible", $produit->quantity);
        $stmt->bindValue(":prix", $produit->price);
        $stmt->bindValue(":id", $produit->idSolderProduct);
        $stmt->execute();

    }

    public function deleteDBProduit($produit) {
        $req = "DELETE FROM Produit_Vendeur WHERE ID = :id";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":id", $produit->idSolderProduct);
        $stmt->execute();

        $req = "DELETE FROM Produit WHERE ID = :id";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":id", $produit->idProduct);
        $stmt->execute();
    }

    public function insertDBPointRetrait($pointRetrait) {
        $req = "INSERT INTO Point_Retrait (adresseRetrait) 
                VALUES (:adresseRetrait)";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":adresseRetrait", $pointRetrait->address);
        $stmt->execute();
    }

    public function updateDBPointRetrait($pointRetrait) {
        $req = "UPDATE Point_Retrait SET adresseRetrait = :adresseRetrait 
                WHERE ID = :id";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":adresseRetrait", $pointRetrait->address);
        $stmt->bindValue(":id", $pointRetrait->idPointRetrait);
        $stmt->execute();
    }

    public function deleteDBPointRetrait($pointRetrait) {
        $req = "DELETE FROM Point_Retrait WHERE ID = :id";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":id", $pointRetrait->idAddress);
        $stmt->execute(); 
    }

    public function insertDBCategorie($categorie) {
        $req = "INSERT INTO Categorie (Categorie) 
        VALUES (:categorie)";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":categorie", $categorie->categoryName);
        $stmt->execute();
    }

    public function updateDBCategorie($categorie) {
        $req = "UPDATE Categorie 
        SET Categorie = :categorie 
        WHERE ID = :id";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":categorie", $categorie->categoryName);
        $stmt->bindValue(":id", $categorie->id);
        $stmt->execute();
    }

    public function deleteDBCategorie($categorie) {
        $req = "DELETE FROM Categorie 
        WHERE ID = :id";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":id", $categorie->id);
        $stmt->execute();
    }

}