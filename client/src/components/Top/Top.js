import React, { useRef, useEffect, useContext} from 'react'
import Home from '../Home/Home'
import { GlobalContext } from '../../context/GlobalState';
import stream from 'getstream';

export default function Top() {
    
    const { user, notifications, setNotifications } = useContext(GlobalContext);
    
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

            async function callback(data) {
                // // console.log('A new activity: ' + JSON.stringify(data));
                // // const newNotifications  =  {...notifications};
                // const newNotifications  =  {...notificationRef.current};
                // // debugger
                // for (let i = 0; i < data.new.length; i++) {
                //     let group = data.new[i].group;
                //     if (group in newNotifications) {
                //         if (!newNotifications[group].messages.includes(data.new[i].id)) {
                //             let message =  data.new[i].id;
                //             newNotifications[group].messages = [message, ...newNotifications[group].messages];
                //         }
                //     }
                //     else {
                //         newNotifications[group] = {
                //             messages: [data.new[i].id],
                //             groupID: data.new[i].id,
                //             userType: data.new[i]
                //         }
                //     }
                // }
                // console.log(data)
                // console.log("REAL TIME POST PROCESSING", newNotifications)
                // console.log("NOTIF REF", notificationRef)
                // if (data.new.length > 0) {
                //     console.log('IS THIS BEING CALLED')
                //     setNotifications(newNotifications)
                // }

                const fetchResponse = await fetch(`http://localhost:5000/getNotifications?username=${user.username}`, {
                    method: 'GET'
                });
                let notificationResults = await fetchResponse.json({});
                console.log(notificationResults)
                const unseenCount = notificationResults.notifications.unseen;
                const newNotifications = {}
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
        console.log("THIS IS NOTIFICATION REF", notificationRef)
        getNotifications();
    }, [user])
    
    
    useEffect(() => {
        console.log("IN TOP", notificationRef.current)
        notificationRef.current = notifications;
        console.log("RESET REF", notificationRef.current)
    }, [notifications])
    
    
    
    
    
    
    
    
    
    
    
    
    
    return (
        <div>
            <Home notificationRef={notificationRef}/>
        </div>
    )
}
