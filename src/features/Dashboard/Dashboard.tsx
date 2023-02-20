import { Route, Routes } from 'react-router-dom';
import { configRoutes } from '~/configs';
import Loadable from '~/components/Loadable';
import { lazy } from 'react';
const Manager = Loadable(lazy(() => import('./pages/Manager')));
// const Add = Loadable(lazy(() => import('./pages/Add')));
const Dashboard = () => {
    return (
        <Routes>
            <Route index element={<Manager />}></Route>
            {/* <Route path={configRoutes.add} element={<Add />} /> */}
        </Routes>
    );
};

export default Dashboard;
