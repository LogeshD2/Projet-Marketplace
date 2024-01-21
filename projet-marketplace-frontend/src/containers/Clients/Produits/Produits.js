// Librairie;
import React, { useEffect, useState } from "react";
import classes from "./Produits.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

export default function Produits() {
  // State
  const [products, setProducts] = useState();
  const [categories, setCategories] = useState();
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  const getProducts = () => {
    fetch(
      "https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/clients/produits/"
    )
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCategories = () => {
    fetch(
      "https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/clients/categories/"
    )
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCategoryChange = (categoryId) => {
    // Mettre à jour les catégories sélectionnées
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const fetchProducts = () => {
    const categoryIdString = selectedCategories.join("/"); // Convertir les catégories sélectionnées en chaîne de caractères séparée par des virgules
    console.log(categoryIdString);
    fetch(
      `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/clients/produitsCategories/${categoryIdString}`
    ) // Appeler l'API avec les catégories sélectionnées comme paramètre
      .then((response) => response.json())
      .then((products) => {
        // Utiliser les produits récupérés
        setProducts(products);
        console.log(products); // Remplacez cette ligne par votre logique pour afficher les produits dans votre application
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const DisplayedProduits =
    products &&
    products.map((product) => (
      <>
        <div class={classes.productsCard}>
          <div class={classes.card}>
            <div class={classes.imgBx}>
              <img
                src={product.picture}
                style={{ outline: "none" }}
                alt={product.nomProduit}
              />
            </div>

            <div class={classes.contentBx}>
              <h2>{product.nomProduit}</h2>
              <div class={classes.size}>
                <h3>Prix :</h3>
                <span>{product.prix}5€</span>
              </div>

              <Link
                to={`/clients/produits/${product.idProduitVendeur}`}
                className={classes.buyFirstProduct}
                style={{ marginTop: "0" }}
              >
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      </>
    ));

  const DisplayedCategories =
    categories &&
    categories.map((categorie, index) => (
      <div key={index} className={classes.Category}>
        <input
          key={index}
          type="checkbox"
          value={categorie.nomCategorie}
          onChange={() => handleCategoryChange(categorie.id)}
        />
        <label htmlFor={categorie.nomCategorie}>{categorie.nomCategorie}</label>
      </div>
    ));

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Produits</h1>
      <div className={classes.ProduitCategorie}>
        <div className={classes.Categories}>
          <h2 style={{ textAlign: "left" }}>Catégories</h2>
          {DisplayedCategories}
          <button onClick={fetchProducts}>Rechercher</button>
        </div>

        <div className={classes.productsList}>{DisplayedProduits}</div>
      </div>
    </>
  );
}
