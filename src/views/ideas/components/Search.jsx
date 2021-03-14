import React from 'react';

import InputText from '__src/components/inputtext/Inputtext.jsx';
import Button from '__src/components/button/Button.jsx';

import "./Search.scss";


const ENTER_KEY = 13;


class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchtext: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }


    handleChange(value, key) {
        // console.log(value);
        // console.log(key);
        this.setState({
            [key]: value
        });
    }


    handleClick() {
        this.props.searchHandler(this.state.searchtext);
        this.setState({
            searchtext: ""
        });
    }


    handleKeyDown(event) {
        if (event.which === ENTER_KEY) {
            this.props.searchHandler(this.state.searchtext);
            this.setState({
                searchtext: ""
            });
        }
    }


    render() {
        return (
            <div className="search_widget">

                <InputText
                    ref={input => this.text_search = input}
                    handleChange={this.handleChange}
                    type={"text"}
                    value={this.state.searchtext}
                    name="searchtext"
                    handleKeyDown={this.handleKeyDown}
                    placeholder={this.props.placeholder}
                />

                <Button 
                    className="big search_button" 
                    handleClick={this.handleClick}
                >
                    <i className="icon-search"></i>
                </Button>

            </div>
        )
    }
}


export default Search;