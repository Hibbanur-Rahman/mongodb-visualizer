import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Database, Search, FileText, ChevronRight } from "lucide-react";
import ModelService from "@/services/models.service";
import type { Model } from "@/types/models.types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#001E2B] text-white shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">MongoDB Models Visualizer</h1>
              <p className="text-gray-300 text-sm">
                Explore and visualize your Mongoose schemas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Models</p>
                  <p className="text-3xl font-bold text-gray-900">{models.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-white shadow-sm border-l-4 border-green-500">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Fields</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {models.reduce((acc, model) => acc + model.fields.length, 0)}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-white shadow-sm border-l-4 border-purple-500">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Database className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Collections</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {new Set(models.map((m) => m.collection)).size}
                  </p>
                </div>
              </div>
            </Card>
          </div>
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
              className="pl-10 bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Models Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
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
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Database className="h-5 w-5 text-blue-600" />
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
                    <Badge variant="warning" className="font-semibold">
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
          <div className="text-center py-20">
            <Database className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No models found
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? `No models match "${searchTerm}"`
                : "Start by defining some Mongoose models"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
