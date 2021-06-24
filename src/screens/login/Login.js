import React, { Component } from 'react';
import Header from '../../common/header/Header';
import { Card, CardContent, Typography, FormControl, Input, InputLabel, Button, FormHelperText } from '@material-ui/core';
import './Login.css';

class Login extends Component {

    constructor() {
        super();
        this.state = {
            username: "",
            usernameRequired: "dispNone",
            password: "",
            passwordRequired: "dispNone",
            incorrectUsernamePassword: "dispNone",
            loggedIn: sessionStorage.getItem('access-token') == null ? false : true
        }
    }

    navigateToHome = () => {
        this.props.history.push('/profile');
    }

    inputUsernameChangeHandler = (e) => {
        this.setState({ username: e.target.value })
    }

    inputPasswordChangeHandler = (e) => {
        this.setState({ password: e.target.value })
    }

    loginClickHandler = () => {
        this.setState({ incorrectUsernamePassword: "dispNone" });
        this.state.username === "" ? this.setState({ usernameRequired: "dispBlock" }) : this.setState({ usernameRequired: "dispNone" });
        this.state.password === "" ? this.setState({ passwordRequired: "dispBlock" }) : this.setState({ passwordRequired: "dispNone" });

        if (this.state.username === "" || this.state.password === "") { return }

        if (this.state.username === "admin" && this.state.password === "admin") {
            sessionStorage.setItem('username', 'admin');
            sessionStorage.setItem('access-token', 'IGQVJXdmFKaTAwRk53cU5TQXpFNVd0Y1ozbVd2SWJUUkZAwRDhyZAEFPVFctNUgyX3lTaEpIYlFGa2JRWEVaMGVCQkR3RzJVdDU3Y2h0dEFhSGJHYjJMVlluSFZABbTYxOTdjM2RHVlBzaXNKbkxZANlExMgZDZD');
            this.setState({ loggedIn: true });
            this.navigateToHome();
        } else {
            this.setState({ incorrectUsernamePassword: "dispBlock" });
        }
    }

    //IGQVJXdmFKaTAwRk53cU5TQXpFNVd0Y1ozbVd2SWJUUkZAwRDhyZAEFPVFctNUgyX3lTaEpIYlFGa2JRWEVaMGVCQkR3RzJVdDU3Y2h0dEFhSGJHYjJMVlluSFZABbTYxOTdjM2RHVlBzaXNKbkxZANlExMgZDZD

    render() {
        return (
            <div>
                <Header title="Image Viewer" />
                <div className="card-container">
                    <Card className="login-card">
                        <CardContent>
                            <Typography variant="h5"> LOGIN </Typography><br />
                            <FormControl required>
                                <InputLabel htmlFor="username">Username</InputLabel>
                                <Input type="text" id="username" username={this.state.username} onChange={this.inputUsernameChangeHandler}></Input>
                                <FormHelperText className={this.state.usernameRequired}>
                                    <span className="required-warning">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input type="password" id="password" password={this.state.password} onChange={this.inputPasswordChangeHandler}></Input>
                                <FormHelperText className={this.state.passwordRequired}>
                                    <span className="required-warning">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br /><br />
                            <div className={this.state.incorrectUsernamePassword}><span className="red"> Incorrect username and/or password </span></div><br />
                            <Button variant="contained" color="primary" onClick={this.loginClickHandler} >LOGIN</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }
}

export default Login;