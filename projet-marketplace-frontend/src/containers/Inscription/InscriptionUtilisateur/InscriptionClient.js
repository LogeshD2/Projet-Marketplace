// Librairie
import React from "react";
import classes from "./Inscription.module.css";
import { useForm } from "react-hook-form";

export default function Inscription() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (data.motDePasse != data.retaperMotDePasse) {
      console.log("Erreur");
      return;
    }
    const client = {
      ...data,
      typeUtilisateur: "client",
    };

    fetch(
      "https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/inscription",
      {
        method: "POST",
        body: JSON.stringify(client),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Traitement de la réponse du serveur
        console.log(data);
      })
      .catch((error) => {
        // Gestion des erreurs
        console.error("Erreur:", error);
      });
  };

  return (
    <div className={classes.Inscription}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Formulaire Client</h1>

        <p className={classes.email}> Veuillez entrer vos coordonées : </p>

        <div className={classes.input}>
          <input
            type="text"
            placeholder="Nom"
            name="fname"
            required="required"
            autocomplete="off"
            {...register("nom")}
          />
          <input
            type="text"
            placeholder="Prénom"
            name="name"
            required="required"
            autocomplete="off"
            {...register("prenom")}
          />
          <input
            type="text"
            placeholder="Adresse"
            name="adresse"
            required="required"
            autocomplete="off"
            {...register("adresse")}
          />
          <input
            type="text"
            placeholder="N° de téléphone"
            name="tel"
            required="required"
            autocomplete="off"
            {...register("numeroTelephone")}
          />
          <input
            type="text"
            placeholder="Adresse mail"
            name="email"
            required="required"
            autocomplete="off"
            {...register("adresseMail")}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            name="password"
            required="required"
            autocomplete="off"
            {...register("motDePasse")}
          />
          <input
            type="password"
            placeholder="Re-tapez le mot de passe"
            name="password_retype"
            required="required"
            autocomplete="off"
            {...register("retaperMotDePasse")}
          />

          <p className={classes.inscription}>
            {" "}
            J'ai déjà un compte. Je me{" "}
            <span>
              <a href="/connexion">connecte</a>
            </span>{" "}
            ou revenir sur le{" "}
            <span>
              <a href="/">site.</a>
            </span>
          </p>
          <div className={classes.fin}>
            <button type="submit">S'inscrire</button>
          </div>
        </div>
      </form>
    </div>
  );
}
