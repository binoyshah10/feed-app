import React, { useState, useEffect } from 'react'
import Post from '../Post/Post'

export default function Feed() {

    const [feedActivities, setfeedActivities] = useState([]);

    useEffect(() => {
        getFeedData();
    }, [])


    async function getFeedData() {
        const fetchResponse = await fetch('http://localhost:5000/getFeed?persona=worker&id=worker1', {
            method: 'GET'
        });
        let feedResults = await fetchResponse.json({});
        setfeedActivities(feedResults.feedData.results)
    }

    return (
        <div>
            <Post updateFeed={getFeedData}/>  
            {feedActivities.length > 0 && feedActivities.map((activity, index) => {
                return <div key={activity.id}>
                    <p>User: {activity.actor}</p>
                    <p>Message: {activity.message}</p>
                </div> 
            })}      
        </div>
    )
}
