import React from 'react';


import "./checkbox.scss";


let _count = [];


// ##OLD
class Checkbox extends React.Component {

    constructor(props) {
        super(props);
        _count++;
    }
    
    handleChange(event) {
        const checked = !this.props.checked;
        this.props.handleChange(this.props.field, checked);
    }
    render() {
        const {className, disabled, type, checked} = this.props;

        // console.log("checked", checked);

        return (
            <div id={`ts_checkbox${_count}`} className={`${type === "switcher" ? "ts_checkbox_switcher" : "ts_checkbox"}   ${className || ""}`}>
                <input
                    type="checkbox" 
                    className={`ts_checkbox__input ${disabled ? 'disabled' : ''}`}
                    checked={checked} 
                    onChange={this.handleChange.bind(this)}
                />
                <label htmlFor={`ts_checkbox${_count}`} className="ts_checkbox__label"></label>
            </div>
        );
    }
}



// ##TODO non funziona, capire il perche
// const handleChange = function(props) {
//     const checked = props.checked;
//     props.handleChange(props.field, checked);
// };
// const Checkbox = (props) => {
//     const {propClass, disabled} = props;
//     return ( 
//         <div className={`ts_checkbox ${propClass || ''}`}>
//             <input
//                 type="checkbox" 
//                 className={`ts_checkbox_input ${disabled ? 'disabled' : ''}`}
//                 checked={props.checked} 
//                 onChange={ () => handleChange.apply(null, [props]) }
//             />
//             <label className="ts_checkbox_label"></label>
//         </div>
//     );
// };


export default Checkbox;
