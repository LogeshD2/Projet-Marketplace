// Librairie
import React from "react";
import classes from "./Menu.module.css";
import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <div className={classes.Menu}>
      <div class={classes.backgroundOne}>
        <div class={classes.linkContainer}>
          <Link to="/connexion" class={classes.linkOne}>
            Connexion
          </Link>
        </div>
      </div>
      <div class={`${classes.backgroundTwo} ${classes.linkContainer}`}>
        <Link to="/clients" class={classes.linkTwo}>
          Accueil
        </Link>
      </div>
      <div class={`${classes.backgroundThree} ${classes.linkContainer}`}>
        <Link to="/inscription/client" class={classes.linkThree}>
          Inscription
        </Link>
      </div>
    </div>
  );
}
