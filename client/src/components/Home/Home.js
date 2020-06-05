import React, { useEffect, useCallback, useContext } from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import Feed from '../Feed/Feed';
import styles from './Home.module.scss';
import { GlobalContext } from "../../context/GlobalState";

export default function Home({ notificationRef }) {

    const { user, setNotifications, notifications, theme } = useContext(GlobalContext);
    
    const getNotifications = useCallback(async () => {
        const fetchResponse = await fetch(`http://localhost:5000/getNotifications?username=${user.username}`, {
            method: 'GET'
        });
        let notificationResults = await fetchResponse.json({});
        // console.log(notificationResults)
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
        setNotifications(newNotifications)
    }, [user])
    
    useEffect(() => {
        getNotifications()
    }, [getNotifications])

    return (
        <div className={styles.gridContainer}>
            <div className={styles.navbar}>
                <Navbar updateNotifications={getNotifications} notificationRef={notificationRef}/>
            </div>

            <div className={theme === 'light' ? `${styles.sidebar} ${styles.light}` : `${styles.sidebar} ${styles.dark}`}>
                <Sidebar notificationRef={notificationRef}/>
            </div>

            <div className={theme === 'light' ? `${styles.feed} ${styles.light}` : `${styles.feed} ${styles.dark}`}>
                <Feed />
            </div>
        </div>
    )
}
