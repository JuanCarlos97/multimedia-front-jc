import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useContent } from '../../hooks/useContent';
import { useTheme } from '../../hooks/useTheme';
import videoIcon from '../../assets/images/video.svg';
import textIcon from '../../assets/images/text.svg';
import imageIcon from '../../assets/images/image.svg';
import moment from 'moment';

function Index() {
    const { user } = useUser();

    const {
        getContents,
        searchTerm,
        setSearchTerm,
        filterTheme,
        setFilterTheme,
        filterType,
        setFilterType,
        contentCounts,
        contents
    } = useContent();
    const {
        getThemes,
        themes
    } = useTheme();

    useEffect(() => {
        getContents();
        getThemes();
    }, []);

    return (
        <>
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Contenidos</h1>
                    {user && (user.role == "admin" || user.role == "creator") && (
                        <a
                            type='button'
                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            href="/contents/new"
                        >
                            Crear
                        </a>
                    )}
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <div className="my-4">
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input input-bordered w-full max-w-xs"
                        />
                        <select
                            value={filterTheme}
                            onChange={(e) => setFilterTheme(e.target.value)}
                            className="select select-bordered w-full max-w-xs ml-2"
                        >
                            <option value="">Filtrar por tema</option>
                            {themes.map((theme) => (
                                <option key={theme._id} value={theme._id}>{theme.name}</option>
                            ))}
                        </select>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="select select-bordered w-full max-w-xs ml-2"
                        >
                            <option value="">Filtrar por tipo</option>
                            <option value="image">Imagen</option>
                            <option value="video">Video</option>
                            <option value="text">Texto</option>
                        </select>
                    </div>

                    <div className="my-4">
                        <h2 className="text-lg font-semibold">Contenidos Disponibles:</h2>
                        <ul>
                            <li>+{contentCounts.images} imágenes</li>
                            <li>+{contentCounts.videos} videos</li>
                            <li>+{contentCounts.texts} textos</li>
                        </ul>
                    </div>

                    <ul role="list" className="divide-y divide-gray-100">
                        {contents.map((content) => (
                            <Link to={`/content/${content._id}`} key={content._id} className={`block ${user?.role === "reader" || !user ? "cursor-not-allowed" : ""}`}>
                                <li key={content._id} className="flex justify-between gap-x-6 py-5">
                                    <div className="flex min-w-0 gap-x-4">
                                        <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={content.type == "video" ? videoIcon : content.type == "image" ? imageIcon : textIcon} alt="" />
                                        <div className="min-w-0 flex-auto">
                                            <p className="text-sm font-semibold leading-6 text-gray-900">Subido el {moment(content.createdAt).format('DD/MM/YYYY HH:mm:ss')}</p>
                                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">{content.theme.name}</p>
                                        </div>
                                    </div>
                                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                        <p className="text-sm leading-6 text-gray-900">{content.credits}</p>
                                        <div className="mt-1 flex items-center gap-x-1.5">
                                            <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            </div>
                                            <p className="text-xs leading-5 text-gray-500">{content.type}</p>
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
