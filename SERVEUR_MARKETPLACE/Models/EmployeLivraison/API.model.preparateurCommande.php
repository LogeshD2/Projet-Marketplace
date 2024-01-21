<?php

require_once "Models/Model.php";


class APIModelPreparateurCommande extends Model {


    public function getDBPreparateurCommande($token) {
        $stmt = $this->getBdd()->prepare("SELECT * FROM Utilisateur WHERE ID= :id") ;
        $stmt->bindParam(':id', $token);
        $stmt->execute();
        $data1=$stmt->fetch(PDO::FETCH_ASSOC);

        $utilisateur= $data1;

        $stmt = $this->getBdd()->prepare("SELECT ID, nomEntreprise FROM Employe_Livraison WHERE idUtilisateur= :id") ;
        $stmt->bindParam(':id', $token);
        $stmt->execute();
        $data2=$stmt->fetch(PDO::FETCH_ASSOC);
        $employeLivraison = $data2;

        $stmt = $this->getBdd()->prepare("SELECT ID FROM Preparateur_Commande WHERE idEmploye_Livraison= :id") ;
        $stmt->bindParam(':id', $employeLivraison['ID']);
        $stmt->execute();
        $data2=$stmt->fetch(PDO::FETCH_ASSOC);
        $preparateurCommande = $data2;

        
        // Récupération des ID des commandes
        $sql = "SELECT Commande.ID FROM Commande 
            WHERE aPaye = 1
            AND idPreparateur_Commande = :idPreparateur_Commande
            ";
        $stmt = $this->getBdd()->prepare($sql);
        $stmt->bindParam(':idPreparateur_Commande', $preparateurCommande['ID']);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($rows as $row) {
            $idCommande = $row['ID'];
            
            // Calcul du nombre de cartons
            $sql = "SELECT Produit.Poid FROM Produit INNER JOIN Produit_Vendeur ON Produit.ID = Produit_Vendeur.idProduit INNER JOIN Produits_Panier ON Produit_Vendeur.ID = Produits_Panier.idProduit_Vendeur INNER JOIN Panier ON Produits_Panier.idPanier = Panier.ID INNER JOIN Commande ON Panier.ID = Commande.idPanier WHERE Commande.ID = :idCommande";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idCommande", $idCommande);
            $stmt->execute();
            $tableau2 = array();
            $nbCartons = 1;
            $PoidTotal = 0;

            while ($row2 = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $tableau2[] = $row2['Poid'];
            }

            foreach ($tableau2 as $valeur) {
                $PoidTotal += $valeur;
                if ($PoidTotal > 20) {
                    $nbCartons++;
                    $PoidTotal = $valeur;
                }
            }
            
            //Mise à jour du nombre de cartons
            $sql = "UPDATE Preparateur_Commande INNER JOIN Commande ON Preparateur_Commande.ID = Commande.idPreparateur_Commande SET Preparateur_Commande.nbCartons = $nbCartons WHERE Commande.ID = :idCommande";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idCommande", $idCommande);
            $stmt->execute();

            // Récupération de l'ID du client
            $sql = "SELECT Client.ID FROM Client INNER JOIN Panier ON Client.idPanier = Panier.ID INNER JOIN Commande ON Panier.ID = Commande.idPanier WHERE Commande.ID = :idCommande";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idCommande", $idCommande);
            $stmt->execute();
            $client = $stmt->fetch(PDO::FETCH_ASSOC);
            $idClient = $client['ID'];

            // Récupération des produits de la commande
            $sql = "SELECT Produit.ID, Produit.Nom 
                FROM Produit INNER JOIN Produit_Vendeur ON Produit.ID = Produit_Vendeur.idProduit 
                INNER JOIN Produits_Panier ON Produit_Vendeur.ID = Produits_Panier.idProduit_Vendeur 
                INNER JOIN Panier ON Produits_Panier.idPanier = Panier.ID 
                INNER JOIN Commande ON Panier.ID = Commande.idPanier 
                WHERE Commande.ID = :idCommande";

            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idCommande", $idCommande);
            $stmt->execute();
            $tableau3 = array();

            while ($row3 = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $tableau3[] = array(
                    'ID' => $row3['ID'],
                    'Nom' => $row3['Nom']
                );
            }

            $data = array(
                'IDCommande' => $idCommande,
                'IDClient' => $idClient,
                'Produits' => $tableau3,
                'nbCartons' => $nbCartons,
            );

            $tableau1[] = $data;
        }

        $tab = array(
            'utilisateur' => $utilisateur,
            'IDPreparateurCommande' => $preparateurCommande['ID'],
            'employeLivraison' => $employeLivraison, 
            'commandes' => $tableau1  
        );

       
        return $tab;    
    }

