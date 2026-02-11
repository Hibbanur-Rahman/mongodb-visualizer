import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Database, Key, Hash } from "lucide-react";
import ModelService from "@/services/models.service";
import type { Model } from "@/types/models.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ModelDetail = () => {
  const { modelName } = useParams<{ modelName: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<Model | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchModelDetails = async () => {
    try {
      setLoading(true);
      const response = await ModelService.GetAllModels();
      if (response?.status === 200) {
        const foundModel = response?.data?.data.find(
          (m: Model) => m.name === modelName
        );
        setModel(foundModel || null);
      }
    } catch (error) {
      console.error("Error fetching model:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModelDetails();
  }, [modelName]);

  const filteredFields = model?.fields.filter((field) =>
    field.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      String: "info",
      Number: "success",
      Boolean: "warning",
      Date: "secondary",
      ObjectId: "destructive",
      Array: "default",
    };
    return colorMap[type] || "outline";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading model details...</p>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Model not found</h2>
        <Button onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Models
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#001E2B] text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Database className="h-6 w-6" />
            <div>
              <h1 className="text-2xl font-bold">{model.name}</h1>
              <p className="text-sm text-gray-300">Collection: {model.collection}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="flex items-center gap-3">
              <Hash className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Fields</p>
                <p className="text-2xl font-bold">{model.fields.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="flex items-center gap-3">
              <Key className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Required Fields</p>
                <p className="text-2xl font-bold">
                  {model.fields.filter((f) => f.required).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Unique Fields</p>
                <p className="text-2xl font-bold">
                  {model.fields.filter((f) => f.unique).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>

        {/* Fields Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">Schema Fields</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-bold w-[250px]">Field Name</TableHead>
                <TableHead className="font-bold">Type</TableHead>
                <TableHead className="font-bold">Properties</TableHead>
                <TableHead className="font-bold">Default</TableHead>
                <TableHead className="font-bold">Enum Values</TableHead>
                <TableHead className="font-bold">Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFields && filteredFields.length > 0 ? (
                filteredFields.map((field, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm font-medium">
                      {field.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeColor(field.type) as any}>
                        {field.type}
                        {field.isArray && "[]"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {field.required && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                        {field.unique && (
                          <Badge variant="warning" className="text-xs">
                            Unique
                          </Badge>
                        )}
                        {field.index && (
                          <Badge variant="info" className="text-xs">
                            Indexed
                          </Badge>
                        )}
                        {field.isArray && (
                          <Badge variant="secondary" className="text-xs">
                            Array
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {field.default !== undefined ? (
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {typeof field.default === "object"
                            ? JSON.stringify(field.default)
                            : String(field.default)}
                        </code>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {field.enum && field.enum.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {field.enum.map((val, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {String(val)}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {field.ref ? (
                        <Badge variant="info" className="text-xs">
                          → {field.ref}
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-gray-500">No fields found matching "{searchTerm}"</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ModelDetail;
