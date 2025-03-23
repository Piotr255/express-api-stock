import { NextFunction, Request, Response } from "express-serve-static-core";

interface ErrorInfo {
    code: number
    message: string,

}
export function errorHandler(error: Error, request: Request, response: Response, next: NextFunction) {
    const errorInfo: ErrorInfo = {
        code: response.statusCode,
        message: error.message
    };
    response.render('errorSite', {
        errorInfo: errorInfo     
    });
}