import React, { useContext } from 'react';
import styles from './Notification.module.scss';
import { GlobalContext } from "../../context/GlobalState";
import { useHistory } from 'react-router-dom';
import { Classes, Icon } from '@blueprintjs/core';
import { IconNames } from "@blueprintjs/icons";
const names = require('../../usernames.json');

export default function Notification({ updateNotifications }) {

    const { user, notifications, setNotifications } = useContext(GlobalContext);
    const history = useHistory();

    const viewProfile = (actor, userType, verb) => {
        history.push(`/user/${actor}`, {
            profileUsername: actor,
            profileUserType: userType,
            filter: verb
        })
    }

    const dismissNotification = async (groupID, notificationActivities) => {
        console.log(notifications)
        const data = {
            username: user.username,
            notificationGroupID: groupID,
            notificationActivities: notificationActivities
        }

        const fetchResponse = await fetch('http://localhost:5000/seenNotification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let postResponse = await fetchResponse.json({});
        console.log(postResponse)
        setNotifications({})
        updateNotifications();
    }

    return (
        <div>
            {Object.keys(notifications).length > 0 &&  Object.entries(notifications).map(([key, value], index) =>  {
                let [actor, verb] = key.split('_');
                const userType = value.userType
                const activityCount = value.messages.length;
                let message = ""
                switch(verb) {
                    case "info":
                        message = `${names[actor]} updated their status`;
                        break;
                    case "alert":
                        message = `${names[actor]} raised ${activityCount} alerts`;
                        break;
                    case "warning":
                        message = `${names[actor]} raised ${activityCount} warnings`;
                        break;
                    default:
                        message = `${names[actor]} posted ${activityCount} messages`;
                  }              
                return (
                    <div className={`${styles.notificationContainer} ${Classes.POPOVER_DISMISS}`} key={index}>
                        <span className={styles.notificationMessage} onClick={() => viewProfile(actor, userType, verb)}>{message}</span>
                        <Icon icon={IconNames.CROSS} onClick={() => dismissNotification(value.groupID, value.messages)} className={styles.dismissNotification}/>
                    </div>
                )
            })}
            {Object.keys(notifications).length === 0 &&
                <div className={`${styles.noNotification} ${Classes.POPOVER_DISMISS}`}>
                    No notifications
                </div>
            }
        </div>
    )
}
