import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classes from "./Produit.module.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Produit() {
  const { id } = useParams();
  const [quantite, setQuantite] = useState(1);
  const [product, setProduct] = useState();
  const navigate = useNavigate();

  const client = useSelector(
    (state) => state.client.clientInfo && state.client.clientInfo
  );

  const idPanier = useSelector(
    (state) =>
      state.client.clientInfo && state.client.clientInfo.panier.idPanier
  );
  useEffect(() => {
    getProduct();
    // getClient();
  }, []);

  console.log(client);
  const getProduct = () => {
    fetch(
      `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/clients/produits/${id}`
    )
      .then((response) => response.json())
      .then((data) => {
        setProduct(data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // const getClient = () => {
  //   fetch(
  //     `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/clients/clients/6`
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setClient(data[0]);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const handleAjouter = (event) => {
    event.preventDefault();
    if (product && product.quantiteDisponible > quantite) {
      setQuantite(quantite + 1);
    }
  };

  const handleSoustraire = (event) => {
    event.preventDefault();
    if (quantite > 1) {
      setQuantite(quantite - 1);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const productBasket = {
      quantite: quantite,
      idPanier: idPanier,
      idProduit_Vendeur: product && product.idProduitVendeur,
    };

    fetch(
      "https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/clients/updatePanier/",
      {
        method: "POST",
        body: JSON.stringify(productBasket),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Traitement de la réponse du serveur
        console.log(data);
        toast.success(data.message);
        navigate("/clients", { replace: true });
      })
      .catch((error) => {
        // Gestion des erreurs
        console.error("Erreur:", error);
      });
  };

  return (
    <>
      {product && (
        <div className={classes.Produit}>
          <div>
            <img src={product.picture} alt={product.nomProduit} />
          </div>

          <div className={classes.commander}>
            <h2>{product.nomProduit}</h2>
            <h4>
              <i>Référence : A53</i>
            </h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </p>
            <h2>
              <b>Prix : {product.prix}€</b>
            </h2>

            <form onSubmit={handleSubmit}>
              <label name="quantite">Quantité : </label>
              <button
                className={classes.quantiteButton}
                onClick={handleSoustraire}
              >
                -
              </button>
              <input
                className={classes.quantiteInput}
                type="number"
                name="quantite"
                id="quantite"
                value={quantite}
              />
              <button
                className={classes.quantiteButton}
                onClick={handleAjouter}
              >
                +
              </button>
              {client && (
                <button className={classes.panierButton} type="submit">
                  Ajouter au panier
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
