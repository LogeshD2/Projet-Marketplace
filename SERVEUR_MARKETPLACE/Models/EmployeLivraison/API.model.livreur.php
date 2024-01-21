<?php


require_once "Models/Model.php";


class APIModelLivreur extends Model{
    
    public function getDBLivreur($token) {

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

        $stmt = $this->getBdd()->prepare("SELECT ID, aPermis, EstDisponible FROM Livreur WHERE idEmploye_Livraison= :id") ;
        $stmt->bindParam(':id', $employeLivraison['ID']);
        $stmt->execute();
        $data2=$stmt->fetch(PDO::FETCH_ASSOC);
        $livreur = $data2;


        $sql = "SELECT ID FROM Colis WHERE estPrepare = 1 AND idLivreur = :idLivreur";
        $stmt = $this->getBdd()->prepare($sql);
        $stmt->bindParam(':idLivreur', $livreur['ID']);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $tableau4 = array();


        foreach ($rows as $row) {
            $idColis = $row['ID'];
            // Récupération de l'ID du client
            $sql = "SELECT idClient FROM Colis WHERE ID = :idColis";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idColis", $idColis);
            $stmt->execute();
            $client2 = $stmt->fetch(PDO::FETCH_ASSOC);
            $idClient2 = $client2['idClient'];

            // Récupération de la date de livraison
            $sql = "SELECT dateLivraison FROM Colis WHERE ID = :idColis";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idColis", $idColis);
            $stmt->execute();
            $date = $stmt->fetch(PDO::FETCH_ASSOC);
            $dateLivraison = $date['dateLivraison'];


            // Choix du véhicule
            $sql = "SELECT Preparateur_Commande.nbCartons 
                FROM Preparateur_Commande 
                INNER JOIN Colis ON Preparateur_Commande.ID = Colis.idPreparateur_Commande 
                WHERE Colis.ID = $idColis";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idColis", $idColis);
            $stmt->execute();
            $cartons = $stmt->fetch(PDO::FETCH_ASSOC);
            $nbCartons = $cartons['nbCartons'];
            $typeVehicule = '';


            if ($nbCartons <= 10) {
                $typeVehicule = 'voiture';
            } 
            else if ($nbCartons > 10 && $nbCartons <= 30) {
                $typeVehicule = 'camionnette';
            }
            else {
                $typeVehicule = 'camion';
            }
            
            // Récupération du mode de livraison
            $sql = "SELECT modeLivraison FROM Colis WHERE ID = :idColis";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idColis", $idColis);
            $stmt->execute();
            $mode = $stmt->fetch(PDO::FETCH_ASSOC);
            $modeLivraison = $mode['modeLivraison'];


            // Récupération de l'adresse de livraison
            if ($modeLivraison == 'domicile') {
                $sql = "SELECT Utilisateur.Adresse 
                    FROM Utilisateur 
                    INNER JOIN Client ON Utilisateur.ID = Client.idUtilisateur 
                    INNER JOIN Colis ON Client.ID = Colis.idClient 
                    WHERE Colis.ID = :idColis";
                $stmt = $this->getBdd()->prepare($sql);
                $stmt->bindValue(":idColis", $idColis);
                $stmt->execute();
                $adresse = $stmt->fetch(PDO::FETCH_ASSOC);
                $adresseLivraison = $adresse['Adresse'];
            }
            else {
                $sql = "SELECT Point_Retrait.adresseRetrait 
                    FROM Point_Retrait 
                    INNER JOIN Colis ON Point_Retrait.ID = Colis.idPoint_Retrait 
                    WHERE Colis.ID = :idColis";
                $stmt = $this->getBdd()->prepare($sql);
                $stmt->bindValue(":idColis", $idColis);
                $stmt->execute();
                $adresse = $stmt->fetch(PDO::FETCH_ASSOC);
                $adresseLivraison = $adresse['adresseRetrait'];
            }


            // Récupération des produits du colis
            $sql = "SELECT Produit.ID, Produit.Nom 
                FROM Produit 
                INNER JOIN Produit_Vendeur ON Produit.ID = Produit_Vendeur.idProduit 
                INNER JOIN Produits_Panier ON Produit_Vendeur.ID = Produits_Panier.idProduit_Vendeur 
                INNER JOIN Panier ON Produits_Panier.idPanier = Panier.ID 
                INNER JOIN Commande ON Panier.ID = Commande.idPanier 
                INNER JOIN Colis ON Commande.ID = Colis.idCommande 
                WHERE Colis.ID = :idColis";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idColis", $idColis);
            $stmt->execute();
            $tableau7 = array();

