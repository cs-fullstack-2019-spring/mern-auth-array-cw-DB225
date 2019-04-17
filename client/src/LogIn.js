import React, { Component } from 'react';

class LogIn extends Component{
    constructor(props) {
        super(props);
        this.state={
            data:[],
        };
    }
    submitLoginForm=(e)=>{
        e.preventDefault();
        fetch('/users/login',
            {
                method: 'POST',
                headers:{
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: e.target.username.value,
                    password: e.target.password.value,
                }),
            })
            .then(data=>{ return data.text()})
            .then(data=>{if(data)
                return this.props.userLoggedIn(data, true);
            else
                return this.props.userLoggedIn(data, false)});
    };

    render(){
        return(
            <div>
                <h1>Log In</h1>
                <form onSubmit={this.submitLoginForm}>
                    <p>
                        <input type="text" name='username' placeholder="Enter username" autoFocus/>
                    </p>
                    <p>
                        <input type="password" name='password' placeholder="Enter password" />
                    </p>
                    <button>Sign In</button>
                </form>
                {this.state.data}
            </div>
        );
    }
}

export default LogIn;