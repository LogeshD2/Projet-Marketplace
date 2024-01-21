<?php

require_once "Models/Model.php";

class APIModelVendeur extends Model {

    public function getDBVendeur($token) {

        $stmt = $this->getBdd()->prepare("SELECT * FROM Utilisateur WHERE ID= :id") ;
        $stmt->bindParam(':id', $token);
        $stmt->execute();
        $data1=$stmt->fetch(PDO::FETCH_ASSOC);

        $json1=json_encode($data1, JSON_PRETTY_PRINT);


        //récupération trésorerie
        $stmt = $this->getBdd()->prepare("SELECT * FROM Vendeur WHERE idUtilisateur= :id") ;
        $stmt->bindParam(':id', $token);
        $stmt->execute();
        $data2=$stmt->fetch(PDO::FETCH_ASSOC);


        //comparaison idvendeur avant sa suppréssion
        $ID=$data2["ID"];
        // if (!empty($data2)) {
        //     unset($data["ID"]);
        //     unset($data["idUtilisateur"]);
            
        // }
        $json2=json_encode($data2, JSON_PRETTY_PRINT);


        //récupération de tous les produits de ce vendeur
        $stmt = $this->getBdd()->prepare("SELECT Produit.ID as ID, Produit.Nom, Produit.Picture, 
            Produit_Vendeur.ID as idProduitVendeur, Produit_Vendeur.QuantiteDisponible, Produit_Vendeur.Prix, Produit_Vendeur.QuantiteVendu, Produit_Vendeur.PrixVendu, 
            Produit.Description_Prod, Categorie.Categorie, Produit.Poid 
            FROM Produit 
            INNER JOIN Produit_Vendeur 
            ON Produit.ID = Produit_Vendeur.idProduit 
            INNER JOIN Vendeur ON Produit.idVendeur=Vendeur.ID 
            INNER JOIN Categorie ON Produit.idCategorie = Categorie.ID 
            WHERE Produit.idVendeur= :id");
            
        $stmt->bindParam(':id', $ID);
        $stmt->execute();
        $data3=array();
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data3[]=$row;  
        }
        $json3=json_encode($data3, JSON_PRETTY_PRINT);


        //récupération historique des ventes
        $stmt = $this->getBdd()->prepare("SELECT Vente.DateTransaction, Produit.ID, Produit.Nom, Produit_Vendeur.QuantiteVendu, Produit_Vendeur.PrixVendu FROM Vente INNER JOIN Produit_Vendeur ON Vente.idProduit_Vendeur = Produit_Vendeur.ID INNER JOIN Produit ON Produit_Vendeur.idProduit = Produit.ID WHERE Vente.idVendeur = :id") ;
        $stmt->bindParam(':id', $ID);
        $stmt->execute();
        $data4=array();
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data4[]=$row;
        }
        $json4=json_encode($data4, JSON_PRETTY_PRINT);


        //récupération Contract
        $stmt = $this->getBdd()->prepare("SELECT Contrat.DureeContrat, Contrat.DateFin, Contrat.TempsRestant, Contrat.Commission FROM Vendeur_Externe INNER JOIN Contrat ON Vendeur_Externe.idContrat=Contrat.ID WHERE Vendeur_Externe.idVendeur= :id") ;
        $stmt->bindParam(':id', $ID);
        $stmt->execute();
        // $data5=array();
        $data5 = $stmt->fetch(PDO::FETCH_ASSOC);
        $json5=json_encode($data5, JSON_PRETTY_PRINT);

        //récupération des Catégories
        $stmt = $this->getBdd()->prepare("SELECT ID, Categorie FROM Categorie") ;
        $stmt->execute();
        $data6=array();
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data6[]=$row;
        }
        $json6=json_encode($data6, JSON_PRETTY_PRINT);

        // $contacts=array(
        //     'user'=>json_decode($json1), 
        //     'treasury'=>json_decode($json2),
        //     'products'=>json_decode($json3),
        //     'sold'=>json_decode($json4),
        //     'contract'=>json_decode($json5),
        //     'category' => json_decode($json6)
        // );

        $contacts = array(
            $json1,
            $json2,
            $json3,
            $json4,
            $json5,
            $json6
        );

        return $contacts;
    }
}

