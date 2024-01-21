// Librairie
import React from "react";
import { Link } from "react-router-dom";

export default function ChoixUtilisateur() {
  return (
    <div>
      <h1>Choisissez votre formulaire :</h1>
      <ul>
        <li>
          <Link to="/inscription/client">Formulaire Client</Link>
        </li>
      </ul>
    </div>
  );
}
