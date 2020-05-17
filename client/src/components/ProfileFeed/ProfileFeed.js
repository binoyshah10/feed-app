import React, { useState, useEffect, useContext } from 'react';
import { Card, Elevation, Intent, Icon, Button } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import styles from './ProfileFeed.module.scss';
import Select from 'react-select';
import { GlobalContext } from "../../context/GlobalState";

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
            if (postResponse.message == 'User is followed') {
                setFollowedUser(true)
            } else {
                setFollowedUser(false)
            }
        }

        checkIfFollowed()

    }, [profileUsername, feedActivities])

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
        updateFeed()
    }

    return (
        <div> 
            <div className={styles.cardLayout}>
                <Card interactive={false} elevation={Elevation.TWO} style={{width: '80%'}}>
                <p>
                    <Icon icon={IconNames.PERSON} iconSize={30} intent={Intent.PRIMARY}/>
                    {profileUsername}
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
                return (
                    <div key={activity.id} className={styles.postLayout}>
                        <Card interactive={false} elevation={Elevation.TWO} style={{width: '80%'}}>
                        <p><Icon icon={ activity.type === 'machine' ?  IconNames.TRACTOR : IconNames.PERSON} iconSize={20} intent={Intent.PRIMARY} className={styles.personIcon}/>
                            {activity.actor}</p>
                        <p>Message: {activity.message}</p>
                        </Card>
                    </div>
                )
            })}       
        </div>   
    )
    
}
