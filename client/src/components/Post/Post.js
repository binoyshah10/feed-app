import React, { useState, useContext } from 'react';
import { Button, Card, Elevation, TextArea, Intent, Classes, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import styles from './Post.module.scss';
import { GlobalContext } from "../../context/GlobalState";

export default function Post({ updateFeed }) {

    const [formValues, setFormValues] = useState({postMessage: ''});
    const { user } = useContext(GlobalContext);

    async function postToFeed() {

        const data = {
            ...formValues,
            userType: user.type,
            username: user.username
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

        <div className={styles.cardLayout}>
            <Card interactive={false} elevation={Elevation.TWO} style={{width: '80%'}}>
                <p><Icon icon={IconNames.PERSON} iconSize={28} intent={Intent.PRIMARY} className={styles.personIcon}/>{user.name}</p>
                <p>Post to your feed</p>
                <TextArea
                    growVertically={true}
                    large={true}
                    intent={Intent.PRIMARY}
                    onChange={handleInputChange}
                    value={formValues.postMessage}
                    className={Classes.FILL}
                    name="postMessage"
                />
                <Button type="submit" onClick={postToFeed} intent={Intent.PRIMARY} style={{marginTop: '10px', width: '80px'}}>Post</Button>
            </Card>
        </div>
    )
}
