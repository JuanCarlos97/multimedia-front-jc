import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import moment from 'moment';
import Loader from '../../components/Loader';
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { useTheme } from '../../hooks/useTheme';
import Swal from 'sweetalert2';

function Show() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useUser();
    const {
        getTheme,
        theme,
        destroy,
        renderContentPermissions,
        renderAccessPermissions
    } = useTheme();

    // Validation to user role
    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        if (id) {
            getTheme(id);
        }
    }, [id]);

    const deleteTheme = async (id: string) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Estás seguro de querer eliminar esta temática? Todos los contenidos serán eliminados.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const result = await destroy(id);

                if (result) {
                    navigate('/themes');
                    Swal.fire(
                        'Eliminado!',
                        'La temática ha sido eliminada.',
                        'success'
                    );
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'No se pudo eliminar la temática.',
                    });
                }
            }
        });
    };

    if (!theme) {
        return <Loader />;
    }

    return (
        <>
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center">
                        <Link to="/themes" className="mr-3">
                            <ArrowLeftIcon className="h-5 w-5 text-gray-900" />
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Temática: {theme._id}</h1>
                    </div>
                    <div>
                        {user?.role == "admin" && (
                            <>
                                <a
                                    type='button'
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-2"
                                    href={`/theme/${theme._id}/edit`}
                                >
                                    Editar
                                </a>
                                <button
                                    type='button'
                                    className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                    onClick={() => deleteTheme(theme._id)}
                                >
                                    Eliminar
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <div>
                        <div className="px-4 sm:px-0">
                            <h3 className="text-base font-semibold leading-7 text-gray-900">Información de la temática</h3>
                            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Detalles del tema</p>
                        </div>
                        <div className="mt-6 border-t border-gray-100">
                            <dl className="divide-y divide-gray-100">
                                {theme.imageUrl && (
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-gray-900">Imagen</dt>
                                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                            <img src={theme.imageUrl} alt="Content" className="max-w-full h-20 rounded-lg" />
                                        </dd>
                                    </div>
                                )}
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Nombre</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{theme.name}</dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Fecha de creación</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{moment(theme.createdAt).format('DD/MM/YYYY HH:mm:ss')}</dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Última actualización</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{moment(theme.updatedAt).format('DD/MM/YYYY HH:mm:ss')}</dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Permisos de contenido</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                        {renderContentPermissions(theme.contentPermissions)}
                                    </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Permisos de acceso</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                        {renderAccessPermissions(theme.accessPermissions)}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Show;
