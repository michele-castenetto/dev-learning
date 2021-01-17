import React from 'react';
import {inject, observer} from 'mobx-react';


import './Workwithus.scss';


let View = ({ Base, appstore }) => {


    return(
        <Base className="ts_view ts_view__workwithus">
            
            
            <section className="section">



            </section>

            <section className="section dark">

                

            </section>

            <section className="section">

                

            </section>


        </Base>
    )
};
View = inject("appstore")(observer(View));


export default View;

