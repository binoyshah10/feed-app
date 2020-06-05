import React, { useState, useEffect, useContext, useRef } from 'react';
import { Navbar as BlueprintNavbar, Button, Alignment, Popover, Position, Classes }  from '@blueprintjs/core';
import styles from './Navbar.module.scss';
import { useHistory } from 'react-router-dom';
import Notification from '../Notification/Notification';
import { GlobalContext } from "../../context/GlobalState";
import stream from 'getstream';
import AsyncSelect from 'react-select/async';

export default function Navbar({ updateNotifications }) {

    const [notificationCount, setNotificationCount] = useState(0);
    const history = useHistory();
    const { user, notifications, setNotifications, theme, setTheme } = useContext(GlobalContext);
    const [searchValue, setSearchValue] = useState(null)
    // const notificationRef = useRef();
    // notificationRef.current = notifications;


    // useEffect(() => {
    //     const getNotifications = () => {
    //     if (user.streamToken) {
    //         let client = stream.connect(
    //             process.env.REACT_APP_STREAM_API_KEY,
    //             null,
    //             process.env.REACT_APP_STREAM_APP_ID
    //         );
    //         const notificationSystem = client.feed('Notifications', user.username, user.streamToken);

    //         function callback(data) {
    //             // console.log('A new activity: ' + JSON.stringify(data));
    //             // const newNotifications  =  {...notifications};
    //             const newNotifications  =  {...notificationRef.current};
    //             // debugger
    //             for (let i = 0; i < data.new.length; i++) {
    //                 let group = data.new[i].group;
    //                 if (group in newNotifications) {
    //                     if (!newNotifications[group].messages.includes(data.new[i].id)) {
    //                         let message =  data.new[i].id;
    //                         newNotifications[group].messages = [message, ...newNotifications[group].messages];
    //                     }
    //                 }
    //                 else {
    //                     newNotifications[group] = {
    //                         messages: [data.new[i].id],
    //                         groupID: data.new[i].id,
    //                         userType: data.new[i]
    //                     }
    //                 }
    //             }
    //             console.log(data)
    //             console.log("REAL TIME POST PROCESSING", newNotifications)
    //             console.log("NOTIF REF", notificationRef)
    //             if (data.new.length > 0) {
    //                 setNotifications(newNotifications)
    //             }
    //         }
        
    //         function successCallback() {
    //             console.log('Now listening to changes in realtime. Add an activity to see how realtime works.');
    //         }
        
    //         function failCallback(data) {
    //             alert('Something went wrong, check the console logs');
    //             console.log(data);
    //         }
        
    //         notificationSystem.subscribe(callback).then(successCallback, failCallback);

    //         }
    //     }   
    //     console.log("THIS IS NOTIFICATION REF", notificationRef)
    //     getNotifications();
    // }, [user])

    useEffect(() => {
        console.log('Notification count updating:', notificationCount)
        console.log(notifications)
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

    const changeTheme = () => {
        theme === 'light' ? setTheme('dark') : setTheme('light')
    }


    const selectStyles = {
        option: provided => ({
          ...provided,
          color: 'black'
        }),
        control: provided => ({
          ...provided,
          color: 'black'
        }),
        singleValue: (provided) => ({
          ...provided,
          color: 'black'
        })
    }

    return (
        <BlueprintNavbar className={theme === 'light' ? `${styles.navStyles} ${styles.light}` : `${styles.navStyles} ${Classes.DARK}`}>
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
                    styles={selectStyles}
                />
                <BlueprintNavbar.Divider />
                <Button className="bp3-minimal" icon="home" text="Home" onClick={navigateHome}/>
                <Popover content={<Notification updateNotifications={updateNotifications}/>} position={Position.BOTTOM}>
                    <div className={styles.button}>
                        <Button className="bp3-minimal" icon="notifications" text={"Notifications "}>
                            <span className={notificationCount > 0 ? styles.notificationCount : null}>
                                {notificationCount > 0 ? notificationCount : null}
                            </span>
                        </Button>
                    </div>
                </Popover>
                {theme === 'light' && 
                    <Button className="bp3-minimal" icon="flash" onClick={changeTheme}/>            
                }
                 {theme === 'dark' && 
                    <Button className="bp3-minimal" icon="moon" onClick={changeTheme}/>            
                }

            </BlueprintNavbar.Group>
        </BlueprintNavbar>
    )
}
