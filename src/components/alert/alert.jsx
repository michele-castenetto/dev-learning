import React from 'react';

import Button from '../button/Button.jsx';


import "./Alert.scss";


const AlertContent = ({ text, closeText, handleClose, icon }) => {
    return (  
        
        <div className="ui_modal_alert">
            <div className="content">
                {icon && 
                    <span className="ui_modal_icon">
                        <i className="material-icons">{icon}</i>
                    </span>
                }
                {text}
            </div>
            <div className="controls">
                <Button className="button" handleClick={ () => handleClose()}>
                    {closeText}
                </Button>
            </div>
        </div>
        
    );
};


export default AlertContent;