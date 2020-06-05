import React, { useState, useEffect, useContext } from 'react'
import styles from './ProfileView.module.scss';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import ProfileFeed from '../ProfileFeed/ProfileFeed';
import { useCallback } from 'react';
import { GlobalContext } from '../../context/GlobalState';

export default function Feed(props) {

    const { notifications, user, setNotifications, theme } = useContext(GlobalContext);
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
        // console.log(feedResults)
        setfeedActivities(feedResults.feedData.results)
    }, [profileUsername, profileUserType])
    
    useEffect(() => {
        // async function getFeedData() {  
        //     const fetchResponse = await fetch(`http://localhost:5000/getFeed?userType=${profileUserType}&username=${profileUsername}`, {
        //         method: 'GET'
        //     });
        //     let feedResults = await fetchResponse.json({});
        //     setfeedActivities(feedResults.feedData.results)
        // }
        getFeedData();
    }, [profileUsername, getFeedData, notifications])

    const getNotifications = useCallback(async () => {
        const fetchResponse = await fetch(`http://localhost:5000/getNotifications?username=${user.username}`, {
            method: 'GET'
        });
        let notificationResults = await fetchResponse.json({});
        // console.log("Remote notification", notificationResults)
        // console.log("System notifications", notifications)
        const unseenCount = notificationResults.notifications.unseen;
        // const newNotifications = []
        // for (let i = 0; i < unseenCount; i++) {
        //     let notificationGroup = notificationResults.notifications.results[i];
        //     let [actor, verb] = notificationGroup.group.split('_');
        //     verb = verb === 'post' ? 'posted' : 'operated';
        //     const activityCount = notificationGroup.activity_count;
        //     const message = `${actor} has ${verb} ${activityCount} messages`;

        //     if (!notifications.includes(message)) {
        //         newNotifications.push(message);
        //     }
        // }

        // setNotifications([...notifications, ...newNotifications]);

        const newNotifications = {...notifications}
        for (let i = 0; i < unseenCount; i++) {
            let notificationGroup = notificationResults.notifications.results[i];
            let group = notificationGroup.group;
            if (group in newNotifications) {
                let messages = []
                for (let j = 0; j < notificationGroup.activities.length; j++) {
                    if (!newNotifications[group].messages.includes(notificationGroup.activities[j].id)) {
                        messages.push(notificationGroup.activities[j].id)
                    }
                }
                newNotifications[group].messages = [...newNotifications[group].messages, ...messages]
                newNotifications[group].groupID = notificationGroup.id
            }
            else {
                let messages = []
                for (let j = 0; j < notificationGroup.activities.length; j++) {
                    messages.push(notificationGroup.activities[j].id)
                }
                newNotifications[group] = {
                    messages,
                    groupID: notificationGroup.id,
                    userType: notificationGroup.activities[0].type
                }
            }
        }
        console.log('Updating notifications')
        console.log(newNotifications)
        setNotifications(newNotifications)
    }, [user])
    
    useEffect(() => {
        getNotifications()
    }, [getNotifications])


    return (
        <div className={styles.gridContainer}>
            <div className={styles.navbar}>
                <Navbar updateNotifications={getNotifications}/>
            </div>
            <div className={theme === 'light' ? `${styles.sidebar} ${styles.light}` : `${styles.sidebar} ${styles.dark}`}>
                <Sidebar />
            </div>
            <div className={theme === 'light' ? `${styles.profileFeed} ${styles.light}` : `${styles.profileFeed} ${styles.dark}`}>
                <ProfileFeed updateFeed={getFeedData} feedActivities={feedActivities} profileUsername={profileUsername} profileUserType={profileUserType} feedFilter={filter}/>
            </div>
        </div>
    )
}