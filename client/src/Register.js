import React, { Component } from 'react';

class Register extends Component{
    constructor(props) {
        super(props);
        this.state={
            data:[],
        };
    }
    submitForm=(e)=>{
        e.preventDefault();
        fetch('/users/newuser',{
            method: "POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
              username: e.target.username.value,
              password: e.target.password.value,
            })
        })

            .then(data=>{return data.text()})
    };



    render(){
        return(
            <div>
                <h1>New Account</h1>
                <form onSubmit={this.submitForm}>
                    <p>
                        <input type="text" name='username' placeholder='Username'/>
                    </p>
                    <p>
                        <input type="password" name='password' placeholder='Password'/>
                    </p>
                    <p>
                        <input type="submit" value='CREATE'/>
                    </p>
                </form>
            </div>
        );
    }
}

export default Register;