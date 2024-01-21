import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classes from "./Colis.module.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Colis() {
  const { id } = useParams();
  const [oneColis, setOneColis] = useState();
  const navigate = useNavigate();

  const idLivreur = useSelector(
    (state) => state.client.clientInfo && state.client.clientInfo.IDLivreur
  );

  const typeUtilisateur = useSelector(
    (state) =>
      state.client.clientInfo && state.client.clientInfo.typeUtilisateur
  );

  if (typeUtilisateur != "livreur" || typeUtilisateur == null) {
    navigate("/clients", { replace: true });
    console.log("ok");
  }

  console.log(oneColis && oneColis);
  useEffect(() => {
    getOneColis();
  }, []);

  console.log(oneColis);

  function handleTraject() {
    const destinationAddress = oneColis.adresseLivraison;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://www.google.com/maps?saddr=${latitude},${longitude}&daddr=${encodeURIComponent(
            destinationAddress
          )}`;
          window.open(url, "_blank");
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error(
        "La géolocalisation n'est pas prise en charge par ce navigateur."
      );
    }
  }

  const getOneColis = () => {
    fetch(
      `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/employeLivraison/livreurs/colis/${id}`
    )
      .then((response) => response.json())
      .then((data) => {
        setOneColis(data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmitChoisirColis = () => {
    const sendBody = {
      idLivreur: idLivreur,
      idColis: oneColis && oneColis.IDColis,
    };
    fetch(
      `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/employeLivraison/livreurs/choisirColis`,
      {
        method: "PUT",
        body: JSON.stringify(sendBody),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        toast.success(data.message);
        navigate("/livreurs/mes_colis", { replace: true });
        // Traitement de la réponse du serveur
        console.log(data);
      })
      .catch((error) => {
        // Gestion des erreurs
        console.error("Erreur:", error);
      });
  };

  const handleSubmitLivrerColis = () => {
    const sendBody = {
      idLivreur: idLivreur,
      idColis: oneColis && oneColis.IDColis,
    };
    fetch(
      `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/employeLivraison/livreurs/colisLivrer`,
      {
        method: "PUT",
        body: JSON.stringify(sendBody),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Traitement de la réponse du serveur
        toast.success(data.message);
        navigate("/livreurs/", { replace: true });
        console.log(data);
      })
      .catch((error) => {
        // Gestion des erreurs
        console.error("Erreur:", error);
      });
  };

  const DisplayedColisProduits =
    oneColis && oneColis.Produits.map((produits) => <p>{produits.Nom}</p>);

  return (
    <div class={classes.wrapper}>
      <div class={classes.titre}>
        <h1>Colis n°{id}</h1>
        <hr />
        <div class={classes.description}>
          <p>
            <b>Client : </b>n°{oneColis && oneColis.IDClient}
          </p>
          <p>
            <b>Liste des produits</b>
          </p>
          {DisplayedColisProduits}
          <p>
            <b>Mode de livraison : </b>
            {oneColis && oneColis.modeLivraison}
          </p>
          <p>
            <b>Adresse de livraison: </b>
            {oneColis && oneColis.adresseLivraison}
          </p>
          <p>
            <b>Date de livraison : </b>
            {oneColis && oneColis.DateLivraison}
          </p>
          <p>
            <b>Type de véhicule à utiliser : </b>
            {oneColis && oneColis.typeVehicule}
          </p>
        </div>
        {oneColis && oneColis.IDLivreur == null ? (
          <button onClick={handleSubmitChoisirColis}>Choisir</button>
        ) : (
          <button onClick={handleSubmitLivrerColis}>Livrer</button>
        )}
        <button onClick={handleTraject}>Voir trajet</button>
      </div>
    </div>
  );
}
