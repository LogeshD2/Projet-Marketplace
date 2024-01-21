import React, { useState } from "react";
import classes from "./Category.module.css";
import { toast } from "react-toastify";

export default function Category() {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Ajoutez ici le code pour traiter les données soumises
    const token = "";
    if (categoryName.trim() === "") {
      alert("Le nom du produit ne peut pas être vide !");
    } else {
      const sendBody = {
        categoryName: categoryName,
        image: categoryImage,
      };
      console.log(sendBody);
      let url = `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/vendeur/interne/categorie/ajouter`;

      fetch(url, {
        method: "POST",
        body: JSON.stringify(sendBody),
      })
        .then((response) => response.json())
        .then((data) => {
          toast.success(data.message);
          window.location.reload();
          // Traitement de la réponse du serveur
          console.log(data);
        })
        .catch((error) => {
          // Gestion des erreurs
          console.error("Erreur:", error);
        });
      // Do something with the updated quantity and price values
      console.log("Category created");
    }
  };

  return (
    <div className={classes.categoryForm}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="category-name">Nom de la catégorie : </label>
        <input
          type="text"
          id="category-name"
          required
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value)}
        />
        <br />
        <label htmlFor="category-image">Lien vers l'image : </label>
        {/* <input
          type="file"
          id="category-image"
          accept="image/*"
          onChange={(event) => setCategoryImage(event.target.files[0])}
        /> */}
        <input
          type="url"
          id="image-url"
          name="image-url"
          onChange={(event) => setCategoryImage(event.target.value)}
          required
        />
        <br />
        <button type="button" onClick={handleSubmit}>
          Créer la catégorie
        </button>
      </form>
    </div>
  );
}
