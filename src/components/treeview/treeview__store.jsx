import React from 'react';
import { observer, inject } from 'mobx-react';


// import TSScrollbar from '../../../components/scrollbar/scrollbar.jsx';


import './treeview_light.scss';



let Node = (props) => {
    
    const {store, node, node: {childs} } = props;
    
    // ##TODO invece di non renderizzare i figli cambiare l'altezza a 0 con una classe 
    let node_childs = [];
    if (node.isExpanded) {
        node_childs = childs.map(c => {
            return <li key={c.id}> <Node node={c} store={store} /> </li>;
        });
    }

    
    // const node_childs = childs.map(c => {
    //     return <li key={c.id}> <Node node={c} store={store} /> </li>;
    // });
    
    
    return (
        <div className='box_node'>
            
            <div
                className={`node ${node.isSelected ? 'selected' : ''}`}
                data-nodeid={node.id}
            >   
                {
                    node.childs.length ?
                    <div className='box_arrow' 
                        // onClick={props.handleArrowClick}
                    >
                        <div className={`arrow ${node.isExpanded ? 'arrow-up' : 'arrow-down'}`} >
                        </div>
                    </div>
                    :
                    null
                }
                
                <div className='box_text' 
                    // onDoubleClick={props.handleTextDoubleClick} 
                    // onClick={props.handleTextClick}
                    onClick={ () => {
                        store.expandCatalogoNode(node.id); 
                        store.selectCatalogoNode(node.id)
                    }}
                >
                    <div className='text'> 
                        {node.text} 
                    </div>
                </div>
            </div>
                
            <ul className={`node_childs ${node.isExpanded ? 'expanded' : ''}`}>
                {node_childs}
            </ul>
            
        </div>
    );

};
Node = inject('appstore')(observer(Node));



let TreeView = (props) => {
    
    const {store, nodes} = props;

    const node_childs = nodes.map(n => <li key={n.id}> <Node node={n} store={store} /> </li> );

    return (

        <div className='ts_treeview'>     
            <ul className='treeview_root'>
                {node_childs}
            </ul>
        </div>

        // <div className='ts_treeview'>
        //     <TSScrollbar
        //         autoHide
        //         autoHideTimeout={1000}
        //         autoHideDuration={200}
        //     >
                
        //     <ul className='treeview_root'>
        //         {node_childs}
        //     </ul>
            
        //     </ TSScrollbar>
        // </div>
    )
}
TreeView = inject('appstore')(observer(TreeView));


export default TreeView;
