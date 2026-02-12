import Request from "@/config/apiConfig";

const GetAllModels = async () => Request({
    url: "models",
    method: "GET",
    secure: true,
})

const GetModelData = async (modelName: string, params?: {
    limit?: number;
    skip?: number;
    sort?: string;
}) => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.sort) queryParams.append('sort', params.sort);

    const queryString = queryParams.toString();
    const url = `models/${modelName}/data${queryString ? `?${queryString}` : ''}`;

    return Request({
        url,
        method: "GET",
        secure: true,
    });
}

const ModelService={
    GetAllModels,
    GetModelData,
}

export default ModelService;
