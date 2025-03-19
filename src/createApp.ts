import express from 'express';
import financialData from './routes/financialData';
import path from 'path';

export function createApp() {
    const app = express();
    app.set('views', './templates');
    app.set('view engine', 'ejs');
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(express.urlencoded({extended: true}));
    app.use(express.json())
    app.use('/api/v1/', financialData);
    return app;
}