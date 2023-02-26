export type type = {
    page: string;
    add: string;
    dashboard: string;
    notFound: string;
    auth: string;
    learnedWord: string;
    rank: string;
};
const routes: type = {
    page: '?page=',
    add: 'add',
    dashboard: '/',
    notFound: '*',
    auth: '/login',
    learnedWord: '/learned-word',
    rank: 'rank',
};
export default routes;
