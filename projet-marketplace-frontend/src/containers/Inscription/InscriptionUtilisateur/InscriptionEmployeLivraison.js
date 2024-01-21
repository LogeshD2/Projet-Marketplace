// Librairie
import React from "react";
import classes from "./Inscription.module.css";
import { useForm } from "react-hook-form";

export default function InscriptionEmployeLivraison() {
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
    const livreur = {
      ...data,
      typeUtilisateur: "employeLivraison",
    };

    fetch(
      "https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/inscription",
      {
        method: "POST",
        body: JSON.stringify(livreur),
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
        <h1>Formulaire</h1>
        <h2>Employé de livraison</h2>

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
            placeholder="Entreprise"
            name="entreprise"
            required="required"
            autocomplete="off"
            {...register("entreprise")}
          />

          {errors.Catégorie && (
            <b className={classes.errors}>Choisissez votre catégorie !</b>
          )}

          <select
            className={classes.categorie}
            id="categorie-select"
            {...register("typeEmployeLivraison", { required: true })}
          >
            <option value="">--Choisir votre catégorie--</option>
            <option value="preparateurCommande">Préparateur de commande</option>
            <option value="livreur">Livreur</option>
          </select>

          {errors.Permis && (
            <b className={classes.errors}>Choisissez votre type de permis !</b>
          )}

          <select
            className={classes.categorie}
            id="categorie-select"
            {...register("permis", { required: true })}
          >
            <option value="">--Choisir votre type de permis--</option>
            <option value="PermisNULL">Pas de permis</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="B_C">B et C</option>
          </select>

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
