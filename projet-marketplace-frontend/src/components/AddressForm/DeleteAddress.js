import React from "react";

export default function DeleteAddress(props) {
  console.log(props.address);
  const handleDelete = (address) => {
    const sendBody = {
      idAddress: address.ID,
    };
    console.log(sendBody);
    fetch(
      `https://localhost/Projet-Marketplace/SERVEUR_MARKETPLACE/vendeur/interne/adresse/supprimer`,
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
  const buttonStyle = {
    fontSize: "16px",
    padding: "11px 38px",
    marginTop: "10px",
    cursor: "pointer",
    border: "0",
    outline: "none",
    color: "black",
    boxShadow: "0 4px 6px 0 rgba(0, 0, 0, 0.12)",
    marginLeft: "20px",
    marginBottom: "15px",
  };

  return (
    <div>
      {props.address.map((address) => (
        <div key={address.ID}>
          <span>{address.adresseRetrait}</span>
          <button onClick={() => handleDelete(address)} style={buttonStyle}>
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
}
