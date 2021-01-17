import React from 'react';
import {inject, observer} from 'mobx-react';


import './Notfound.scss';



let View = ({ Base, appstore }) => {


    return(
        <Base className="ts_view ts_view__notfound">
            

            <div className="notfound">
                
                <h2>Page Not Found</h2>
                
            </div>


        </Base>
    )
};
View = inject("appstore")(observer(View));


export default View;

