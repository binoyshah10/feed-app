import React, { useContext } from 'react';
import './App.css';
import Home from './components/Home/Home';
import ProfileView from './components/ProfileView/ProfileView';
import { GlobalProvider, GlobalContext } from './context/GlobalState';
import { Route, Switch } from 'react-router-dom';
import Login from './components/Login/Login';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { FocusStyleManager } from "@blueprintjs/core";

function App() {

  // eslint-disable-next-line
  const loggedIn = useContext(GlobalContext);
  FocusStyleManager.onlyShowFocusOnTabs();

  return (
    <GlobalProvider>
      <Switch>
        <Route path="/" render={ loggedIn => ( loggedIn === true ? <Home /> : <Login />)} exact />
        <PrivateRoute path="/home">
          <Home/>
        </PrivateRoute>
        <PrivateRoute path="/user/:profileUsername">
          <ProfileView />
        </PrivateRoute>
      </Switch>
    </GlobalProvider>
  );
}

export default App;
