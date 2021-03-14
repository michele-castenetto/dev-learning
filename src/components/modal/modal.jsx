import React from 'react';
import ReactDOM from 'react-dom';
import {inject, observer} from 'mobx-react';


import Modal from 'react-modal';
import "./Modal.scss";


Modal.setAppElement('#app');



const AppModal = (props) => {
    
    const {content, isOpen, handleCloseModal, className, modalOverlayPropClass} = props;
    
    return (  
        <Modal 
            onRequestClose={handleCloseModal}
            className={`ui_modal ${className || ''}`}
            overlayClassName={`ui_modal__overlay ${modalOverlayPropClass || ''}`} 
            isOpen={isOpen}
        >   
            {content}
        </Modal>
    );
};


export default AppModal;