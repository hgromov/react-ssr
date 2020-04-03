import express from 'express';
import fs from 'fs';
import path from 'path';
import reload from 'reload';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import App from '../src/App';

const PORT = 8000;

const app = express();

app.use('^/$', (req, res, next) => {
    fs.readFile(path.resolve('./build/index.html'), 'utf-8', (error, data) => {
        if (error) {
            console.error(error);
            return res.status(500).send('something went wrong');
        }
        return res.send(data.replace(
            '<div id="root"></div>',
            `<div id="root">${ReactDOMServer.renderToString(<App />)}</div>`
        ))
    })
})

app.use(express.static(path.resolve(__dirname, '..', 'build')));

reload(app)
    .then(() => {
        app.listen(PORT, () => {
            console.info('server started on port: ' + PORT)
        })
    })
    .catch(error => console.error('Reload failed, could not start server', error))