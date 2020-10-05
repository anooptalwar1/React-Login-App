import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Table, Avatar, Box, Chip } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.color,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        margin: 0,
    },
    table: {
        minWidth: 700,
    },
    chip: {
        margin: theme.spacing(0.5),
    },
}));

export default function ProjectTable(props) {
    const classes = useStyles();

    return (
        <TableContainer component={Paper} elevation={3}>
            <Table className={classes.table} aria-label="table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">Logo</StyledTableCell>
                        <StyledTableCell>Project Name</StyledTableCell>
                        <StyledTableCell align="center">Classes</StyledTableCell>
                        <StyledTableCell align="center">Type</StyledTableCell>
                        <StyledTableCell align="center">Creation Time</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.projects.map((project) => (
                        <StyledTableRow key={project.id}  onClick={() => props.onProjectsRowClick(project.id)}>
                            <StyledTableCell component="th" scope="row">
                                <Avatar style={{ width: 120, height: 120 }} alt="Profile Avatar" src={project.logo} />
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                                {project.name}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                <Box component='ul' className={classes.root}>
                                    {project.classes.map((data) => {
                                        return (
                                            <li key={data.key}>
                                                <Chip variant='outlined' color='secondary' label={data.label} className={classes.chip} />
                                            </li>
                                        );
                                    })}
                                </Box>
                            </StyledTableCell>
                            <StyledTableCell align="right">{project.type}</StyledTableCell>
                            <StyledTableCell align="right">{project.createdDateTime}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
