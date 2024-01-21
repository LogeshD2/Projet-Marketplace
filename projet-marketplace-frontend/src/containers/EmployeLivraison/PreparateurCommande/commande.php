<?php
session_start();
?>
<!DOCTYPE html>
<html>
<head>
</head>
<body>
    
<?php   
// Connexion à la base de données
require_once('connexion_bd.php');
$connexion = connexion_bd();  

// Récupération des données de la base de données

// Récupération des ID des commandes
$sql = "SELECT Commande.ID FROM Commande WHERE aPaye = 1";
$result = $connexion->query($sql);
$rows = $result->fetchAll(PDO::FETCH_ASSOC);
$tableau1 = array();

foreach ($rows as $row) {
    $idCommande = $row['ID'];
    
    // Calcul du nombre de cartons
    $sql = "SELECT Produit.Poid FROM Produit INNER JOIN Produit_Vendeur ON Produit.ID = Produit_Vendeur.idProduit INNER JOIN Produits_Panier ON Produit_Vendeur.ID = Produits_Panier.idProduit_Vendeur INNER JOIN Panier ON Produits_Panier.idPanier = Panier.ID INNER JOIN Commande ON Panier.ID = Commande.idPanier WHERE Commande.ID = $idCommande";
    $result2 = $connexion->query($sql);
    $tableau2 = array();
    $nbCartons = 1;
    $PoidTotal = 0;

    while ($row2 = $result2->fetch(PDO::FETCH_ASSOC)) {
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
    $sql = "UPDATE Preparateur_Commande INNER JOIN Commande ON Preparateur_Commande.ID = Commande.idPreparateur_Commande SET Preparateur_Commande.nbCartons = $nbCartons WHERE Commande.ID = $idCommande";
    $result = $connexion->query($sql);

    // Récupération de l'ID du client
    $sql = "SELECT Client.ID FROM Client INNER JOIN Panier ON Client.idPanier = Panier.ID INNER JOIN Commande ON Panier.ID = Commande.idPanier WHERE Commande.ID = $idCommande";
    $result3 = $connexion->query($sql);
    $client = $result3->fetch(PDO::FETCH_ASSOC);
    $idClient = $client['ID'];

    // Récupération des produits de la commande
    $sql = "SELECT Produit.ID, Produit.Nom FROM Produit INNER JOIN Produit_Vendeur ON Produit.ID = Produit_Vendeur.idProduit INNER JOIN Produits_Panier ON Produit_Vendeur.ID = Produits_Panier.idProduit_Vendeur INNER JOIN Panier ON Produits_Panier.idPanier = Panier.ID INNER JOIN Commande ON Panier.ID = Commande.idPanier WHERE Commande.ID = $idCommande";
    $result4 = $connexion->query($sql);
    $tableau3 = array();

    while ($row3 = $result4->fetch(PDO::FETCH_ASSOC)) {
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

$json = json_encode($tableau1, JSON_PRETTY_PRINT);
echo $json;
file_put_contents('commande.json', $json);
