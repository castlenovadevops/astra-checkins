import React from "react";
// mock 
import { Link as RouterLink } from 'react-router-dom';

import { Box, Link,   Typography, Avatar, FormControl, Select, MenuItem } from '@mui/material';
// components
import Logo from '../../components/Logo';
import LogoutOutlined from '@mui/icons-material/ExitToAppOutlined'
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
import { styled } from '@mui/material/styles';
//
// import navConfig from './NavConfig';
// component
import Iconify from '../../components/Iconify';
import HTTPManager from "../../utils/httpRequestManager";
import Loader from "../../components/Loader";
// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const AccountStyle = styled('div')(({ theme }) => ({
    display: 'flex', 
    flexDirection:'column',
    padding: theme.spacing(2, 1),
    borderRadius: Number(theme.shape.borderRadius) * 1.5,
    backgroundColor: theme.palette.grey[500_12],
  }));

export default class NavigationMenu extends React.Component{
  httpManager = new HTTPManager();
    constructor(){
        super();
        this.state = {
            userDetail : {},
            sideMenuItems : [],
            mercantsList:[],
            isLoading: false,
            reviewMerchantsList:[]
        }
    }

    componentDidMount(){ 
        var userstr = window.localStorage.getItem('userdetail');
        if(userstr !== '' && userstr !== undefined){
          var details = JSON.parse(userstr);
          this.setState({userDetail:  details}, ()=>{   
              let items = [ 
                  {
                      title: 'dashboard',
                      path: '/app',
                      icon: getIcon('mdi:tablet-dashboard'),
                  }, 
                  {
                      title: 'transactions',
                      path: '/app/transactions',
                      icon: getIcon('mdi:cash-fast'),
                  }, 
                  {
                      title: 'Batch Reports',
                      path: '/app/batchreports',
                      icon: getIcon('mdi:select-group'),
                  }, 
                  {
                      title: 'Appointments',
                      path: '/app/appointments',
                      icon: getIcon('mdi:calendar-edit'),
                  }, 
                  {
                    title: 'Employee',
                    path: '/app/employee',
                    icon: getIcon('mdi:account-cog'), 
                  },
                  {
                    title: 'Customer',
                    path: '/app/customer',
                    icon: getIcon('mdi:account-group')
                  },
                  {
                    title: 'Gift Cards',
                    path: '/app/giftcards',
                    icon: getIcon('mdi:gift')
                  },
                  {
                      title: 'Inventory', 
                      icon: getIcon('mdi:sitemap'),
                      children: [
                        {
                          title: 'Category',
                          path: '/app/category'
                        },
                        {
                          title: 'Products',
                          path: '/app/product'
                        },
                      ]
                  }, 
                  {
                    title: 'Settings',
                    icon: getIcon('mdi:cog'),
                    children: [ 
                        {
                          title: 'Default Commission Payment',
                          path: '/app/commissionpayment'   
                        },
                        {
                          title: 'Default Discount Division',
                          path: '/app/defaultdiscount'   
                        },
                        {
                          title: 'Discount',
                          path: '/app/discount'
                        },
                        {
                          title: 'Tax',
                          path: '/app/tax'   
                        },
                        {
                          title: 'Employee Specific Setting',
                          path: '/app/employeesetting'   
                        },
                        {
                          title: 'Printer Settings',
                          path: '/app/printers'   
                        },
                        {
                          title: 'Loyalty Points Setting',
                          path: '/app/loyaltypointsettings'   
                        },
                        // {
                        //   title: 'Loyalty Redeem Point Settings',
                        //   path: '/app/loyaltyredeemsettings'   
                        // }  ,
                        // {
                        //   title: 'Loyalty Program',
                        //   path: '/app/loyaltyactivatesettings'   
                        // }  
                      
                    ]
                },
                
                {
                  title: 'payout',
                  path: '/app/payout',
                  icon: getIcon('mdi:chart-arc'),
              }, 
              {
                title: 'report',
                path: '/app/report',
                icon: getIcon('mdi:file-chart'),
            },  
              {
                title: 'sync',
                path: '/syncData/progress',
                icon: getIcon('mdi:sync'),
            },
              ]
              this.setState({sideMenuItems: items}); 

          })
        }
    }
 
    render(){
        return  <Scrollbar
          sx={{
            height: 1,
            '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
          }}
        >
          {this.state.isLoading && <Loader />}
          {/* <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
            <Logo height={70}/>
          </Box> */}
    
          <Box sx={{ mb: 5, mx: 2.5, mt:2 }}>
            <Link underline="none" component={RouterLink} to="#">
              <AccountStyle>
                <div style={{display:'flex', alignItems:'center'}}>
                <Avatar src={'/static/icons/avataricon.png'} style={{maxHeight:'40px'}} alt="photoURL" />
                <Box sx={{ ml: 2, width:'70%' }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                    {this.state.userDetail.mEmployeeFirstName+" "+this.state.userDetail.mEmployeeLastName}
                  </Typography> 

                </Box>
                  <Typography   sx={{ color: 'text.primary', fontSize:'12px' }}>
                    <img src={'/static/icons/logout.png'} alt="Logout" style={{maxHeight:'40px'}} />
                  </Typography> 
                </div>  
                <div style={{display:'flex', alignItems:'center'}}>
                  <Typography   sx={{ color: 'text.primary', fontSize:'12px' }}>
                    Version - Development
                  </Typography> 
                </div>
              </AccountStyle>
            </Link>
          </Box>
    
          <NavSection navConfig={this.state.sideMenuItems}/>
    
          <Box sx={{ flexGrow: 1 }} /> 
        </Scrollbar>
    }

}