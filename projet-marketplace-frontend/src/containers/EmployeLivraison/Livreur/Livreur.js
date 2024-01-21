// Librairie
import React, { useEffect, useState } from "react";
import classes from "./Livreur.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Livreur() {
  // State COLIS
  const [colis, setColis] = useState();

  const navigate = useNavigate();

  const typeUtilisateur = useSelector(
    (state) =>
      state.client.clientInfo && state.client.clientInfo.typeUtilisateur
  );

  if (typeUtilisateur != "livreur" || typeUtilisateur == null) {
    navigate("/clients", { replace: true });
    console.log("ok");
  }

  useEffect(() => {
    getColis();
  }, []);

  const getColis = () => {
    fetch(
      "https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/employeLivraison/livreurs/colis"
    )
      .then((response) => response.json())
      .then((data) => {
        setColis(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const DisplayedColis =
    colis &&
    colis.map((oneColis) => (
      <>
        <div class={classes.commandesCard}>
          <div class={classes.card}>
            <div class={classes.contentBx}>
              <h2>colis n° {oneColis.IDColis}</h2>

              <div class={classes.size}>
                <h3>Client : n° {oneColis.IDClient}</h3>
              </div>

              <div class={classes.size}>
                <h3>A livrer le : {oneColis.DateLivraison}</h3>
              </div>

              <Link to={`/livreurs/colis/${oneColis.IDColis}`}>Détails</Link>
            </div>
          </div>
        </div>
      </>
    ));

  return (
    <div className="container">
      <div className={classes.Accueil}>
        <h1 style={{ textAlign: "center" }}>Accueil</h1>

        <h2 style={{ textAlign: "left" }}>Les colis à livrer</h2>

        <div className={classes.commandes}>{DisplayedColis}</div>
      </div>
    </div>
  );
}
