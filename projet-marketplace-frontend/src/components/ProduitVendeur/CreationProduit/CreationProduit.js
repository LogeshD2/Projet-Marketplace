import React, { useState } from "react";
import Select from "react-select";
import classes from "./CreationProduit.module.css";
import { toast } from "react-toastify";

export default function CreationProduit(props) {
  const [imageUrl, setImageUrl] = useState();
  const [productName, setProductName] = useState();
  const [quantity, setQuantity] = useState();
  const [price, setPrice] = useState();
  const [selectedCategory, setSelectedCategory] = useState(
    props.categoryData[0]
  );
  const [categoryOptions, setCategoryOptions] = useState([
    ...props.categoryData,
    "Autre...",
  ]);

  const [newCategory, setNewCategory] = useState("");

  const [createNewCategory, setCreateNewCategory] = useState(false);

  const [description, setDescription] = useState("");

  const [weight, setWeight] = useState();

  const token = "";

  const handleImageUrl = (event) => {
    setImageUrl(event.target.value);
  };

  const handleProductName = (event) => {
    setProductName(event.target.value);
  };

  const handleQuantity = (event) => {
    const newValue = parseInt(event.target.value);
    setQuantity(newValue >= 0 ? newValue : 0);
  };

  // Fonction appelée dès que l'on change le prix de vente
  const handlePrice = (event) => {
    const newValue = parseFloat(event.target.value);
    setPrice(newValue >= 0 ? newValue : 0);
  };

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

  // Fonction appelée dès que l'on change le poids d'un produit
  const handleWeightChange = (event) => {
    const newValue = parseFloat(event.target.value);
    setWeight(newValue >= 0 ? newValue : 0);
  };

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
      // const token = "";

      // let url;
      // if (props.shopId) {
      //   url = `http://localhost/shop/${props.shopId}/product/add`;
      // } else {
      //   url = `http://localhost/admin/product/add`;
      // }

      const sendBody = {
        productName: productName,
        image: imageUrl,
        category: selectedCategory,
        description: description,
        weight: weight,
        quantity: quantity,
        price: price,
        idSolder: props.idSolder,
      };
      console.log(sendBody);
      fetch(
        "https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/vendeur/interne/produit/ajouter",
        {
          method: "POST",
          body: JSON.stringify(sendBody),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          // Traitement de la réponse du serveur
          window.location.reload();
          toast.success(data.message);
          console.log(data);
        })
        .catch((error) => {
          // Gestion des erreurs
          console.error("Erreur:", error);
        });
    }
  };
  console.log(props.categoryData[0].ID);
  return (
    <div className={classes.CreationProduit}>
      <form className={classes.addProduct} onSubmit={handleSubmit}>
        <div className={classes.newProduct}>
          <div>
            <label for="image-url">URL de l'image :</label>
            <br />
            <input
              type="url"
              id="image-url"
              name="image-url"
              onChange={handleImageUrl}
              required
            />
          </div>
          <div>
            <label for="product-name">Nom du produit :</label>
            <br />
            <input
              type="text"
              id="product-name"
              name="product-name"
              onChange={handleProductName}
              required
            />
          </div>
          <div>
            <label for="category">Catégorie :</label>
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
              className={classes.category}
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
          </div>
          <div>
            <label for="description">Description :</label>
            <br />
            <textarea name="description" onChange={handleDescriptionChange}>
              {description}
            </textarea>
          </div>
          <div>
            <label for="weight">
              Poids (en kg) :<br />
            </label>
            <input
              name="weight"
              type="number"
              step="0.01"
              value={weight}
              onChange={handleWeightChange}
              required
            />
          </div>
          <div>
            <label for="available-quantity">Quantité disponible :</label>
            <br />
            <input
              type="number"
              id="available-quantity"
              name="available-quantity"
              onChange={handleQuantity}
              required
            />
          </div>
          <div>
            <label for="sold-price">Prix de vente :</label>
            <br />
            <input
              type="number"
              id="sold-price"
              name="sold-price"
              step="0.01"
              onChange={handlePrice}
              required
            />
          </div>
          <button type="submit">Envoyer</button>
        </div>
      </form>
    </div>
  );
}
