import React, { PureComponent } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Radar, RadarChart, PolarGrid, Legend, Tooltip,
    PolarAngleAxis, PolarRadiusAxis,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
    LineChart, ComposedChart, Line,
} from 'recharts';


import ScrollToTop from "__src/components/ScrollToTop/ScrollToTop.jsx";


import './Profile.scss';




// ##OLD
let ImagePanel = () => {
    return (
        <div className="imagepanel">
            <div className="panel">
                <img src="./images/michele.jpg" alt="" />
            </div>
        </div>
    );
};










let RadarChartComp = ({ data, label1, label2, dataKey1, dataKey2 }) => {
    return (
        // <div style={{ width: "100%", height: "100%" }}>
            <ResponsiveContainer>
                <RadarChart data={data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="label" />

                    <Legend />

                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name={label1} dataKey={dataKey1} stroke="#6DB6CC" fill="#6DB6CC" fillOpacity={0.4} />
                    <Radar name={label2} dataKey={dataKey2} stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.4} />

                </RadarChart>
            </ResponsiveContainer>
        // </div>
    );
}




let AreaChartComp = ({ data, label1, label2, dataKey1, dataKey2 }) => {
    return (
        // <div style={{ width: "100%", height: "100%" }}>
            <ResponsiveContainer>
                <AreaChart data={data} >
                    <CartesianGrid 
                        strokeDasharray="3 3" 
                        // stroke="#f5f5f5"
                    />

                    <Legend />

                    {/* <XAxis type="number" />
                    <YAxis dataKey="name" type="category" /> */}
                    <XAxis dataKey="label" />
                    <YAxis />   
                    
                    <Tooltip />

                    {/* <Area type="monotone" dataKey="uv" stroke="#82ca9d" fill="#82ca9d" /> */}
                    <Area stackId="1" dataKey={dataKey1} stroke="#6DB6CC" fill="#6DB6CC" fillOpacity={0.4}/>
                    <Area stackId="2" dataKey={dataKey2} stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.4}/>
                </AreaChart>
            </ResponsiveContainer>
        // </div>
    );
}



