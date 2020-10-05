import React, { useMemo, useState, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import './App.css';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Box, CssBaseline } from '@material-ui/core';

import AppBar from './components/common/AppBar';
import Login from './components/cards/Login';
import Registration from './components/cards/Registration';
import ForgetPassword from './components/cards/ForgetPassword';
import Profile from './components/cards/Profile';
import Dashboard from './components/cards/Dashboard';
import CreateProject from './components/cards/CreateProject';

import usePersistentState from './utility/PersistentStateUtility';
import { isAuthorized, clearAuthorization } from './utility/Utility';
import { axiosAuthConfig } from './config/Axios';

const axios = require('axios');

function App() {
  const [darkMode, setDarkMode] = usePersistentState('darkMode', false);
  const [authorize, setAuthorize] = useState(false);

  useEffect(() => {
    setAuthorize(isAuthorized());
  }, [authorize]);

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: darkMode ? 'dark' : 'light',
          primary: {
            main: '#9c27b0',
          },
          secondary: {
            main: '#00a152',
          },
        },
        overrides: {
          MuiTableCell: {
            head: {
              backgroundColor: '#9c27b0',
              color: 'white',
            },
          },
        },
      }),
    [darkMode],
  );

  const handleAuthorization = (response) => {
    setAuthorize(response);
  }

  const handleLogout = () => {
    axios.post('/service/api/user/logout',
      axiosAuthConfig
    ).then((response) => {
      if (response.data) {
        console.log('handleLogout -> axios response.data -> ' + JSON.stringify(response.data) + ' status -> ' + response.status);
      } else {
        console.log('handleLogout -> axios response -> ' + JSON.stringify(response.toJSON()) + ' status -> ' + response.status);
      }
      clearAuthorization();
      setAuthorize(false);
    }).catch((error) => {
      if (error.response) {
        console.log('handleLogout -> axios error.response.data -> ' + JSON.stringify(error.response));
      } else {
        console.log('handleLogout -> axios error -> ' + JSON.stringify(error.toJSON()));
      }
    });
  }

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  let routes = (
    <Switch>
      <Route path='/login' render={() => <Login authorize={authorize} onAuthorizationResponse={handleAuthorization} />} />
      <Route path='/register' render={() => <Registration onAuthorizationResponse={handleAuthorization} />} />
      <Route path='/forgetPassword' component={ForgetPassword} />
      {authorize &&
        <Route path='/profile' component={Profile} />
      }
      <Route path='/dashboard' component={Dashboard} />
      <Route path='/createProject' component={CreateProject} />
      <Route path='/' exact render={() => <Login authorize={authorize} onAuthorizationResponse={handleAuthorization} />} />
      <Redirect to='/' />
    </Switch>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar authorize={authorize} darkMode={darkMode} onThemeIconClick={handleDarkMode} onLogoutIconClick={handleLogout} />
      <Box display='flex' justifyContent='center' margin={5}>
        {routes}
      </Box>
    </ThemeProvider>
  );
}

export default App;
