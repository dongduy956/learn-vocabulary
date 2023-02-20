import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { EmptyLayout, MainLayout } from './Layouts';
import { configRoutes } from '~/configs';
import { Auth, Dashboard } from './features';
const App = () => {
    return (
        <Router>
            <Routes>
                <Route element={<EmptyLayout />}>
                    <Route path={`${configRoutes.auth}`} element={<Auth />} />
                </Route>
                <Route element={<MainLayout />}>
                    <Route path={`${configRoutes.dashboard}`} element={<Dashboard />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
