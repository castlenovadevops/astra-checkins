import { Outlet } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles'; 

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 64;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%', 
  paddingBottom: theme.spacing(7.5),
  [theme.breakpoints.up('lg')]: {
    // paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: 0,//theme.spacing(2),
    paddingRight:0// theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function TicketLayout() { 

  return (
    <RootStyle> 
      <MainStyle>
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
