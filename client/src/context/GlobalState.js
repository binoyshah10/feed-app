import React, { createContext, useState, useEffect } from 'react';

const initialState = {
    user: null,
    loggedIn: false,
    notifications: [],
    theme: 'light'
}

export const GlobalContext = createContext(initialState);
export const GlobalProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [notifications, setNotif] = useState({});
    const [theme, setTheme] = useState('light')

    const setNotifications = (notif) => {
        console.log('PREVIOUS NOTIF', notifications)
        console.log("TRACING")
        console.trace();
        console.log('NEW NOTIF', notif)
        setNotif(notif);
    }

    return (<GlobalContext.Provider value={{
        user,
        setUser,
        loggedIn,
        setLoggedIn,
        notifications, 
        setNotifications,
        theme,
        setTheme
    }}>
        {children}
    </GlobalContext.Provider>);
}