let DataSection = () => {


    const data = [
        {
            label: 'Empathize', 
            current: 80, 
            last: 70, 
            averange: 80, 
            best: 85,
            fullMark: 100,
        },
        {
            label: 'Define', 
            current: 95, 
            last: 70, 
            averange: 90, 
            best: 95,
            fullMark: 100,
        },
        {
            label: 'Ideate', 
            current: 80, 
            last: 90, 
            averange: 70, 
            best: 80,
            fullMark: 100,
        },
        {
            label: 'Prototype', 
            current: 75, 
            last: 60, 
            averange: 80, 
            best: 85,
            fullMark: 100,
        },
        {
            label: 'Test', 
            current: 60, 
            last: 90, 
            averange: 70, 
            best: 90,
            fullMark: 100,
        },
        {
            label: 'Implement', 
            current: 30, 
            last: 40, 
            averange: 50, 
            best: 70,
            fullMark: 100,
        },
    ];

    const data2 = [
        {
            label: '1', contrib: 10, averange: 11, best: 13,
        },
        {
            label: '2', contrib: 6, averange: 8, best: 9,
        },
        {
            label: '3', contrib: 2, averange: 4, best: 3,
        },
        {
            label: '4', contrib: 0, averange: 3, best: 5,
        },
        {
            label: '5', contrib: 0, averange: 3, best: 5,
        },
        {
            label: '6', contrib: 1, averange: 5, best: 7,
        },
        {
            label: '7', contrib: 11, averange: 6, best: 11,
        },
        {
            label: '8', contrib: 8, averange: 8, best: 10,
        },
        {
            label: '9', contrib: 4, averange: 7, best: 10,
        },
        {
            label: '10', contrib: 6, averange: 9, best: 12,
        },
        {
            label: '11', contrib: 3, averange: 6, best: 12,
        },
        {
            label: '12', contrib: 4, averange: 4, best: 9,
        },
        {
            label: '13', contrib: 3, averange: 5, best: 7,
        },
        {
            label: '14', contrib: 3, averange: 2, best: 3,
        },
        {
            label: '15', contrib: 7, averange: 3, best: 7,
        },
        {
            label: '16', contrib: 10, averange: 12, best: 13,
        },
        {
            label: '17', contrib: 0, averange: 6, best: 9,
        },
        {
            label: '18', contrib: 0, averange: 6, best: 12,
        },
        {
            label: '19', contrib: 1, averange: 3, best: 6,
        },
        {
            label: '20', contrib: 5, averange: 9, best: 12,
        },
        {
            label: '21', contrib: 10, averange: 9, best: 11,
        },
        {
            label: '22', contrib: 12, averange: 10, best: 14,
        },
        {
            label: '23', contrib: 4, averange: 5, best: 14,
        },
        {
            label: '24', contrib: 7, averange: 5, best: 10,
        },
        {
            label: '25', contrib: 9, averange: 6, best: 9,
        },
        {
            label: '26', contrib: 3, averange: 9, best: 8,
        },
        {
            label: '27', contrib: 5, averange: 4, best: 5,
        },
        {
            label: '28', contrib: 7, averange: 5, best: 7,
        },
        {
            label: '29', contrib: 8, averange: 4, best: 10,
        },
        {
            label: '30', contrib: 9, averange: 3, best: 10,
        },
        {
            label: '31', contrib: 1, averange: 4, best: 6,
        },





    ];

    return (
        <div className="section data-section">


            <section className="section-container">

                <div className="tab tab_chart">

                    <div className="tab_chart_header">
                        <h4>Design Thinking Skills</h4>
                    </div>

                    <div className="box_chart">
                        <div className="chart_header">
                            <h5>vs mese precedente</h5>
                        </div>
                        <RadarChartComp
                            data={data}
                            label1={"Attuale"}
                            label2={"Ultimo mese"}
                            dataKey1={"current"}
                            dataKey2={"last"}
                        />
                    </div>

                    <div className="box_chart">
                        <div className="chart_header">
                            <h5>vs media utenti</h5>
                        </div>
                        <RadarChartComp
                            data={data}
                            label1={"Attuale"}
                            label2={"Media"}
                            dataKey1={"current"}
                            dataKey2={"averange"}
                        />
                    </div>

                    <div className="box_chart">
                        <div className="chart_header">
                            <h5>vs migliore</h5>
                        </div>
                        <RadarChartComp
                            data={data}
                            label1={"Attuale"}
                            label2={"Migliore"}
                            dataKey1={"current"}
                            dataKey2={"best"}
                        />
                    </div>

                </div>


                <div className="tab tab_chart">

                    <div className="tab_chart_header">
                        <h4>Contribute Skills</h4>
                    </div>

                    <div className="box_chart2">
                        <div className="chart_header">
                            <h5>vs mese precedente</h5>
                        </div>
                        <AreaChartComp 
                            data={data2}
                            dataKey1={"contrib"}
                            dataKey2={"averange"}
                        />  

                    </div>
                    <div className="box_chart2">
                        <div className="chart_header">
                            <h5>vs media utenti</h5>
                        </div>
                        <AreaChartComp 
                            data={data2}
                            dataKey1={"contrib"}
                            dataKey2={"best"}
                        />  

                    </div>




                </div>


            </section>




        </div>
    );
}







let profileData = {
    "username": "michele.castenetto",
    "email": "michele.castenetto@gmail.com",
    "role": 3,

    "name": "Michele",
    "surname": "Castenetto",
    "birth_date": 425253600000,

    "ideas": 5,
    "company": "",
    "institute": "",


};



