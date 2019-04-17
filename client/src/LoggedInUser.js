import React, { Component } from 'react';

class LoggedInUser extends Component{
    constructor(props) {
        super(props);
        this.state={
            isLoggedIn:false,
        };
    }


    render(){
        if(!this.props.isLoggedIn){
            return(<div>
                <h1>NOT LOGGED IN!!!</h1>
            </div>);
        }

        else {
            return (
                <div>
                    <h1>Test</h1>
                </div>
            );
        }
    }
}

export default LoggedInUser;