    public function getDBCommandes() {

        // Récupération des ID des commandes
        $sql = "SELECT Commande.ID FROM Commande WHERE aPaye = 1 AND idPreparateur_Commande IS NULL";
        $result = $this->getBdd()->query($sql);
        $rows = $result->fetchAll(PDO::FETCH_ASSOC);
        $tableau1 = array();

        foreach ($rows as $row) {
            $idCommande = $row['ID'];
            
            // Calcul du nombre de cartons
            $sql = "SELECT Produit.Poid 
                FROM Produit 
                INNER JOIN Produit_Vendeur ON Produit.ID = Produit_Vendeur.idProduit 
                INNER JOIN Produits_Panier ON Produit_Vendeur.ID = Produits_Panier.idProduit_Vendeur 
                INNER JOIN Panier ON Produits_Panier.idPanier = Panier.ID 
                INNER JOIN Commande ON Panier.ID = Commande.idPanier 
                WHERE Commande.ID = :idCommande";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idCommande", $idCommande);
            $stmt->execute();
            $tableau2 = array();
            $nbCartons = 1;
            $PoidTotal = 0;

            while ($row2 = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $tableau2[] = $row2['Poid'];
            }

            foreach ($tableau2 as $valeur) {
                $PoidTotal += $valeur;
                if ($PoidTotal > 20) {
                    $nbCartons++;
                    $PoidTotal = $valeur;
                }
            }
            
            //Mise à jour du nombre de cartons
            $sql = "UPDATE Preparateur_Commande INNER JOIN Commande ON Preparateur_Commande.ID = Commande.idPreparateur_Commande SET Preparateur_Commande.nbCartons = $nbCartons WHERE Commande.ID = :idCommande";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idCommande", $idCommande);
            $stmt->execute();

            // Récupération de l'ID du client
            $sql = "SELECT Client.ID FROM Client INNER JOIN Panier ON Client.idPanier = Panier.ID INNER JOIN Commande ON Panier.ID = Commande.idPanier WHERE Commande.ID = :idCommande";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idCommande", $idCommande);
            $stmt->execute();
            $client = $stmt->fetch(PDO::FETCH_ASSOC);
            $idClient = $client['ID'];

            // Récupération des produits de la commande
            $sql = "SELECT Produit.ID, Produit.Nom 
                FROM Produit INNER JOIN Produit_Vendeur ON Produit.ID = Produit_Vendeur.idProduit 
                INNER JOIN Produits_Panier ON Produit_Vendeur.ID = Produits_Panier.idProduit_Vendeur 
                INNER JOIN Panier ON Produits_Panier.idPanier = Panier.ID 
                INNER JOIN Commande ON Panier.ID = Commande.idPanier 
                WHERE Commande.ID = :idCommande";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idCommande", $idCommande);
            $stmt->execute();

            $tableau3 = array();

            while ($row3 = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $tableau3[] = array(
                    'ID' => $row3['ID'],
                    'Nom' => $row3['Nom']
                );
            }

            // Création du tableau pour l'objet JSON
            $data = array(
                'IDCommande' => $idCommande,
                'IDClient' => $idClient,
                'Produits' => $tableau3,
                'nbCartons' => $nbCartons,
            );

