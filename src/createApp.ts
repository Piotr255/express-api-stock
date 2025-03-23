import express from 'express';
import financialData from './routes/financialData';
import path from 'path';
import { errorHandler } from './middlewares/error';

export function createApp() {
    const app = express();
    app.set('views', './templates');
    app.set('view engine', 'ejs');
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(express.urlencoded({extended: true}));
    app.use(express.json())
    app.use('/api/v1/', financialData);
    app.get('/*splat',function (req, res, next) {
        res.redirect('/api/v1/home');
    });
    app.use(errorHandler);
    return app;
}