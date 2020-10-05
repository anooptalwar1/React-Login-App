import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, TextField, Grid, Avatar, Fab, Button, Link, Box, LinearProgress, IconButton, Snackbar } from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CloseIcon from '@material-ui/icons/Close';

import TextFieldPassword from '../common/TextFieldPassword';
import { isNotEmptyString, isValidPasswordFormat, isPasswordMatchingConfirmed, buildImageUrl, saveUserDetails } from '../../utility/Utility';
import { axiosAuthConfig } from '../../config/Axios';

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

function ProfileCard() {

  useEffect(() => {
    setShowProgress(true);
    axios.get('/service/api/user',
      axiosAuthConfig
    ).then(response => {
      setFirstName(response.data.first_name);
      setLastName(response.data.last_name);
      setEmail(response.data.email);
      setAvatar(buildImageUrl(response.data.avatar));

      saveUserDetails(response.data);
      setShowProgress(false);
    }).catch(error => {
      setShowProgress(false);
      console.log(`GET User Error Response -> ${error}`);
    });
  }, []);

  const classes = useStyles();

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
      console.log('onAvatarChanged avatarFile -> ' + avatarFile)
    }
  };

  const [firstName, setFirstName] = useState('');

  const [lastName, setLastName] = useState('');

  const [email, setEmail] = useState('');

  const [changePassword, setChangePassword] = useState(false);

  const changePasswordCloseHandler = () => {
    setChangePassword(false);
  };

  const changePasswordOpenHandler = () => {
    setChangePassword(true);
  }

  const [oldPassword, setOldPassword] = useState({
    value: '',
    valid: true,
    show: false,
  });

  const handleOldPasswordChange = (event) => {
    setOldPassword({
      ...oldPassword,
      value: event.target.value,
      valid: isValidPasswordFormat(event.target.value)
    });
  };

  const handleShowOldPassword = () => {
    setOldPassword({
      ...oldPassword,
      show: !oldPassword.show
    });
  };

  const [newPassword, setNewPassword] = useState({
    value: '',
    valid: true,
    show: false,
  });

  const handleNewPasswordChange = (event) => {
    setNewPassword({
      ...newPassword,
      value: event.target.value,
      valid: isValidPasswordFormat(event.target.value)
    });
  };

  const handleShowNewPassword = () => {
    setNewPassword({
      ...newPassword,
      show: !newPassword.show
    });
  };

  const [confirmNewPassword, setConfirmNewPassword] = useState({
    value: '',
    valid: true,
    show: false,
  });

  const handleConfirmNewPasswordChange = (event) => {
    setConfirmNewPassword({
      ...confirmNewPassword,
      value: event.target.value,
      valid: isPasswordMatchingConfirmed(event.target.value, newPassword.value)
    });
  };

  const handleShowConfirmNewPassword = () => {
    setConfirmNewPassword({
      ...confirmNewPassword,
      show: !confirmNewPassword.show
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

  const saveProfileHandler = () => {
    console.log('userDetails firstName ->' + firstName + " lastName -> " + lastName + " avatarFile -> " + avatarFile);

    let errors = [];

    if (!isNotEmptyString(firstName)) {
      errors.push('Please fill First Name');
    }

    if (!isNotEmptyString(lastName)) {
      errors.push('Please fill Last Name');
    }



    if (errors.length) {
      console.log('userDetails -> errors -> ' + errors.join(', '));
      setSnackBar({
        ...snackBar, 
          message: errors.join('\n'),
          show: true
        
      });
    } else {
      console.log('userDetails -> forwarding to PATCH Details');

      setShowProgress(true);

      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      axios.patch('/service/api/user/details',
        formData,
      axiosAuthConfig
      ).then((response) => {
        if (response.status === 200) {
          console.log(response.data.message)
          setShowProgress(false) 
          formData.append('avatar', avatarFile);
          axios.patch('/service/api/user/details',
            formData,
            axiosAuthConfig
          ).then((response) => {
            if (response.status === 200)
            console.log(response.data.message)
          }).catch((error) => {
            if (error.response) {
              console.log('avatarDetails -> axios error.response.data -> ' + JSON.stringify(error.response));
              setSnackBar({
                ...snackBar, 
                  message: error.response.data.message,
                  show: true
              });
            }
          }
    
          )           
        }
      }).catch((error) => {
        if (error.response) {
          console.log('userDetails -> axios error.response.data -> ' + JSON.stringify(error.response));
          setSnackBar({
            ...snackBar, 
              message: error.response.data.message,
              show: true
          });
        }
      }

      )
    }
  }

  const changePasswordHandler = () => {
    console.log('passwordDetails oldPassword ->' + oldPassword.value + " newPassword -> " + newPassword.value + " confirmNewPassword -> " + confirmNewPassword.value);

    let errors = [];


    if (!isPasswordMatchingConfirmed(newPassword.value, confirmNewPassword.value)) {
      errors.push('Please verify and re-enter password');
    }

    if (errors.length) {
      console.log('passwordDetails -> errors -> ' + errors.join(', '));
      setSnackBar({
        ...snackBar,
          message: errors.join('\n'),
          show: true
      });
    } else {
      console.log('passwordDetails -> forwarding to PATCH password Details');

      setShowProgress(true);

      const formData = new FormData();
      formData.append('old_password', oldPassword.value);
      formData.append('password', newPassword.value);
      axios.patch('/service/api/user/password',
        formData,
        axiosAuthConfig
      ).then((response) => {
        if (response.status === 200) {
          setSnackBar({
            ...snackBar, 
              message: response.data.message,
              show: true
          });
          // console.log('passwordDetails -> forwarding to PATCH Details');
          console.log(response.data.message)
          setShowProgress(false);
          setChangePassword(false);
          // message(response.data.message);      
        }
      }).catch((error) => {
        if (error.response) {
          console.log('passwordDetails -> axios error.response.data -> ' + JSON.stringify(error.response));
          setSnackBar({
            ...snackBar, 
              message: error.response.data.message,
              show: true
          });
        }
      }

      )
    }
  }

  return (
    <div style={{ minWidth: '35%' }}>
      <Dialog open={changePassword} onClose={changePasswordCloseHandler} fullWidth>
        <DialogTitle>
          <Typography variant='h6'>
            <Box fontWeight='fontWeightNormal'>
              Change Password
            </Box>
          </Typography>
        </DialogTitle>
        <br />
        <DialogContent>
          <Grid container direction={'column'} spacing={2}>
            <Grid item>
              <TextFieldPassword label={'Old Password'} labelWidth={110} password={oldPassword} onPasswordChange={handleOldPasswordChange} onShowPassword={handleShowOldPassword} />
            </Grid>
            <Grid item>
              <TextFieldPassword label={'New Password'} labelWidth={110} password={newPassword} onPasswordChange={handleNewPasswordChange} onShowPassword={handleShowNewPassword} />
            </Grid>
            <Grid item>
              <TextFieldPassword label={'Confirm New Password'} labelWidth={180} password={confirmNewPassword} onPasswordChange={handleConfirmNewPasswordChange} onShowPassword={handleShowConfirmNewPassword} />
            </Grid>
          </Grid>
        </DialogContent>
        <br />
        <DialogActions>
          <Button onClick={changePasswordCloseHandler} color='primary' variant='contained'>Cancel</Button>
          <Button onClick={changePasswordHandler} color='primary' variant='contained'>Change</Button>
        </DialogActions>
      </Dialog>
      <Paper className={classes.root} elevation={3}>
        <Typography variant='h6'>
          <Box fontWeight="fontWeightNormal">
            Profile
          </Box>
        </Typography>
        <br />
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
            <br />
          </Grid>
          <Grid item>
            <TextField label='First Name' type='string' variant='outlined' fullWidth={true} required
              onChange={(event) => setFirstName(event.target.value)} value={firstName} />
          </Grid>
          <Grid item>
            <TextField label='Last Name' type='string' variant='outlined' fullWidth={true} required
              onChange={(event) => setLastName(event.target.value)} value={lastName} />
          </Grid>
          <Grid item>
            <TextField label='Email' type='email' variant='outlined' fullWidth={true} value={email} InputProps={{ readOnly: true, }} disabled />
          </Grid>
          <Grid item>
            <TextField label='Password' type='password' variant='outlined' fullWidth={true} defaultValue="Hello World" disabled />
            <Box display='flex' justifyContent='flex-end' marginTop={1}>
              <Link color="secondary" href="#" onClick={changePasswordOpenHandler}>Change Password</Link>
            </Box>
          </Grid>
          <Grid item>
            {showProgress &&
              <LinearProgress color="secondary" />
            }
          </Grid>
          <Grid item>
            <Grid container direction={'row'} spacing={2}>
              <Grid item>
                <Button variant="contained" color="primary" size="large" onClick={saveProfileHandler}>Save</Button>
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

export default ProfileCard;