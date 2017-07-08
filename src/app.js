import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import PostList from './page/content/PostList';

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={PostList}>
        </Route>
    </Router>
), document.getElementById('container'));
