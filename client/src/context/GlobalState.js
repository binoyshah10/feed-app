import React, { createContext, useState } from 'react';

const initialState = {
    user: null,
    loggedIn: false,
    notifications: []
}

export const GlobalContext = createContext(initialState);
export const GlobalProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [notifications, setNotifications] = useState({});

    return (<GlobalContext.Provider value={{
        user,
        setUser,
        loggedIn,
        setLoggedIn,
        notifications, 
        setNotifications
    }}>
        {children}
    </GlobalContext.Provider>);
}