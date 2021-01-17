import React from 'react';


import "./inputtext.scss";


// ##OLD
class InputText extends React.Component {
    
    handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        this.props.handleChange(value, name);
    }
    render() {

        const {className, disabled, placeholder, type, value, name, handleKeyDown} = this.props;
        
        return (
            <input 
                className={`ts_inputtext ${className || ""} ${disabled || ""}`} 
                onChange={(e) => this.handleChange(e)} 
                name={name}
                value={value} 
                type={type}
                onKeyDown={handleKeyDown}
                ref={input => this.input = input}
                placeholder={placeholder}
            />
        );
    }
}
  

// const InputText = (props) => {
//     const {className, disabled, placeholder, type, value, handleChange, handleKeyDown} = props;
//     return (
//         <input 
//             className={`ts_inputtext ${className || ""} ${disabled || ""}`} 
//             type={type}
//             placeholder={placeholder || ''}
//             name={name}
//             value={value} 
//             onChange={ (event) => handleChange(event.target.value, event.target.name)} 
//             onKeyDown={handleKeyDown}
//             ref={input => this.input = input}
//         />
//     )
// };

export default InputText;

