import React from 'react';


import { Scrollbars } from 'react-custom-scrollbars';



const ScrollBar = (props) => {

    const {scrollPropClass} = props;
    
    return (  
        <div 
            className={`ts_scrollbar ${scrollPropClass || ''}`} 
            style={{height: "100%"}}
        >   
            <Scrollbars
                autoHide
                autoHideTimeout={1000}
                autoHideDuration={200}
                {...props}
            >   
                {props.children}
            </ Scrollbars>
        </div>
    );
};


export default ScrollBar;
