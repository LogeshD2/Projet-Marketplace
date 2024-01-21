import React, { useEffect, useState } from "react";
import classes from "./CommandePerso.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CommandePerso() {
  // Librairie

  // State COMMANDE
  const [commandes, setCommandes] = useState();

  const idPreparateurCommande = useSelector(
    (state) => state.client.clientInfo && state.client.clientInfo.utilisateur.ID
  );

  const navigate = useNavigate();

  const typeUtilisateur = useSelector(
    (state) =>
      state.client.clientInfo && state.client.clientInfo.typeUtilisateur
  );

  if (typeUtilisateur != "preparateurCommande" || typeUtilisateur == null) {
    navigate("/clients", { replace: true });
    console.log("ok");
  }

  useEffect(() => {
    getCommandePerso();
  }, []);

  const getCommandePerso = () => {
    fetch(
      `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/employeLivraison/preparateurCommandes/preparateurCommandes/${idPreparateurCommande}`
    )
      .then((response) => response.json())
      .then((data) => {
        setCommandes(data.commandes);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log(commandes && commandes);

  const DisplayedCommandes =
    commandes &&
    commandes.map((commandeperso) => (
      <>
        <div class={classes.commandesCard}>
          <div class={classes.card}>
            <div class={classes.contentBx}>
              <h2>Commande n° {commandeperso.IDCommande}</h2>

              <div class={classes.size}>
                <h3>Client : n° {commandeperso.IDClient}</h3>
              </div>

              <div class={classes.size}>
                <h3>
                  Nombre de cartons nécessaires : {commandeperso.nbCartons}
                </h3>
              </div>

              <Link
                to={`/preparateur_commandes/commandes/${commandeperso.IDCommande}`}
              >
                Détails
              </Link>
            </div>
          </div>
        </div>
      </>
    ));

  return (
    <div class="container">
      <div className={classes.Accueil}>
        <h1 style={{ textAlign: "center" }}>Accueil</h1>

        <h2 style={{ textAlign: "left" }}>Vos commandes à preparer</h2>

        <div className={classes.commandes}>{DisplayedCommandes}</div>
      </div>
    </div>
  );
}
