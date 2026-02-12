import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Database, Key, Hash, Table as TableIcon, ChevronLeft, ChevronRight } from "lucide-react";
import ModelService from "@/services/models.service";
import type { Model, ModelDataResponse } from "@/types/models.types";
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
  const [dataRecords, setDataRecords] = useState<Array<Record<string, unknown>>>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    skip: 0,
    hasMore: false,
  });
  const [activeTab, setActiveTab] = useState<"schema" | "data">("schema");

  const fetchModelDetails = useCallback(async () => {
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
  }, [modelName]);

  const fetchModelData = useCallback(async (skip = 0) => {
    if (!modelName) return;

    try {
      setDataLoading(true);
      const response = await ModelService.GetModelData(modelName, {
        limit: pagination.limit,
        skip,
        sort: '-_id'
      });

      if (response?.status === 200) {
        const data: ModelDataResponse = response.data;
        setDataRecords(data.data.records);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching model data:", error);
    } finally {
      setDataLoading(false);
    }
  }, [modelName, pagination.limit]);

  useEffect(() => {
    fetchModelDetails();
  }, [fetchModelDetails]);

  useEffect(() => {
    if (activeTab === "data") {
      fetchModelData();
    }
  }, [activeTab, fetchModelData]);

  const filteredFields = model?.fields.filter((field) =>
    field.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNextPage = () => {
    const newSkip = pagination.skip + pagination.limit;
    fetchModelData(newSkip);
  };

  const handlePrevPage = () => {
    const newSkip = Math.max(0, pagination.skip - pagination.limit);
    fetchModelData(newSkip);
  };

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "object") {
      if (value instanceof Date) return new Date(value).toLocaleString();
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const getTypeColor = (type: string): "info" | "success" | "warning" | "secondary" | "destructive" | "default" | "outline" => {
    const colorMap: Record<string, "info" | "success" | "warning" | "secondary" | "destructive" | "default" | "outline"> = {
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

        {/* Tab Switcher */}
        <div className="flex gap-4 mb-6 border-b bg-white rounded-t-lg px-6">
          <button
            onClick={() => setActiveTab("schema")}
            className={`py-4 px-6 font-semibold border-b-2 transition-colors ${
              activeTab === "schema"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Schema Structure
            </div>
          </button>
          <button
            onClick={() => setActiveTab("data")}
            className={`py-4 px-6 font-semibold border-b-2 transition-colors ${
              activeTab === "data"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <TableIcon className="h-4 w-4" />
              Collection Data
            </div>
          </button>
        </div>

        {/* Search */}
        {activeTab === "schema" && (
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
        )}

        {/* Schema Fields Table */}
        {activeTab === "schema" && (
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
                      <Badge variant={getTypeColor(field.type)}>
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
        )}

        {/* Collection Data View */}
        {activeTab === "data" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Collection Data
                <span className="text-sm font-normal text-gray-600 ml-3">
                  ({pagination.total} total records)
                </span>
              </h2>
              <Button
                onClick={() => fetchModelData(pagination.skip)}
                disabled={dataLoading}
                variant="outline"
                size="sm"
              >
                {dataLoading ? "Loading..." : "Refresh"}
              </Button>
            </div>

            {dataLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading data...</p>
                </div>
              </div>
            ) : dataRecords.length === 0 ? (
              <div className="text-center py-12">
                <TableIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No records found in this collection</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        {Object.keys(dataRecords[0] || {}).map((key) => (
                          <TableHead key={key} className="font-bold min-w-[150px]">
                            {key}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dataRecords.map((record, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                          {Object.entries(record).map(([key, value]) => (
                            <TableCell key={key} className="max-w-xs">
                              <div className="truncate" title={formatValue(value)}>
                                {typeof value === "object" && value !== null ? (
                                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block overflow-auto max-h-20">
                                    {formatValue(value)}
                                  </code>
                                ) : (
                                  <span className="text-sm">{formatValue(value)}</span>
                                )}
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Controls */}
                <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Showing {pagination.skip + 1} to{" "}
                    {Math.min(pagination.skip + pagination.limit, pagination.total)} of{" "}
                    {pagination.total} records
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handlePrevPage}
                      disabled={pagination.skip === 0 || dataLoading}
                      variant="outline"
                      size="sm"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      onClick={handleNextPage}
                      disabled={!pagination.hasMore || dataLoading}
                      variant="outline"
                      size="sm"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelDetail;