            while ($row7 = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $tableau7[] = array(
                    'ID' => $row7['ID'],
                    'Nom' => $row7['Nom']
                );
            }

            // Création du tableau pour l'objet JSON
            $data2 = array(
                'IDColis' => $idColis,
                'IDClient' => $idClient2,
                'Produits' => $tableau7,
                'modeLivraison' => $modeLivraison,
                'adresseLivraison' => $adresseLivraison,
                'DateLivraison' => $dateLivraison,
                'typeVehicule' => $typeVehicule,
            );
            $tableau4[] = $data2;
        }


        $tab = array(
            'utilisateur' => $utilisateur,
            'IDLivreur' => $livreur['ID'],
            'employeLivraison' => $employeLivraison, 
            'colis' => $tableau4
        );
        return $tab;
    
    }

    public function getDBColis() {
        $sql = "SELECT ID FROM Colis WHERE estPrepare = 1 AND idLivreur IS NULL";
        $result = $this->getBdd()->query($sql);
        $rows = $result->fetchAll(PDO::FETCH_ASSOC);
        $tableau4 = array();

        foreach ($rows as $row) {
            $idColis = $row['ID'];
            // Récupération de l'ID du client
            $sql = "SELECT idClient FROM Colis WHERE ID = :idColis";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idColis", $idColis);
            $stmt->execute();
            $client2 = $stmt->fetch(PDO::FETCH_ASSOC);
            $idClient2 = $client2['idClient'];


            // Récupération de la date de livraison
            $sql = "SELECT dateLivraison FROM Colis WHERE ID = :idColis";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idColis", $idColis);
            $stmt->execute();
            $date = $stmt->fetch(PDO::FETCH_ASSOC);
            $dateLivraison = $date['dateLivraison'];


            // Choix du véhicule
            $sql = "SELECT Preparateur_Commande.nbCartons 
                FROM Preparateur_Commande 
                INNER JOIN Colis ON Preparateur_Commande.ID = Colis.idPreparateur_Commande 
                WHERE Colis.ID = $idColis";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idColis", $idColis);
            $stmt->execute();
            $cartons = $stmt->fetch(PDO::FETCH_ASSOC);
            $nbCartons = $cartons['nbCartons'];
            $typeVehicule = '';


            if ($nbCartons <= 10) {
                $typeVehicule = 'voiture';
            } 
            else if ($nbCartons > 10 && $nbCartons <= 30) {
                $typeVehicule = 'camionnette';
            }
            else {
                $typeVehicule = 'camion';
            }
            
            // Récupération du mode de livraison
            $sql = "SELECT modeLivraison FROM Colis WHERE ID = :idColis";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idColis", $idColis);
            $stmt->execute();
            $mode = $stmt->fetch(PDO::FETCH_ASSOC);
            $modeLivraison = $mode['modeLivraison'];


            // Récupération de l'adresse de livraison
            if ($modeLivraison == 'domicile') {
                $sql = "SELECT Utilisateur.Adresse 
                    FROM Utilisateur 
                    INNER JOIN Client ON Utilisateur.ID = Client.idUtilisateur 
                    INNER JOIN Colis ON Client.ID = Colis.idClient 
                    WHERE Colis.ID = :idColis";
                $stmt = $this->getBdd()->prepare($sql);
                $stmt->bindValue(":idColis", $idColis);
                $stmt->execute();
                $adresse = $stmt->fetch(PDO::FETCH_ASSOC);
                $adresseLivraison = $adresse['Adresse'];
            }
            else {
                $sql = "SELECT Point_Retrait.adresseRetrait 
                    FROM Point_Retrait 
                    INNER JOIN Colis ON Point_Retrait.ID = Colis.idPoint_Retrait 
                    WHERE Colis.ID = :idColis";
                $stmt = $this->getBdd()->prepare($sql);
                $stmt->bindValue(":idColis", $idColis);
                $stmt->execute();
                $adresse = $stmt->fetch(PDO::FETCH_ASSOC);
                $adresseLivraison = $adresse['adresseRetrait'];
            }


            // Récupération des produits du colis
            $sql = "SELECT Produit.ID, Produit.Nom 
                FROM Produit 
                INNER JOIN Produit_Vendeur ON Produit.ID = Produit_Vendeur.idProduit 
                INNER JOIN Produits_Panier ON Produit_Vendeur.ID = Produits_Panier.idProduit_Vendeur 
                INNER JOIN Panier ON Produits_Panier.idPanier = Panier.ID 
                INNER JOIN Commande ON Panier.ID = Commande.idPanier 
                INNER JOIN Colis ON Commande.ID = Colis.idCommande 
                WHERE Colis.ID = :idColis
                ";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idColis", $idColis);
            $stmt->execute();
            $tableau7 = array();

            while ($row7 = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $tableau7[] = array(
                    'ID' => $row7['ID'],
                    'Nom' => $row7['Nom']
                );
            }

            // Création du tableau pour l'objet JSON
            $data2 = array(
                'IDColis' => $idColis,
                'IDClient' => $idClient2,
                'Produits' => $tableau7,
                'modeLivraison' => $modeLivraison,
                'adresseLivraison' => $adresseLivraison,
                'DateLivraison' => $dateLivraison,
                'typeVehicule' => $typeVehicule,
            );
            $tableau4[] = $data2;
        }
        
        return $tableau4;
    }


    public function getDBOneColis($idColis) {
        $sql = "SELECT ID, idLivreur FROM Colis WHERE estPrepare = 1 AND ID = :idColis";
        $stmt = $this->getBdd()->prepare($sql);
        $stmt->bindValue(":idColis", $idColis);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $tableau4 = array();
        $idLivreur = $rows['idLivreur'];

        foreach ($rows as $row) {
            $idColis = $row['ID'];
            // Récupération de l'ID du client
            $sql = "SELECT idClient FROM Colis WHERE ID = :idColis";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idColis", $idColis);
            $stmt->execute();
            $client2 = $stmt->fetch(PDO::FETCH_ASSOC);
            $idClient2 = $client2['idClient'];


            // Récupération de la date de livraison
            $sql = "SELECT dateLivraison FROM Colis WHERE ID = :idColis";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idColis", $idColis);
            $stmt->execute();
            $date = $stmt->fetch(PDO::FETCH_ASSOC);
            $dateLivraison = $date['dateLivraison'];


            // Choix du véhicule
            $sql = "SELECT Preparateur_Commande.nbCartons 
                FROM Preparateur_Commande 
                INNER JOIN Colis ON Preparateur_Commande.ID = Colis.idPreparateur_Commande 
                WHERE Colis.ID = $idColis";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idColis", $idColis);
            $stmt->execute();
            $cartons = $stmt->fetch(PDO::FETCH_ASSOC);
            $nbCartons = $cartons['nbCartons'];
            $typeVehicule = '';


            if ($nbCartons <= 10) {
                $typeVehicule = 'voiture';
            } 
            else if ($nbCartons > 10 && $nbCartons <= 30) {
                $typeVehicule = 'camionnette';
            }
            else {
                $typeVehicule = 'camion';
            }
            
            // Récupération du mode de livraison
            $sql = "SELECT modeLivraison FROM Colis WHERE ID = :idColis";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idColis", $idColis);
            $stmt->execute();
            $mode = $stmt->fetch(PDO::FETCH_ASSOC);
            $modeLivraison = $mode['modeLivraison'];


            // Récupération de l'adresse de livraison
            if ($modeLivraison == 'domicile') {
                $sql = "SELECT Utilisateur.Adresse 
                    FROM Utilisateur 
                    INNER JOIN Client ON Utilisateur.ID = Client.idUtilisateur 
                    INNER JOIN Colis ON Client.ID = Colis.idClient 
                    WHERE Colis.ID = :idColis";
                $stmt = $this->getBdd()->prepare($sql);
                $stmt->bindValue(":idColis", $idColis);
                $stmt->execute();
                $adresse = $stmt->fetch(PDO::FETCH_ASSOC);
                $adresseLivraison = $adresse['Adresse'];
            }
            else {
                $sql = "SELECT Point_Retrait.adresseRetrait 
                    FROM Point_Retrait 
                    INNER JOIN Colis ON Point_Retrait.ID = Colis.idPoint_Retrait 
                    WHERE Colis.ID = :idColis";
                $stmt = $this->getBdd()->prepare($sql);
                $stmt->bindValue(":idColis", $idColis);
                $stmt->execute();
                $adresse = $stmt->fetch(PDO::FETCH_ASSOC);
                $adresseLivraison = $adresse['adresseRetrait'];
            }


            // Récupération des produits du colis
            $sql = "SELECT Produit.ID, Produit.Nom 
                FROM Produit 
                INNER JOIN Produit_Vendeur ON Produit.ID = Produit_Vendeur.idProduit 
                INNER JOIN Produits_Panier ON Produit_Vendeur.ID = Produits_Panier.idProduit_Vendeur 
                INNER JOIN Panier ON Produits_Panier.idPanier = Panier.ID 
                INNER JOIN Commande ON Panier.ID = Commande.idPanier 
                INNER JOIN Colis ON Commande.ID = Colis.idCommande 
                WHERE Colis.ID = :idColis";
            $stmt = $this->getBdd()->prepare($sql);
            $stmt->bindValue(":idColis", $idColis);
            $stmt->execute();
            $tableau7 = array();

            while ($row7 = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $tableau7[] = array(
                    'ID' => $row7['ID'],
                    'Nom' => $row7['Nom']
                );
            }

            // Création du tableau pour l'objet JSON
            $data2 = array(
                'IDColis' => $idColis,
                'IDLivreur' => $rows[0]['idLivreur'],
                'IDClient' => $idClient2,
                'Produits' => $tableau7,
                'modeLivraison' => $modeLivraison,
                'adresseLivraison' => $adresseLivraison,
                'DateLivraison' => $dateLivraison,
                'typeVehicule' => $typeVehicule,
            );
            $tableau4[] = $data2;
        }
        return $tableau4;
    }

    public function chooseDBColis($livreur) {
        $req = "UPDATE Colis 
        SET idLivreur = :idLivreur 
        WHERE ID = :id";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":idLivreur", $livreur->idLivreur);
        $stmt->bindValue(":id", $livreur->idColis);
        $stmt->execute();
    }

    public function DBColisLivrer($livreur) {
        $req = "SELECT idCommande FROM Colis WHERE ID = :id"
        ;
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":id", $livreur->idColis);
        $stmt->execute();
        $idCommande = $stmt->fetch(PDO::FETCH_ASSOC);

        $req = "DELETE FROM Colis 
                WHERE ID = :id";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":id", $livreur->idColis);
        $stmt->execute();

        $req = "DELETE FROM Commande 
                WHERE ID = :id";
        $stmt = $this->getBdd()->prepare($req);
        $stmt->bindValue(":id", $idCommande['idCommande']);
        $stmt->execute();
    }

}