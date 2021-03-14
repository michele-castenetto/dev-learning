import React from 'react';
import {inject, observer} from 'mobx-react';


import './Notfound.scss';



let View = ({ BaseView, appstore }) => {


    return(
        <BaseView className="ts_view ts_view__notfound">
            
            
            <div className="notfound">
                
                <h2>Page Not Found</h2>
                
            </div>


        </BaseView>
    )
};
View = inject("appstore")(observer(View));


export default View;

