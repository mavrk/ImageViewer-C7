import React,{Component} from 'react';
import Header from '../../common/header/Header';
import {Card, CardContent, Typography, FormControl, Input, InputLabel, Button} from '@material-ui/core';
import './Login.css';

class Login extends Component{
  render(){
      return(
            <div>
                <Header title="Image Viewer"/>
                <div className="card-container">
                    <Card className="login-card">
                        <CardContent>
                            <Typography variant="headline" component="h2"> LOGIN </Typography><br/>
                            <FormControl>
                                <InputLabel htmlFor="username">Username</InputLabel>
                                <Input id="username" type="text"></Input>
                            </FormControl> 
                            <br /><br />
                            <FormControl>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input id="password" type="password"></Input>
                            </FormControl>
                            <br /><br /><br />
                            <Button variant="contained" color="primary">LOGIN</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
      )
  }
}

export default Login;