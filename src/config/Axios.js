import { baseURL, appId, contentTypeForm }  from './Enviornment';

export const axiosConfig = {
    baseURL: baseURL,
    headers: {
        'Content-Type': contentTypeForm,
        'app_id': appId,
    }
};

export const axiosAuthConfig = {
    baseURL: baseURL,
    headers: {
        'Content-Type': contentTypeForm,
        'app_id': appId,
        'access_token': localStorage.getItem('accessToken'),
    }
};