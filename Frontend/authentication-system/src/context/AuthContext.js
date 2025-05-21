import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance, { setAuthToken } from '../api/axiosinstance'; 
import { storeToken, getToken, removeToken } from '../api/LocalStorageService';


const AuthContext = createContext(null);


const API_BASE_URL = 'http://127.0.0.1:8000/api'; 


export const AuthProvider = ({ children }) => {
    
    const { accessToken: initialAccessToken, refreshToken: initialRefreshToken } = getToken();
    const [accessToken, setAccessToken] = useState(initialAccessToken);
    const [refreshToken, setRefreshToken] = useState(initialRefreshToken);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [authError, setAuthError] = useState(null); 

    const navigate = useNavigate(); 

    
    useEffect(() => {
        setAuthToken(accessToken); 
    }, [accessToken]); 

    
    const fetchUserProfile = useCallback(async () => {
        setAuthError(null); 
        if (!accessToken) { 
            setCurrentUser(null); 
            setLoading(false);
            return;
        }
        try {
            
            const response = await axiosInstance.get('/profile/');
            if (response.status === 200) {
                setCurrentUser(response.data);
            } else {
                const errorDetail = response.data?.detail || `Failed to fetch profile (Status: ${response.status})`;
                setAuthError(errorDetail);
                setCurrentUser(null);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
            const errorDetail = error.response?.data?.detail || error.message || 'An unknown error occurred.';
            setAuthError(errorDetail);
            setCurrentUser(null);

            if (error.response && error.response.status === 401) {
                console.log("401 Unauthorized detected. Clearing local tokens.");
                removeToken(); 
                setAccessToken(null); 
                setRefreshToken(null); 
                
            }
        } finally {
            setLoading(false);
        }
    }, [accessToken]); 

    
    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]); 


    
    const setAuthTokensAndUser = async (access, refresh) => {
        storeToken({ access, refresh }); 
        setAccessToken(access); 
        setRefreshToken(refresh);
        setAuthError(null); 
        
    };

    
    const logout = useCallback(async () => {
        setAuthError(null); 
        try {
            
            await axiosInstance.post(`${API_BASE_URL}/logout/`, { refresh: refreshToken });
        } catch (error) {
            console.error('Logout error (backend blacklisting failed):', error.response ? error.response.data : error.message);
            const errorDetail = error.response?.data?.detail || error.message || 'Logout failed on server.';
            setAuthError(errorDetail); 
        } finally {
            removeToken(); 
            setAccessToken(null);
            setRefreshToken(null);
            setCurrentUser(null);
            navigate('/logout'); 
        }
    }, [refreshToken, navigate]); 

    
    const value = {
        accessToken,
        refreshToken,
        currentUser,
        loading,
        authError, 
        setAuthTokensAndUser,
        logout,
        fetchUserProfile 
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children} 
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
