import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import moment from 'moment';
import Loader from '../../components/Loader';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { useContent } from '../../hooks/useContent';
import Swal from 'sweetalert2';

function Show() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useUser();
    const {
        getContent,
        destroy,
        content
    } = useContent();

    useEffect(() => {
        if (user) {
            if (id) {
                getContent(id);
            }
        } else {
            navigate('/');
        }
    }, [id]);

    const deleteContent = async (id: string) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Estás seguro de querer eliminar este contenido?",
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
                    navigate('/contents');
                    Swal.fire(
                        'Eliminado!',
                        'El contenido ha sido eliminado.',
                        'success'
                    );
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'No se pudo eliminar el contenido.',
                    });
                }
            }
        });
    };

    if (!content) {
        return <Loader />;
    }

    return (
        <>
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center">
                        <Link to={`/contents`} className="mr-3">
                            <ArrowLeftIcon className="h-5 w-5 text-gray-900" />
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Contenido: {content._id}</h1>
                    </div>
                    <div>
                        {(user?._id == content.user._id || user?.role == "admin") && (
                            <>
                                <a
                                    type='button'
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-2"
                                    href={`/content/${content._id}/edit`}
                                >
                                    Editar
                                </a>
                                <button
                                    type='button'
                                    className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                    onClick={() => deleteContent(content._id)}
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
                            <h3 className="text-base font-semibold leading-7 text-gray-900">Información del contenido</h3>
                            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Detalles del contenido</p>
                        </div>
                        <div className="mt-6 border-t border-gray-100">
                            <dl className="divide-y divide-gray-100">
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Temática</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{content.theme.name}</dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Fecha de creación</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{moment(content.createdAt).format('DD/MM/YYYY HH:mm:ss')}</dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Última actualización</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{moment(content.updatedAt).format('DD/MM/YYYY HH:mm:ss')}</dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Creditos</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{content.credits}</dd>
                                </div>
                                {content.type === 'text' && (
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-gray-900">Texto</dt>
                                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                            <div className="p-4 rounded-lg bg-gray-100">{content.text}</div>
                                        </dd>
                                    </div>
                                )}

                                {content.type === 'image' && (
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-gray-900">Imagen</dt>
                                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                            <img src={content.url} alt="Content" className="max-w-full h-auto rounded-lg" />
                                        </dd>
                                    </div>
                                )}

                                {content.type === 'video' && (
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-gray-900">Video</dt>
                                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                            <video controls src={content.url} className="max-w-full h-auto rounded-lg"></video>
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Show;
