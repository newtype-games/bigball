import React, {Component} from 'react';

class Login extends Component {
    constructor(props){
        super(props);

        this.state = {};
    }

    componentDidMount(){
    }

    render(){
        try{
            return (
                <div>
                <h1>Login in</h1>
                    <form action="/login/password" method="post">
                        <section>
                            <label for="username">Username</label>
                            <input id="username" name="username" type="text" autocomplete="username" required autofocus/>
                        </section>
                        <section>
                            <label for="current-password">Password</label>
                            <input id="current-password" name="password" type="password" autocomplete="current-password" required/>
                        </section>
                        <button type="submit">Login in</button>
                    </form>
                </div>
            );
        }
        catch(err){
            return(<div> error </div>);
        }
    }
}

export default Login;
