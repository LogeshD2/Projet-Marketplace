<?php
// Connexion à la base de données
require_once('connexion_bd.php');
$connexion = connexion_bd(); 

// Récupérer l'identifiant unique de la commande depuis la variable POST
$idCommande = filter_var($_POST['IDCommande'], FILTER_VALIDATE_INT);

// Exécuter la mise à jour de la commande
$sql = "UPDATE Colis INNER JOIN Commande ON Colis.idCommande = Commande.ID SET Colis.estPrepare = 1 WHERE Commande.ID = $idCommande";
$result = $connexion->query($sql);

$sql = "DELETE FROM Commande WHERE Commande.ID = $idCommande";
$result = $connexion->query($sql);

// Vérifier si la mise à jour a réussi
if ($result === TRUE) {
    // Fermer la connexion à la base de données
    $connexion->close();

} else {

    // La mise à jour a échoué
    echo 'Erreur lors de la mise à jour de la commande : ' . mysqli_error($connexion);

    // Fermer la connexion à la base de données
    $connexion->close();

}
?>
