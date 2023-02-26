export const DEFAULT_PORT = 4000;
export const BEARER = 'Bearer';
export const IS_PUBLIC_KEY = 'isPublic';

export const MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  ARTIST_NOT_FOUND: 'Artist not found',
  ALBUM_NOT_FOUND: 'Album not found',
  TRACK_NOT_FOUND: 'Track not found',
  WRONG_PASSWORD: 'Wrong password',
  SAME_PASSWORDS: 'Same passwords',
  SUCCESS_USER_SIGNUP: 'User successfully registered',
  AUTH_HEADER_EXCEPTION: 'Authorisation Header Error',
  UNAUTHORIZED_USER: 'User is not authorized',
};

export enum ENTITIES {
  USERS = 'users',
  ARTISTS = 'artists',
  ALBUMS = 'albums',
  TRACKS = 'tracks',
  FAVORITES = 'favorites',
}
