import { useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function useNavigation() {
    const { user } = useUser();

    const allNavigation = [
        { name: 'Multimedia APP', href: '/', current: false },
        { name: 'Contenidos', href: '/contents', current: false },
        { name: 'Usuarios', href: '/users', current: false, roles: ['admin'] },
        { name: 'Temáticas', href: '/themes', current: false, roles: ['admin'] },
    ];

    const filteredNavigation = allNavigation.filter(navItem =>
        !navItem.roles || navItem.roles.includes(user?.role)
    );

    const location = useLocation();
    const navigationWithCurrent = filteredNavigation.map(navItem => ({
        ...navItem,
        current: navItem.href === location.pathname,
    }));

    return navigationWithCurrent;
}

export default useNavigation;
