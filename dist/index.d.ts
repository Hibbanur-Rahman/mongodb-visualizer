import * as express_serve_static_core from 'express-serve-static-core';
import { Mongoose } from 'mongoose';

declare function modelAnalyzer(options: {
    mongoose: Mongoose;
    path?: string;
    title?: string;
}): express_serve_static_core.Router;

export { modelAnalyzer };
