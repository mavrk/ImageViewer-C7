import React, { Component } from "react";

class Home extends Component {
    constructor(props) {
        super(props);
        if (sessionStorage.getItem('access-token') == null) {
            props.history.replace('/');
        }

        this.state = {
            profilePicture: null,
            
        }
    }

    render() {
        return (
            <div>You are in home</div>
        );
    }
}

export default Home;