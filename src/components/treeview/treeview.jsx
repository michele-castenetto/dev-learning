import React from 'react';
import { observer, inject } from 'mobx-react';

// import './treeview_light.scss';
// import './treeview.scss';


let Node = (props) => {
    
    const { nodeView : NodeView, handleNodeClick, node, node: {childs} } = props;
    
    // ##TODO invece di non renderizzare i figli cambiare l'altezza a 0 con una classe 
    let node_childs = [];
    if (node.isExpanded) {
        node_childs = childs.map(c => {
            return <li key={c.id}> <Node node={c} handleNodeClick={handleNodeClick}/> </li>;
        });
    }

    return (
        <div className='box_node'>
            
            <div
                className={`node ${node.isSelected ? 'selected' : ''}`}
                data-nodeid={node.id}
            >   
                {/* {
                    node.childs.length ?
                    <div className='box_arrow' 
                        // onClick={props.handleArrowClick}
                    >
                        <div className={`arrow ${node.isExpanded ? 'arrow-up' : 'arrow-down'}`} >
                        </div>
                    </div>
                    :
                    null
                } */}
                
                <NodeView node={node}/>

                {/* <div className='box_text' 
                    onClick={ () => handleNodeClick(node.id) }
                >
                    <div className='text'> 
                        {node.label} 
                    </div>
                </div> */}

            </div>
                
            { node_childs.length >= 1 &&
                <ul className={`node_childs ${node.isExpanded ? 'expanded' : ''}`}>
                    {node_childs}
                </ul>
            }
            
        </div>
    );

};
Node = observer(Node);



let TreeView = (props) => {
    
    const {handleNodeClick, nodes, className, nodeView} = props;

    const node_childs = nodes.map(n => <li key={n.id}> <Node nodeView={nodeView} node={n} handleNodeClick={handleNodeClick} /> </li> );

    return (
        <div className={`treeview ${className || ''}`}>     
            <ul className='treeview_root'>
                {node_childs}
            </ul>
        </div>
    )
}
TreeView = observer(TreeView);



export default TreeView;
