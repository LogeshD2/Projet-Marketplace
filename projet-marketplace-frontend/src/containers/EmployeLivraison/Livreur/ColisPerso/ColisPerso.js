// Librairie
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classes from "./ColisPerso.module.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ColisPerso() {
  // State COLIS
  const [colis, setColiss] = useState();

  const idLivreur = useSelector(
    (state) => state.client.clientInfo && state.client.clientInfo.utilisateur.ID
  );

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
    getColisPerso();
  }, []);

  const getColisPerso = () => {
    fetch(
      `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/employeLivraison/livreurs/livreurs/${idLivreur}`
    )
      .then((response) => response.json())
      .then((data) => {
        setColiss(data.colis);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const DisplayedColis =
    colis &&
    colis.map((colisperso) => (
      <>
        <div class={classes.commandesCard}>
          <div class={classes.card}>
            <div class={classes.contentBx}>
              <h2>Colis n° {colisperso.IDColis}</h2>

              <div class={classes.size}>
                <h3>Client : n° {colisperso.IDClient}</h3>
              </div>

              <div class={classes.size}>
                <h3>A livrer le : {colisperso.DateLivraison}</h3>
              </div>

              <Link to={`/livreurs/colis/${colisperso.IDColis}`}>Détails</Link>
            </div>
          </div>
        </div>
      </>
    ));

  return (
    <div class="container">
      <div className={classes.Accueil}>
        <h1 style={{ textAlign: "center" }}>Accueil</h1>

        <h2 style={{ textAlign: "left" }}>Les colis à livrer</h2>

        <div className={classes.commandes}>{DisplayedColis}</div>
      </div>
    </div>
  );
}
