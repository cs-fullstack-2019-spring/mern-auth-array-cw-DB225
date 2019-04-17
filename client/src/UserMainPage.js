import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import Register from "./Register";
import LogOut from "./LogOut";
import LoggedInUser from "./LoggedInUser";
import LogIn from "./LogIn";

class UserMainPage extends Component{
    constructor(props) {
        super(props);
        this.state ={
            infoUser:{
                isLoggedIn:false,
                username:null,
            }
        };
    }

    loggedInUserInfo = (loggedIn,username)=>{
        this.setState({
            isLoggedIn: loggedIn,
            username: username
        })

};
    userLoggedIn = (username, loggedIn) =>{
        this.setState({
            infoUser:{
                username: username,
                isloggedIn: loggedIn,
            }
        })
    };

    logOut = ()=>{
        this.setState({
            isLoggedIn:false,
            username:null,
        });
        fetch('/users/logout')
            .then(data=>{return data.text()})
            .then(() => this.userLoggedIn(undefined, false))
    };


    render(){
        return(
            <div>
                <h1>Didier App</h1>
                <Router>
                    <Link to='/'>HOME</Link>
                    <Link to='/logIn'>SIGN IN</Link>
                    <Link to='/newuser'>REGISTER</Link>
                    <Link to='/logout' onClick={this.logOut}>LOG OUT</Link>
                    <Route exact path='/' component={()=><LoggedInUser infoUser={this.state.infoUser} userLoggedIn={this.userLoggedIn}/>} />
                    <Route path='/login' component={()=><LogIn infoUser={this.state.infoUser} userLoggedIn={this.userLoggedIn}/>}  />
                    <Route path='/newuser' component={()=><Register isLoggedIn={this.state.isLoggedIn} username={this.state.username} loggedInUserInfo={this.state.loggedInUserInfo}/>}/>
                    <Route path='/logout' component={()=><LogOut />}/>
                </Router>
            </div>
        );
    }
}

export default UserMainPage;