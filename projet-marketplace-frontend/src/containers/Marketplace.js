// Librairie
import React from "react";
import { Routes, Route } from "react-router-dom";

// Composants
import Accueil from "./Clients/Accueil/Accueil";
import Layout from "../HOC/Layout/Layout";
import Produits from "./Clients/Produits/Produits";
import Produit from "./Clients/Produits/Produit/Produit";
import Panier from "./Clients/Panier/Panier";
import Menu from "./Menu/Menu";
import Connexion from "./Connexion/Connexion";
import ChoixUtilisateur from "./Inscription/ChoixUtilisateur";
import InscriptionClient from "./Inscription/InscriptionUtilisateur/InscriptionClient";
import InscriptionEmployeLivraison from "./Inscription/InscriptionUtilisateur/InscriptionEmployeLivraison";
import InscriptionVendeur from "./Inscription/InscriptionUtilisateur/InscriptionVendeur";
import ProduitsNom from "./Clients/ProduitsNom/ProduitsNom";
import VendeurExterne from "./Vendeur/Externe/VendeurExterne";
import VendeurInterne from "./Vendeur/Interne/VendeurInterne";
import Livreur from "./EmployeLivraison/Livreur/Livreur";
import PreparateurCommande from "./EmployeLivraison/PreparateurCommande/PreparateurCommande";
import Commande from "./EmployeLivraison/PreparateurCommande/Commande/Commande";
import CommandePerso from "./EmployeLivraison/PreparateurCommande/CommandePerso/CommandePerso";
import Colis from "./EmployeLivraison/Livreur/Colis/Colis";
import ColisPerso from "./EmployeLivraison/Livreur/ColisPerso/ColisPerso";
import Erreur from "../components/UI/Error/Erreur";

export default function Marketplace() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Menu />} />

        <Route exact path="/inscription" element={<ChoixUtilisateur />} />
        <Route
          exact
          path="/inscription/client"
          element={<InscriptionClient />}
        />
        <Route
          exact
          path="/inscription/livreur"
          element={<InscriptionEmployeLivraison />}
        />
        <Route
          exact
          path="/inscription/vendeur"
          element={<InscriptionVendeur />}
        />

        <Route exact path="/Connexion" element={<Connexion />} />

        <Route exact path="/clients" element={<Accueil />} />
        <Route exact path="/clients/produits" element={<Produits />} />
        <Route exact path="/clients/produits/:id" element={<Produit />} />
        <Route
          exact
          path="/clients/produitsNom/:nom"
          element={<ProduitsNom />}
        />
        <Route exact path="/clients/panier" element={<Panier />} />

        <Route exact path="/vendeurs/:id" element={<VendeurExterne />} />
        <Route exact path="/admin" element={<VendeurInterne />} />

        <Route exact path="/livreurs" element={<Livreur />} />
        <Route exact path="/livreurs/colis/:id" element={<Colis />} />
        <Route exact path="/livreurs/mes_colis" element={<ColisPerso />} />

        <Route
          exact
          path="/preparateur_commandes"
          element={<PreparateurCommande />}
        />
        <Route
          exact
          path="/preparateur_commandes/commandes/:id"
          element={<Commande />}
        />
        <Route
          exact
          path="/preparateur_commandes/mes_commandes"
          element={<CommandePerso />}
        />
        <Route exact="*" element={<Erreur />} />
      </Routes>
    </Layout>
  );
}
