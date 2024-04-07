import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { ArrowLeftIcon, PhotoIcon, VideoCameraIcon } from '@heroicons/react/20/solid';
import { useContent } from '../../hooks/useContent';
import Swal from 'sweetalert2';

function Edit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();

    const {
        getAllowedThemes,
        getSetDataContent,
        update,
        type,
        setType,
        text,
        setText,
        uploadProgress,
        handleThemeChange,
        selectedTheme,
        theme,
        themes,
        handleFileChange
    } = useContent();


    useEffect(() => {
        if (user.role == "creator" || user.role == "admin") {
            getAllowedThemes();
            if (id) {
                getSetDataContent(id);
            }
        } else {
            navigate('/');
        }
    }, []);

    // Handle Submit to update content
    const updateContent = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (id) {
            const result = await update(id);

            if (result) {
                navigate('/contents');
                Swal.fire(
                    'Actualizado!',
                    'El contenido se ha actualizado.',
                    'success'
                );
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se pudo actualizar el contenido. Inténtalo de nuevo.',
                });
            }
        }
    }

    return (
        <>
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex items-center">
                        <Link to={`/content/${id}`} className="mr-3">
                            <ArrowLeftIcon className="h-5 w-5 text-gray-900" />
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Editar contenido</h1>
                    </div>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <form onSubmit={updateContent}>
                        <div className="space-y-12">
                            <div className="border-b border-gray-900/10 pb-12">
                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    {/* Theme */}
                                    <div className="sm:col-span-3">
                                        <label htmlFor="theme" className="block text-sm font-medium leading-6 text-gray-900">
                                            Temática
                                        </label>
                                        <select
                                            id="theme"
                                            name="theme"
                                            value={theme}
                                            onChange={handleThemeChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Seleccionar temática</option>
                                            {themes.map((theme) => (
                                                <option key={theme._id} value={theme._id}>{theme.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Type */}
                                    <div className="sm:col-span-3">
                                        <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">
                                            Tipo de contenido
                                        </label>
                                        <select
                                            id="type"
                                            name="type"
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Seleccionar tipo de contenido</option>
                                            {selectedTheme && selectedTheme.contentPermissions.images && <option value="image">Imagen</option>}
                                            {selectedTheme && selectedTheme.contentPermissions.videos && <option value="video">Video</option>}
                                            {selectedTheme && selectedTheme.contentPermissions.texts && <option value="text">Texto</option>}
                                        </select>
                                    </div>

                                    {/* URL */}
                                    {(type === 'image' || type === 'video') && (
                                        <>
                                            <div className="col-span-full">
                                                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Subir {type === 'image' ? "imagen" : "video"}
                                                </label>
                                                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                                    <div className="text-center">
                                                        {type === 'image' ? (
                                                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                                        ) : (
                                                            <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                                        )}
                                                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                                            <label
                                                                htmlFor="file"
                                                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                                            >
                                                                <span>Subir archivo</span>
                                                                <input
                                                                    type="file"
                                                                    name="file"
                                                                    id="file"
                                                                    accept={type === 'image' ? "image/*" : "video/*"}
                                                                    onChange={handleFileChange}
                                                                    disabled={!type}
                                                                    className="sr-only"
                                                                />
                                                            </label>
                                                            <p className="pl-1">o arrastrar y soltar</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 w-full bg-gray-200 rounded-full dark:bg-gray-700">
                                                    <div
                                                        className={`bg-${uploadProgress === 100 ? 'green' : 'blue'}-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full`}
                                                        style={{ width: `${uploadProgress}%` }}>
                                                        {uploadProgress.toFixed(0)}%
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Text */}
                                    {type === 'text' && (
                                        <div className="col-span-full">
                                            <label htmlFor="text" className="block text-sm font-medium leading-6 text-gray-900">
                                                Ingresa el texto
                                            </label>
                                            <textarea
                                                id="text"
                                                name="text"
                                                value={text}
                                                onChange={(e) => setText(e.target.value)}
                                                rows={10}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Actualizar contenido
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

            </main>
        </>
    )
}

export default Edit;
