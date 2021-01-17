import React from 'react';
import {inject, observer} from 'mobx-react';


import './Ideas.scss';



let View = ({ Base, appstore }) => {


    return(
        <Base className="ts_view ts_view__ideas">
            

            Ideas


        </Base>
    )
};
View = inject("appstore")(observer(View));


export default View;

