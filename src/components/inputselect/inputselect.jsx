
import React, {Component} from 'react';
import ReactSelect from 'react-select';
// import 'react-select/dist/react-select.css';


class Select extends Component {

    handleChange(item) {
        this.props.handleChange(item.value, this.props.field);
    }
    
    render() {
        
        return (
            <ReactSelect
                {...this.props}
                className={`inputSelect ${this.props.className || ""}`}
                name="form-field-name"
                onChange={ (event) => this.handleChange(event) }
            />
        );
    }
    
}

export default Select;




