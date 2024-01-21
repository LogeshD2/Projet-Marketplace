import React, { useEffect, useState } from "react";
import classes from "./ProduitsNom.module.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ProduitsNom() {
  const { nom } = useParams();
  const [produitsNom, setProduitsNom] = useState();

  useEffect(() => {
    getProduitsNom();
  }, []);

  const getProduitsNom = () => {
    fetch(
      `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/clients/produitsNom/${cleanString(
        nom
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setProduitsNom(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const cleanString = (str) => {
    // Remplacer les caractères spéciaux par leur lettre initiale
    const replacedStr = str
      .replace(/[éèêë]/gi, "e")
      .replace(/[àâä]/gi, "a")
      .replace(/[ôö]/gi, "o")
      .replace(/[ûü]/gi, "u")
      .replace(/[ç]/gi, "c");

    // Supprimer les espaces
    const trimmedStr = replacedStr.replace(/\s+/g, "");

    // Mettre tout en minuscules
    const lowercaseStr = trimmedStr.toLowerCase();

    // Retourner la chaîne propre
    return lowercaseStr;
  };

  const DisplayedProduits =
    produitsNom &&
    produitsNom.map((produitNom) => (
      <div class={classes.productsCard}>
        <div class={classes.card}>
          <div class={classes.imgBx}>
            <img
              src={produitNom.picture}
              style={{ outline: "none" }}
              alt={produitNom.nomProduit}
            />
          </div>

          <div class={classes.contentBx}>
            <h2>{produitNom.nomProduit}</h2>

            <div class={classes.size}>
              <h3>Prix :</h3>
              <span>{produitNom.prix}5€</span>
            </div>

            <Link to={`/clients/produits/${produitNom.idProduitVendeur}`}>
              Buy Now
            </Link>
          </div>
        </div>
      </div>
    ));

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>
        {nom.charAt(0).toUpperCase() + nom.slice(1)}
      </h1>

      <div className={classes.productsList}>{DisplayedProduits}</div>
    </div>
  );
}
