// Librairie
import React, { useEffect, useState } from "react";
import classes from "./Panier.module.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import data from "../../../data/Produits.json";
import { useNavigate } from "react-router-dom";

export default function Panier() {
  // State
  const [panier, setPanier] = useState("");
  const [prixTotalProduitsPanier, setPrixTotalProduitsPanier] = useState();
  const [pointsRetrait, setPointsRetrait] = useState();
  const [modeLivraison, setModeLivraison] = useState("");
  const navigate = useNavigate();

  const client = useSelector(
    (state) => state.client.clientInfo && state.client.clientInfo
  );

  const idClient = useSelector(
    (state) => state.client.clientInfo && state.client.clientInfo.id
  );

  const idPanier = useSelector(
    (state) =>
      state.client.clientInfo && state.client.clientInfo.panier.idPanier
  );

  const adresseClient = useSelector(
    (state) => state.client.clientInfo && state.client.clientInfo.adresse
  );
  console.log(client);
  useEffect(() => {
    getPanier();
    getPointRetrait();
  }, []);

  useEffect(() => {
    calculerPrixTotalProduits();
  }, [panier]);

  const getPanier = () => {
    fetch(
      `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/clients/panier/${idPanier}`
    )
      .then((response) => response.json())
      .then((data) => {
        setPanier(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPointRetrait = () => {
    fetch(
      `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/clients/pointsRetrait`
    )
      .then((response) => response.json())
      .then((data) => {
        setPointsRetrait(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleQuantiteChange = (event, produit) => {
    const nouvelleQuantite = event.target.value;
    // Mettre à jour le produit du panier avec la nouvelle quantité et le nouveau prix
    const updatedProduitsPanier =
      panier &&
      panier.map((prod) => {
        if (prod.idProduitVendeur === produit.idProduitVendeur) {
          // console.log(prod.id);
          return {
            ...prod,
            quantite: nouvelleQuantite,
            prixTotal: nouvelleQuantite * prod.prix,
          };
        }
        return prod;
      });
    setPanier(updatedProduitsPanier);
  };

  const handleChangeModeLivraison = (e) => {
    setModeLivraison(e.target.value); // Met à jour la valeur sélectionnée dans l'état
  };

  const handleDeleteProduitPanier = (produit) => {
    const sendBody = {
      idProduitVendeur: produit.idProduitVendeur,
      idPanier: idPanier,
    };

    fetch(
      `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/clients/supprimerProduitsPanier`,
      {
        method: "DELETE",
        body: JSON.stringify(sendBody),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Traitement de la réponse du serveur
        toast.success(data.message);
        window.location.reload();
        console.log(data);
      })
      .catch((error) => {
        // Gestion des erreurs
        console.error("Erreur:", error);
      });
  };

  const handleSubmitValiderCommande = (event) => {
    event.preventDefault();

    const validerCommande = {
      panier: panier,
      idClient,
      idPanier,
      modeLivraison,
      adresseClient,
    };
    console.log(validerCommande);

    fetch(
      "https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/clients/validerPanier",
      {
        method: "POST",
        body: JSON.stringify(validerCommande),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Traitement de la réponse du serveur
        toast.success(data.message);
        navigate("/clients", { replace: true });
        console.log(data);
      })
      .catch((error) => {
        // Gestion des erreurs
        console.error("Erreur:", error);
      });
  };

  const displayedProduitsPanier =
    panier &&
    panier.map((produit, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "20px 0",
          padding: "20px",
        }}
      >
        <img src={produit.picture} alt={produit.nom} />
        <div className={classes.panierProduitDetails}>
          <h3 style={{ margin: "0" }}>{produit.nom}</h3>
          <p>
            <h3>Prix unité</h3>
            {produit.prix}€
          </p>
        </div>

        <div className={classes.panierDetails} style={{ flex: "1" }}>
          <input
            className={classes.panierInput}
            type="number"
            min="1"
            max={produit.quantiteDisponible}
            defaultValue={produit.nbProduits}
            onChange={(event) => handleQuantiteChange(event, produit)} // Passer le produit en tant qu'argument
          />
          <p style={{ display: "inline", marginLeft: "10px" }}>
            <h3>Prix total produit</h3>
            {produit.prixTotal
              ? produit.prixTotal
              : produit.nbProduits * produit.prix}
            €
          </p>
          <button onClick={() => handleDeleteProduitPanier(produit)}>
            Supprimer
          </button>
        </div>
      </div>
    ));

  let prixTotalProduitsPanierDefault = 0;
  panier &&
    panier.map((produit) => {
      prixTotalProduitsPanierDefault += produit.prix * produit.nbProduits;
    });

  let prixTotalProduitsPanierFraisLivraison = 0;
  panier &&
    panier.map((produit) => {
      prixTotalProduitsPanierFraisLivraison += produit.fraisLivraison * 1;
    });

  const calculerPrixTotalProduits = () => {
    let somme = 0;
    panier &&
      panier.map((produit) => {
        somme += produit.prixTotal
          ? produit.prixTotal
          : produit.prix * produit.nbProduits;
      });
    setPrixTotalProduitsPanier(somme);
  };

  // console.log(prixTotalPanier);
  // const displayedProduitsPanier = data.products.map((produit, index) => (
  //   <h1>ok</h1>
  // ));

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Récapitulatif de mon panier</h1>

      <div className={classes.Panier}>
        <div className={classes.panierProduits}>{displayedProduitsPanier}</div>
        <div className={classes.panierCommander}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <h5>Prix Produits</h5>
            <h5>
              {prixTotalProduitsPanier
                ? prixTotalProduitsPanier
                : prixTotalProduitsPanierDefault}
              €
            </h5>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h5>Frais Livraison</h5>
            <h5>{prixTotalProduitsPanierFraisLivraison}€</h5>
          </div>
          <hr />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2>Total</h2>
            <h2>
              {(prixTotalProduitsPanier
                ? prixTotalProduitsPanier
                : prixTotalProduitsPanierDefault) +
                prixTotalProduitsPanierFraisLivraison}
              €
            </h2>
          </div>
          <div>
            <form onSubmit={handleSubmitValiderCommande}>
              <select
                value={modeLivraison}
                onChange={handleChangeModeLivraison}
                required
              >
                <option value="">--Choisir votre mode de livraison--</option>
                <option value="domicile">Domicile</option>
                {pointsRetrait &&
                  pointsRetrait.map((address) => (
                    <option value={address.ID}>{address.adresseRetrait}</option>
                  ))}
              </select>
              <div style={{ textAlign: "center" }}>
                <button type="submit" className={classes.panierValider}>
                  Valider ma commande
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
