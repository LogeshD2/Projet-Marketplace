// Librairie
import React from "react";
import classes from "./Inscription.module.css";
import { useForm } from "react-hook-form";

export default function InscriptionVendeur() {
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
    const vendeur = {
      ...data,
      typeUtilisateur: "vendeur",
    };

    console.log(data);

    fetch(
      "https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/inscription",
      {
        method: "POST",
        body: JSON.stringify(vendeur),
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
        <h1>Formulaire Vendeur</h1>

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

          {errors.Type && (
            <b className={classes.errors}>Choisissez votre type !</b>
          )}

          <select
            className={classes.type}
            id="type-selected"
            {...register("typeVendeur", { required: true })}
          >
            <option value="">--Choisir votre type--</option>
            <option value="Particulier">Particulier</option>
            <option value="Professionnel">Professionnel</option>
          </select>
          <input
            type="text"
            placeholder="Pseudo de vente"
            name="nomShop"
            required="required"
            autocomplete="off"
            {...register("nomShop")}
          />
          <input
            type="email"
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
