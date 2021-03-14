import React from 'react';

import Button from '../button/Button.jsx';


import "./Alert.scss";


const ConfirmContent = (props) => {

    let {text, confirmText, cancelText, handleConfirm, handleCancel} = props;
    
    return (  
        
        <div className="ui_modal_confirm">
            <div className="content">
                {text}
            </div>
            <div className="controls">
                <Button className="button" handleClick={ () => handleConfirm()}>
                    {confirmText}
                </Button>
                <Button className="button" handleClick={ () => handleCancel()}>
                    {cancelText}
                </Button>
            </div>
        </div>

    );
};


export default ConfirmContent;