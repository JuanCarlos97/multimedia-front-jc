import { useState } from 'react'
import API from '../apis/api';
import { AccessPermissions, ContentPermissions, Theme } from '../interfaces/Theme';
import { storage } from '../firebase-config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const useTheme = () => {
    const [themes, setThemes] = useState<Theme[]>([]);
    const [theme, setTheme] = useState<Theme | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [name, setName] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [error, setError] = useState('');
    const [contentPermissions, setContentPermissions] = useState<ContentPermissions>({
        images: false,
        videos: false,
        texts: false,
    });
    const [accessPermissions, setAccessPermissions] = useState<AccessPermissions>({
        read: [],
        write: [],
    });

    const getThemes = async () => {
        API.get('/themes')
            .then((response) => setThemes(response.data))
            .catch((error) => console.log(error));
    }


    const getTheme = (id: string) => {
        API.get(`/themes/${id}`)
            .then((response) => {
                const { name, contentPermissions, accessPermissions } = response.data;
                setName(name);
                setContentPermissions(contentPermissions);
                setAccessPermissions(accessPermissions);
                setTheme(response.data)
            })
            .catch((error) => {
                console.error(error);
                setError(error);
            });
    }

    const handleContentPermissionsChange = (type: string) => {
        setContentPermissions((prevPermissions: any) => ({
            ...prevPermissions,
            [type]: !prevPermissions[type],
        }));
    };

    const handleAccessPermissionsChange = (permissionType: 'read' | 'write', role: string) => {
        setAccessPermissions((prevPermissions) => {
            const currentPermissions = prevPermissions[permissionType];
            const updatedPermissions = currentPermissions.includes(role)
                ? currentPermissions.filter((r) => r !== role)
                : [...currentPermissions, role];
            return {
                ...prevPermissions,
                [permissionType]: updatedPermissions,
            };
        });
    };

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileRef = ref(storage, `temas/${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error('Error uploading file:', error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    setImageUrl(downloadURL);
                    setIsButtonDisabled(false);
                });
            }
        );
    };

    const renderContentPermissions = (contentPermissions: any) => {
        const permissions = [
            { key: 'images', label: 'Imágenes' },
            { key: 'videos', label: 'Videos' },
            { key: 'texts', label: 'Textos' },
        ];

        return permissions.map((permission) => (
            <div key={permission.key}>
                {permission.label}: {contentPermissions[permission.key] ? '✅' : '❌'}
            </div>
        ));
    };

    const renderAccessPermissions = (accessPermissions: any) => {
        const roles = [
            { key: 'read', label: 'Leer' },
            { key: 'write', label: 'Escribir' },
        ];

        return roles.map((role) => (
            <div key={role.key}>
                {role.label}: {accessPermissions[role.key].map((r: any) => r).join(', ')}
            </div>
        ));
    };

    const create = async () => {
        // Validate that at least one content permission is activated
        const hasContentPermission = Object.values(contentPermissions).some((value) => value === true);
        if (!hasContentPermission) {
            return { response: false, message: "Debes asignar por lo menos un permiso de contenido." };
        }
        // Validate that both access permissions (read and write) have at least one value
        const hasReadPermission = accessPermissions.read.length > 0;
        const hasWritePermission = accessPermissions.write.length > 0;
        if (!hasReadPermission || !hasWritePermission) {
            return { response: false, message: "Debes asignar por lo menos un permiso de acceso en lectura y escritura." };
        }

        const themeData = {
            name,
            contentPermissions,
            accessPermissions,
            imageUrl
        };

        try {
            const response = await API.post('/themes', themeData);
            if (response.status === 200) {
                return { response: true, message: null };
            } else {
                return { response: false, message: null }
            }
        } catch (error: any) {
            const errorMessage = error.response && error.response.data && error.response.data.msg ? error.response.data.msg : 'No se pudo crear el contenido. Inténtalo de nuevo.';
            return { response: false, message: errorMessage }
        }
    };

    const update = async (id: string) => {
        const themeData = {
            name,
            contentPermissions,
            accessPermissions,
            imageUrl
        };

        try {
            const response = await API.put(`/themes/${id}`, themeData);
            if (response.status === 200) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    };

    const destroy = async (id: string) => {
        try {
            const response = await API.delete(`/themes/${id}`);
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
        getTheme,
        getThemes,
        theme,
        themes,
        contentPermissions,
        accessPermissions,
        handleContentPermissionsChange,
        handleAccessPermissionsChange,
        handleFileChange,
        create,
        update,
        destroy,
        error,
        setName,
        name,
        uploadProgress,
        isButtonDisabled,
        renderContentPermissions,
        renderAccessPermissions
    }
}
