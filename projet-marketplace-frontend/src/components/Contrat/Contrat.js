import React from "react";
import classes from "./Contrat.module.css";

export default function Contrat(props) {
  return (
    <div className={classes.contract}>
      <h4>Contrat Actif</h4>
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
    </div>
  );
}
