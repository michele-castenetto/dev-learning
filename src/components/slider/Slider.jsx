import React from 'react';


import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";


const Slider = (props) => {

    const {className} = props;
    
    return (  
        <Carousel 
            {...props}
            className={`ts_slider ${className || ''}`}
        >   
            {props.children}
        </Carousel>
    );
};


export default Slider;