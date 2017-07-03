import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, hashHistory, IndexRoute } from 'react-router';
import PostList from './page/content/PostList';

ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="/" component={PostList}>
        </Route>
    </Router>
), document.getElementById('container'));
