import React, { useState, useEffect, useContext, useRef } from 'react';
import { Navbar as BlueprintNavbar, Button, Alignment, Popover, Position }  from '@blueprintjs/core';
import styles from './Navbar.module.scss';
import { useHistory } from 'react-router-dom';
import Notification from '../Notification/Notification';
import { GlobalContext } from "../../context/GlobalState";
import stream from 'getstream';
import AsyncSelect from 'react-select/async';

export default function Navbar() {

    const [notificationCount, setNotificationCount] = useState(0);
    const history = useHistory();
    const { user, notifications, setNotifications } = useContext(GlobalContext);
    const [searchValue, setSearchValue] = useState(null)
    const notificationRef = useRef();
    notificationRef.current = notifications;


    useEffect(() => {
        const getNotifications = () => {
        if (user.streamToken) {
            let client = stream.connect(
                process.env.REACT_APP_STREAM_API_KEY,
                null,
                process.env.REACT_APP_STREAM_APP_ID
            );
            const notificationSystem = client.feed('Notifications', user.username, user.streamToken);

            function callback(data) {
                // console.log('A new activity: ' + JSON.stringify(data));
                // const newNotifications  =  {...notifications};
                const newNotifications  =  {...notificationRef.current};
                // debugger
                for (let i = 0; i < data.new.length; i++) {
                    let group = data.new[i].group;
                    if (group in newNotifications) {
                        if (!newNotifications[group].messages.includes(data.new[i].id)) {
                            let message =  data.new[i].id;
                            newNotifications[group].messages = [message, ...newNotifications[group].messages];
                        }
                    }
                    else {
                        newNotifications[group] = {
                            messages: [data.new[i].id],
                            userType: data.new[i]
                        }
                    }
                }
                console.log(newNotifications)
                setNotifications(newNotifications)
            }
        
            function successCallback() {
                console.log('Now listening to changes in realtime. Add an activity to see how realtime works.');
            }
        
            function failCallback(data) {
                alert('Something went wrong, check the console logs');
                console.log(data);
            }
        
            notificationSystem.subscribe(callback).then(successCallback, failCallback);

            }
        }   

        getNotifications();
    }, [user, setNotifications])

    useEffect(() => {
        setNotificationCount(Object.keys(notifications).length)
    }, [notifications])

    const navigateHome = () => {
        // Redirect to Home page
        history.push('/home');
    }

    const handleChangeSelect = (selection) => {
        setSearchValue(null);
        const username = selection.value.username;
        const userType = selection.value.type;
        history.push(`/user/${username}`, {
            profileUsername: username,
            profileUserType: userType,
            filter: 'all'
        })
    }

    const promiseOptions = (inputValue) => {
        return new Promise(async (resolve) => {
            const fetchResponse = await fetch(`http://localhost:5000/searchUser?username=${inputValue}`, {
                method: 'GET'
            });
            let result = await fetchResponse.json({});
            resolve(result.data)
    })}

    return (
        <BlueprintNavbar className={`${styles.navStyles} ${styles.light}`}>
            <BlueprintNavbar.Group align={Alignment.LEFT}>
                <BlueprintNavbar.Heading>SFF Feed App</BlueprintNavbar.Heading>
                <BlueprintNavbar.Divider />
                <AsyncSelect
                    value={searchValue}
                    onChange={handleChangeSelect}
                    loadOptions={promiseOptions}
                    isMulti={false}
                    placeholder="Search for users"
                    className={styles.searchBox}
                />
                <BlueprintNavbar.Divider />
                <Button className="bp3-minimal" icon="home" text="Home" onClick={navigateHome}/>
                <Popover content={<Notification />} position={Position.BOTTOM}>
                    <div className={styles.button}>
                        <Button className="bp3-minimal" icon="notifications" text={"Notifications "}>
                            <span className={notificationCount > 0 ? styles.notificationCount : null}>
                                {notificationCount > 0 ? notificationCount : null}
                            </span>
                        </Button>
                    </div>
                </Popover>
            </BlueprintNavbar.Group>
        </BlueprintNavbar>
    )
}
