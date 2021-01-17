import React from 'react';

import Button from '../button/button.jsx';


// import "./alert.scss";


const ConfirmContent = (props) => {

    let {text, confirmText, cancelText, handleConfirm, handleCancel} = props;
    
    return (  
        
        <div className="ts_modal_confirm">
            <div className="content">
                {text}
            </div>
            <div className="controls">
                <Button className="ts_button1" handleClick={ () => handleConfirm()}>
                    {confirmText}
                </Button>
                <Button className="ts_button1" handleClick={ () => handleCancel()}>
                    {cancelText}
                </Button>
            </div>
        </div>

    );
};


export default ConfirmContent;