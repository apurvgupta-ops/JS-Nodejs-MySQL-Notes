import React from "react";
import { Link } from "react-router-dom";

const Button = ({ title, path, color }) => {
  return (
    <Link to={path} className={`text-${color}-500`}>
      {title}
    </Link>
  );
};

export default Button;
