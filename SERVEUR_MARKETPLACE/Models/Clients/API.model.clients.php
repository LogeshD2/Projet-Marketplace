<?php

require_once "Models/Model.php";


class APIModelClients extends Model {

    // public function getDBClients() {

        
    //     $req = "SELECT u.ID, u.Nom AS NomUtilisateur, u.Prenom, u.Adresse, u.AdresseMail, u.TEL, u.MDP, 
    //         c.estAbonne, 
    //         pa.ID as panierID, pa.estValide, pa.Quantite, 
    //         pv.QuantiteDisponible, pv.Prix, pv.estDisponible, pv.QuantiteVendu, pv.PrixVendu, pv.dateEstimeLivraison, pv.FraisLivraison,
    //         p.Nom AS NomProduit, p.Picture, p.Description_Prod, p.Poid, p.Note,
    //         ca.Categorie
    //         FROM Client c
    //         INNER JOIN Utilisateur u ON u.ID = c.idUtilisateur  
    //         INNER JOIN Panier pa ON c.idPanier = pa.ID  
    //         INNER JOIN Produit_Vendeur pv ON pa.ID = pv.idPanier 
    //         INNER JOIN Produit p ON pv.idProduit = p.ID  
    //         INNER JOIN Categorie ca ON p.idCategorie = ca.ID 
    //     ";
    //     $stmt = $this->getBdd()->prepare($req);
    //     $stmt->execute();
    //     $clients = $stmt->fetchAll(PDO::FETCH_ASSOC);
    //     $stmt->closeCursor();
    //     return($clients);

    // }  

