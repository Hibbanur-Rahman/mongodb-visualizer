import { Route, Routes } from "react-router-dom";
import Home from "./views/home";
import ModelDetail from "./views/ModelDetail";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/model/:modelName" element={<ModelDetail />} />
      </Routes>
    </>
  );
}

export default App;
