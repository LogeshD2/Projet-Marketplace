<?php 

define("URL", str_replace("index.php", "", (isset($_SERVER['HTTPS']) ? "https" : "http") .
    "://$_SERVER[HTTP_HOST]$_SERVER[PHP_SELF]"));


require_once "Controllers/Clients/API.controller.clients.php";
require_once "Controllers/Vendeurs/API.controller.vendeurs.php";
require_once "Controllers/Vendeurs/API.controller.admin.php";
require_once "Controllers/Connexion/API.controller.connexion.php";
require_once "Controllers/Inscription/API.controller.inscription.php";
require_once "Controllers/EmployeLivraison/API.controller.preparateurCommande.php";
require_once "Controllers/EmployeLivraison/API.controller.livreur.php";




$apiControllerClients = new APIControllerClients();
$apiControllerVendeur = new APIControllerVendeurs();
$apiControllerAdmin = new APIControllerAdmin();
$apiControllerConnexion = new APIControllerConnexion();
$apiControllerInscription = new APIControllerInscription();
$apiControllerPreparateurCommande = new APIControllerPreparateurCommande();
$apiControllerLivreur = new APIControllerLivreur();



try {
    if (empty($_GET["page"])) {
        throw new Exception("La page est introuvable");
    } else {
        $url = explode("/", filter_var($_GET["page"], FILTER_SANITIZE_URL));
        if(empty($url[0])) throw new Exception("La page n'existe pas");
        switch($url[0]) {
            case "clients":
               if(!empty($url[1])) {
                    switch($url[1]) {
                        case "clients":
                            if(empty($url[2])) {
                                // $apiControllerClients->getClients();
                            } else {
                                $apiControllerClients->getClient($url[2]);
                            }
                            break;
                        case "produits":
                            if(empty($url[2])) {
                                $apiControllerClients->getProduits();
                            } else {
                                $apiControllerClients->getProduit($url[2]);
                            }
                            break;
                        case "categories":
                            $apiControllerClients->getCategories();
                            break;
                        case "produitsNom":
                            if(empty($url[2])) {
                                echo "Pas produits nom";
                            } else {
                                $apiControllerClients->getProduitsNom(urldecode($url[2]));
                            }
                            break;
                        case "produitsNomAutoCompletion":
                            $apiControllerClients->getProduitsNomAutoCompletion();
                            break;
                        case "produitsCategories":
                            if(empty($url[2])) {
                                $apiControllerClients->getProduits();
                            } else {
                                $idCategories = [];

                                for($i=2; $i<count($url); $i++) {
                                    $idCategories[] = $url[$i];
                                }

                                $idCategories = implode(",", $idCategories);
                                $idCategories = rtrim($idCategories, ",");

                                $apiControllerClients->getProduitsCategories($idCategories);
                            }
                            break;
                        case "updatePanier":
                            $apiControllerClients->insertProduitPanier();
                            break;
                        case "panier":
                            if(empty($url[2])) {
                                echo "non panier";
                            } else {
                                $apiControllerClients->getProduitsPanier($url[2]);
                            }
                            break;
                        case "pointsRetrait":
                            $apiControllerClients->getPointsRetrait();
                            break;
                        case "supprimerProduitsPanier":
                            $apiControllerClients->deleteProduitPanier();
                            break;
                        case "validerPanier":
                            $apiControllerClients->validerPanier();
                            break;

                    }
               } else {
                echo "Page non client";
               }
                break;
            case "vendeur":
               if(!empty($url[1])) {
                switch($url[1]) {
                    case "interne":
                        if(!empty($url[2])) {
                            switch($url[2]) {
                                case "produit":
                                    if(!empty($url[3])) {
                                        switch($url[3]) {
                                            case "ajouter":
                                                $apiControllerAdmin->insertProduit();
                                                break;
                                            case "modifier":
                                                $apiControllerAdmin->updateProduit();
                                                break;
                                            case "supprimer":
                                                $apiControllerAdmin->deleteProduit();
                                                break;
                                        }
                                    } else {
                                        echo "pas produits";     
                                    }
                                    break;
                                case "adresse":
                                    if(!empty($url[3])) {
                                        switch($url[3]) {
                                            case "ajouter":
                                                $apiControllerAdmin->insertPointRetrait();
                                                break;
                                            case "modifier":
                                                $apiControllerAdmin->updatePointRetrait();
                                                break;
                                            case "supprimer":
                                                $apiControllerAdmin->deletePointRetrait();
                                                break;
                                        }
                                    } else {
                                        echo "pas produits";     
                                    }   
                                    break;
                                case "categorie":
                                    if(!empty($url[3])) {
                                        switch($url[3]) {
                                            case "ajouter":
                                                $apiControllerAdmin->insertCategorie();
                                                break;
                                            case "modifier":
                                                $apiControllerAdmin->updateCategorie();
                                                break;
                                            case "supprimer":
                                                $apiControllerAdmin->deleteCategorie();
                                                break;
                                        }
                                    } else {
                                        echo "pas produits";     
                                    }   
                                    break;
                            }
                        }
                        else {
                            $apiControllerAdmin->getAdmin();
                        }   
                        break;
                    case "externe":
                        if(empty($url[2])) {
                            echo "non vendeur exxterne";
                        } else {
                            $apiControllerVendeur->getVendeur($url[2]);    
                        }   
                       break;
                  }
               } else {
                echo "page non vendeur";
               }
                break;
            case "employeLivraison":
                if(empty($url[1])) {
                    echo "pas employe livraison";
                }
                else {
                    switch($url[1]) {
                        case "livreurs":
                            switch($url[2]) {
                                case "livreurs":
                                    if(!empty($url[3])) {
                                        $apiControllerLivreur->getLivreur($url[3]);
                                    }
                                    else {
                                        echo "non livreur";
                                    }   
                                    break;
                                case "colis":
                                    if(!empty($url[3])) {
                                        $apiControllerLivreur->getOneColis($url[3]);
                                    }
                                    else {
                                        $apiControllerLivreur->getColis();  
                                    }
                                    break;
                                case "choisirColis":
                                    $apiControllerLivreur->chooseColis();
                                    break;
                                case "colisLivrer":
                                    $apiControllerLivreur->colisLivrer();
                                    break;
                            }
                            break;
                        case "preparateurCommandes":
                            switch($url[2]) {
                                case "preparateurCommandes":
                                    if(!empty($url[3])) {
                                        $apiControllerPreparateurCommande->getPreparateurCommande($url[3]);    
                                    }
                                    else {
                                        echo "non preparateur";
                                    }
                                    break;
                                case "commandes":
                                    if(!empty($url[3])) {
                                        $apiControllerPreparateurCommande->getCommande($url[3]);
                                    }
                                    else {
                                        $apiControllerPreparateurCommande->getCommandes();  
                                    }
                                    break;
                                case "choisirCommande":
                                    $apiControllerPreparateurCommande->chooseCommande();
                                    break;
                                case "estPrepare":
                                    $apiControllerPreparateurCommande->estPrepare();
                                    break;
                            }
                            break;
                    }
                }
                break;
            case "inscription":
                $apiControllerInscription->Inscription();
                break;
            case "connexion":
                $apiControllerConnexion->Connexion();
                break;

          
            
        }
    }
} catch(Exception $e) {
    $message = $e->getMessage();
    echo $message;
}