import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton } from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover'; 

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    linkTo: '/',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    linkTo: '/app/profile',
  },
  // {
  //   label: 'Settings',
  //   icon: 'eva:settings-2-fill',
  //   linkTo: '',
  // },
];

// ----------------------------------------------------------------------

export default class AccountPopover extends React.Component {
  constructor(){
    super();
    this.state = {
      anchorRef: null,
      open: false,
      userDetail: null
    }

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen(event){
    this.setState({open:true, anchorEl: event.currentTarget})
  }

  handleClose(){
    this.setState({open:false})
  }

  logout(){
    window.localStorage.clear();
    window.location.reload();
  }

  componentDidMount(){

    var userstr = window.localStorage.getItem('userdetail');
    if(userstr !== '' && userstr !== undefined){
      var details = JSON.parse(userstr);
      this.setState({userDetail:  details})
    }
  }

  render(){
    return (
      <>
        <IconButton
          ref={this.state.anchorRef}
          onClick={this.handleOpen}
          sx={{
            p: 0,
            ...(this.state.open && {
              '&:before': {
                zIndex: 1,
                content: "''",
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                position: 'absolute',
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
              },
            }),
          }}
        >
          <Avatar src={'/static/icons/avataricon.png'} alt="photoURL" />
        </IconButton>

        {this.state.userDetail !== null && <MenuPopover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onClose={this.handleClose}
          sx={{
            p: 0,
            mt: 1.5,
            ml: 0.75,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          }}
        >
          <Box sx={{ my: 1.5, px: 2.5 }}>
            <Typography variant="subtitle2" noWrap>
              {this.state.userDetail.firstName+" "+this.state.userDetail.lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {this.state.userDetail.email}
            </Typography>
          </Box>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack sx={{ p: 1 }}>
            {MENU_OPTIONS.map((option) => (
              <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={this.state.handleClose}>
                {option.label}
              </MenuItem>
            ))}
          </Stack>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem onClick={()=>this.logout()} sx={{ m: 1 }}>
            Logout
          </MenuItem>
        </MenuPopover> }
      </>
    );
  }
}