let InfoSection = ({ profile }) => {

    var birth_date = "-";
    if (profile.birth_date) {
        var d = new Date(profile.birth_date);
        birth_date = `${d.getDay() < 10 ? "0" + d.getDay() : d.getDay()}-${d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1}-${d.getFullYear()}`
    }

    let role = "";
    if (profile.role === 1) {
        role = "Insegnante";
    }
    if (profile.role === 2) {
        role = "Designer";
    }
    if (profile.role === 3) {
        role = "Developer";
    }


    return (
        <section className="section info-section">

            <section className="section-container">


                <div className="tab tab_side">

                    <div className="box_user">
                        {profile.username}
                    </div>

                    <div className="box_image">
                        <img src="./images/michele.jpg" alt="" />
                        <div className="image_button">
                            <span className="icon-camera"></span>
                        </div>
                    </div>

                    <div className="box_info">
                        <div className="box_label">E-mail</div>
                        <div className="box_value">
                            {profile.email}
                            <div className="box_button">
                                <span className="icon-pencil"></span>
                            </div>
                        </div>
                    </div>



                </div>


                <div className="tab tab_info">

                    <div className="box_header">
                        {"Info"}
                    </div>

                    {/* <div className="box_info">
                        <div className="box_label">Username</div>
                        <div className="box_value">{profile.username}</div>
                    </div> */}


                    <div className="subtab_info">

                        <div className="box_info">
                            <div className="box_label">Nome</div>
                            <div className="box_value">
                                {profile.name}
                                <div className="box_button">
                                    <span className="icon-pencil"></span>
                                </div>
                            </div>
                        </div>

                        <div className="box_info">
                            <div className="box_label">Cognome</div>
                            <div className="box_value">
                                {profile.surname}
                                <div className="box_button">
                                    <span className="icon-pencil"></span>
                                </div>
                            </div>
                        </div>

                        <div className="box_info">
                            <div className="box_label">Data di nascita</div>
                            <div className="box_value">
                                {birth_date}
                                <div className="box_button">
                                    <span className="icon-pencil"></span>
                                </div>
                            </div>
                        </div>

                        <div className="box_info">
                            <div className="box_label">Stato</div>
                            <div className="box_value">
                                {profile.country || "Italia"}
                                <div className="box_button">
                                    <span className="icon-pencil"></span>
                                </div>
                            </div>
                        </div>

                        <div className="box_info">
                            <div className="box_label">Città</div>
                            <div className="box_value">
                                {profile.country || "Roma"}
                                <div className="box_button">
                                    <span className="icon-pencil"></span>
                                </div>
                            </div>
                        </div>

                    </div>


                    <div className="subtab_info">

                        <div className="box_info">
                            <div className="box_label">Role</div>
                            <div className="box_value">
                                {role}
                                <div className="box_button">
                                    <span className="icon-pencil"></span>
                                </div>
                            </div>
                        </div>

                        <div className="box_info">
                            <div className="box_label">Azienda/Istituto</div>
                            <div className="box_value">
                                {profile.company}
                                <div className="box_button">
                                    <span className="icon-pencil"></span>
                                </div>
                            </div>
                        </div>

                    </div>






                </div>

            </section>







        </section>

    );
};




let HeaderContent = ({ appstore }) => {

    const { routerStore } = appstore;

    return (
        <section className="content">

            <div className="column_left">

                <div className="disclaimer">

                    <h2> Progetta con noi </h2>

                    <p> Collabora assieme ad altri insegnanti, designer e sviluppatori per progettare la scuola del futuro</p>

                    <button 
                        className="button_action"
                        onClick={() => routerStore.execChangePath("/register")}
                    >
                        Unisciti a noi
                    </button>

                </div>

            </div>


            <div className="column_right">

                <div className="box_panel">

                    <div className="panel">

                        <div className="panel_transformed rotating">

                            <div className="box_icon">
                                <span className="icon-user"></span>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
};
HeaderContent = inject("appstore")(observer(HeaderContent));


let View = ({ BaseView, BaseHeader, Main, Footer, appstore }) => {

    let profile = profileData;

    return (
        <div className={`ts_view ts_view__profile`}>

            <ScrollToTop scrollStepInPx="50" delayInMs="16.66" />

            <BaseHeader>
                <HeaderContent />
            </BaseHeader>

            <Main>


                <InfoSection profile={profile} />

                <DataSection />


            </Main>

            <Footer />

        </div>
    )
};
View = inject("appstore")(observer(View));


export default View;

