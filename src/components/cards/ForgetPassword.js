import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, TextField, Button, Box, Grid, Link } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
    },
}));

function ForgetPasswordCard() {
    const classes = useStyles();
    const history = useHistory();

    const loginHandler = () => {
        history.push('/login');
    }
    
    const resetPasswordHandler = () => {
        console.log('resetPasswordHandler()');
    }

    return (
        <div>
            <Paper className={classes.root} elevation={3}>
                <Typography variant='h6'>
                    <Box fontWeight="fontWeightNormal">
                        Forget your Password?
                        </Box>
                </Typography>
                <br />
                <br />
                <Typography component="p">
                    Enter the email you’ve registered with. We’ll send you the instructions there.
                </Typography>
                <br />
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth={true}
                    required />
                <br />
                <br />
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={resetPasswordHandler}>
                    RESET PASSWORD
                </Button>
                <br />
                <Grid container direction={'row'} spacing={1}>
                    <Grid item>
                        <p>Go back to the</p>
                    </Grid>
                    <Grid item>
                        <p><Link color="secondary" href="#" onClick={loginHandler}>Login page</Link></p>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}

export default ForgetPasswordCard;
