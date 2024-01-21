import React from "react";
import classes from "./Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <footer className={classes.Footer}>
      <div className={classes.footerLeft}>
        <h3>
          CY<span>SHOP</span>
        </h3>

        <p className={classes.footerLinks}>
          <a href="#" className={classes.link1}>
            Home
          </a>

          <a href="#">Blog</a>

          <a href="#">Pricing</a>

          <a href="#">About</a>

          <a href="#">Faq</a>

          <a href="#">Contact</a>
        </p>

        <p className={classes.footerCompanyName}>CY SHOP © 2023</p>
      </div>

      <div className={classes.footerCenter}>
        <div className={classes.yacon}>
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          <p>
            <span>Adresse:</span>33 Bd du Por 95000 Cergy
          </p>
        </div>

        <div>
          <FontAwesomeIcon icon={faPhone} />
          <p>
            <span>Phone: </span>+33.01.34.25.10.10
          </p>
        </div>

        <div>
          <FontAwesomeIcon icon={faEnvelope} />
          <p>
            <span>Email: </span>
            <a href="mailto:support@company.com">contact@cy-shop.fr</a>
          </p>
        </div>
      </div>

      <div className={classes.footerRight}>
        <p className={classes.footerCompanyAbout}>
          <span>About the company</span>
          Notre entreprise est un site e-commerce proposant une large gamme de
          produits. Nous nous efforçons de fournir une expérience d'achat en
          ligne facile et agréable à tous nos clients.
        </p>

        <div className={classes.footerIcons}>
          <a href="#">
            <i className="fa fa-facebook"></i>
          </a>
          <a href="#">
            <i className="fa fa-twitter"></i>
          </a>
          <a href="#">
            <i className="fa fa-linkedin"></i>
          </a>
          <a href="#">
            <i className="fa fa-github"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
