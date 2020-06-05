import React, { useState, useEffect, useContext } from 'react';
import { Card, Elevation, Intent, Icon, Button } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import styles from './ProfileFeed.module.scss';
import Select from 'react-select';
import { GlobalContext } from "../../context/GlobalState";
import CommentBox from '../CommenBox/CommentBox';
import moment from 'moment-timezone';
const names = require('../../usernames.json');

export default function ProfileFeed({ feedActivities, profileUsername, profileUserType, feedFilter, updateFeed }) {

    const filterOptions = [
        { value: 'all', label: 'All' },
        { value: 'info', label: 'Info' },
        { value: 'warning', label: 'Warning' },
        { value: 'alert', label: 'Alert' }
    ]
    
    const [filter, setFilter] = useState(null);
    const { user } = useContext(GlobalContext);
    const [followedUser, setFollowedUser] = useState(false);

    useEffect(() => {
        setFilter({value: feedFilter, label: feedFilter.charAt(0).toUpperCase() + feedFilter.slice(1)})
    }, [profileUsername, feedFilter])

    useEffect(() => {
        
        const checkIfFollowed = async () => {
            const data = {
                userType: user.type,
                username: user.username,
                followedUsername: profileUsername,
                followedUserType: profileUserType
            }
    
            const fetchResponse = await fetch('http://localhost:5000/checkIfFollowed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            let postResponse = await fetchResponse.json({});
            if (postResponse.message === 'User is followed') {
                setFollowedUser(true)
            } else {
                setFollowedUser(false)
            }
        }

        checkIfFollowed()

    }, [profileUsername, feedActivities, user, profileUserType])

    const handleChangeSelect = (selection) => {
        setFilter(selection)
    }

    const followUser = async () => {

        const data = {
            userType: user.type,
            username: user.username,
            followedUsername: profileUsername,
            followedUserType: profileUserType

        }

        const fetchResponse = await fetch('http://localhost:5000/follow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let postResponse = await fetchResponse.json({});
        console.log(postResponse);
        updateFeed()
    }

    const unfollowUser = async () => {

        const data = {
            userType: user.type,
            username: user.username,
            followedUsername: profileUsername,
            followedUserType: profileUserType

        }

        const fetchResponse = await fetch('http://localhost:5000/unfollow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let postResponse = await fetchResponse.json({});
        console.log(postResponse);
        updateFeed()
    }

    async function gotThis(activity) {      
        const data = {
            userType: user.type,
            userName: user.username,
            activitypersona: activity.type,
            activityactor: activity.actor,
            actID: activity.id   
        }
        // console.log(data);
        const fetchResponse = await fetch('http://localhost:5000/addigotthis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let postResponse = await fetchResponse.json({});
        console.log(postResponse);
        updateFeed();
    }

    return (
        <div> 
            <div className={styles.cardLayout}>
                <Card interactive={false} elevation={Elevation.TWO} style={{width: '80%'}}>
                <p className={styles.username}>
                    <Icon icon={profileUserType === 'machine' ?  IconNames.TRACTOR : IconNames.PERSON} iconSize={30} intent={Intent.PRIMARY}/>
                    <span style={{paddingLeft: '5px' ,fontWeight: 'bold', color: '#137CBD'}}>{names[profileUsername]}</span>
                </p>
                {followedUser === false && 
                    <Button intent={Intent.PRIMARY} style={{marginTop: '10px', width: '80px'}} onClick={followUser}>Follow</Button>
                }
                {followedUser === true && 
                    <Button intent={Intent.PRIMARY} style={{marginTop: '10px', width: '80px'}} onClick={unfollowUser}>Unfollow</Button>
                }
                    
                </Card>
            </div>
            <div className={styles.filterContainer}>
                <Select options={filterOptions} className={styles.filter} onChange={handleChangeSelect} value={filter}/>
            </div>
            {feedActivities.length > 0 && feedActivities.filter((activity) => {
                if (filter.value === 'alert') {
                    return activity.verb === 'alert';
                }
                else if (filter.value === 'warning') {
                    return activity.verb === 'warning';
                }
                else if (filter.value === 'info') {
                    return activity.verb === 'info';
                }
                else {
                    return true;
                }
            }).map((activity, index) => {
                let verbStyle = ''
                switch(activity.verb) {
                    case "info":
                        verbStyle = 'info'
                        break;
                    case "alert":
                        verbStyle = 'alert'
                      break;
                    case "warning":
                        verbStyle = 'warning'
                        break;
                    default:
                        verbStyle = 'default'
                }       
                const time = moment.tz(activity.time, "UTC").startOf('minute').fromNow();
                return (
                    <div key={activity.id} className={styles.postLayout}>
                        <Card interactive={false} elevation={Elevation.TWO} className={`${styles.feedItem} ${styles[verbStyle]}`}>
                        <p>
                            <Icon icon={ activity.type === 'machine' ?  IconNames.TRACTOR : IconNames.PERSON} iconSize={20} intent={Intent.PRIMARY} className={styles.personIcon}/>
                            <span style={{paddingLeft: '5px' ,fontWeight: 'bold', color: '#137CBD'}}>{names[activity.actor]}</span>
                            <span style={{float: 'right'}}>{time}</span>
                        </p>
                        <p>{activity.message}</p>
                        <div>
                            <div disabled={activity.latest_reactions.gotthis?.length > 0 ? true : false} style={{marginBottom: '7px'}}>
                                <Icon icon={IconNames.HAND} iconSize={14} intent={activity.latest_reactions.gotthis?.length > 0 ?Intent.SUCCESS : Intent.PRIMARY} onClick={() => gotThis(activity)}/>
                                    <span>{activity.latest_reactions.gotthis?.length > 0 ? names[activity.latest_reactions.gotthis[0].data.actor]+' has got this' : 'No one got this'}</span>
                            </div>
                        </div>
                        {
                            activity.latest_reactions.comment?.length > 0  &&  activity.latest_reactions.comment.slice().reverse().map((reaction, index) => {
                                return (
                                    <div key={index} >
                                        <p><span className={styles.commenter}>{names[reaction.data.actor]}</span>: {reaction.data.comment}</p>
                                    </div>
                                )
                            })
                        }
                        <CommentBox activity={activity} updateFeed={updateFeed}/>
                        </Card>
                    </div>
                )
            })}       
        </div>   
    )
    
}
