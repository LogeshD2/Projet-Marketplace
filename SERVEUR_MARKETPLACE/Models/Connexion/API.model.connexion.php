<?php

require_once "Models/Model.php";


class APIModelConnexion extends Model {
    
    public function DBConnexion($utilisateur) {
            // Récupération des données de la table "Utilisateur"
        $adresse = $utilisateur->adresseMail;
        $stmt = $this->getBdd()->prepare("SELECT AdresseMail, MDP FROM Utilisateur WHERE AdresseMail= :mail");
        $stmt->bindParam(':mail', $adresse);
        $stmt->execute();
        if($stmt->rowCount() != 0) {
            $utilisateurNonConnecte = $stmt->fetch(PDO::FETCH_ASSOC);
            $verifyPassword = password_verify($utilisateur->motDePasse, $utilisateurNonConnecte["MDP"]);
            if($verifyPassword) {
                $stmt = $this->getBdd()->prepare("SELECT * FROM Utilisateur WHERE AdresseMail= :mail");
                $stmt->bindParam(':mail', $utilisateur->adresseMail);
                $stmt->execute();
                $utilisateurConnecte = array();
                while($utilisateurConnecte = $stmt->fetch(PDO::FETCH_ASSOC)){
                    $utilisateurConnecte;
                    $stmt = $this->getBdd()->prepare("SELECT * FROM Client WHERE idUtilisateur= :id") ;
                    $stmt->bindParam(':id', $utilisateurConnecte["ID"]);
                    $stmt->execute();
                    if ($stmt->rowCount() != 0) {
                        $typeUtilisateur="Client";
                    }
    
                    $stmt = $this->getBdd()->prepare("SELECT * FROM Livreur INNER JOIN Employe_Livraison ON Livreur.idEmploye_Livraison= Employe_Livraison.ID WHERE Employe_Livraison.idUtilisateur= :id") ;
                    $stmt->bindParam(':id', $utilisateurConnecte["ID"]);
                    $stmt->execute();
                    if ($stmt->rowCount() != 0) {
                        $typeUtilisateur="Livreur";
                    }
    
                    $stmt = $this->getBdd()->prepare("SELECT * FROM Preparateur_Commande INNER JOIN Employe_Livraison ON Preparateur_Commande.idEmploye_Livraison= Employe_Livraison.ID WHERE Employe_Livraison.idUtilisateur= :id") ;
                    $stmt->bindParam(':id', $utilisateurConnecte["ID"]);
                    $stmt->execute();
                    if ($stmt->rowCount() != 0) {
                        $typeUtilisateur="Preparateur_Commande";
                    }
    
                    $stmt = $this->getBdd()->prepare("SELECT * FROM Vendeur_Externe INNER JOIN Vendeur ON Vendeur_Externe.idVendeur = Vendeur.ID WHERE Vendeur.idUtilisateur= :id") ;
                    $stmt->bindParam(':id', $utilisateurConnecte["ID"]);
                    $stmt->execute();
                    if ($stmt->rowCount() != 0) {
                        $typeUtilisateur="Vendeur";
                    }

                    $stmt = $this->getBdd()->prepare("SELECT * FROM Vendeur_Interne INNER JOIN Vendeur ON Vendeur_Interne.idVendeur = Vendeur.ID WHERE Vendeur.idUtilisateur= :id") ;
                    $stmt->bindParam(':id', $utilisateurConnecte["ID"]);
                    $stmt->execute();
                    if ($stmt->rowCount() != 0) {
                        $typeUtilisateur="Admin";
                    }

                    $utilisateurConnecte["Utilisateur"]=$typeUtilisateur;
                    return $utilisateurConnecte;
                }
            }
        }
       
    }
}