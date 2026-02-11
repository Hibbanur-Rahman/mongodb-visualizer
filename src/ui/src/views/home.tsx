import { Button } from "@/components/ui/button";
import ModelService from "@/services/models.service";
import { useEffect } from "react";

const Home = () => {
  const handleGetModels = async () => {
    try {
      const response = await ModelService.GetAllModels();
      console.log("models", response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    handleGetModels();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to MongoDB Visualizer</h1>
      <p className="text-lg text-gray-600">
        Visualize your MongoDB data with ease.
      </p>
      <Button>Get Started</Button>
    </div>
  );
};

export default Home;
