import React from "react";
import UI from "./Frontend/Ui";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<UI />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
