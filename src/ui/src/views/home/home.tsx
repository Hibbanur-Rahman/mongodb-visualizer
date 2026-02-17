import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Database, Search, FileText, ChevronRight, FileCode, Upload, Zap, Activity } from "lucide-react";
import ModelService from "@/services/models.service";
import type { Model } from "@/types/models.types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Home = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleGetModels = async () => {
    try {
      setLoading(true);
      const response = await ModelService.GetAllModels();
      console.log("models", response.data);
      if (response?.status === 200) {
        setModels(response?.data?.data);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetModels();
  }, []);

  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.collection.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full">
      {/* Get Started Section */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Get started with MongoDB Visualizer</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Connect to your database */}
            <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-blue-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Connect to your database</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get your connection string and setup instructions to start querying your database.
              </p>
              <Button className="w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-50">
                <Database className="h-4 w-4 mr-2" />
                Connect
              </Button>
            </Card>

            {/* Import existing data */}
            <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-blue-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Import existing data</h3>
              <p className="text-sm text-gray-600 mb-4">
                Migrate your schema and data from another database.
              </p>
              <Button className="w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-50">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </Card>

            {/* Build a sample app */}
            <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-blue-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Build a sample app</h3>
              <p className="text-sm text-gray-600 mb-4">
                Spin up a MongoDB project and run your first queries in seconds.
              </p>
              <Button className="w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-50">
                <FileCode className="h-4 w-4 mr-2" />
                Quickstart
              </Button>
            </Card>
          </div>

          {/* Database Usage Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Database Usage</h2>
            <Card className="p-12 border-2 border-dashed">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Activity className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Usage Data</h3>
                <p className="text-gray-600">
                  Usage data for this database will appear here as it is generated.
                </p>
              </div>
            </Card>
          </div>

          {/* Models Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Models</h2>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="text-sm">
                  {models.length} {models.length === 1 ? "Model" : "Models"}
                </Badge>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500 rounded-lg">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Total Models</p>
                    <p className="text-3xl font-bold text-blue-900">{models.length}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500 rounded-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-green-700 font-medium">Total Fields</p>
                    <p className="text-3xl font-bold text-green-900">
                      {models.reduce((acc, model) => acc + model.fields.length, 0)}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500 rounded-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-700 font-medium">Collections</p>
                    <p className="text-3xl font-bold text-purple-900">
                      {new Set(models.map((m) => m.collection)).size}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search models or collections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white shadow-sm border-gray-300"
                />
              </div>
            </div>

            {/* Models Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading models...</p>
                </div>
              </div>
            ) : filteredModels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModels.map((model, index) => (
                  <Card
                    key={index}
                    className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border-2 hover:border-blue-500 group"
                    onClick={() => navigate(`/model/${model.name}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-500 transition-colors">
                          <Database className="h-5 w-5 text-blue-600 group-hover:text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {model.name}
                          </h3>
                          <p className="text-sm text-gray-500 font-mono">
                            {model.collection}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Fields</span>
                        <Badge variant="secondary" className="font-semibold">
                          {model.fields.length}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Required</span>
                        <Badge variant="destructive" className="font-semibold">
                          {model.fields.filter((f) => f.required).length}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Unique</span>
                        <Badge className="font-semibold bg-amber-500 hover:bg-amber-600">
                          {model.fields.filter((f) => f.unique).length}
                        </Badge>
                      </div>
                    </div>

                    {/* Field Types Preview */}
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-gray-500 mb-2">Field Types:</p>
                      <div className="flex flex-wrap gap-1">
                        {Array.from(
                          new Set(model.fields.map((f) => f.type))
                        )
                          .slice(0, 4)
                          .map((type, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        {new Set(model.fields.map((f) => f.type)).size > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{new Set(model.fields.map((f) => f.type)).size - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 border-2 border-dashed">
                <div className="flex flex-col items-center justify-center text-center">
                  <Database className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No models found
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm
                      ? `No models match "${searchTerm}"`
                      : "Start by defining some Mongoose models"}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