    public function getDBClient($idClient) {    

        $req = "SELECT COUNT(*) AS 'nbClient' FROM Client c
            INNER JOIN Utilisateur u ON u.ID = c.idUtilisateur  
            INNER JOIN Panier pa ON c.idPanier = pa.ID  
            INNER JOIN Produits_Panier p_pa ON pa.ID = p_pa.idPanier
            INNER JOIN Produit_Vendeur pv ON p_pa.idProduit_Vendeur = pv.ID 
            WHERE u.ID = :idClient";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":idClient", $idClient, PDO::PARAM_INT);
        $stmt->execute();
        $nbClient = $stmt->fetch(PDO::FETCH_ASSOC);
        

        if($nbClient['nbClient'] == 0) {
            $req = "SELECT u.ID AS idUtilisateur, u.Nom AS NomUtilisateur, u.Prenom, u.Adresse, u.AdresseMail, u.TEL, u.MDP, 
                c.ID AS idClient, c.estAbonne, 
                pa.ID as panierID, pa.estValide, pa.Quantite
                FROM Client c
                INNER JOIN Utilisateur u ON u.ID = c.idUtilisateur  
                INNER JOIN Panier pa ON c.idPanier = pa.ID  
                WHERE u.ID = :idClient";
        } else {
            $req = "SELECT u.ID AS idUtilisateur, u.Nom AS NomUtilisateur, u.Prenom, u.Adresse, u.AdresseMail, u.TEL, u.MDP, 
                c.ID AS idClient, c.estAbonne, 
                pa.ID as panierID, pa.estValide, pa.Quantite, 
                pv.QuantiteDisponible, pv.Prix, pv.estDisponible, pv.QuantiteVendu, pv.PrixVendu, pv.dateEstimeLivraison, pv.FraisLivraison,
                p.Nom AS NomProduit, p.Picture, p.Description_Prod, p.Poid, p.Note,
                ca.Categorie
                FROM Client c
                INNER JOIN Utilisateur u ON u.ID = c.idUtilisateur  
                INNER JOIN Panier pa ON c.idPanier = pa.ID  
                INNER JOIN Produits_Panier p_pa ON pa.ID = p_pa.idPanier
                INNER JOIN Produit_Vendeur pv ON p_pa.idProduit_Vendeur = pv.ID 
                INNER JOIN Produit p ON pv.idProduit = p.ID  
                INNER JOIN Categorie ca ON p.idCategorie = ca.ID 
                WHERE u.ID = :idClient;
        ";
        }
        
        
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":idClient", $idClient, PDO::PARAM_INT);
        $stmt->execute();
        $client = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt->closeCursor();
        return $client;
    }  

    public function getDBProduits() {
        $req = "SELECT pv.ID, pv.QuantiteDisponible, pv.Prix, pv.estDisponible, pv.QuantiteVendu, pv.PrixVendu, pv.dateEstimeLivraison, pv.FraisLivraison, pv.idProduit,
            p.Nom AS NomProduit, p.Picture, p.Description_Prod, p.Poid, p.Note,
            ca.Categorie
            FROM Produit_Vendeur pv
            INNER JOIN Produit p ON pv.IdProduit = p.ID
            INNER JOIN Categorie ca ON p.idCategorie = ca.ID
            WHERE pv.QuantiteDisponible > 0
        ";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->execute();
        $produits = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt->closeCursor();
        return $produits;
    }

    public function getDBProduit($idProduit) {
        $req = "SELECT pv.ID, pv.QuantiteDisponible, pv.Prix, pv.estDisponible, pv.QuantiteVendu, pv.PrixVendu, pv.dateEstimeLivraison, pv.FraisLivraison, pv.idProduit,
            p.Nom AS NomProduit, p.Picture, p.Description_Prod, p.Poid, p.Note,
            ca.Categorie
            FROM Produit_Vendeur pv
            INNER JOIN Produit p ON pv.idProduit = p.ID
            INNER JOIN Categorie ca ON p.idCategorie = ca.ID
            AND pv.ID = :idProduitVendeur
        ";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":idProduitVendeur", $idProduit);
        $stmt->execute();
        $produits = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt->closeCursor();
        return $produits;
    }

    public function getDBCategories() {
        $req = "SELECT * FROM Categorie";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->execute();
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt->closeCursor();
        return $categories;
    }

    public function getDBProduitsNomID() {
        $req = "SELECT ID,Nom FROM Produit";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->execute();
        $produitsNomID = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt->closeCursor();
        return $produitsNomID;
    }
    public function getDBProduitsNom($produitsNomID) {
        $req = "SELECT pv.ID, pv.QuantiteDisponible, pv.Prix, pv.estDisponible, pv.QuantiteVendu, pv.PrixVendu, pv.dateEstimeLivraison, pv.FraisLivraison, pv.idProduit,
            p.Nom AS NomProduit, p.Picture, p.Description_Prod, p.Poid, p.Note,
            ca.Categorie
            FROM Produit_Vendeur pv
            INNER JOIN Produit p ON pv.IdProduit = p.ID
            INNER JOIN Categorie ca ON p.idCategorie = ca.ID
            WHERE p.ID IN ($produitsNomID)
        ";
        $stmt = $this->getBdd()->prepare($req);

        foreach ($produitsNomID as $index => $id) {
            $stmt->bindValue(($index + 1), $id, PDO::PARAM_INT); 
        }

        $stmt->execute();
        $produitsNom = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt->closeCursor();
        return $produitsNom; 
    }

    public function getDBProduitsCategories($idCategories) {
        $req = "SELECT pv.ID, pv.QuantiteDisponible, pv.Prix, pv.estDisponible, pv.QuantiteVendu, pv.PrixVendu, pv.dateEstimeLivraison, pv.FraisLivraison, pv.idProduit,
        p.Nom AS NomProduit, p.Picture, p.Description_Prod, p.Poid, p.Note,
        ca.Categorie
        FROM Produit_Vendeur pv
        INNER JOIN Produit p ON pv.IdProduit = p.ID
        INNER JOIN Categorie ca ON p.idCategorie = ca.ID
        WHERE ca.ID IN ($idCategories)"; // Utiliser les placeholders dans la requête

        $stmt = $this->getBdd()->prepare($req);

        // Lier les valeurs des IDs de catégories en tant que paramètres à la requête préparée
        foreach ($idCategories as $index => $id) {
            $stmt->bindValue(($index + 1), $id, PDO::PARAM_INT); // Paramètre est de type entier
        }

        $stmt->execute();
        $produitsCategories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt->closeCursor();
        return $produitsCategories;  
    }

    public function insertDBProduitPanier($produit) {
        for ($i = 1; $i <= $produit->quantite; $i++) {
            $req = "INSERT INTO Produits_Panier (idPanier, idProduit_Vendeur) VALUES (:idPanier, :idProduit_Vendeur)";
            $stmt = $this->getBdd()->prepare($req);
            $stmt->bindValue(":idPanier", $produit->idPanier);
            $stmt->bindValue(":idProduit_Vendeur", $produit->idProduit_Vendeur);
            $stmt->execute();
        }
        
        $req = "UPDATE Produit_Vendeur 
        SET QuantiteDisponible = QuantiteDisponible - :quantite 
        WHERE ID = :idProduit_Vendeur";

        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":quantite", $produit->quantite);
        $stmt->bindValue(":idProduit_Vendeur", $produit->idProduit_Vendeur);
        $stmt->execute();
        $stmt->closeCursor();

    }
    
    public function getDBProduitsPanier($produitsPanier) {
        $req = "SELECT p.Nom, p.Picture, p.Note, p.idVendeur as idVendeur, pv.QuantiteDisponible, pv.ID as idProduitVendeur, pv.Prix, pv.FraisLivraison, pa.ID, COUNT(*) AS nbProduits
            FROM Produit p
            INNER JOIN Produit_Vendeur pv ON p.ID = pv.idProduit
            INNER JOIN Produits_Panier pp ON pv.ID = pp.idProduit_Vendeur
            INNER JOIN Panier pa ON pp.idPanier = pa.ID
            WHERE pa.ID = :idPanier
            GROUP BY p.Nom, p.Picture, pv.quantiteDisponible, pv.Prix, pv.FraisLivraison;        
        ";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":idPanier", $produitsPanier);
        $stmt->execute();
        $panier = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt->closeCursor();
        return $panier;
    }

    public function validerDBPanier($validerPanier) {
        $req = "INSERT INTO Commande (aPaye, idClient, idPanier)
            VALUES (:aPaye, :idClient, :idPanier)";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":aPaye", 1);
        $stmt->bindValue(":idClient", $validerPanier->idClient);
        $stmt->bindValue(":idPanier", $validerPanier->idPanier);
        $stmt->execute();
        $idCommande = $this->getBdd()->lastInsertId();

        

        $req = "INSERT INTO Colis (adresseLivraison, estPrepare, idClient, idPoint_Retrait, idCommande, modeLivraison)
            VALUES(:adresseLivraison, :estPrepare, :idClient, :idPoint_Retrait, :idCommande, :modeLivraison)
        ";
        $stmt = $this->getBdd()->prepare($req);
        if($validerPanier->modeLivraison == "domicile") {
            $stmt->bindValue(":adresseLivraison", $validerPanier->adresseClient);
            $stmt->bindValue(":idPoint_Retrait", NULL);
            $stmt->bindValue(":modeLivraison", "domicile");
        } else {
            $sql = "SELECT ID, adresseRetrait FROM Point_Retrait WHERE ID=:idPoint_Retrait";
            $stmt2 = $this->getBdd()->prepare($sql);
            $stmt2->bindValue(":idPoint_Retrait", $validerPanier->modeLivraison);
            $stmt2->execute();
            $pointRetrait = $stmt2->fetch(PDO::FETCH_ASSOC);
            $stmt2->closeCursor();
            $stmt->bindValue(":adresseLivraison", $pointRetrait['adresseRetrait']);
            $stmt->bindValue(":idPoint_Retrait", $pointRetrait['ID']);
            $stmt->bindValue(":modeLivraison", "pointRetrait");
        }
        $stmt->bindValue(":estPrepare", 0);
        $stmt->bindValue(":idClient", $validerPanier->idClient);
        $stmt->bindValue(":idCommande", $idCommande);
        $stmt->execute();

        
        $produitsPanier = $validerPanier->panier;
        
        foreach($produitsPanier as $produitPanier) {
            $sql = "SELECT COUNT(*) AS nbProduits, idProduit_Vendeur FROM Vente WHERE idProduit_Vendeur=:idProduitVendeur AND idVendeur=:idVendeur
            ";
            $stmt2 = $this->getBdd()->prepare($sql);
            $stmt2->bindValue(":idProduit_Vendeur", $produitPanier->idProduitVendeur);
            $stmt2->bindValue(":idVendeur", $produitPanier->idVendeur);
            $stmt2->execute();
            $req = "INSERT INTO Vente (Montant, Notes, idProduit_Vendeur, idVendeur)
            VALUES (:montant, :notes, :idProduit_Vendeur, :idVendeur)"
            ;
            $stmt = $this->getBdd()->prepare($req);
            $stmt->bindValue(":montant", $produitPanier->nbProduits * $produitPanier->prix);
            $stmt->bindValue(":notes", $produitPanier->note);
            $stmt->bindValue(":idProduit_Vendeur", $produitPanier->idProduitVendeur);
            $stmt->bindValue(":idVendeur", $produitPanier->idVendeur);
            $stmt->execute();
           
        }

        $req = "DELETE FROM Produits_Panier WHERE idPanier = :idPanier";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":idPanier", $validerPanier->idPanier);
        $stmt->execute();        
        
    }

    public function getDBPointsRetrait() {
        $stmt = $this->getBdd()->prepare("SELECT * FROM Point_Retrait") ;
        $stmt->execute();
        $pointsRetrait= $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $pointsRetrait;
    }

    public function deleteDBProduitPanier($produit) {

        $req="SELECT COUNT(*) AS nbProduits 
            FROM Produits_Panier 
            WHERE idProduit_Vendeur=:idProduitVendeur AND idPanier=:idPanier"
        ;
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":idProduitVendeur", $produit->idProduitVendeur);
        $stmt->bindValue(":idPanier", $produit->idPanier);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC); 
        $nbProduits = $result['nbProduits'];

        $req= "UPDATE Produit_Vendeur 
            SET QuantiteDisponible = QuantiteDisponible + :quantite
            WHERE ID = :idProduitVendeur"
        ;
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":quantite", $nbProduits);
        $stmt->bindValue(":idProduitVendeur", $produit->idProduitVendeur);
        $stmt->execute();


        $req = "DELETE FROM Produits_Panier WHERE idProduit_Vendeur = :idProduitVendeur AND idPanier = :idPanier"
        ;
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":idProduitVendeur", $produit->idProduitVendeur);
        $stmt->bindValue(":idPanier", $produit->idPanier);
        $stmt->execute();
    }
} 