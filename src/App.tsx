import { lazy } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Loadable from '~/components/Loadable';
import { configRoutes } from '~/configs';
import { Auth } from './features';
import { EmptyLayout, MainLayout } from './layouts';
const Dashboard = Loadable(lazy(() => import('~/features/Dashboard')));
const LearnedWord = Loadable(lazy(() => import('~/features/LearnedWord')));
const Rank = Loadable(lazy(() => import('~/features/Rank')));
const App = () => {
    return (
        <Router>
            <Routes>
                <Route element={<EmptyLayout />}>
                    <Route path={`${configRoutes.auth}`} element={<Auth />} />
                </Route>
                <Route element={<MainLayout />}>
                    <Route path={`${configRoutes.dashboard}`} element={<Dashboard />} />
                    <Route path={`${configRoutes.learnedWord}`} element={<LearnedWord />} />
                    <Route path={`${configRoutes.rank}`} element={<Rank />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
