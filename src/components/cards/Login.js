import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, TextField, Box, Grid, Button, Link, LinearProgress, IconButton, Snackbar } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { isValidEmailFormat, isValidPasswordFormat } from '../../utility/Utility';

import TextFieldPassword from '../common/TextFieldPassword';
import WelcomeCard from '../cards/Welcome';
import { axiosConfig } from '../../config/Axios';

const axios = require('axios');

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
    },
}));

function LoginCard(props) {

    const classes = useStyles();
    const history = useHistory();

    const [showProgress, setShowProgress] = useState(false);

    const [snackBar, setSnackBar] = useState({
        message: '',
        show: false
    });

    const handleSnackBarClose = () => {
        setSnackBar({
            ...snackBar,
            message: '',
            show: false
        });
    };

    const [email, setEmail] = useState({
        value: '',
        valid: true
    });

    const emailChangedHandler = (event) => {
        setEmail({
            ...email,
            value: event.target.value,
            valid: isValidEmailFormat(event.target.value)
        });
    }

    const [password, setPassword] = useState({
        value: '',
        valid: true,
        show: false,
    });

    const handlePasswordChange = (event) => {
        setPassword({
            ...password,
            value: event.target.value,
            valid: isValidPasswordFormat(event.target.value)
        });
    };

    const handleShowPassword = () => {
        setPassword({
            ...password,
            show: !password.show
        });
    };

    const forgetPasswordHandler = () => {
        history.push('/forgetPassword');
    }

    const registerHandler = () => {
        history.push('/register');
    }

    const dashboardHandler = () => {
        history.push('/dashboard');
    }

    const loginHandler = () => {
        console.log('loginHandler email -> ' + email.value + ' password -> ' + password.value);

        let errors = [];

        if (!isValidEmailFormat(email.value)) {
            errors.push('Please fill valid email');
        }

        if (!isValidPasswordFormat(password.value)) {
            errors.push('Please fill valid password');
        }

        if (errors.length) {
            console.log('loginHandler -> errors -> ' + errors.join(', '));
            setSnackBar({
                ...snackBar,
                message: errors.join(', '),
                show: true
            });
        } else {
            console.log('loginHandler -> forwarding to POST login');

            setShowProgress(true);

            const formData = new FormData();
            formData.append('email', email.value);
            formData.append('password', password.value);
            axios.post('/service/api/user/login',
                formData,
                axiosConfig
            ).then((response) => {
                if (response.data) {
                    console.log('loginHandler -> axios response.data -> ' + JSON.stringify(response.data) + ' status -> ' + response.status);
                    setSnackBar({
                        ...snackBar,
                        message: response.data.message,
                        show: true
                    });
                } else {
                    console.log('loginHandler -> axios response -> ' + JSON.stringify(response.toJSON()) + ' status -> ' + response.status);
                }
                if (response.status === 200) {
                    const expirationDate = new Date(new Date().getTime() + response.data.access_token_expires_in);
                    localStorage.setItem('accessToken', response.data.access_token);
                    localStorage.setItem('expirationDate', expirationDate);
                    localStorage.setItem('refreshToken', response.data.refresh_token);

                    props.onAuthorizationResponse(true);

                    history.push('/dashboard');
                }
            }).catch((error) => {
                if (error.response) {
                    console.log('loginHandler -> axios error.response.data -> ' + JSON.stringify(error.response));
                    setSnackBar({
                        ...snackBar,
                        message: error.response.data.message,
                        show: true
                    });
                } else {
                    console.log('loginHandler -> axios error -> ' + JSON.stringify(error.toJSON()));
                }
                props.onAuthorizationResponse(false);
            }).then(() => {
                setShowProgress(false);
            });
        }
    }

    return (
        <div>
            {(props.authorize)
                ?
                <Box display='flex' justifyContent='center'>
                    <WelcomeCard onDashboardClicked={dashboardHandler} />
                </Box>
                :
                <Paper className={classes.root} elevation={3}>
                    <Box marginBottom={3}>
                        <Typography variant='h6'>
                            <Box fontWeight='fontWeightNormal'>
                                Login
                        </Box>
                        </Typography>
                    </Box>
                    <Grid container direction={'column'} spacing={2}>
                        <Grid item>
                            <TextField label='Email' variant='outlined' error={!email.valid} onChange={(event) => emailChangedHandler(event)} fullWidth required />
                        </Grid>
                        <Grid item>
                            <TextFieldPassword label={'Password'} labelWidth={80} password={password} onPasswordChange={handlePasswordChange} onShowPassword={handleShowPassword} />
                        </Grid>
                        <Grid item>
                            <p>
                                <Link color="secondary" href="#" onClick={forgetPasswordHandler}>Forget Password?</Link>
                            </p>
                        </Grid>
                        <Grid item>
                            {showProgress &&
                                <LinearProgress color='secondary' />
                            }
                        </Grid>
                        <Grid item>
                            <Grid container direction={'row'} spacing={2}>
                                <Grid item>
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        size='large'
                                        onClick={loginHandler}>
                                        LOG IN
                                </Button>
                                </Grid>
                                <Grid item>
                                    <p>Have no account?</p>
                                </Grid>
                                <Grid item>
                                    <p>
                                        <Link color="secondary" href='#' onClick={registerHandler}>Sign Up here</Link>
                                    </p>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            }
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={snackBar.show}
                autoHideDuration={6000}
                onClose={handleSnackBarClose}
                message={snackBar.message}
                action={
                    <React.Fragment>
                        <IconButton size='small' aria-label='close' color='inherit' onClick={handleSnackBarClose}>
                            <CloseIcon />
                        </IconButton>
                    </React.Fragment>
                }
            />
        </div>
    );
}

export default LoginCard;