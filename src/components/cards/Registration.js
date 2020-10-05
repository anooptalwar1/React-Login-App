import React, { useState } from 'react';
import { useHistory } from "react-router";
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, TextField, Grid, Avatar, Fab, Button, Link, Box, LinearProgress, IconButton, Snackbar } from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CloseIcon from '@material-ui/icons/Close';

import TextFieldPassword from '../common/TextFieldPassword';

import { isNotEmptyString, isValidEmailFormat, isValidPasswordFormat, isPasswordMatchingConfirmed } from '../../utility/Utility';
import { axiosConfig } from '../../config/Axios';

const axios = require('axios');

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
    },
    avatar: {
        margin: 10,
        width: 120,
        height: 120,
    },
}));

function RegistrationCard(props) {

    const classes = useStyles();
    const history = useHistory();

    const [avatar, setAvatar] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);

    const onAvatarChanged = (event) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setAvatar(reader.result);
            }, false);
            reader.readAsDataURL(event.target.files[0]);
            setAvatarFile(event.target.files[0]);
        }
    };

    const [firstName, setFirstName] = useState('');

    const [lastName, setLastName] = useState('');

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

    const [confirmPassword, setConfirmPassword] = useState({
        value: '',
        valid: true,
        show: false,
    });

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword({
            ...confirmPassword,
            value: event.target.value,
            valid: isPasswordMatchingConfirmed(event.target.value, password.value)
        });
    };

    const handleShowConfirmPassword = () => {
        setConfirmPassword({
            ...confirmPassword,
            show: !confirmPassword.show
        });
    };

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

    const loginHandler = () => {
        history.push('/login');
    }

    const registerHandler = () => {
        console.log('registerHandler firstName ->' + firstName + " lastName -> " + lastName + " email -> " + email.value + " password -> " + password.value + " confirmPassword -> " + confirmPassword.value + " avatarFile -> " + avatarFile);

        let errors = [];

        if (!isNotEmptyString(firstName)) {
            errors.push('Please fill First Name');
        }

        if (!isNotEmptyString(lastName)) {
            errors.push('Please fill Last Name');
        }

        if (!isValidEmailFormat(email.value)) {
            errors.push('Please fill valid email');
        }

        if (!isPasswordMatchingConfirmed(password.value, confirmPassword.value)) {
            errors.push('Please verify and re-enter password');
        }

        if (errors.length) {
            console.log('registerHandler -> errors -> ' + errors.join(', '));
            setSnackBar({
                ...snackBar,
                message: errors.join('\n'),
                show: true
            });
        } else {
            console.log('registerHandler -> forwarding to POST registration');

            setShowProgress(true);

            const formData = new FormData();
            formData.append('first_name', firstName);
            formData.append('last_name', lastName);
            formData.append('email', email.value);
            formData.append('password', password.value);
            formData.append('avatar', avatarFile);
            axios.post('/service/api/user',
                formData,
                axiosConfig
            ).then((response) => {
                if (response.status === 201) {
                    console.log('registerHandler -> forwarding to POST Login');

                    const formData = new FormData();
                    formData.append('email', email.value);
                    formData.append('password', password.value);
                    axios.post('/service/api/user/login',
                        formData,
                        axiosConfig
                    ).then((response) => {
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
                            setSnackBar({
                                ...snackBar,
                                message: error.response.data.message,
                                show: true
                            });
                        }
                        props.onAuthorizationResponse(false);
                    }).then(() => {
                        setShowProgress(false);
                    });
                }
            }).catch((error) => {
                if (error.response) {
                    setSnackBar({
                        ...snackBar,
                        message: error.response.data.message,
                        show: true
                    });
                }
                setShowProgress(false);
            });
        }
    }

    return (
        <div>
            <Paper className={classes.root} elevation={3}>
                <Typography variant='h6'>
                    <Box fontWeight="fontWeightNormal">
                        Registration
                    </Box>
                </Typography>
                <Grid container direction={'column'} spacing={2}>
                    <Grid item>
                        <Box display='flex' justifyContent='center' alignItems="flex-end">
                            <Avatar alt="Profile Avatar" src={avatar} className={classes.avatar} />
                            <label htmlFor="upload-photo">
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="upload-photo"
                                    name="upload-photo"
                                    type="file"
                                    onChange={onAvatarChanged}
                                />
                                <Fab color="secondary" size="small" component="span" aria-label="add">
                                    <AttachFileIcon />
                                </Fab>
                            </label>
                        </Box>
                    </Grid>
                    <Grid item>
                        <TextField label='First Name' type='string' variant='outlined' fullWidth={true} required
                            onChange={(event) => setFirstName(event.target.value)} />
                    </Grid>
                    <Grid item>
                        <TextField label='Last Name' type='string' variant='outlined' fullWidth={true} required
                            onChange={(event) => setLastName(event.target.value)} />
                    </Grid>
                    <Grid item>
                        <TextField label='Email' type='email' variant='outlined' fullWidth={true} required
                            error={!email.valid} onChange={(event) => emailChangedHandler(event)} />
                    </Grid>
                    <Grid item>
                        <TextFieldPassword label={'Password'} labelWidth={80} password={password} onPasswordChange={handlePasswordChange} onShowPassword={handleShowPassword} />
                    </Grid>
                    <Grid item>
                        <TextFieldPassword label={'Confirm Password'} labelWidth={140} password={confirmPassword} onPasswordChange={handleConfirmPasswordChange} onShowPassword={handleShowConfirmPassword} />
                    </Grid>
                    <Grid item>
                        {showProgress &&
                            <LinearProgress color="secondary" />
                        }
                    </Grid>
                    <Grid item>
                        <Grid container direction={'row'} spacing={2}>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={registerHandler}>
                                    Register
                                </Button>
                            </Grid>
                            <Grid item>
                                <p>Already have an account?</p>
                            </Grid>
                            <Grid item>
                                <p>
                                    <Link color="secondary" href="#" onClick={loginHandler}>Login here</Link>
                                </p>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
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
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackBarClose}>
                            <CloseIcon />
                        </IconButton>
                    </React.Fragment>
                }
            />
        </div>
    );
}

export default RegistrationCard;