import React from 'react';
import { useEffect, useState } from "react";
import {inject, observer} from 'mobx-react';


import Checkbox from  '../../components/checkbox/checkbox.jsx';

import './Login.scss';



const ENTER_KEY = 13;



// let LoginForm = ({}) => {

//     useEffect(() => {
//         this.input_username.focus();    
//     }, []);

//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");

//     return (

//     );

// };



class LoginForm extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            remember: false
        };
    }


    componentDidMount() {
        this.input_username.focus();
    }


    handleKeyDown(event) {
        if (event.which === ENTER_KEY) {
            if (event.target === this.input_username) {
                this.input_password.focus();
            }
            if (event.target === this.input_password) {
                this.handleLoginClick();
            }
            
		}
    }
    

    handleChange(key, value) {
        this.setState({
            [key]: value
        });
    }


    handleInputTextChange(event) {
        const key = event.target.name;
        const value = event.target.value;
        this.setState({
            [key]: value
        });
    }


    handleLoginClick() {
        const { appstore } = this.props;
        const { firebaseStore, authStore, routerStore } = appstore;

        const username = this.state.username;
        const password = this.state.password;
        const remember = this.state.remember;

        // authStore.login(username, password, remember);
        firebaseStore.login(username, password);
        routerStore.execChangePath("/home");

    }
    
    // handlePasswordChangeViewClick() {
    //     const { appstore } = this.props;
    //     const { api, routerStore, uiStore} = appstore;
    //     routerStore.changePath("/resetpassword");
    // }


    render() {
        
        const {appstore} = this.props;
        const { languageStore, routerStore, uiStore } = appstore;

        return (
            <div className="login_form">

                {/* <h2>{languageStore.translate("LoginView.signin", "Accedi")}</h2> */}
                <h2> Accedi </h2>

                <div className="box_input">
                    <input 
                        className="ts_inputtext" 
                        // className="ts_inputtext2" 
                        ref={el => this.input_username = el}
                        type="text" 
                        name="username"
                        placeholder="Username"
                        value={this.state.username} 
                        onChange={ (e) => this.handleInputTextChange(e)}
                        onKeyDown={ (e) => this.handleKeyDown(e)}
                        required
                    />
                    {/* <label className="ts_inputtext2_label" alt="Username" placeholder="Username"></label> */}
                </div>


                <div className="box_input">
                    <input 
                        className="ts_inputtext"
                        // className="ts_inputtext2"
                        ref={el => this.input_password = el}
                        type="password" 
                        name="password"
                        placeholder="Password"
                        value={this.state.password} 
                        onChange={ (e) => this.handleInputTextChange(e)}
                        onKeyDown={ (e) => this.handleKeyDown(e)}
                        required                        
                    />
                    {/* <label className="ts_inputtext2_label" alt="Password" placeholder="Password"></label> */}

                </div>


                {/* <div className="checkbox_line">
                    <Checkbox
                        checked={this.state.remember} 
                        field="remember"
                        handleChange={this.handleChange.bind(this)} 
                        stateField="saveLogin"
                    />

                    <p>
                        Ho letto ed accettato la normativa sulla privacy
                    </p>

                </div> */}


                {/* <div className="button_changeview">
                    <p onClick={() => this.handlePasswordChangeViewClick()}>
                        {languageStore.translate("LoginView.passforget", "Hai dimenticato la password ?")}
                    </p>
                </div> */}
                
                <button 
                    className="button_action"
                    onClick={ () => this.handleLoginClick()}
                > 
                    Login
                </button>

                <p> o registati se non hai ancora un account </p>

                <button 
                    className="button_action"
                    onClick={ () => routerStore.execChangePath("/register")}
                > 
                    Iscriviti
                </button>
                              
            </div>
        );
    }

}
LoginForm = inject("appstore")(observer(LoginForm));




let View = ({ BaseView }) => {
    return(
        <BaseView className="ts_view ts_view__login">
            <LoginForm />
        </BaseView>
    )
};


export default View;
