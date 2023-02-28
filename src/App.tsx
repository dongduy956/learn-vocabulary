import { lazy, FC } from 'react';
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import Loadable from '~/components/Loadable';
import { configRoutes } from '~/configs';
import { EmptyLayout, MainLayout } from './layouts';
import { useSelector } from 'react-redux';
import { loginSelector } from './store';
const Dashboard = Loadable(lazy(() => import('~/features/Dashboard')));
const LearnedWord = Loadable(lazy(() => import('~/features/LearnedWord')));
const Rank = Loadable(lazy(() => import('~/features/Rank')));
const NotFound = Loadable(lazy(() => import('~/features/NotFound')));
const Auth = Loadable(lazy(() => import('~/features/Auth')));

const App: FC = () => {
    const isLogin = useSelector(loginSelector);

    return (
        <Router>
            <Routes>
                <Route element={isLogin ? <MainLayout /> : <EmptyLayout />}>
                    <Route
                        path={configRoutes.dashboard}
                        element={isLogin ? <Dashboard /> : <Navigate to={configRoutes.auth} />}
                    />
                    <Route
                        path={`${configRoutes.auth}/*`}
                        element={!isLogin ? <Auth /> : <Navigate to={configRoutes.dashboard} />}
                    />
                </Route>
                {isLogin && (
                    <Route path={configRoutes.dashboard} element={<MainLayout />}>
                        <Route path={`${configRoutes.dashboard}`} element={<Dashboard />} />
                        <Route path={`${configRoutes.learnedWord}`} element={<LearnedWord />} />
                        <Route path={`${configRoutes.rank}`} element={<Rank />} />
                    </Route>
                )}
                <Route element={<EmptyLayout />}>
                    <Route path={`${configRoutes.notFound}`} element={<NotFound />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
