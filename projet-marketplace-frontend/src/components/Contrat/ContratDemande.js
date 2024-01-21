import React, { useState } from "react";
import classes from "./ContratDemande.module.css";

export default function ContratDemande(props) {
  const [choix, setChoix] = useState("refuser");

  function handleChoixChange(event) {
    setChoix(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const token = "";

    // fetch(`http://localhost/contract/${props.contractData.id}`, {
    //   method: "PUT",
    //   body: JSON.stringify({
    //     sign: choix == "refuser" ? false : true,
    //     // quantity: availableQuantity,
    //     // price: soldPrice,
    //   }),
    //   headers: {
    //     "X-Token": token,
    //     "Content-Type": "application/json",
    //   },
    // }).then(() => {
    //   window.location.reload();
    // });
    // Do something with the updated quantity and price values
    console.log("Answer submitted");
  };
  console.log(props);

  return (
    <div className={classes.demand}>
      <form onSubmit={handleSubmit}>
        <h4>Contrat Externe{props.id}</h4>
        <ul>
          <li>
            Lien du shop :{" "}
            <a href={props.contractData.shopLink}>
              {props.contractData.shopLink}
            </a>
          </li>
          <li>Durée du contrat : {props.contractData.DureeContrat}</li>
          <li>
            Date d'expiration : {props.contractData.DateFin} soit dans{" "}
            {props.contractData.TempsRestant}
          </li>
          <li>Comission : {props.contractData.Commission}%</li>
        </ul>
        <label for="accepter">Accepter</label>
        <input
          type="radio"
          id="accepter"
          name="choix"
          value="accepter"
          checked={choix === "accepter"}
          onChange={handleChoixChange}
        />
        <label for="refuser">Refuser</label>
        <input
          type="radio"
          id="refuser"
          name="choix"
          value="refuser"
          checked={choix === "refuser"}
          onChange={handleChoixChange}
        />
        <br />
        <button type="submit">Valider</button>
      </form>
    </div>
  );
}
