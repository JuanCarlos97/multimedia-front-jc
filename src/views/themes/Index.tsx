import { useEffect } from 'react';
import moment from 'moment';
import { useUser } from '../../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import themeIcon from '../../assets/images/theme.svg';
import { useTheme } from '../../hooks/useTheme';

function Index() {
    const { user } = useUser();
    const navigate = useNavigate();
    const { getThemes, themes } = useTheme();

    useEffect(() => {
        if (user.role == "admin") {
            getThemes();
        } else {
            navigate('/');
        }
    }, []);

    return (
        <>
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Temáticas</h1>
                    <a
                        type='button'
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        href="/themes/new"
                    >
                        Crear
                    </a>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <ul role="list" className="divide-y divide-gray-100">
                        {themes.map((theme) => (
                            <Link to={`/theme/${theme._id}`} key={theme._id} className="block">
                                <li key={theme._id} className="flex justify-between gap-x-6 py-5">
                                    <div className="flex min-w-0 gap-x-4">
                                        <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={theme.imageUrl ? theme.imageUrl : themeIcon} alt="" />
                                        <div className="min-w-0 flex-auto">
                                            <p className="text-sm font-semibold leading-6 text-gray-900">{theme.name}</p>
                                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">{theme._id}</p>
                                        </div>
                                    </div>
                                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                        <p className="text-sm leading-6 text-gray-900">{moment(theme.createdAt).format('DD/MM/YYYY HH:mm:ss')}</p>
                                        <div className="mt-1 flex items-center gap-x-1.5">
                                            <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            </div>
                                            <p className="text-xs leading-5 text-gray-500">{theme._id}</p>
                                        </div>
                                    </div>
                                </li>
                            </Link>
                        ))}
                    </ul>
                </div>
            </main>
        </>
    );
}

export default Index;
