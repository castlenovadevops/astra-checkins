import { styled } from '@mui/material/styles';
import {  Container, Typography } from '@mui/material'; 
import FormManager from '../../components/formComponents/FormManager';
import schema from './schema.json'; 
import { deviceDetect } from 'react-device-detect';
import TestComponent from './test';
const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    justifyContent: 'start',
  },
})); 

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
})); 
export default function SyncCode() { 
  var schemaObj = Object.assign({}, schema);
  schema.properties.push(
    {
      "component":"TextField", 
      "type": "hidden",
      "format":"stringnumeric",
      "minLength": 1,
      "maxLength": 6,
      "grid":9,
      "name":"deviceDetails",
      "label":"", 
      "value": deviceDetect(window.navigator.userAgent)
    }  )
  return (

    <RootStyle title="Business Registration | Astro POS">  
        <Container maxWidth="sm" style={{padding:0}}>
              <ContentStyle className="mobileminauto">               
                <Typography style={{padding:0}}>
                  <img alt="Astro POS" src="/static/icons/logo-450.png"  className='logoimg'
                                    style={{ objectFit: 'cover', maxWidth:'100%'}}/>
                </Typography> 
              </ContentStyle>
      </Container> 

    <Container maxWidth="sm">
      <ContentStyle className="mobileminautoform">  
      {/* <TestComponent /> */}
             <FormManager formProps={schemaObj} />   
      </ContentStyle>
    </Container>
  </RootStyle> 
  );
}
