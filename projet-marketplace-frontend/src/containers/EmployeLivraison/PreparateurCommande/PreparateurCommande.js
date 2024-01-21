// Librairie
import React, { useEffect, useState } from "react";
import classes from "./PreparateurCommande.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PreparateurCommande() {
  // State COMMANDE
  const [commandes, setCommandes] = useState();

  const clientInfo = useSelector(
    (state) =>
      state.client.clientInfo && state.client.clientInfo.IDPreparateurCommande
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

  console.log(clientInfo);
  useEffect(() => {
    getCommandes();
  }, []);

  const getCommandes = () => {
    fetch(
      "https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/employeLivraison/preparateurCommandes/commandes"
    )
      .then((response) => response.json())
      .then((data) => {
        setCommandes(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const DisplayedCommandes =
    commandes &&
    commandes.map((commande) => (
      <>
        <div class={classes.commandesCard}>
          <div class={classes.card}>
            <div class={classes.contentBx}>
              <h2>Commande n° {commande.IDCommande}</h2>

              <div class={classes.size}>
                <h3>Client : n° {commande.IDClient}</h3>
              </div>

              <div class={classes.size}>
                <h3>Nombre de cartons nécessaires : {commande.nbCartons}</h3>
              </div>

              <Link
                to={`/preparateur_commandes/commandes/${commande.IDCommande}`}
              >
                Détails
              </Link>
            </div>
          </div>
        </div>
      </>
    ));

  return (
    <div className="container">
      <div className={classes.Accueil}>
        <h1 style={{ textAlign: "center" }}>Accueil</h1>

        <h2 style={{ textAlign: "left" }}>Les commandes à preparer</h2>

        <div className={classes.commandes}>{DisplayedCommandes}</div>
      </div>
    </div>
  );
}
