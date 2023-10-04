import React from "react";
import "./content-box.css";

const ContentBox = ({ children, color = "" }) => {
    return <div className={`content-container${color}`}>{children}</div>;
};

export default ContentBox;
