import React, { createContext, useState, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const AuthContext = createContext(); 

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')));

    const login = (token, userData) => {
        localStorage.setItem('authToken', token);
        setAuthToken(token);
        localStorage.setItem('userData', JSON.stringify(userData));
        setUserData(userData);

        const decodedToken = jwtDecode(token);
        const userRoles = decodedToken.roles;

        console.log('Roles del usuario autcontext:', userData);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setAuthToken(null);
        localStorage.removeItem('userData');
        setUserData(null);
    };

    const sendNotification = async (data) => {
        try 
        {
            const response = await axios.post('https://firebase-uthh.vercel.app/', {
                tokenUser: data.tokenUser,
                title: data.title,
                body: data.body,
                url: data.url,
                matricula: data.matricula
            });
            console.log('Notificacion enviada con exito :', response.data);
            return response.data;
        } 
        catch (error) 
        {
            console.error('Error al lenviar la notificacion:', error);
            throw error;
        }
    };

    const isAuthenticated = !!authToken;

    return (
        <AuthContext.Provider value={{ authToken, login, logout, sendNotification, isAuthenticated, userData }}>
            {children}
        </AuthContext.Provider>
    );
};
