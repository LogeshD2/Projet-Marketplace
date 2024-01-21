import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProduitVendeur from "../../../components/ProduitVendeur/ProduitVendeur";
import CreationProduit from "../../../components/ProduitVendeur/CreationProduit/CreationProduit";

import donnees from "../VendeurData1.json";

import classes from "../Vendeur.module.css";
import { useSelector } from "react-redux";

export default function VendeurExterne() {
  const [data, setData] = useState(); // Créer un state
  const { id } = useParams(); // récupère l'id du vendeur dans l'URL
  const [isOk, setIsOk] = useState(true);
  const { state } = useLocation();

  const navigate = useNavigate();

  const typeUtilisateur = useSelector(
    (state) =>
      state.client.clientInfo && state.client.clientInfo.typeUtilisateur
  );

  if (typeUtilisateur != "vendeur" || typeUtilisateur == null) {
    navigate("/clients", { replace: true });
    console.log("ok");
  }

  // Fonction useEffect qui permet d'effectuer une action lorsqu'un composant est modifié. Elle prend en paramètre une fonction de rappel (callback) qui sera exécutée à chaques fois que le composant est modifié ainsi qu'un tableau de dépendance (dans lequel on peut spécifier les variables qui doivent être surveillées, autrement on surveillera chaques variables)
  useEffect(() => {
    const fetchData = async () => {
      // La fonction fetchData est une fonction asynchrone qui permet d'utiliser "await" lorsque l'on attend une réponse qui peut être longue (par exemple lors d'un appel d'API)
      const response = await fetch(
        `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/vendeur/externe/${id}`
      );
      if (!response.ok) {
        setIsOk(false);
      } else {
        const jsonData = await response.json();
        setData(jsonData);
        setIsOk(true);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={classes.Vendeur}>
      <h2>Trésorerie</h2>
      <div className={classes.treasury}>
        <p>Chiffre d'affaire : {data?.treasury.ChiffreAffaires}€</p>
        <p>
          Chiffre d'affaire espéré : {data?.treasury.ChiffreAffairesPotentiels}€
        </p>
      </div>
      <hr />
      <h2>Produits</h2>
      <div className={classes.productList}>
        {data?.products.map((product) => {
          return (
            <ProduitVendeur
              key={product.id}
              productData={product}
              categoryData={data?.category}
            />
          );
        })}
      </div>
      <hr />
      <h2>Création d'un produit</h2>

      {data ? (
        <CreationProduit
          idSolder={data && data.treasury.ID}
          categoryData={data?.category}
        />
      ) : (
        <p>Chargement en cours...</p>
      )}
      <hr />
      <h2>Historique de vente</h2>
      <div className={classes.soldHistory}>
        <ul>
          {data?.sold.map((soldObject) => (
            <li>
              {soldObject.DateTransaction} : Vous avez vendu{" "}
              {soldObject.soldQuantity} {soldObject.Nom}
              {soldObject.QuantiteVendu > 1 ? "s" : ""} pour un total de{" "}
              {soldObject.PrixVendu}€.
            </li>
          ))}
        </ul>
      </div>
      <hr />
      <h2>Votre contrat</h2>
      <div className={classes.contract}>
        <ul>
          <li>Durée du contrat : {data?.contract.DureeContrat}</li>
          <li>
            Date d'expiration : {data?.contract.DateFin} soit dans{" "}
            {data?.contract.TempsRestant}
          </li>
          <li>Comission : {data?.contract.Commission}%</li>
        </ul>
      </div>
    </div>
  );
}
