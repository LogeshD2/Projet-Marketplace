import React, { useState } from "react";
import Select from "react-select";

import classes from "./ProduitVendeur.module.css";

export default function ProduitVendeur(props) {
  // const { productData } = props.productData;
  // //   console.log("Test");
  // console.log(props.productData);
  // console.log(productData);
  const key = props.key;
  const token = "";
  console.log(key);

  // Créer les différents states dont nous aurons besoin
  const [productName, setProductName] = useState(props.productData.Nom);

  const [imageUrl, setImageUrl] = useState(props.productData.Picture);

  const [availableQuantity, setAvailableQuantity] = useState(
    props.productData.QuantiteDisponible
  );
  const [soldPrice, setSoldPrice] = useState(props.productData.Prix);

  const [selectedCategory, setSelectedCategory] = useState(
    props.categoryData[0].ID
  );
  const [categoryOptions, setCategoryOptions] = useState([
    ...props.categoryData,
    "Autre...",
  ]);
  console.log(categoryOptions[0].ID);
  const [newCategory, setNewCategory] = useState("");

  const [createNewCategory, setCreateNewCategory] = useState(false);

  const [description, setDescription] = useState(
    props.productData.Description_Prod
  );

  const [weight, setWeight] = useState(props.productData.Poid);
  const handleCategoryChange = (selectedOption) => {
    if (selectedOption.value === "Autre...") {
      // If users clicked on Autre...
      setSelectedCategory(selectedOption.value);
      setCreateNewCategory(true);
    } else {
      setSelectedCategory(selectedOption.value);
      setCreateNewCategory(false);
    }
  };

  const handleNewCategory = () => {
    if (newCategory.trim() !== "") {
      // Vérification si l'input n'est pas vide
      setSelectedCategory(newCategory);
      setCreateNewCategory(false);
      setNewCategory("");
    } else {
      alert("Le nom de la nouvelle catégorie ne peut pas être vide !");
    }
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  // Fonction appelée dès que l'on change la quantité disponible
  const handleQuantityChange = (event) => {
    const newValue = parseInt(event.target.value);
    setAvailableQuantity(newValue >= 0 ? newValue : 0);
  };

  // Fonction appelée dès que l'on change le poids d'un produit
  const handleWeightChange = (event) => {
    const newValue = parseFloat(event.target.value);
    setWeight(newValue >= 0 ? newValue : 0);
  };

  // Fonction appelée dès que l'on change le prix de vente
  const handlePriceChange = (event) => {
    const newValue = parseFloat(event.target.value);
    setSoldPrice(newValue >= 0 ? newValue : 0);
  };
  console.log(props.productData);
  const handleDeleteButton = (event) => {
    event.preventDefault();
    // const token = "";
    const sendBody = {
      idProduct: props.productData.ID,
      idSolderProduct: props.productData.idProduitVendeur,
    };

    fetch(
      `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/vendeur/interne/produit/supprimer`,
      {
        method: "DELETE",
        body: JSON.stringify(sendBody),
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

  // Fonction appelée dès que l'on envoie notre formulaire
  const handleSubmit = (event) => {
    event.preventDefault();

    if (productName.trim() === "") {
      alert("Le nom du produit ne peut pas être vide !");
    } else if (imageUrl.trim() === "") {
      alert("Veuillez donner une URL d'image");
    } else if (description.trim() === "") {
      alert("Un produit doit avoir une description");
    }
    // const token = "";
    else {
      const sendBody = {
        idProduct: props.productData.ID,
        idSolderProduct: props.productData.idProduitVendeur,
        productName: productName,
        image: imageUrl,
        category: selectedCategory,
        description: description,
        weight: weight,
        quantity: availableQuantity,
        price: soldPrice,
      };
      console.log(sendBody);
      fetch(
        `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/vendeur/interne/produit/modifier`,
        {
          method: "PUT",
          body: JSON.stringify(sendBody),
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
    }
  };
  console.log(props.productData);

  return (
    <div className={classes.ProduitVendeur}>
      <form onSubmit={handleSubmit}>
        <div className={classes.productDiv}>
          <img src={props.productData.Picture} alt="représente le produit" />
          <h4>{productName}</h4>
          Nom du produit :{" "}
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Veuillez entrer un nom de produit"
          />
          <br />
          URL de l'image :<br />{" "}
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Veuillez entrer une nouvelle URL d'image"
          />
          <br />
          <label for="category">Catégorie :</label>
          <br />
          <Select
            name="category"
            value={{
              label: selectedCategory.Categorie,
              value: selectedCategory.ID,
            }}
            options={categoryOptions.map((category) => ({
              label: category.Categorie,
              value: category.ID,
            }))}
            onChange={handleCategoryChange}
          />
          {createNewCategory ? (
            <div>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Saisir une nouvelle catégorie..."
              />
              <button type="button" onClick={handleNewCategory}>
                Valider
              </button>
            </div>
          ) : null}
          Description :<br />{" "}
          <textarea onChange={handleDescriptionChange}>{description}</textarea>
          <br />
          Poids (en kg)
          <br />
          <input
            type="number"
            step="0.01"
            value={weight}
            onChange={handleWeightChange}
            required
          />
          <br />
          Quantité disponible :
          <input
            type="number"
            value={availableQuantity}
            onChange={handleQuantityChange}
            required
          />
          <br />
          Prix de vente : <br />
          <input
            type="number"
            step="0.01"
            value={soldPrice}
            onChange={handlePriceChange}
            required
          />
          <br />
          Quantité vendue : {props.productData.QuantiteVendu}
          <br />
          <br />
          Prix total de vente : {props.productData.PrixVendu}€
          <br />
          <button type="submit">Mettre à jour</button>
          <br />
          <button
            style={{
              backgroundColor: "red",
              borderRadius: "10px",
              color: "white",
            }}
            onClick={handleDeleteButton}
          >
            Supprimer
          </button>
        </div>
      </form>
    </div>
  );
}
