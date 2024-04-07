import React, { useEffect, useState } from 'react'
import { storage } from '../firebase-config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import API from '../apis/api';
import { Content } from '../interfaces/Content';
import { Theme } from '../interfaces/Theme';
import { useUser } from '../context/UserContext';

export const useContent = () => {
    const { user } = useUser();
    const [contents, setContents] = useState<Content[]>([]);
    const [content, setContent] = useState<Content | null>(null);
    const [contentCounts, setContentCounts] = useState({ images: 0, videos: 0, texts: 0 });
    const [filterTheme, setFilterTheme] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [themes, setThemes] = useState<Theme[]>([]);
    const [theme, setTheme] = useState('');
    const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
    const [url, setUrl] = useState('');
    const [type, setType] = useState('');
    const [text, setText] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [credits, setCredits] = useState('');

    const getContents = async () => {
        API.get('/contents')
            .then((response) => {
                setContents(response.data)
                const counts = { images: 0, videos: 0, texts: 0 };
                response.data.forEach((content: { type: string; }) => {
                    if (content.type === 'image') counts.images += 1;
                    if (content.type === 'video') counts.videos += 1;
                    if (content.type === 'text') counts.texts += 1;
                });
                setContentCounts(counts);
            })
            .catch((error) => console.log(error));
    }

    const getContent = async (id: string) => {
        API.get(`/contents/${id}`)
            .then((response) => setContent(response.data))
            .catch((error) => console.log(error));
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            let url = '/contents';
            if (filterTheme) {
                url += `/theme/${filterTheme}`;
            } else if (searchTerm) {
                url += `?name=${encodeURIComponent(searchTerm)}`;
            } else if (filterType) {
                url += `/type/${filterType}`;
            }

            API.get(url)
                .then((response) => {
                    setContents(response.data)
                    const counts = { images: 0, videos: 0, texts: 0 };
                    response.data.forEach((content: { type: string; }) => {
                        if (content.type === 'image') counts.images += 1;
                        if (content.type === 'video') counts.videos += 1;
                        if (content.type === 'text') counts.texts += 1;
                    });
                    setContentCounts(counts);
                })
                .catch((error) => console.log(error));
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [filterTheme, searchTerm, filterType]);

    const getAllowedThemes = async () => {
        API.get('/themes')
            .then((response) => {
                const filteredThemes = response.data.filter((theme: Theme) =>
                    theme.accessPermissions.write.includes(user.role)
                );
                setThemes(filteredThemes);
            })
            .catch((error) => console.error(error));
    }

    const getSetDataContent = async (id: string) => {
        API.get(`/contents/${id}`)
            .then((response) => {
                const { type, theme, url, text, credits } = response.data;
                setTheme(theme._id);
                setType(type);
                setUrl(url || '');
                setText(text || '');
                setCredits(credits);
                setSelectedTheme(theme);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const themeId = e.target.value;
        setTheme(themeId);
        const foundTheme = themes.find((theme) => theme._id === themeId);
        setSelectedTheme(foundTheme || null);
    };

    const handleFileChange = async (e: any) => {
        const file = e.target.files[0];
        setUrl('');
        const fileRef = ref(storage, `contents/${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error('Error al subir archivo:', error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('Archivo disponible en:', downloadURL);
                    if (type === 'image' || type === 'video') {
                        setUrl(downloadURL);
                    }
                });
            }
        );
    };

    const create = async () => {
        if ((type === 'image' || type === 'video') && !url) {
            return { response: false, message: "Debes subir tu archivo." };
        }
        if (type === 'text' && !text.trim()) {
            return { response: false, message: "Debes ingresar algún texto." };
        }

        let contentData = {
            type,
            theme,
            url,
            text,
            credits: ""
        };

        if (type === 'image' || type === 'video') {
            contentData.url = url;
        } else if (type === 'text') {
            contentData.text = text;
        }

        contentData.credits = user.username

        try {
            const response = await API.post('/contents', contentData);
            if (response.status === 200) {
                return { response: true, message: "Contenido creado correctamente." };
            } else {
                return { response: false, message: "No se pudo crear el contenido. Inténtalo de nuevo." };
            }
        } catch (error: any) {
            const errorMessage = error.response && error.response.data && error.response.data.msg ? error.response.data.msg : 'No se pudo crear el contenido. Inténtalo de nuevo.';
            return { response: false, message: errorMessage };
        }
    }

    const update = async (id: string) => {
        let contentData = {
            type,
            url,
            text,
            theme,
            credits,
        };

        if (type === 'image' || type === 'video') {
            contentData.url = url;
        } else if (type === 'text') {
            contentData.text = text;
        }

        try {
            const response = await API.put(`/contents/${id}`, contentData);
            if (response.status === 200) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    const destroy = async (id: string) => {
        try {
            const response = await API.delete(`/contents/${id}`);
            if (response.status === 200) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    };


    return {
        content,
        getContent,
        getContents,
        getAllowedThemes,
        searchTerm,
        setSearchTerm,
        filterTheme,
        setFilterTheme,
        filterType,
        setFilterType,
        contentCounts,
        contents,
        theme,
        themes,
        setTheme,
        handleThemeChange,
        handleFileChange,
        type,
        selectedTheme,
        setType,
        uploadProgress,
        text,
        url,
        setUrl,
        setText,
        getSetDataContent,
        credits,
        setCredits,
        create,
        update,
        destroy,
    }
}
