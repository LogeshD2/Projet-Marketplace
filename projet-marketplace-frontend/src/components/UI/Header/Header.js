// Composants
import React from "react";
import classes from "./Header.module.css";
import CYSHOP from "../../../public/CYSHOP.png";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/Logout/logoutActions";

// Composants
import NavigationItems from "./NavigationItem/NavigationItem";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { pathname } = useLocation();

  const typeUtilisateur = useSelector((state) =>
    state.client.clientInfo ? state.client.clientInfo.typeUtilisateur : null
  );
  console.log(typeUtilisateur);

  const dispatch = useDispatch(); // Déconnexion

  const handlerClickDeconnexion = () => {
    dispatch(logout());
    console.log("ok");
  };
  return (
    <header className={classes.Header}>
      <div className={`container ${classes.navigation}`}>
        <div className={classes.imgCYSHOP}>
          <img src={CYSHOP} />
        </div>

        <div>
          <ul>
            {(typeUtilisateur === "clients" || typeUtilisateur == null) && (
              <>
                <li>
                  <NavigationItems to="/clients">Accueil</NavigationItems>
                </li>
                <li>
                  <NavigationItems to="/clients/produits">
                    Produits
                  </NavigationItems>
                </li>
                <li>
                  <NavigationItems to="/clients/panier">Panier</NavigationItems>
                </li>
              </>
            )}
            {typeUtilisateur === "vendeurs" && (
              <>
                <li>
                  <NavigationItems to="/">Accueil</NavigationItems>
                </li>
                <li>
                  <NavigationItems to="Trésorerie">Trésorerie</NavigationItems>
                </li>
              </>
            )}
            {typeUtilisateur === "livreur" && (
              <>
                <li>
                  <NavigationItems to="/livreurs">Accueil</NavigationItems>
                </li>
                <li>
                  <NavigationItems to="/livreurs/mes_colis">
                    Mes Colis
                  </NavigationItems>
                </li>
              </>
            )}
            {typeUtilisateur === "preparateurCommande" && (
              <>
                <li>
                  <NavigationItems to="/preparateur_commandes">
                    Accueil
                  </NavigationItems>
                </li>
                <li>
                  <NavigationItems to="/preparateur_commandes/mes_commandes">
                    Mes Commandes
                  </NavigationItems>
                </li>
              </>
            )}
            {!typeUtilisateur ? (
              <>
                <li>
                  <NavigationItems to="/connexion">Connexion</NavigationItems>
                </li>
                <li>
                  <NavigationItems to="/inscription/client">
                    inscription
                  </NavigationItems>
                </li>
              </>
            ) : (
              <li>
                <NavigationItems to="/">
                  <span onClick={handlerClickDeconnexion}>Déconnexion</span>
                </NavigationItems>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
