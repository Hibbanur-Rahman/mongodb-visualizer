import * as express_serve_static_core from 'express-serve-static-core';

declare function modelAnalyzer(options: {
    mongoose: any;
    path?: string;
    title?: string;
}): express_serve_static_core.Router;

export { modelAnalyzer };
