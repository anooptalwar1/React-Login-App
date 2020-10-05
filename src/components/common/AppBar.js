import React from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { fade, makeStyles } from '@material-ui/core/styles';
import { AppBar, Box, Toolbar, IconButton, Typography, Badge, MenuItem, Menu, Avatar } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DashboardIcon from '@material-ui/icons/Dashboard';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default function PrimarySearchAppBar(props) {
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleDashboardOptionClick = () => {
    history.push('/dashboard');
  }

  const handleProfileOptionClick = () => {
    handleMenuClose();
  }

  const handleLogoutOptionClick = () => {
    props.onLogoutIconClick();
    handleMenuClose();
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {props.authorize &&
        <MenuItem component={Link} to='/profile' onClick={handleProfileOptionClick}>Profile</MenuItem>
      }
      {props.authorize &&
        <MenuItem component={Link} onClick={handleLogoutOptionClick} to='/login'>Logout</MenuItem>
      }
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label='notification' color='inherit'>
          <Badge badgeContent={1} color='secondary'>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={props.onThemeIconClick}>
        <IconButton aria-label='dark mode' color='inherit'>
          {props.darkMode
            ?
            <Brightness5Icon />
            :
            <Brightness4Icon />
          }
        </IconButton>
        <p>Theme</p>
      </MenuItem>
      {props.authorize &&
        <MenuItem component={Link} onClick={handleDashboardOptionClick} to='/dashboard'>
          <IconButton aria-label='dashboard' aria-haspopup='true' color='inherit'>
            <DashboardIcon />
          </IconButton>
          <p>Dashboard</p>
        </MenuItem>
      }
      {props.authorize &&
        <MenuItem component={Link} onClick={handleProfileOptionClick} to='/profile'>
          <IconButton aria-label='profile' aria-haspopup='true' color='inherit'>
            {(localStorage.getItem('avatar'))
              ?
              <Avatar style={{ width: 25, height: 25 }} alt="Profile Avatar" src={localStorage.getItem('avatar')} />
              :
              <AccountCircle />
            }
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      }
      {props.authorize &&
        <MenuItem component={Link} onClick={handleLogoutOptionClick} to='/login'>
          <IconButton aria-label='logout' aria-haspopup='true' color='inherit'>
            <ExitToAppIcon />
          </IconButton>
          <p>Logout</p>
        </MenuItem>
      }
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position='static'>
        <Toolbar>
          <Typography className={classes.title} variant='h5' noWrap>
            <Box fontWeight='fontWeightBold'>
              Object Recognition TIM
            </Box>
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label='notification' color='inherit'>
              <Badge badgeContent={1} color='secondary'>
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton aria-label='dark mode' onClick={props.onThemeIconClick} color='inherit'>
              {props.darkMode
                ?
                <Brightness5Icon />
                :
                <Brightness4Icon />
              }
            </IconButton>
            {props.authorize &&
              <IconButton edge='end' aria-label='dashboard' aria-controls={menuId} onClick={handleDashboardOptionClick} color='inherit'>
                <DashboardIcon />
              </IconButton>
            }
            {props.authorize &&
              <IconButton edge='end' aria-label='profile' aria-controls={menuId} aria-haspopup='true' onClick={handleProfileMenuOpen} color='inherit'>
                {(localStorage.getItem('avatar'))
                  ?
                  <Avatar style={{ width: 30, height: 30 }} alt="Profile Avatar" src={localStorage.getItem('avatar')} />
                  :
                  <AccountCircle />
                }
              </IconButton>
            }
          </div>
          <div className={classes.sectionMobile}>
            <IconButton aria-label='more' aria-controls={mobileMenuId} aria-haspopup='true' onClick={handleMobileMenuOpen} color='inherit'>
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
