import React, { Component } from 'react';


class WatchClickOutside extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }


    UNSAFE_componentWillMount () {
        document.body.addEventListener('click', this.handleClick);
    }

    componentWillUnmount() {
        document.body.removeEventListener('click', this.handleClick);
    }


    handleClick(event) {
        const container = this.refs.container;
        const onClickOutside = this.props.onClickOutside;
        const target = event.target; 

        if (!onClickOutside || typeof onClickOutside !== 'function') { return; }
        
        if (target !== container && !container.contains(target)) {
            onClickOutside(event);
        }
    }

    render() {
        return (
            <div ref="container">
                {this.props.children}
            </div>
        );
    }
    
}

export default WatchClickOutside;
