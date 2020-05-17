import React, { useState, useContext } from 'react';
import { TextArea, Button, Intent } from "@blueprintjs/core";
import { GlobalContext } from "../../context/GlobalState";

export default function CommentBox({ activity, updateFeed }) {

    const [postComment, setPostComment] = useState('');
    const { user } = useContext(GlobalContext);

    const handleCommentChange = (e) => {
        setPostComment(e.target.value)
    }

    async function sendComment() {
        
        const data = {
            userType: user.type,
            userName: user.username,
            activitypersona: activity.type,
            activityactor: activity.actor,
            actID: activity.id , 
            comment: postComment
        }
        console.log(data);
        const fetchResponse = await fetch('http://localhost:5000/addCommenttoactivity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let postResponse = await fetchResponse.json({});
        console.log(postResponse);
        setPostComment('');
        updateFeed();
    }

    return (
        <div>
             <TextArea
                placeholder="Enter a comment" 
                growVertically={false}
                small={true}
                fill={true}
                intent={Intent.PRIMARY}
                value={postComment}
                onChange={handleCommentChange}
                name="postComment"
            />
            <Button type="submit" intent={Intent.SUCCESS} style={{marginTop: '10px', width: '80px'}} text="Comment" onClick={sendComment}></Button>
        </div>
    )
}
