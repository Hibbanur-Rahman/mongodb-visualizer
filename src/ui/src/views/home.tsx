import { Button } from "@/components/ui/button";

const Home = () => {
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
