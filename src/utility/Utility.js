import { baseURL } from '../config/Enviornment';
import { axiosAuthConfig } from '../config/Axios';

const axios = require('axios');

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export const isValidEmailFormat = (value) => {
    const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/;
    return (isNotEmptyString(value) && pattern.test(value));
};

export const isValidPasswordFormat = (value) => {
    const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return (isNotEmptyString(value) && pattern.test(value));
};

export const isPasswordMatchingConfirmed = (value, password) => {
    return (isValidPasswordFormat(value) && (value === password));
};

export const isValidStringFormat = (value, minSize, maxSize) => {
    const pattern = /^[a-zA-Z0-9\s]+$/;
    return (isStringMatchingSizeConstrains(value, minSize, maxSize) && pattern.test(value));
};

export const isStringMatchingSizeConstrains = (value, minSize, maxSize) => {
    return isNotEmptyString(value) && (value.trim().length >= minSize) && (value.trim().length <= maxSize);
};

export const isNotEmptyString = (value) => {
    return (value && value.trim().length !== 0);
};

export const isAuthorized = () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!accessToken || !refreshToken) {
        return false;
    }
    const expirationDate = new Date(localStorage.getItem('expirationDate'));
    if (expirationDate > new Date()) {
        return true;
    } else {
        axios.get('/service/api/token/refresh',
            axiosAuthConfig
        ).then((response) => {
            console.log('isAuthorized() -> refresh response ' + JSON.stringify(response.data));

            const expirationDate = new Date(new Date().getTime() + response.data.access_token_expires_in);
            localStorage.setItem('accessToken', response.data.access_token);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('refreshToken', response.data.refresh_token);

            return true;
        }).catch((error) => {
            console.log('isAuthorized() -> refresh error ' + error);
        });
    }
};

export const clearAuthorization = () => {
    localStorage.removeItem('name');
    localStorage.removeItem('avatar');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('refreshToken');
};

export const buildImageUrl = (path) => {
    return `${baseURL}/service/download/file/JkZmQ5OTM2YmNmMDFYTlmM2E1ZTZ/${localStorage.getItem('accessToken')}/${path}`;
};

export const saveUserDetails = (user) => {
    localStorage.setItem('name', `${user.first_name} ${user.last_name}`);
    localStorage.setItem('avatar', buildImageUrl(user.avatar));
};

export const getUserName = () => {
    let name = localStorage.getItem('name');
    return (name && isNotEmptyString(name) ? name : 'User');
};
