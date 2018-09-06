'use strict';

import React from 'react';
import dva from '@alife/wdk-dva';
import {Router, Route} from '@alife/wdk-dva/lib/router';
import listModel from './models';
import ListView from './view/list/index.js';

const app = dva();

app.model(listModel);

app.router(({history}) => {
    return (
        <Router history={history}>
            <Route path="/" component={ListView}/>
        </Router>
    );
});

app.start('#container');
