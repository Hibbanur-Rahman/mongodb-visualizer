import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import ModelService from "@/services/models.service";
import type { Model } from "@/types/models.types";
import { useEffect, useState } from "react";

const Home = () => {
  const [models,setModels]=useState<Model[]>([]);
  const handleGetModels = async () => {
    try {
      const response = await ModelService.GetAllModels();
      console.log("models", response.data);
      if(response?.status===200){
        setModels(response?.data?.data);
      }
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
      <div className="mt-4">
        {models.map((model, index) => (
          <Card key={index} className="w-96 mb-4 cursor-pointer">
            <CardHeader>
              <h2 className="text-2xl font-semibold">{model?.name}</h2>
            </CardHeader>
            <CardDescription>
              <p className="text-sm text-gray-500">
                Collection: {model?.collection}
              </p>

            </CardDescription>
          </Card>
        ))}
      </div>

    </div>
  );
};

export default Home;
