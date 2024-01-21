import React, { useState } from "react";
import classes from "./AddressForm.module.css";
import { toast } from "react-toastify";

export default function AdresseForm() {
  const [adresse, setAdresse] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleAdresseChange = (event) => {
    const { value } = event.target;
    setAdresse(value);

    // Appel de l'API OpenStreetView pour obtenir des suggestions en France
    const url = `https://nominatim.openstreetmap.org/search?q=${value}&countrycodes=fr&format=json`;
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Une erreur s'est produite");
        }
      })
      .then((data) => {
        setSuggestions(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSuggestionClick = (suggestion) => {
    setAdresse(suggestion.display_name);
    setSuggestions([]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const token = "";

    if (adresse.trim() === "") {
      alert("Le nom du produit ne peut pas être vide !");
    } else {
      // const token = "";

      let url = `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/vendeur/interne/adresse/ajouter`;
      console.log(adresse);
      fetch(url, {
        method: "POST",
        body: JSON.stringify({
          address: adresse,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          toast.success(data.message);
          // Traitement de la réponse du serveur
          window.location.reload();
          console.log(data);
        })
        .catch((error) => {
          // Gestion des erreurs
          console.error("Erreur:", error);
        });
    }
  };

  return (
    <div className={classes.adresseForm}>
      <form>
        <label htmlFor="adresse">Adresse : </label>
        <input
          type="text"
          id="adresse"
          name="adresse"
          value={adresse}
          onChange={handleAdresseChange}
        />

        {suggestions.length > 0 && (
          <ul>
            {suggestions.map((suggestion, index) => (
              <li
                className="suggestion"
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
        <button onClick={handleSubmit}>Ajouter</button>
      </form>
    </div>
  );
}
