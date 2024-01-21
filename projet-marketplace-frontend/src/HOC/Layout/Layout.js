// Librairie
import React from "react";
import classes from "./Layout.module.css";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Composants
import Header from "../../components/UI/Header/Header";
import Footer from "../../components/UI/Footer/Footer";

export default function Layout(props) {
  const location = useLocation();

  return (
    <div className={classes.Layout}>
      {location.pathname === "/" ? (
        props.children
      ) : (
        <>
          <div>
            <Header />
            <div className={classes.app}>{props.children}</div>
            <Footer />
          </div>
          <ToastContainer
            autoClose="3000"
            position="bottom-right"
            pauseOnHover={false}
          />
        </>
      )}
    </div>
  );
}
