import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, Box, Button, IconButton, TextField, LinearProgress, Snackbar } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

import ProjectTable from '../list/ProjectTable';
import { axiosAuthConfig } from '../../config/Axios';
import { mockProjects } from '../../store/Mock';

const axios = require('axios');

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
    },
    media: {
        height: 120,
    },
}));

function DashboardCard() {

    useEffect(() => {
        setShowProgress(true);
        axios.get('/service/api/projects',
            axiosAuthConfig
        ).then(response => {
            setProjects(response.data.message);
            setShowProgress(false);
        }).catch(error => {
            setShowProgress(false);
            console.log(`GET Projects Error Response -> ${error}`);
        });
    }, []);

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

    const handleCreateProjectNavigation = () => {
        history.push('/createProject')
    };

    const [projects, setProjects] = useState(mockProjects);

    const handleSearchTextChanged = (event) => {
        setProjects(filterProjects(mockProjects, event.target.value));
    };

    const filterProjects = (projects, searchText) => {
        searchText = searchText.toLowerCase();
        return projects.filter((project) => {
            return Object.keys(project)
                .some((key) => {
                    return typeof project[key] === 'string' && project[key].toLowerCase().indexOf(searchText) !== -1;
                });
        });
    };

    const handleProjectsRowClick = (projectId) => {
        console.log('Projects Row clicked projectId ' + projectId);
    };

    return (
        <div style={{ width: '75%' }}>
            <Paper className={classes.root} elevation={3}>
                <Box display='flex' p={1}>
                    <Box p={1} flexGrow={1}>
                        <TextField id="outlined-search" label="Search Projects" type="search" variant="outlined" onChange={(event) => handleSearchTextChanged(event)} />
                    </Box>
                    <Box p={1}>
                        <Button variant='contained' color='primary' size='large' onClick={handleCreateProjectNavigation}>
                            Create Project
                        </Button>
                    </Box>
                </Box>
                {showProgress &&
                    <LinearProgress color='secondary' />
                }
            </Paper>
            <br /><br />
            {(projects.length === 0)
                ?
                <Paper className={classes.root} elevation={3}>
                    <Typography component='p'>
                        You have no projects yet. To start your first project click the button above.
                    </Typography>
                </Paper>
                :
                <ProjectTable projects={projects} onProjectsRowClick={handleProjectsRowClick} />
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

export default DashboardCard;
