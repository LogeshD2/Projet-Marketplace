// Librairie
import React from "react";
import { NavLink } from "react-router-dom";
import classes from "./NavigationItem.module.css";

export default function NavigationItems(props) {
  return (
    <div className={classes.NavigationItem}>
      <NavLink
        to={props.to}
        className={(navData) => (navData.isActive ? "active" : "")}
      >
        {props.children}
      </NavLink>
    </div>
  );
}
