export interface IUserItem {
    id: number;
    email: string;
    fullName: string;
    image: string|null;
    roles: string[];
}

export interface IUserRowProps {
    user: IUserItem;
    initials: (name: string) => string;
}

export interface ITrack {
    id: string;
    title: string;
    artist: string;
    album: string;
    duration: number; // в секундах
    imageUrl?: string;
    previewUrl?: string;
  }
  
  export interface ISearchResults {
    tracks: ITrack[];
    total: number;
    query: string;
  }