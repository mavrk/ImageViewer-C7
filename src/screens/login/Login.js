import React,{Component} from 'react';
import Header from '../../common/header/Header';
import {Card, CardContent, Typography, FormControl, Input, InputLabel, Button, FormHelperText} from '@material-ui/core';
import './Login.css';

class Login extends Component{
    
    constructor() {
        super();
        this.state = { 
          username: "",
          usernameRequired: "dispNone",
          password: "",
          passwordRequired: "dispNone",
        }
    }

    inputUsernameChangeHandler = (event) => {
       this.setState({username:event.target.value});
    }
    
    inputPasswordChangeHandler = (event) => {
        this.setState({password:event.target.value});
    }

    loginClickHandler = () => {
        this.state.username === "" ? this.setState({ usernameRequired: "dispBlock" }) : this.setState({ usernameRequired: "dispNone" });
        this.state.password === "" ? this.setState({passwordRequired: "dispBlock" }) : this.setState({ passwordRequired: "dispNone" });
    }

    render(){
        return(
            <div>
                <Header title="Image Viewer"/>
                <div className = "card-container">
                    <Card className = "login-card">
                        <CardContent>
                            <Typography variant="h5"> LOGIN </Typography><br/>
                            <FormControl required>
                                <InputLabel htmlFor="username">Username</InputLabel>
                                <Input type = "text" id = "username" username = {this.state.username} onChange = {this.inputUsernameChangeHandler}></Input>
                                <FormHelperText  className = {this.state.usernameRequired}>
                                    <span className = "required-warning">required</span>    
                                </FormHelperText>
                            </FormControl> 
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input type = "password" id = "password" password = {this.state.password} onChange = {this.inputPasswordChangeHandler}></Input>
                                <FormHelperText className = {this.state.passwordRequired}>
                                    <span className = "required-warning">required</span>    
                                </FormHelperText>
                            </FormControl>
                            <br /><br /><br />
                            <Button variant="contained" color="primary" onClick = {this.loginClickHandler} >LOGIN</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }
}

export default Login;