import React from 'react';

import Button from '../button/button.jsx';


// import "./alert.scss";


const AlertContent = (props) => {

    let {text, closeText, handleClose, icon} = props;
    
    return (  
        
        <div className="ts_modal_alert">
            <div className="content">
                {icon && 
                    <span className="ts_modal_icon">
                        <i className="material-icons">{icon}</i>
                    </span>
                }
                {text}
            </div>
            <div className="controls">
                <Button className="ts_button1" handleClick={ () => handleClose()}>
                    {closeText}
                </Button>
            </div>
        </div>
        
    );
};


export default AlertContent;