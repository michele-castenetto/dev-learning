
import React, { Component } from 'react';
import './loading.scss';


const Obscurer = () => <div className='obscurer'></div>;

const DefaultSpinner = () => <div className='default_spinner'></div>;

const SquareSpinner = () => <div className='square_spinner'></div>;

const Bounce3Spinner = () => 
<div className="bounce3_spinner">
  <div className="bounce1"></div>
  <div className="bounce2"></div>
  <div className="bounce3"></div>
</div>;

const Cube9Spinner = () =>
<div className="sk-cube-grid">
  <div className="sk-cube sk-cube1"></div>
  <div className="sk-cube sk-cube2"></div>
  <div className="sk-cube sk-cube3"></div>
  <div className="sk-cube sk-cube4"></div>
  <div className="sk-cube sk-cube5"></div>
  <div className="sk-cube sk-cube6"></div>
  <div className="sk-cube sk-cube7"></div>
  <div className="sk-cube sk-cube8"></div>
  <div className="sk-cube sk-cube9"></div>
</div>


const Loading = (props) => {

    const {isLoading, type} = props;
    let Spinner = null;

    if (!isLoading) { return null; }
    
    switch (type) {
        case 1:
            Spinner = DefaultSpinner;
            break;
        case 2:
            Spinner = SquareSpinner;
            break;
        case 3:
            Spinner = Bounce3Spinner;
            break;
        case 4:
            Spinner = Cube9Spinner;
            break;
        default:
            Spinner = DefaultSpinner;
            break;
    }

    return (
        <div className='ts_loading'>
            <Obscurer />
            <Spinner />
        </div>
    );
}



export default Loading;