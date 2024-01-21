import React, { useState, useEffect } from "react";

import ProduitVendeur from "../../../components/ProduitVendeur/ProduitVendeur.js";
import Contrat from "../../../components/Contrat/Contrat.js";
import ContratDemande from "../../../components/Contrat/ContratDemande.js";
import CreationProduit from "../../../components/ProduitVendeur/CreationProduit/CreationProduit";
import AdresseForm from "../../../components/AddressForm/AddressForm.js";
import { useSelector } from "react-redux";

import classes from "../Vendeur.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DeleteAddress from "../../../components/AddressForm/DeleteAddress.js";
import Category from "../../../components/Category/Category.js";

export default function VendeurInterne() {
  const [data, setData] = useState();
  const [isOk, setIsOk] = useState(true);

  const navigate = useNavigate();

  const typeUtilisateur = useSelector(
    (state) =>
      state.client.clientInfo && state.client.clientInfo.typeUtilisateur
  );

  if (typeUtilisateur != "admin" || typeUtilisateur == null) {
    navigate("/clients", { replace: true });
    console.log("ok");
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/vendeur/interne"
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
  console.log(data && data.contracts);
  return (
    <div className={classes.Vendeur}>
      <div className={classes.mainAdminContainer}>
        <h1>Page Vendeur interne</h1>
        <h2>Produits</h2>
        <div className={classes.productList}>
          {data?.products.map((product) => {
            // console.log(product.id);
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

        <div className={classes.deliveryAddress}>
          <h2>Liste des points de retraits disponibles</h2>
          {/* <ul>
            {data?.deliveryAddress.map((address) => (
              <li>{address.adresseRetrait}</li>
            ))}
          </ul> */}
          {data ? (
            <DeleteAddress address={data?.deliveryAddress} />
          ) : (
            <p>Chargement en cours...</p>
          )}
        </div>
        <hr />
        <div className={classes.addAddress}>
          <h2>Ajouter un point de retrait</h2>
          <AdresseForm />
        </div>

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

        <h2>Création d'une nouvelle catégorie</h2>
        <Category />
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
        <h2>Contrats</h2>
        <div className={classes.contractList}>
          {data?.contracts.inActivity.map((contract) => {
            // console.log(contract);
            return <Contrat key={contract.id} contractData={contract} />;
          })}
        </div>
        <h2>Demande de contrat</h2>
        <div className={classes.contractExt}>
          {data?.contracts.inDemand.map((contract) => {
            return (
              <ContratDemande
                key={contract.id}
                id={contract.id}
                contractData={contract}
              />
            );
          })}
        </div>
      </div>
      <li>
        <Link to="/inscription/vendeur">Formulaire Vendeur</Link>
      </li>
      <li>
        <Link to="/inscription/livreur">Formulaire Employé de livraison</Link>
      </li>
    </div>
  );
}
