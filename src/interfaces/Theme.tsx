export interface Theme {
    contentPermissions: ContentPermissions;
    accessPermissions: AccessPermissions;
    _id: string;
    name: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export interface AccessPermissions {
    read: string[];
    write: string[];
}

export interface ContentPermissions {
    images: boolean;
    videos: boolean;
    texts: boolean;
}