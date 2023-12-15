import { HomePage, ProfilePage, Bolgeler, Masa } from './pages';
import { withNavigationWatcher } from './contexts/navigation';

const routes = [

    {
        path: '/profile',
        element: ProfilePage
    },
    {
        path: '/home',
        element: HomePage
    },
    {
        path: '/bolgeler',
        element: Bolgeler
    },
    {
        path: '/masa',
        element: Masa
    }
];

export default routes.map(route => {
    return {
        ...route,
        element: withNavigationWatcher(route.element, route.path)
    };
});
