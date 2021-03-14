import React from 'react';
import {inject, observer} from 'mobx-react';

import { getUrlVars } from "__src/libs/gutils.js";

import './Login.scss';


import Select, {components} from "react-select";


const ENTER_KEY = 13;


const Option = (props) => {
    return (
        <div> 
            <components.Option {...props}>
                {
                    props.data.image ?
                    <img style={{height: "3rem", marginRight:".5rem"}} src={props.data.image}></img>
                    : 
                    null
                }
                {props.children}
            </components.Option>
        </div>
    );
};


const SingleValue = (props) => (
    <components.SingleValue {...props}>
        {
            // props.data.image ?
            // <img style={{height: "1rem", marginRight:".5rem"}} src={props.data.image}></img>
            // : 
            // null
        }
        {props.children}
    </components.SingleValue>
);







class Register extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            requestToken: "",
            username: "",
            password: "",
            passwordConfirm: "",
            role: "teacher",
        };
    }


    componentDidMount() {
        this.input_password.focus();
    }


    handleKeyDown(event) {
        if (event.which === ENTER_KEY) {
            if (event.target === this.input_username) {
                this.input_password.focus();
            }
            if (event.target === this.input_password) {
                this.input_password_confirm.focus();
            }
            if (event.target === this.input_password_confirm) {
                this.handleRegisterClick();
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
        this.handleChange(key, value);
    }


    async handleRegisterClick() {
        const { appstore } = this.props;
        const { firebaseStore, routerStore, uiStore, languageStore } = appstore;
        try {
            
            const username = this.state.username;
            const password = this.state.password;
            const passwordConfirm = this.state.passwordConfirm;

            if (!username) {
                alert("Il campo username é obbligatorio");
                return;
            }
            if (!password) {
                alert("Il campo password é obbligatorio");
                return;
            }

            if (password !== passwordConfirm) {
                const msg = "Le password non coincidono!";
                alert(msg);
                return;
            }

            const response = await firebaseStore.register(username, password);

            // ##TODO check eventuali errori
            // if (response.status === "ERROR") { throw response; }

            let msg = "Iscrizione a Dev-learning completata";
            alert(msg);

            firebaseStore.login(username, password);
            routerStore.execChangePath("/home");

        } catch (error) {
            console.log(error);
            uiStore.alert(error.message || "Error");
        }        
    }


    handleLoginViewClick() {
        const { appstore: { api, routerStore, uiStore} } = this.props;
        routerStore.changePath("/login");
    }


    render() {
        const _this = this;
        const { appstore } = this.props;
        const { languageStore, uiStore } = appstore;


        const roles = [
            {
                id: "teacher",
                label: "Teacher"
            },
            {
                id: "designer",
                label: "Designer"
            },
            {
                id: "developer",
                label: "Developer"
            },
        ];


        const options = roles.map( role => {
            return {
                label: role.label,
                value: role.id,
                image: role.image 
            };
        });
        const selected = options.find( r => r.value === this.state.role);


        return (
            <div className="login_form">

                <h2> Iscriviti </h2>

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

                <p className="label"> Scegli una password </p>

                <div className="box_input">
                    <input 
                        ref={el => this.input_password = el}
                        type="password" 
                        className="ts_inputtext"
                        name="password"
                        placeholder="Password"
                        value={this.state.password} 
                        onChange={ (e) => this.handleInputTextChange(e)}
                        onKeyDown={ (e) => this.handleKeyDown(e)}
                    />
                </div>

                <p className="label"> Ripeti la password </p>

                <div className="box_input">
                    <input 
                        ref={el => this.input_password_confirm = el}
                        type="password" 
                        className="ts_inputtext"
                        name="passwordConfirm"
                        placeholder="Conferma Password"
                        value={this.state.passwordConfirm} 
                        onChange={ (e) => this.handleInputTextChange(e)}
                        onKeyDown={ (e) => this.handleKeyDown(e)}
                    />
                </div>

                <p className="label"> Scegli un ruolo </p>

                <div className="box_select"> 
                    <Select 
                        components={{ Option: Option, SingleValue: SingleValue }}
                        className="ts_select__container"
                        classNamePrefix='ts_select'
                        onChange={(role) => {
                            _this.setState({
                                role: role.value
                            });
                        }}
                        options={options}
                        value={selected} 
                        // clearable={false} 
                        // field="navigatore"
                    />     
                </div>


                {/* <div className="button_changeview">
                    <p onClick={() => this.handleLoginViewClick()}>
                        {languageStore.translate("ChangePasswordView.to_login_view", "Effettua il login")}
                        
                    </p>
                </div> */}


                <button 
                    className="button_action"
                    onClick={ () => this.handleRegisterClick()}
                >   
                    Iscriviti
                </button>

            </div>
        );
    }

}
Register = inject("appstore")(observer(Register));




let View = ({ BaseView }) => {
    return(
        <BaseView className="ts_view ts_view__login">
            <Register />
        </BaseView>
    )
};


export default View;








