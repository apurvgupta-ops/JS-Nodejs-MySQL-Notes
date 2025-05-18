import React from "react";
import { Link } from "react-router-dom";

const Button = ({ title, path, color, onClick }) => {
  return (
    <Link to={path} className={`text-${color}-500`} onClick={onClick}>
      {title}
    </Link>
  );
};

export default Button;
