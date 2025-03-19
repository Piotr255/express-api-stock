import { NextFunction, Request, Response } from "express-serve-static-core";

export function home(request: Request, response: Response) {
    response.render('home', {form: "default"});
    
}

export function form(request: Request, response: Response, next: NextFunction) {
    const formType = request.params.type;
    response.render('home', {
        form: formType
    }); 
}

export function company(request: Request, response: Response, next: NextFunction) {
    const formType = request.params.type;
    response.render('home', {
        form: formType
    }); 
}

export function compare(request: Request, response: Response, next: NextFunction) {
    const formType = request.params.type;
    response.render('home', {
        form: formType
    }); 
}
export function list(request: Request, response: Response, next: NextFunction) {
    const formType = request.params.type;

    response.render('home', {
        form: formType
    }); 
}