import React, { useState, useContext } from 'react';
import { Button, Card, Elevation, Intent, InputGroup } from "@blueprintjs/core";
import styles from './Login.module.scss';
import { GlobalContext } from "../../context/GlobalState";
import { useHistory } from 'react-router-dom';

export default function Login() {

    const [formValues, setFormValues] = useState({username: '', password: ''});
    const { setLoggedIn, setUser} = useContext(GlobalContext);
    const history = useHistory();

    const handleInputChange = e => {
        const {name, value} = e.target
        setFormValues({...formValues, [name]: value})
    }

    const loginUser = async () => {

        const data = {
            ...formValues
        }

        const fetchResponse = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let loginResponse = await fetchResponse.json({});
        const user = loginResponse.user;
        
        setFormValues({username: '', password: ''});

        // Setting user and loggedIn
        setUser(user);
        setLoggedIn(true);
        
        // Redirect to Home page
        history.push('/home');

    }

    return (
        <div className={`${styles.loginContainer}`}>
            <Card className={styles.loginCard} elevation={Elevation.FOUR}>
                <h2>SFF Feed App</h2>
                <h4>Username</h4>
                <InputGroup onChange={handleInputChange} value={formValues.username} name="username" intent={Intent.PRIMARY}/>
                <h4>Password</h4>
                <InputGroup onChange={handleInputChange} value={formValues.password} name="password" type="password" intent={Intent.PRIMARY}/>
                <Button intent={Intent.PRIMARY} onClick={loginUser} style={{marginTop: '10px', width: '80px'}}>Login</Button>
            </Card>
        </div>
    )
}
