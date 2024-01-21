import React, { useEffect, useState } from "react";
import classes from "./Connexion.module.css";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/Logout/logoutActions";
import { useNavigate } from "react-router-dom";
import { setClientInfo } from "../../redux/Client/clientActions";
import { toast } from "react-toastify";

export default function Connexion() {
  const [utilisateur, setUtilisateur] = useState();
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch(); // Déconnexion
  const navigate = useNavigate();

  const [client, setClient] = useState();
  const [preparateurCommande, setPreparateurCommande] = useState();
  const [livreur, setLivreur] = useState();
  const [vendeur, setVendeur] = useState();
  const [admin, setAdmin] = useState();

  // const user = {
  //   adresseMail: "bastien@gmail.com",
  //   motDePasse: "bastien",
  console.log(client);
  // };
  const getClient = (id) => {
    fetch(
      `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/clients/clients/${id}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        data[0] = {
          ...data[0],
          typeUtilisateur: "clients",
        };
        setClient(data[0]);
        dispatch(setClientInfo(data[0]));
      })
      .catch((error) => {
        console.error("Erreur lors de la connexion:", error);
        // Gérer les erreurs de connexion
        this.setState({ error: "Erreur lors de la connexion" });
      });
  };

  const getPreparateurCommande = (id) => {
    fetch(
      `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/employeLivraison/preparateurCommandes/preparateurCommandes/${id}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        data = {
          ...data,
          typeUtilisateur: "preparateurCommande",
        };
        setPreparateurCommande(data);
        dispatch(setClientInfo(data));
      })
      .catch((error) => {
        console.error("Erreur lors de la connexion:", error);
        // Gérer les erreurs de connexion
        this.setState({ error: "Erreur lors de la connexion" });
      });
  };

  const getAdmin = () => {
    fetch(
      `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/vendeur/interne/`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        data = {
          ...data,
          typeUtilisateur: "admin",
        };
        setAdmin(data);
        dispatch(setClientInfo(data));
      })
      .catch((error) => {
        console.error("Erreur lors de la connexion:", error);
        // Gérer les erreurs de connexion
        this.setState({ error: "Erreur lors de la connexion" });
      });
  };

  const getLivreur = (id) => {
    fetch(
      `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/employeLivraison/livreurs/livreurs/${id}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        data = {
          ...data,
          typeUtilisateur: "livreur",
        };
        setLivreur(data);
        dispatch(setClientInfo(data));
      })
      .catch((error) => {
        console.error("Erreur lors de la connexion:", error);
        // Gérer les erreurs de connexion
        this.setState({ error: "Erreur lors de la connexion" });
      });
  };

  const getVendeur = (id) => {
    fetch(
      `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/vendeur/externe/${id}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        data = {
          ...data,
          typeUtilisateur: "vendeur",
        };
        setLivreur(data);
        dispatch(setClientInfo(data));
      })
      .catch((error) => {
        console.error("Erreur lors de la connexion:", error);
        // Gérer les erreurs de connexion
        this.setState({ error: "Erreur lors de la connexion" });
      });
  };

  const onSubmitConnexion = (data) => {
    fetch(
      "https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/connexion",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((utilisateur) => {
        toast.success("Bienvenue !");
        // Traitement de la réponse du serveur
        if (utilisateur.Utilisateur === "Client") {
          console.log(utilisateur.ID);

          getClient(utilisateur.ID);
          navigate("/clients", {
            replace: true,
          });
        } else if (utilisateur.Utilisateur === "Vendeur") {
          navigate(`/vendeurs/${utilisateur.ID}`, {
            state: { id: utilisateur.ID },
            replace: true,
          });
        } else if (utilisateur.Utilisateur === "Admin") {
          getAdmin(utilisateur.ID);
          navigate("/admin", {
            state: { id: utilisateur.ID },
            replace: true,
          });
        } else if (utilisateur.Utilisateur === "Preparateur_Commande") {
          getPreparateurCommande(utilisateur.ID);

          navigate("/preparateur_commandes", {
            state: { id: utilisateur.ID },
            replace: true,
          });
        } else if (utilisateur.Utilisateur === "Livreur") {
          getLivreur(utilisateur.ID);
          navigate("/livreurs", {
            state: { id: utilisateur.ID },
            replace: true,
          });
        }
        setUtilisateur(utilisateur);
      })
      .catch((error) => {
        // Gestion des erreurs
        console.error("Erreur:", error);
      });
  };

  return (
    <div className={classes.Connexion}>
      <div className={classes.login}>
        <form onSubmit={handleSubmit(onSubmitConnexion)}>
          <h1>Se connecter</h1>
          <p className={classes.email}> Veuillez entrer vos coordonées : </p>

          <div className={classes.inputs}>
            <input
              type="text"
              placeholder="Adresse mail"
              name="email"
              // required="required"
              autocomplete="off"
              {...register("adresseMail")}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              name="password"
              // required="required"
              autocomplete="off"
              {...register("motDePasse")}
            />

            <p className={classes.inscription}>
              {" "}
              Je n'ai pas de compte.{" "}
              <span>
                <a href="/inscription">Créer un compte</a>
              </span>{" "}
              ou revenir sur le{" "}
              <span>
                <a href="/">site.</a>
              </span>
            </p>
            <div className={classes.fin}>
              <button type="submit">Se connecter</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
