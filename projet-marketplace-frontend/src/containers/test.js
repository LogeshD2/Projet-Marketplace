// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import classes from "./Produit.module.css";
// import axios from "axios";

// export default function Produit() {
//   const { id } = useParams();
//   const [quantite, setQuantite] = useState(1);
//   const [product, setProduct] = useState();

//   var response =
//     '[{"id": 19, "quantiteDisponible": 20, "prix": "901", "estDisponible": 1, "quantiteVendu": 10, "prixVendu": "9009", "dateEstimeLivraison": "2023-04-13", "fraisLivraison": "6", "nomProduit": "Telephone", "picture": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQknKKDli-_WhXHnEnxVo7v8L8ekRshjpRvEQ&usqp=CAU", "description": "Le dernier portable sortie par apple, le best", "poid": "1", "note": "10", "categorie": "Informatique"}]';

//   var data = JSON.parse(response);

//   // Accéder à la première et unique objet dans le tableau
//   var produit = data[0];

//   // Modifier les valeurs des propriétés de l'objet
//   produit.quantiteDisponible = 15;
//   produit.prixVendu = "9500";

//   // Convertir l'objet modifié en une chaîne JSON
//   var produitModifie = JSON.stringify(produit);

//   useEffect(() => {
//     getProduct();
//   }, []);

//   const getProduct = () => {
//     fetch(
//       `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/clients/produits/${id}`
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         setProduct(data[0]);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   const handleAjouter = (event) => {
//     event.preventDefault();
//     if (product && product.quantiteDisponible > quantite) {
//       setQuantite(quantite + 1);
//     }
//   };

//   const handleSoustraire = (event) => {
//     event.preventDefault();
//     if (quantite > 1) {
//       setQuantite(quantite - 1);
//     }
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     const produit = {
//       quantiteVendu: 10,
//       prixVendu: 50,
//     };

//     fetch("https://localhost/Projet-Marketplace/SERVEUR2/", {
//       method: "POST",
//       body: JSON.stringify(data),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         // Traitement de la réponse du serveur
//         console.log(data);
//       })
//       .catch((error) => {
//         // Gestion des erreurs
//         console.error("Erreur:", error);
//       });
//   };
//   return (
//     <>
//       {product && (
//         <div className={classes.Produit}>
//           <div>
//             <img src={product.picture} alt={product.nomProduit} />
//           </div>

//           <div className={classes.commander}>
//             <h2>{product.nomProduit}</h2>
//             <h4>
//               <i>Référence : A53</i>
//             </h4>
//             <p>
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//               eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
//               enim ad minim veniam, quis nostrud exercitation ullamco laboris
//               nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
//               reprehenderit in voluptate velit esse cillum dolore eu fugiat
//               nulla pariatur.
//             </p>
//             <h2>
//               <b>Prix : {product.prix}€</b>
//             </h2>

//             <form onSubmit={handleSubmit}>
//               <label name="quantite">Quantité : </label>
//               <button
//                 className={classes.quantiteButton}
//                 onClick={handleSoustraire}
//               >
//                 -
//               </button>
//               <input
//                 className={classes.quantiteInput}
//                 type="number"
//                 name="quantite"
//                 id="quantite"
//                 value={quantite}
//               />
//               <button
//                 className={classes.quantiteButton}
//                 onClick={handleAjouter}
//               >
//                 +
//               </button>
//               <button className={classes.panierButton} type="submit">
//                 Ajouter au panier
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// // Librairie
// import React, { useEffect, useState } from "react";
// import data from "../../../data/Produits.json";
// import classes from "./Produits.module.css";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { Link } from "react-router-dom";

// export default function Produits() {
//   // State
//   const [produits, setProduits] = useState(data);

//   const ArrowButton = (props) => (
//     <div
//       className={
//         props.direction === "left" ? classes.arrowPrev : classes.arrowNext
//       }
//     >
//       <button onClick={props.onClick} className={classes.buttonSlide}>
//         {props.direction === "left" ? "<" : ">"}
//       </button>
//     </div>
//   );

//   const slickPrev = () => {
//     // Récupérer la référence de votre carrousel
//     const slider = document.querySelector(".slick-slider");

//     // Faire défiler les diapositives vers la gauche
//     slider.slickPrev();
//   };

//   const slickNext = () => {
//     // Récupérer la référence de votre carrousel
//     const slider = document.querySelector(".slick-slider");

//     // Faire défiler les diapositives vers la droite
//     slider.slickNext();
//   };

//   // Slick settings
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     arrows: true,
//     prevArrow: <ArrowButton direction="left" onClick={slickPrev} />,
//     nextArrow: <ArrowButton direction="right" onClick={slickNext} />,
//   };

//   const DisplayedProduits = produits.products.map((produit) => (
//     <>
//       <Link
//         to={`/clients/produit/${produit.id}`}
//         style={{ textDecoration: "none", color: "black" }}
//       >
//         <div className={classes.produit} key={produit.id}>
//           <img src={produit.image} alt="image" />
//           <p>
//             <b>
//               {produit.productName} : {produit.productPrice}€
//             </b>
//           </p>
//           <p>Quantité restante : {produit.soldQuantity}</p>
//           <i>Référence : A53</i>
//         </div>
//       </Link>
//     </>
//   ));

//   return (
//     <div className={classes.Produits}>
//       <h1 style={{ textAlign: "center" }}>Produits</h1>
//       <div>
//         <Slider {...settings} style={{ width: "800px", margin: "auto" }}>
//           {DisplayedProduits}
//         </Slider>
//       </div>
//     </div>
//   );
// }
