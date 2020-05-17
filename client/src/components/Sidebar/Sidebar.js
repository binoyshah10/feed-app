import React, { useEffect, useContext, useState } from 'react';
import { Icon,Intent } from '@blueprintjs/core';
import { IconNames } from "@blueprintjs/icons";
import styles from './Sidebar.module.scss';
import { useHistory } from 'react-router-dom';
import { GlobalContext } from "../../context/GlobalState";

export default function Sidebar() {
    const iconGlobalSize = 30;
    const history = useHistory();
    const { user } = useContext(GlobalContext);
    const [followingList, setFollowingList] = useState([])

    const viewProfile = (data) => {
        history.push(`/user/${data.username}`, {
            profileUsername: data.username,
            profileUserType: data.userType,
            filter: 'all'
        })
    }

    useEffect(() => {
        const getFollowing = async () => {
            const fetchResponse = await fetch(`http://localhost:5000/getFollowingFeeds?userType=${user.type}&username=${user.username}`, {
                method: 'GET'
            });
            const followingListResult = await fetchResponse.json({});
            setFollowingList(followingListResult.following);         
        }

        getFollowing()
    }, [user])

    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.headerContainer}>
                <Icon icon={IconNames.PEOPLE} iconSize={iconGlobalSize+3} intent={Intent.PRIMARY} className={styles.peopleIcon}/>
                <span className={styles.headerText}>Following</span>
            </div>
             {followingList.length > 0 && followingList.map((data, index) => {
                 return (
                    <div onClick={() =>  viewProfile(data)} key={index} className={styles.followingUser}>
                        {data.name}
                    </div>
                 )
             })
             }
        </div>
    )
}
