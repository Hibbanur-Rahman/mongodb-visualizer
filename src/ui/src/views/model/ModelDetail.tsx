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
      <div className="flex items-center justify-center h-full py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading model details...</p>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Model not found</h2>
        <Button onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Models
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{model.name}</h1>
                <p className="text-sm text-gray-600">Collection: <span className="font-mono font-medium">{model.collection}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Hash className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Fields</p>
                <p className="text-3xl font-bold text-gray-900">{model.fields.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <Key className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Required Fields</p>
                <p className="text-3xl font-bold text-gray-900">
                  {model.fields.filter((f) => f.required).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Unique Fields</p>
                <p className="text-3xl font-bold text-gray-900">
                  {model.fields.filter((f) => f.unique).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 mb-6 bg-white rounded-lg border-2 border-gray-200 p-1">
          <button
            onClick={() => setActiveTab("schema")}
            className={`flex-1 py-3 px-6 font-semibold rounded-md transition-all ${
              activeTab === "schema"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Database className="h-4 w-4" />
              Schema Structure
            </div>
          </button>
          <button
            onClick={() => setActiveTab("data")}
            className={`flex-1 py-3 px-6 font-semibold rounded-md transition-all ${
              activeTab === "data"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <TableIcon className="h-4 w-4" />
              Collection Data
            </div>
          </button>
        </div>

        {/* Search */}
        {activeTab === "schema" && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-300"
              />
            </div>
          </div>
        )}

        {/* Schema Fields Table */}
        {activeTab === "schema" && (
        <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-lg font-semibold text-gray-900">Schema Fields</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b-2 border-gray-200">
                <TableHead className="font-bold text-gray-900 w-[250px]">Field Name</TableHead>
                <TableHead className="font-bold text-gray-900">Type</TableHead>
                <TableHead className="font-bold text-gray-900">Properties</TableHead>
                <TableHead className="font-bold text-gray-900">Default</TableHead>
                <TableHead className="font-bold text-gray-900">Enum Values</TableHead>
                <TableHead className="font-bold text-gray-900">Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFields && filteredFields.length > 0 ? (
                filteredFields.map((field, index) => (
                  <TableRow key={index} className="hover:bg-blue-50 transition-colors border-b border-gray-100">
                    <TableCell className="font-mono text-sm font-semibold text-gray-900">
                      {field.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeColor(field.type)} className="font-medium">
                        {field.type}
                        {field.isArray && "[]"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {field.required && (
                          <Badge variant="destructive" className="text-xs font-medium">
                            Required
                          </Badge>
                        )}
                        {field.unique && (
                          <Badge className="text-xs font-medium bg-amber-500 hover:bg-amber-600">
                            Unique
                          </Badge>
                        )}
                        {field.index && (
                          <Badge variant="secondary" className="text-xs font-medium">
                            Indexed
                          </Badge>
                        )}
                        {field.isArray && (
                          <Badge variant="outline" className="text-xs font-medium">
                            Array
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {field.default !== undefined ? (
                        <code className="text-xs bg-blue-50 text-blue-900 px-2 py-1 rounded font-mono">
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
                        <Badge variant="secondary" className="text-xs font-medium">
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
                  <TableCell colSpan={6} className="text-center py-12">
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
          <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
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
                className="border-gray-300"
              >
                {dataLoading ? "Loading..." : "Refresh"}
              </Button>
            </div>

            {dataLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading data...</p>
                </div>
              </div>
            ) : dataRecords.length === 0 ? (
              <div className="text-center py-20">
                <TableIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No records found in this collection</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 border-b-2 border-gray-200">
                        {Object.keys(dataRecords[0] || {}).map((key) => (
                          <TableHead key={key} className="font-bold text-gray-900 min-w-[150px]">
                            {key}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dataRecords.map((record, index) => (
                        <TableRow key={index} className="hover:bg-blue-50 transition-colors border-b border-gray-100">
                          {Object.entries(record).map(([key, value]) => (
                            <TableCell key={key} className="max-w-xs">
                              <div className="truncate" title={formatValue(value)}>
                                {typeof value === "object" && value !== null ? (
                                  <code className="text-xs bg-blue-50 text-blue-900 px-2 py-1 rounded block overflow-auto max-h-20 font-mono">
                                    {formatValue(value)}
                                  </code>
                                ) : (
                                  <span className="text-sm text-gray-900">{formatValue(value)}</span>
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
                <div className="px-6 py-4 border-t-2 border-gray-200 bg-gray-50 flex justify-between items-center">
                  <div className="text-sm text-gray-700 font-medium">
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
                      className="border-gray-300"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      onClick={handleNextPage}
                      disabled={!pagination.hasMore || dataLoading}
                      variant="outline"
                      size="sm"
                      className="border-gray-300"
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
