import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout/mainLayout";
import Home from "./views/home/home";
import ModelDetail from "./views/model/ModelDetail";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/model/:modelName" element={<ModelDetail />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
