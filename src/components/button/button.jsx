import React from 'react';


import "./Button.scss";


const Button = (props) => {

    const {className, disabled, handleClick, onClick, text, children} = props;

    return (
        <button 
            className={`button ${className || ''} ${disabled ? 'disabled' : ''}`} 
            onClick={handleClick || onClick} 
            disabled={disabled}
        > 
            {text}
            {children}
        </button>
    )
};


const IconButton = (props) => {

    const {className, iconClassName, disabled, handleClick, onClick} = props;

    return (
        <button 
            className={`iconbutton ${className || ''} ${disabled ? 'disabled' : ''}`} 
            onClick={handleClick || onClick} 
            disabled={disabled}
        > 
            <span className={`icon ${iconClassName || ""}`}></span>
        </button>
    )
};


export default Button;
export { Button };
export { IconButton };

