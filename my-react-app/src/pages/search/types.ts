export interface ITrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  imageUrl?: string;
  previewUrl?: string;
}

export interface ISearchResults {
  tracks: ITrack[];
  total: number;
  query?: string;
}
