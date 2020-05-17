import React, { useContext } from 'react';
import styles from './Notification.module.scss';
import { GlobalContext } from "../../context/GlobalState";
import { useHistory } from 'react-router-dom';
import { Classes } from '@blueprintjs/core';

export default function Notification() {

    const { notifications } = useContext(GlobalContext);
    const history = useHistory();

    const viewProfile = (actor, userType, verb) => {
        history.push(`/user/${actor}`, {
            profileUsername: actor,
            profileUserType: userType,
            filter: verb
        })
    }

    return (
        <div>
            {Object.keys(notifications).length > 0 &&  Object.entries(notifications).map(([key, value], index) =>  {
                let [actor, verb] = key.split('_');
                const userType = value.userType
                const activityCount = value.messages.length;
                let message = ""
                switch(verb) {
                    case "post":
                        message = `${actor} has posted ${activityCount} messages`;
                        break;
                    case "alert":
                        message = `${actor} has raised ${activityCount} alerts`;
                      break;
                      case "warning":
                        message = `${actor} has raised ${activityCount} warnings`;
                      break;
                    default:
                        message = `${actor} has posted ${activityCount} messages`;
                  }                
                
                return (
                    <div className={`${styles.notificationContainer} ${Classes.POPOVER_DISMISS}`} key={index} onClick={() => viewProfile(actor, userType, verb)}>
                        {message}
                    </div>
                )
            })}
        </div>
    )
}
