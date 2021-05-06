import "./styles/App.css";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { LayoutBase } from "./LayoutBase";

export const App = () => {
  return (
    <BrowserRouter>
      <LayoutBase />
    </BrowserRouter>
  );
};

export default App

