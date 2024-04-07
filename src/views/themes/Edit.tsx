import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/react/20/solid';
import { useTheme } from '../../hooks/useTheme';
import Swal from 'sweetalert2';

function Edit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const {
        getTheme,
        contentPermissions,
        accessPermissions,
        handleContentPermissionsChange,
        handleAccessPermissionsChange,
        update,
        setName,
        name,
        handleFileChange,
        uploadProgress
    } = useTheme();

    // Validation to user role
    useEffect(() => {
        if (user.role !== "admin") {
            navigate('/');
            return;
        }

        if (id) {
            getTheme(id);
        }
    }, [navigate, id, user.role]);

    // Handle Submit to update theme
    const updateTheme = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (id) {
            const result = await update(id);

            if (result) {
                navigate('/themes');
                Swal.fire(
                    'Actualizado!',
                    'La temática ha sido actualizada.',
                    'success'
                );
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se pudo actualizar la temática. Inténtalo de nuevo.',
                });
            }
        }
    }


    return (
        <>
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex items-center">
                        <Link to={`/theme/${id}`} className="mr-3">
                            <ArrowLeftIcon className="h-5 w-5 text-gray-900" />
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Editar temática</h1>
                    </div>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <form onSubmit={updateTheme}>
                        {/* Image */}
                        <div className="col-span-full">
                            <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                                Subir imagen
                            </label>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                <div className="text-center">
                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
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
                                                accept="image/*"
                                                onChange={handleFileChange}
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
                        {/* Name */}
                        <div className='mt-4'>
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Nombre</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Content */}
                        <fieldset className='mt-4'>
                            <legend className="block text-sm font-medium leading-6 text-gray-900 mt-4">Permisos de contenido</legend>
                            <div className="">
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={contentPermissions.images}
                                            onChange={() => handleContentPermissionsChange('images')}
                                        />
                                        {' '} Imágenes
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={contentPermissions.videos}
                                            onChange={() => handleContentPermissionsChange('videos')}
                                        />
                                        {' '} Videos
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={contentPermissions.texts}
                                            onChange={() => handleContentPermissionsChange('texts')}
                                        />
                                        {' '} Textos
                                    </label>
                                </div>
                            </div>
                        </fieldset>

                        {/* Access */}
                        <fieldset className='mt-4'>
                            <legend className="block text-sm font-medium leading-6 text-gray-900 mt-4">Permisos de acceso</legend>
                            {/* Read */}
                            <div className="">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Leer</label>
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={accessPermissions.read.includes('admin')}
                                            onChange={() => handleAccessPermissionsChange('read', 'admin')}
                                        />
                                        {' '} Admin
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={accessPermissions.read.includes('reader')}
                                            onChange={() => handleAccessPermissionsChange('read', 'reader')}
                                        />
                                        {' '} Lector
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={accessPermissions.read.includes('creator')}
                                            onChange={() => handleAccessPermissionsChange('read', 'creator')}
                                        />
                                        {' '} Creador
                                    </label>
                                </div>
                            </div>

                            {/* Write */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Escribir</label>
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={accessPermissions.write.includes('admin')}
                                            onChange={() => handleAccessPermissionsChange('write', 'admin')}
                                        />
                                        {' '} Admin
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={accessPermissions.write.includes('creator')}
                                            onChange={() => handleAccessPermissionsChange('write', 'creator')}
                                        />
                                        {' '} Creador
                                    </label>
                                </div>
                            </div>
                        </fieldset>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Actualizar temática
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}

export default Edit;
