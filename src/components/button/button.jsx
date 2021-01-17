import React from 'react';


import "./button.scss";


const Button = (props) => {

    const {className, disabled, handleClick, text, children} = props;

    return (
        <button 
            className={`ts_button ${className || ''} ${disabled ? 'disabled' : ''}`} 
            onClick={handleClick} 
            disabled={disabled}
        > 
            {text}
            {children}
        </button>
    )
};


export default Button;
