import express from 'express';
import { Mongoose } from 'mongoose';

declare function modelAnalyzer(options: {
    mongoose: Mongoose;
    path?: string;
    title?: string;
}): express.IRouter;

export { modelAnalyzer };
