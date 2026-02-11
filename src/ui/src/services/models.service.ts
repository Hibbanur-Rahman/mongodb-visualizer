import Request from "@/config/apiConfig";

const GetAllModels = async () => Request({
    url: "models",
    method: "GET",
    secure: true,
})

const ModelService={
    GetAllModels,
}

export default ModelService;
