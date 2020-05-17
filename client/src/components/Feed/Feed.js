import React, { useState, useEffect, useContext, useCallback } from 'react'
import Post from '../Post/Post';
import styles from './Feed.module.scss';
import { Card, Elevation, Intent, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { GlobalContext } from "../../context/GlobalState";
import Select from 'react-select';
import CommentBox from '../CommenBox/CommentBox';

export default function Feed() {

    const filterOptions = [
        { value: 'all', label: 'All' },
        { value: 'info', label: 'Info' },
        { value: 'warning', label: 'Warning' },
        { value: 'alert', label: 'Alert' }
    ]

    const [filter, setFilter] = useState('all');
    const [feedActivities, setfeedActivities] = useState([]);
    const { user, notifications } = useContext(GlobalContext);
    

    const getFeedData = useCallback(async () => {
        const fetchResponse = await fetch(`http://localhost:5000/getFeed?userType=${user.type}&username=${user.username}`, {
            method: 'GET'
        });
        let feedResults = await fetchResponse.json({});
        setfeedActivities(feedResults.feedData.results)
        console.log(feedResults.feedData.results)
    }, [user])

    useEffect(() => {
        getFeedData();
    }, [getFeedData, notifications])

    const handleChangeSelect = (selection) => {
        setFilter(selection)
    }

    async function likeFeed(activity) {
        
        const data = {
            userType: user.type,
            userName: user.username,
            activitypersona: activity.type,
            activityactor: activity.actor,
            actID: activity.id   
        }
        console.log(data);
        const fetchResponse = await fetch('http://localhost:5000/addLiketoactivity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let postResponse = await fetchResponse.json({});
        console.log(postResponse);
        getFeedData();
    }

    async function gotThis(activity) {      
        const data = {
            userType: user.type,
            userName: user.username,
            activitypersona: activity.type,
            activityactor: activity.actor,
            actID: activity.id   
        }
        console.log(data);
        const fetchResponse = await fetch('http://localhost:5000/addigotthis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let postResponse = await fetchResponse.json({});
        getFeedData();
    }

    return (
        <div className={styles.layout}>
            <Post updateFeed={getFeedData}/>  
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

                return (
                    <div key={activity.id} className={styles.postLayout}>
                        <Card interactive={false} elevation={Elevation.TWO} className={`${styles.feedItem} ${styles[verbStyle]}`}>
                        <p><Icon icon={ activity.type === 'machine' ?  IconNames.TRACTOR : IconNames.PERSON} iconSize={20} intent={Intent.PRIMARY} className={styles.personIcon}/>
                            {activity.actor}</p>
                        <p>{activity.message}</p>
                        <div className={styles.reactionsContainer}>
                            <div className={styles.reaction} disabled={activity.latest_reactions.gotthis?.length > 0 ? true : false}>
                                <Icon icon={IconNames.HAND} iconSize={14} intent={activity.latest_reactions.gotthis?.length > 0 ?Intent.SUCCESS : Intent.PRIMARY} onClick={() => gotThis(activity)}/>
                                    <span>{activity.latest_reactions.gotthis?.length > 0 ? activity.latest_reactions.gotthis[0].data.actor+' has got this' : 'No one got this'}</span>
                            </div>
                            {/* <div className={styles.reaction}>
                                <Icon icon={IconNames.THUMBS_UP} iconSize={14} intent={Intent.PRIMARY} onClick={() => likeFeed(activity)}/> 
                                <span> Likes</span>
                            </div> */}
                        </div>
                        {
                            activity.latest_reactions.comment?.length > 0  &&  activity.latest_reactions.comment.reverse().map((reaction, index) => {
                                console.log('comment: '+ reaction.data.comment);
                                return (
                                    <div key={index} className={styles.commentStyle}>
                                        <p><span className={styles}>{reaction.data.actor}</span>: {reaction.data.comment}</p>
                                    </div>
                                )
                            })
                        }
                        <CommentBox activity={activity} updateFeed={getFeedData}/>
                        </Card> 
                    </div>
                )
            })}      
        </div>
    )
}