            $tableau1[] = $data;
        }
        return $tableau1;
    }


    public function getDBCommande($idCommande) {
        $sql = "SELECT Commande.ID,  idPreparateur_Commande FROM Commande WHERE aPaye = 1 AND ID = :idCommande";
        $stmt = $this->getBdd()->prepare($sql);
        $stmt->bindValue(":idCommande", $idCommande);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $tableau1 = array();

        foreach ($rows as $row) {
            $idCommande = $row['ID'];
            
            // Calcul du nombre de cartons
            $sql = "SELECT Produit.Poid FROM Produit INNER JOIN Produit_Vendeur ON Produit.ID = Produit_Vendeur.idProduit INNER JOIN Produits_Panier ON Produit_Vendeur.ID = Produits_Panier.idProduit_Vendeur INNER JOIN Panier ON Produits_Panier.idPanier = Panier.ID INNER JOIN Commande ON Panier.ID = Commande.idPanier WHERE Commande.ID = :idCommande";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idCommande", $idCommande);
            $stmt->execute();
            $tableau2 = array();
            $nbCartons = 1;
            $PoidTotal = 0;

            while ($row2 = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $tableau2[] = $row2['Poid'];
            }

            foreach ($tableau2 as $valeur) {
                $PoidTotal += $valeur;
                if ($PoidTotal > 20) {
                    $nbCartons++;
                    $PoidTotal = $valeur;
                }
            }
            
            //Mise à jour du nombre de cartons
            $sql = "UPDATE Preparateur_Commande INNER JOIN Commande ON Preparateur_Commande.ID = Commande.idPreparateur_Commande SET Preparateur_Commande.nbCartons = $nbCartons WHERE Commande.ID = :idCommande";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idCommande", $idCommande);
            $stmt->execute();

            // Récupération de l'ID du client
            $sql = "SELECT Client.ID FROM Client INNER JOIN Panier ON Client.idPanier = Panier.ID INNER JOIN Commande ON Panier.ID = Commande.idPanier WHERE Commande.ID = :idCommande";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idCommande", $idCommande);
            $stmt->execute();
            $client = $stmt->fetch(PDO::FETCH_ASSOC);
            $idClient = $client['ID'];

            // Récupération des produits de la commande
            $sql = "SELECT Produit.ID, Produit.Nom 
                FROM Produit INNER JOIN Produit_Vendeur ON Produit.ID = Produit_Vendeur.idProduit 
                INNER JOIN Produits_Panier ON Produit_Vendeur.ID = Produits_Panier.idProduit_Vendeur 
                INNER JOIN Panier ON Produits_Panier.idPanier = Panier.ID 
                INNER JOIN Commande ON Panier.ID = Commande.idPanier 
                WHERE Commande.ID = :idCommande";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idCommande", $idCommande);
            $stmt->execute();

            $tableau3 = array();

            while ($row3 = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $tableau3[] = array(
                    'ID' => $row3['ID'],
                    'Nom' => $row3['Nom']
                );
            }

            // Création du tableau pour l'objet JSON
            $data = array(
                'IDCommande' => $idCommande,
                'IDPreparateurCommande' => $row['idPreparateur_Commande'],
                'IDClient' => $idClient,
                'Produits' => $tableau3,
                'nbCartons' => $nbCartons,
            );

            $tableau1[] = $data;
        }
        return $tableau1;
    }


    public function chooseDBCommande($preparateurCommande) {
        $req = "UPDATE Commande 
            SET idPreparateur_Commande = :idPreparateur_Commande 
            WHERE ID = :id";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":idPreparateur_Commande", $preparateurCommande->idPreparateurCommande);
        $stmt->bindValue(":id", $preparateurCommande->idCommande);
        $stmt->execute();   
    }

    public function DBestPrepare($preparateurCommande) {
        $req = "UPDATE Colis 
        SET idPreparateur_Commande = :idPreparateur_Commande, estPrepare = :estPrepare
        WHERE idCommande = :id";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":idPreparateur_Commande", $preparateurCommande->idPreparateurCommande);
        $stmt->bindValue(":estPrepare", 1);
        $stmt->bindValue(":id", $preparateurCommande->idCommande);
        $stmt->execute();

        $req = "UPDATE Commande 
            SET aPaye = :aPaye
            WHERE ID = :id";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":aPaye", 0);
        $stmt->bindValue(":id", $preparateurCommande->idCommande);
        $stmt->execute();
    }   

}