import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loadable from '~/components/Loadable';
const Login = Loadable(lazy(() => import('./pages/Login')));
const Auth = () => {
    return (
        <Routes>
            <Route index element={<Login />}></Route>
        </Routes>
    );
};

export default Auth;
