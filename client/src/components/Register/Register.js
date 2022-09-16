import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';


class Register extends Component {
    constructor(props){
        super(props);

        this.state = {
            username:"",
            password: "",
        };

        this.handleChange = this.handleChange.bind(this);
        this.sendRegister = this.sendRegister.bind(this);
    }

    componentDidMount(){
        this.props.openRegisterPage();
    }

    sendRegister(event){
        event.preventDefault();
        this.props.openRegisterPage();
        this.props.registerNewUser({
            username: this.state.username,
            password: this.state.password,
        });
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    redirectUrl(){
        if(this.props.register.redirectUrl){
            return (<div><a href={this.props.register.redirectUrl}>click here to login</a></div>);
        }
        return (<div></div>);
    }

    render(){
        try{
            return (
                <div>
                <h1>Register new account</h1>
                    <form>
                        <section>
                            <label htmlFor="username">Username</label>
                            <input id="username" name="username" type="text" autoComplete="username" required autoFocus onChange={this.handleChange}/>
                        </section>
                        <section>
                            <label htmlFor="current-password">Password</label>
                            <input id="current-password" name="password" type="password" autoComplete="current-password" required onChange={this.handleChange}/>
                        </section>
                        <button type="submit" onClick={this.sendRegister}>Register</button>
                    </form>
                    <div>{this.props.register.message}</div>
                    <div>{this.redirectUrl()}</div>
                </div>
            );
        }
        catch(err){
            console.error(err);
            return(<div> error </div>);
        }
    }
}

function mapStateToProps({ register }) {
    return { register };
}

export default connect(mapStateToProps, actions)(Register);