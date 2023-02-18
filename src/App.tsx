import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { EmptyLayout } from './Layouts';
import { configRoutes } from '~/configs';
import { Auth } from './features';
const App = () => {
    return (
        <Router>
            <Routes>
                <Route element={<EmptyLayout />}>
                    <Route path={`${configRoutes.auth}`} element={<Auth />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
