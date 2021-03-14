import React from 'react';
import detectPassiveEvents from 'detect-passive-events';


import "./ScrollToTop.scss";


class ScrollButton extends React.Component {
    constructor() {
        super();
        this.state = {
            intervalId: 0,
            visible: true
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.stopScrolling = this.stopScrolling.bind(this);
        this.scrollStep = this.scrollStep.bind(this);
        
    }

    
    componentDidMount() {
        this.handleScroll(); // initialize state
        // Add all listeners which can start scroll
        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener("wheel", this.stopScrolling, detectPassiveEvents.hasSupport ? {passive: true} : false);
        window.addEventListener("touchstart", this.stopScrolling, detectPassiveEvents.hasSupport ? {passive: true} : false);
    }

    componentWillUnmount() {
        // Remove all listeners which was registered
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener("wheel", this.stopScrolling, false);
        window.removeEventListener("touchstart", this.stopScrolling, false);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.visible !== this.state.visible;
    }



    scrollStep() {
        if (window.pageYOffset === 0) {
            clearInterval(this.state.intervalId);
        }
        window.scroll(0, window.pageYOffset - this.props.scrollStepInPx);
    }
    

    
    stopScrolling() {
        clearInterval(this.state.intervalId);
    }

    handleClick() {
        this.stopScrolling();
        let intervalId = setInterval(this.scrollStep, this.props.delayInMs);
        this.setState({ intervalId: intervalId });
    }
    
    handleScroll() {
        if (window.pageYOffset > 0) {
            if (!this.state.visible) {
                this.setState({visible: true});
            }
        } else {
            if (this.state.visible) {
                this.setState({visible: false});
            }
        }
    }

    

    render () {

        const classNameFromParent = this.props.className || "";
        
        // ##TODO nascondere il pulsante quando l'offset è zero
        // attualmente non funzionante
        
        return (
            <button 
                className={`ui_scroll_top ${this.state.visible ? 'active' : ''} ${classNameFromParent}`}
                title='scroll to top'
                onClick={ this.handleClick }>
                <span className="icon-arrow-up2"></span>
            </button>
        );
    }
} 
  
export default ScrollButton;



// example
{/* <ScrollButton scrollStepInPx="50" delayInMs="16.66"/> */}




