<?php

require_once "Models/Model.php";


class APIModelInscription extends Model {

    public function DBInscription($utilisateur) {
        $nom = $utilisateur->nom;
        $prenom = $utilisateur->prenom;
        $adresse = $utilisateur->adresse;
        $mail = $utilisateur->adresseMail;
        $tel = $utilisateur->numeroTelephone;
        $password= password_hash($utilisateur->motDePasse, PASSWORD_DEFAULT);
        $typeUtilisateur = $utilisateur->typeUtilisateur;
        // $typeUtilisateur = "vendeurParticulier";


        $stmt = $this->getBdd()->prepare("SELECT COUNT(*) AS nbAdresseMail FROM Utilisateur WHERE AdresseMail = :adresseMail");
        $stmt->bindValue(":adresseMail", $mail);
        $stmt->execute();
        $nbMail = $stmt->fetch(PDO::FETCH_ASSOC);
        if($nbMail['nbAdresseMail'] == 0) {


            try {
                // Démarrer une transaction
                $this->getBdd()->beginTransaction();
                
            
                // Requête 1 - Insertion dans la table Utilisateur
                $stmt = $this->getBdd()->prepare("INSERT INTO Utilisateur (Nom, Prenom, Adresse, AdresseMail, TEL, MDP) VALUES (:nom, :prenom, :adresse, :mail, :tel, :mdp)");
                $stmt->bindValue(":nom", $nom);
                $stmt->bindValue(":prenom", $prenom);
                $stmt->bindValue(":adresse", $adresse);
                $stmt->bindValue(":mail", $mail);
                $stmt->bindValue(":tel", $tel);
                $stmt->bindValue(":mdp", $password);
                $stmt->execute();
                $idUser = $this->getBdd()->lastInsertId();
    
                switch ($typeUtilisateur) {
                    
                    case "client":

                       
                        $stmt = $this->getBdd()->prepare("INSERT INTO Panier (estValide, Quantite) VALUES (:estValide, :quantite)");
                        $stmt->bindValue(":estValide", 0);
                        $stmt->bindValue(":quantite", 0);
                        $stmt->execute();
                        $idPanier = $this->getBdd()->lastInsertId();

                        $stmt = $this->getBdd()->prepare("INSERT INTO Client (estAbonne, idUtilisateur, idPanier) VALUES (:estAbonne,:idUtilisateur,:idPanier)");
                        $stmt->bindValue(":estAbonne", 0);
                        $stmt->bindValue(":idUtilisateur", $idUser);
                        $stmt->bindValue(":idPanier", $idPanier);
                        $stmt->execute();

                        break;

                    case "vendeur":
                        $typeVendeur = $utilisateur->typeVendeur;    

                        $stmt = $this->getBdd()->prepare("INSERT INTO Vendeur (ChiffreAffaires, ChiffreAffairesPotentiels, idUtilisateur) VALUES (:chiffreAffaires,:chiffreAffairesPotentiels,:idUtilisateur)");
                        $stmt->bindValue(":chiffreAffaires", 0);
                        $stmt->bindValue(":chiffreAffairesPotentiels", 0);
                        $stmt->bindValue(":idUtilisateur", $idUser);
                        $stmt->execute();
                        $idVendeur=$this->getBdd()->lastInsertId();

                        $date = new DateTime();
                        $date->add(new DateInterval('P5Y')); // Ajouter 3 années à la date actuelle
                        

                        $stmt = $this->getBdd()->prepare("INSERT INTO Contrat (DureeContrat, Commission, DateFin, TempsRestant, estActif) VALUES (:dureeContrat,:comission,:dateFin,:tempsRestant,:estActif)");
                        $stmt->bindValue(":dureeContrat","5 ans");
                        $stmt->bindValue(":comission", 50);
                        $stmt->bindValue(":dateFin", $date->format('Y-m-d'));
                        $stmt->bindValue(":tempsRestant", 5);
                        $stmt->bindValue(":estActif", 0);

                        $stmt->execute();
                        $idcontrat=$this->getBdd()->lastInsertId();

                        $stmt = $this->getBdd()->prepare("INSERT INTO Vendeur_Externe (peutVendre, types, nomShop, idVendeur, idContrat) VALUES (:peutVendre,:types,:nomShop,:idVendeur,:idContrat)");
                        $stmt->bindValue(":peutVendre",0);
                        $stmt->bindValue(":types", $typeVendeur);
                        $stmt->bindValue(":nomShop", "Apple");
                        $stmt->bindValue(":idVendeur", $idVendeur);
                        $stmt->bindValue(":idContrat", $idcontrat);

                        $stmt->execute();
                        $idVendeur=$this->getBdd()->lastInsertId();

                        break;

                    case "employeLivraison":
                        $nomEntreprise = $utilisateur->entreprise;
                        $typeEmployeLivraison = $utilisateur->typeEmployeLivraison;

                        $stmt = $this->getBdd()->prepare("INSERT INTO Employe_Livraison (NomEntreprise, TypePermis, idUtilisateur,idVehicule) VALUES (:nomEntreprise,:typePermis,:idUtilisateur,:idVehicule)");
                        $stmt->bindValue(":nomEntreprise", $nomEntreprise);
                        $stmt->bindValue(":typePermis", "Permis B");
                        $stmt->bindValue(":idUtilisateur", $idUser);
                        $stmt->bindValue(":idVehicule", 37);                        
                        $stmt->execute();

                        $idEmployeLivraison=$this->getBdd()->lastInsertId();

                        if($typeEmployeLivraison === "livreur") {
                            $stmt = $this->getBdd()->prepare("INSERT INTO Livreur (aPermis, EstDisponible, idEmploye_Livraison) VALUES (:aPermis,:estDisponible,:idEmploye_Livraison)");
                            $stmt->bindValue(":aPermis", 0);
                            $stmt->bindValue(":estDisponible",1);
                            $stmt->bindValue(":idEmploye_Livraison", $idEmployeLivraison);

                            $stmt->execute();
                        } 

                        if($typeEmployeLivraison === "preparateurCommande") {
                            $stmt = $this->getBdd()->prepare("INSERT INTO Preparateur_Commande (nbCartons, idEmploye_Livraison) VALUES (:nbCartons,:idEmploye_Livraison)");
                            $stmt->bindValue(":nbCartons", 0);
                            $stmt->bindValue(":idEmploye_Livraison", $idEmployeLivraison);
                            $stmt->execute();
                            break;
                        }
                        break;
                    default:
                        echo "Erreur! Authentification Arretée";
                        break;
                }
                // Valider la transaction
                $this->getBdd()->commit();
            
            } catch (PDOException $e) {
                // En cas d'erreur, annuler la transaction
                $this->getBdd()->rollBack();
                // Gérer l'erreur ou la soulever pour la traiter plus haut dans le code
                throw new Exception("Erreur lors de l'exécution des requêtes SQL : " . $e->getMessage());
            }        
        }
    }

}