import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, Box, Button, Grid, TextField, Avatar, Fab, LinearProgress, Snackbar } from '@material-ui/core';
import { MenuItem, Chip, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@material-ui/core';

import AttachFileIcon from '@material-ui/icons/AttachFile';
import AddBoxIcon from '@material-ui/icons/AddBox';
import CloseIcon from '@material-ui/icons/Close';

import { isValidStringFormat } from '../../utility/Utility';
import { mockProjectTypes } from '../../store/Mock';
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

const useChipStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        margin: 0,
    },
    textField: {
        width: '25ch',
    },
    chip: {
        margin: theme.spacing(0.5),
    },
}));

function CreateProjectCard() {

    useEffect(() => {
        setShowProgress(true);
        axios.get('/service/api/project/types',
            axiosAuthConfig
        ).then(response => {
            setProjectTypes(response.data.message);
            setShowProgress(false);
        }).catch(error => {
            setShowProgress(false);
            console.log(`GET Project Types Error Response -> ${error}`);
        });
    }, []);

    const classes = useStyles();
    const chipClasses = useChipStyles();
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

    const [projectLogo, setProjectLogo] = useState('');
    const [projectLogoFile, setProjectLogoFile] = useState(null);

    const onProjectLogoChanged = (event) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setProjectLogo(reader.result);
            }, false);
            reader.readAsDataURL(event.target.files[0]);
            setProjectLogoFile(event.target.files[0]);
        }
    };

    const [projectTypes, setProjectTypes] = useState(mockProjectTypes);

    const [projectType, setProjectType] = useState(mockProjectTypes[0].name);

    const projectTypeHandler = (event) => {
        setProjectType(event.target.value);
    }

    const [projectName, setProjectName] = useState({
        value: '',
        valid: true
    });

    const projectNameChangedHandler = (event) => {
        setProjectName({
            ...projectName,
            value: event.target.value,
            valid: isValidStringFormat(event.target.value, 3, 30)
        });
    };

    const [chipData, setChipData] = useState([]);

    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    };

    const [projectClass, setProjectClass] = useState({
        value: '',
        valid: true,
        isAdd: false
    });

    const handleChangeAddProjectClass = () => (event) => {
        const isValid = isValidStringFormat(event.target.value, 2, 30);
        var isDuplicate = false;
        for (var i = 0; i < chipData.length; i++) {
            if (chipData[i].label === event.target.value) {
                isDuplicate = true;
                break;
            }
        }
        setProjectClass({
            ...projectClass,
            value: event.target.value,
            valid: isValid && !isDuplicate,
            isAdd: isValid && !isDuplicate
        });
    };

    const handleClickAddProjectClass = () => {
        setChipData([...chipData, { key: chipData.length, label: projectClass.value }]);
        setProjectClass({
            ...projectClass,
            value: '',
            valid: true,
            isAdd: false
        });
    };

    const handleMouseDownAddProjectClass = (event) => {
        event.preventDefault();
    };

    const [projectDescription, setProjectDescription] = useState({
        value: '',
        valid: true
    });

    const projectDescriptionChangedHandler = (event) => {
        setProjectDescription({
            ...projectDescription,
            value: event.target.value,
            valid: isValidStringFormat(event.target.value, 5, 100)
        });
    };

    const handleDashboardNavigation = () => {
        history.push('/dashboard');
    }

    const handleCreateProject = () => {
        console.log('handleCreateProject projectType -> ' + projectType + ' projectName -> ' + projectName.value + ' projectDescription -> ' + projectDescription.value + ' projectLogoFile -> ' + projectLogoFile + ' chipData length -> ' + chipData.length);

        let errors = [];

        if (!isValidStringFormat(projectName.value, 3, 30)) {
            errors.push('Please fill valid project name');
        }

        if (!chipData.length) {
            errors.push('Please add few project classes');
        }

        if (!isValidStringFormat(projectDescription.value, 5, 100)) {
            errors.push('Please fill valid projectDescription');
        }

        if (errors.length) {
            setSnackBar({
                ...snackBar,
                message: errors.join(', '),
                show: true
            });
        } else {
            console.log('handleCreateProject -> forwarding to POST create project');

            setShowProgress(true);

            const formData = new FormData();
            formData.append('avatar', projectLogoFile);
            formData.append('type', projectType);
            formData.append('name', projectName.value);
            formData.append('description', projectDescription.value);
            for (var i = 0; i < chipData.length; i++) {
                formData.append('classes', chipData[i].label);
            }
            axios.post('/service/api/project/create',
                formData,
                axiosAuthConfig
            ).then((response) => {
                if (response.data) {
                    console.log('handleCreateProject -> axios response.data -> ' + JSON.stringify(response.data) + ' status -> ' + response.status);
                    setSnackBar({
                        ...snackBar,
                        message: response.data.message,
                        show: true
                    });
                } else {
                    console.log('handleCreateProject -> axios response -> ' + JSON.stringify(response.toJSON()) + ' status -> ' + response.status);
                }
                if (response.status === 201) {
                    handleDashboardNavigation();
                }
            }).catch((error) => {
                if (error.response) {
                    console.log('handleCreateProject -> axios error.response.data -> ' + JSON.stringify(error.response));
                    setSnackBar({
                        ...snackBar,
                        message: error.response.data.message,
                        show: true
                    });
                } else {
                    console.log('handleCreateProject -> axios error -> ' + JSON.stringify(error.toJSON()));
                }
            }).then(() => {
                setShowProgress(false);
            });
        }
    };

    return (
        <div style={{ width: '50%' }}>
            <Paper className={classes.root} elevation={3}>
                <Box marginBottom={3}>
                    <Typography variant='h6'>
                        <Box fontWeight='fontWeightNormal'>
                            Create a project
                        </Box>
                    </Typography>
                </Box>
                <Grid container direction={'column'} spacing={2}>
                    <Grid item>
                        <Box display='flex' justifyContent='center' alignItems="flex-end">
                            <Avatar alt="Project Logo" src={projectLogo} className={classes.avatar}>Logo</Avatar>
                            <label htmlFor="upload-photo">
                                <input accept="image/*" style={{ display: 'none' }} id="upload-photo" name="upload-photo" type="file" onChange={onProjectLogoChanged} />
                                <Fab color="secondary" size="small" component="span" aria-label="add">
                                    <AttachFileIcon />
                                </Fab>
                            </label>
                        </Box>
                    </Grid>
                    <Grid item>
                        <TextField label='Project Type' value={projectType} variant='outlined' onChange={projectTypeHandler} select fullWidth required>
                            {projectTypes.map((type) => (
                                <MenuItem key={type.key} value={type.name}>{type.name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item>
                        <TextField label='Project Name' variant='outlined' error={!projectName.valid} onChange={(event) => projectNameChangedHandler(event)} fullWidth required />
                    </Grid>
                    <Grid item>
                        <FormControl className={clsx(classes.margin, classes.textField)} variant='outlined' fullWidth required >
                            <InputLabel htmlFor='classes'>Classes</InputLabel>
                            <OutlinedInput
                                value={projectClass.value}
                                error={!projectClass.valid}
                                onChange={handleChangeAddProjectClass('classes')}
                                endAdornment={
                                    <InputAdornment position='end'>
                                        <IconButton color='primary' edge='end' disabled={!projectClass.isAdd} onClick={handleClickAddProjectClass} onMouseDown={handleMouseDownAddProjectClass}>
                                            <AddBoxIcon fontSize='large' />
                                        </IconButton>
                                    </InputAdornment>
                                }
                                labelWidth={70}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item>
                        {(chipData.length !== 0) &&
                            <Paper component='ul' className={chipClasses.root}>
                                {chipData.map((data) => {
                                    return (
                                        <li key={data.key}>
                                            <Chip variant='outlined' color='secondary' label={data.label} onDelete={handleDelete(data)} className={chipClasses.chip} />
                                        </li>
                                    );
                                })}
                            </Paper>
                        }
                    </Grid>
                    <Grid item>
                        <TextField label='Description' variant='outlined' multiline rows={3} error={!projectDescription.valid} onChange={(event) => projectDescriptionChangedHandler(event)} fullWidth required />
                    </Grid>
                    <Grid item>
                        {showProgress &&
                            <LinearProgress color='secondary' />
                        }
                    </Grid>
                    <Grid item>
                        <Box display='flex'>
                            <Box flexGrow={1}></Box>
                            <Box><Button onClick={handleDashboardNavigation} color='primary' variant='contained'>Cancel</Button></Box>
                            <Box marginLeft={2}><Button onClick={handleCreateProject} color='primary' variant='contained'>Create</Button></Box>
                        </Box>
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
                        <IconButton size='small' aria-label='close' color='inherit' onClick={handleSnackBarClose}>
                            <CloseIcon />
                        </IconButton>
                    </React.Fragment>
                }
            />
        </div>
    );
}

export default CreateProjectCard;
