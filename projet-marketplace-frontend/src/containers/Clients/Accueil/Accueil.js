// Librairie
import React, { useEffect, useState } from "react";
import classes from "./Accueil.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setClientInfo } from "../../../redux/Client/clientActions";
import { useDispatch, useSelector } from "react-redux";
import video from "../../../assets/video/pexels-kindel-media-6994619.mp4";

export default function Accueil() {
  const [client, setClient] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState();
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();

  const clientInfo = useSelector(
    (state) => state.client.clientInfo && state.client.clientInfo
  );

  const typeUtilisateur = useSelector(
    (state) =>
      state.client.clientInfo && state.client.clientInfo.typeUtilisateur
  );

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

  const bestProduct =
    products.length > 0 ? products.sort((a, b) => b.note - a.note) : null;

  const ArrowButton = (props) => (
    <div
      className={
        props.direction === "left" ? classes.arrowPrev : classes.arrowNext
      }
    >
      <button onClick={props.onClick} className={classes.buttonSlide}>
        {props.direction === "left" ? "<" : ">"}
      </button>
    </div>
  );

  // Swiper
  const slickPrev = () => {
    // Récupérer la référence de votre carrousel
    const slider = document.querySelector(".slick-slider");

    // Faire défiler les diapositives vers la gauche
    slider.slickPrev();
  };

  const slickNext = () => {
    // Récupérer la référence de votre carrousel
    const slider = document.querySelector(".slick-slider");

    // Faire défiler les diapositives vers la droite
    slider.slickNext();
  };

  // Slick settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    prevArrow: <ArrowButton direction="left" onClick={slickPrev} />,
    nextArrow: <ArrowButton direction="right" onClick={slickNext} />,
  };

  const DisplayedProduits =
    bestProduct &&
    bestProduct.slice(1, 5).map((product) => (
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
      <>
        <div className={classes.categorie}>
          <img
            src="https://d2aabgjce9enf.cloudfront.net/main/media/content/5/d/5d85c6fc71a6f180e10da000287864e185249b21.jpg"
            alt={categorie.categorie}
          />
          <p style={{ textAlign: "center" }}>
            <b>{categorie.nomCategorie}</b>
          </p>
        </div>
      </>
    ));

  const handleInputChange = async (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    // Appeler l'API du backend pour récupérer les noms de produits
    try {
      const response = await fetch(
        "https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/clients/produitsNomAutoCompletion"
      );
      const data = await response.json();
      // Filtrer les suggestions en fonction du texte de recherche actuel
      const filteredSuggestions = data.filter((item) =>
        item.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des suggestions d'autocomplétion : ",
        error
      );
    }

    if (searchTerm === "") {
      // Réinitialiser les suggestions à une liste vide
      setSuggestions([]);
    }
  };

  const handleKeyDown = (event) => {
    console.log(event.keyCode);
    if (event.keyCode === 13) {
      event.preventDefault();
      handleSubmitProductName(event);
    }
  };

  const handleSubmitProductName = (event) => {
    event.preventDefault(); // Empêcher le rechargement de la page

    // Récupérer la valeur saisie dans le champ de recherche
    const search = event.target.value;
    if (search) {
      navigate(`/clients/produitsNom/${search}`);
    }
  };

  let blurTimeout;
  const handleBlur = () => {
    // Fermer l'autocomplétion en réinitialisant les suggestions
    // après un court délai pour permettre la détection du clic sur le lien
    blurTimeout = setTimeout(() => {
      setSuggestions([]);
    }, 200);
  };

  const handleMouseDown = () => {
    // Empêcher l'autocomplétion de se fermer lorsqu'un lien est cliqué
    // en annulant l'événement onBlur
    clearTimeout(blurTimeout);
  };

  return (
    <div className={classes.Accueil}>
      <div className={classes.videoContainer}>
        <div style={{ border: "1px solid grey" }}>
          <video autoPlay muted loop className={classes.video}>
            <source src={video} type="video/mp4" />
          </video>
        </div>
        <div className={classes.overlay}>
          <form onSubmit={handleSubmitProductName}>
            <div class="group">
              <input
                type="text"
                onKeyDown={handleKeyDown}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
              />
              <span class="highlight"></span>
              <span class="bar"></span>
              <label>Rechercher</label>
            </div>
          </form>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            class="bi bi-search"
            viewBox="0 0 16 16"
            className={classes.glass}
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
          {suggestions.length > 0 && (
            <ul className={classes.autoCompletion}>
              {suggestions.map((suggestion, index) => (
                <Link
                  to={`/clients/produitsNom/${suggestion}`}
                  onMouseDown={handleMouseDown}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <li key={index} className={classes.liAutocompletion}>
                    {suggestion}{" "}
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="container">
        <h1 style={{ textAlign: "center", fontSize: "50px" }}>CY SHOP</h1>

        <div className={classes.newProduct}>
          <h2>Les dernières nouveautés</h2>
          <div className={classes.flexProduct}>
            {bestProduct && (
              <div className={classes.firstProduct}>
                <div className={classes.cardFirstProduct}>
                  <div className={classes.imgBoxFirstProduct}>
                    <img
                      src={bestProduct[0].picture}
                      alt={bestProduct[0].nomProduit}
                      className={classes.imageFirstProduct}
                    />
                  </div>

                  <div className={classes.contentBoxFirstProduct}>
                    <h3>{bestProduct[0].nomProduit}</h3>

                    <h2 className={classes.priceFirstProduct}>
                      <small>{bestProduct[0].prix}</small> €
                    </h2>
                    <Link
                      to={`/clients/produits/${bestProduct[0].idProduitVendeur}`}
                      className={classes.buyFirstProduct}
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className={classes.otherProduct}>{DisplayedProduits}</div>
          </div>
        </div>

        <div className={classes.trait} />

        <div className={classes.bestProduct}>
          <h2>Les mieux notées</h2>
          <div className={classes.flexProduct}>
            {bestProduct && (
              <div className={classes.firstProduct}>
                <div className={classes.cardFirstProduct}>
                  <div className={classes.imgBoxFirstProduct}>
                    <img
                      src={products[0].picture}
                      alt={products[0].nomProduit}
                      className={classes.imageFirstProduct}
                    />
                  </div>

                  <div className={classes.contentBoxFirstProduct}>
                    <h3>{products[0].nomProduit}</h3>
                    <h2 className={classes.priceFirstProduct}>
                      <small>{products[0].prix}</small> €
                    </h2>
                    <Link
                      to={`/clients/produits/${products[0].idProduitVendeur}`}
                      className={classes.buyFirstProduct}
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className={classes.otherProduct}>{DisplayedProduits}</div>
          </div>
        </div>

        <div className={classes.trait} />
        <div>
          <h2>Catégories</h2>
          <Slider {...settings} style={{ margin: "auto" }}>
            {DisplayedCategories}
          </Slider>
        </div>
      </div>
    </div>
  );
}
