import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { GlobalContext } from "../../context/GlobalState";

export default function PrivateRoute({ children, ...rest }) {
    const { loggedIn } = useContext(GlobalContext);

    return (
      <Route
        {...rest}
        render={({ location }) =>
          loggedIn ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }