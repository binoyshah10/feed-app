import React, { useState } from 'react'

export default function Post({ updateFeed }) {

    const [formValues, setFormValues] = useState({postMessage: ''});

    async function postToFeed() {

        const data = {
            ...formValues,
            persona: 'worker',
            id: 'worker1'
        }

        const fetchResponse = await fetch('http://localhost:5000/addActivityToFeed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let postResponse = await fetchResponse.json({});
        console.log(postResponse);
        
        // Telling feed component to refetch data
        updateFeed();
        setFormValues({postMessage: ''});
    }

    const handleInputChange = e => {
        const {name, value} = e.target
        setFormValues({...formValues, [name]: value})
    }
    return (
        <div>
            Post to your feed
            <input type="text" value={formValues.postMessage} name="postMessage" onChange={handleInputChange}/>
            <button type="submit" onClick={postToFeed}>Post</button>
        </div>
    )
}
