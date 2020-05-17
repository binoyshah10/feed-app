import React, { useState, useEffect } from 'react'
import styles from './ProfileView.module.scss';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import ProfileFeed from '../ProfileFeed/ProfileFeed';
import { useCallback } from 'react';

export default function Feed(props) {

    const [feedActivities, setfeedActivities] = useState([]);
    const location = useLocation();
    const profileUsername = location.state.profileUsername;
    const profileUserType = location.state.profileUserType;
    const filter = location.state.filter;

    const getFeedData = useCallback(async () => {  
        const fetchResponse = await fetch(`http://localhost:5000/getFeed?userType=${profileUserType}&username=${profileUsername}`, {
            method: 'GET'
        });
        let feedResults = await fetchResponse.json({});
        setfeedActivities(feedResults.feedData.results)
    }, [])
    
    useEffect(() => {
        // async function getFeedData() {  
        //     const fetchResponse = await fetch(`http://localhost:5000/getFeed?userType=${profileUserType}&username=${profileUsername}`, {
        //         method: 'GET'
        //     });
        //     let feedResults = await fetchResponse.json({});
        //     setfeedActivities(feedResults.feedData.results)
        // }

        getFeedData();
    }, [])


    return (
        <div className={styles.gridContainer}>
            <div className={styles.navbar}>
                <Navbar />
            </div>
            <div className={styles.sidebar}>
                <Sidebar />
            </div>
            <div className={styles.profileFeed}>
                <ProfileFeed updateFeed={getFeedData} feedActivities={feedActivities} profileUsername={profileUsername} profileUserType={profileUserType} feedFilter={filter}/>
            </div>
        </div>
    )
}