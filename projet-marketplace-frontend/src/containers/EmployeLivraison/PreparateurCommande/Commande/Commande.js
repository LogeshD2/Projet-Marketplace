import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import commande from "./Commande.json";
import classes from "./Commande.module.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Commande() {
  const token = "";
  const { id } = useParams();
  const [commande, setCommande] = useState();

  const navigate = useNavigate();

  const idPreparateurCommande = useSelector(
    (state) =>
      state.client.clientInfo && state.client.clientInfo.IDPreparateurCommande
  );

  const typeUtilisateur = useSelector(
    (state) =>
      state.client.clientInfo && state.client.clientInfo.typeUtilisateur
  );

  if (typeUtilisateur != "preparateurCommande" || typeUtilisateur == null) {
    navigate("/clients", { replace: true });
    console.log("ok");
  }

  const DisplayedCommandesProduits =
    commande && commande.Produits.map((produits) => <p>{produits.Nom}</p>);

  useEffect(() => {
    getCommande();
  }, []);

  const getCommande = () => {
    fetch(
      `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/employeLivraison/preparateurCommandes/commandes/${id}`
    )
      .then((response) => response.json())
      .then((data) => {
        setCommande(data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log(commande && commande);
  // Fonction appelée dès que l'on envoie notre formulaire
  const handleSubmitChoisir = (event) => {
    event.preventDefault();
    const sendBody = {
      idPreparateurCommande: idPreparateurCommande,
      idCommande: commande && commande.IDCommande,
    };
    console.log(sendBody);
    fetch(
      `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/employeLivraison/preparateurCommandes/choisirCommande`,
      {
        method: "PUT",
        body: JSON.stringify(sendBody),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        toast.success(data.message);
        navigate("/preparateur_commandes/mes_commandes", { replace: true });
        // Traitement de la réponse du serveur
        console.log(data);
      })
      .catch((error) => {
        // Gestion des erreurs
        console.error("Erreur:", error);
      });
    // Do something with the updated quantity and price values
    console.log("Choisir");
  };

  const handleSubmitPreparer = (event) => {
    event.preventDefault();
    const sendBody = {
      idPreparateurCommande: idPreparateurCommande,
      idCommande: commande && commande.IDCommande,
    };
    fetch(
      `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/employeLivraison/preparateurCommandes/estPrepare`,
      {
        method: "PUT",
        body: JSON.stringify(sendBody),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Traitement de la réponse du serveur
        toast.success(data.message);
        navigate("/preparateur_commandes/", { replace: true });
        console.log(data);
      })
      .catch((error) => {
        // Gestion des erreurs
        console.error("Erreur:", error);
      });
  };

  return (
    <div class={classes.wrapper}>
      <div class={classes.titre}>
        <h1>Commande n°{id}</h1>
        <hr />
        <div class={classes.description}>
          <p>
            <b>Client : </b>n°{commande && commande.IDClient}
          </p>
          <p>
            <b>Liste des produits</b>
          </p>
          {DisplayedCommandesProduits}
          <p>
            <b>Nombre de cartons nécessaires : </b>
            {commande && commande.nbCartons}
          </p>
        </div>
        {commande && commande.IDPreparateurCommande == null ? (
          <button onClick={handleSubmitChoisir}>Choisir</button>
        ) : (
          <button onClick={handleSubmitPreparer}>Préparer</button>
        )}
      </div>
    </div>
  );
}
