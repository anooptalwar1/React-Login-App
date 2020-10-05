import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, Link } from '@material-ui/core';

import { getUserName } from '../../utility/Utility';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        width: '50%',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
}));

export default function WelcomeCard(props) {
    const classes = useStyles();

    return (
        <Paper className={classes.root} elevation={3}>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
                Welcome
            </Typography>
            <br/>
            <Typography variant="h5" component="h2">
                {getUserName()}
            </Typography>
            <br/>
            <Typography className={classes.pos} color="textSecondary">
                TIM - Object Recognition Portal
            </Typography>
            <br/><br/>
            <Typography variant="body2" component="p">
                Object perception capabilities are a key element in building robots able to develop useful tasks in generic, unprepared, human environments. Unfortunately, state of the art papers in computer vision do not evaluate the algorithms with the problems faced in mobile robotics.
            </Typography>
            <br/> <br/>
            <p>
                Expore More, Visit <Link color="secondary" href='#' onClick={props.onDashboardClicked}>Projects Dashboard</Link>
            </p>
        </Paper>
    );
}
