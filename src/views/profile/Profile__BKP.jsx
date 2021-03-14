import React, { PureComponent } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Radar, RadarChart, PolarGrid, Legend, Tooltip,
    PolarAngleAxis, PolarRadiusAxis,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts';


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
        <div style={{ width: "100%", height: "100%" }}>
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
        </div>
    );
}


let Chart2 = () => {


    const data = [
        {
            name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
        },
        {
            name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
        },
        {
            name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
        },
        {
            name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
        },
        {
            name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
        },
        {
            name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
        },
        {
            name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
        },
    ];


    return (
        <div style={{ width: "100%", height: "100%" }}>
            <ResponsiveContainer>
                <AreaChart
                    data={data}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="uv" stroke=" #819dbd" fill=" #BCCBDD" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}





let HeaderContent = () => {
    return (
        <section className="content">

            <div className="column_left">

                <div className="disclaimer">

                    <h2> Progetta con noi </h2>

                    <p> Collabora assieme ad altri insegnanti, designer e sviluppatori per progettare la scuola del futuro</p>

                    <button className="button_action">Unisciti a noi</button>

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



            <div className="col1">

                <header className="info_header">
                    Informazioni profilo
                </header>

            </div>


            <div className="col1">

                <div className="box_image">
                    <img src="./images/michele.jpg" alt="" />
                    <div className="image_button">
                        <span className="icon-camera"></span>
                    </div>
                </div>

            </div>

            <div className="col2">

                <div className="box_info">
                    <div className="box_label">Username</div>
                    <div className="box_value">{profile.username}</div>
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

                <div className="box_info">
                    <div className="box_label">Role</div>
                    <div className="box_value">
                        {role}
                        <div className="box_button">
                            <span className="icon-pencil"></span>
                        </div>
                    </div>
                </div>

            </div>


            <div className="col2">


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
                    <div className="box_label">Azienda/Istituto</div>
                    <div className="box_value">
                        {profile.company}
                        <div className="box_button">
                            <span className="icon-pencil"></span>
                        </div>
                    </div>
                </div>



            </div>


        </section>

    );
};



let DataSection = () => {


    const data1 = [
        {
            label: 'Empathize', current: 80, last: 70, fullMark: 100,
        },
        {
            label: 'Define', current: 95, last: 70, fullMark: 100,
        },
        {
            label: 'Ideate', current: 80, last: 90, fullMark: 100,
        },
        {
            label: 'Prototype', current: 75, last: 60, fullMark: 100,
        },
        {
            label: 'Test', current: 60, last: 90, fullMark: 100,
        },
        {
            label: 'Implement', current: 30, last: 40, fullMark: 100,
        },
    ];
    const data2 = [
        {
            label: 'Empathize', current: 80, averange: 80, fullMark: 100,
        },
        {
            label: 'Define', current: 95, averange: 90, fullMark: 100,
        },
        {
            label: 'Ideate', current: 80, averange: 70, fullMark: 100,
        },
        {
            label: 'Prototype', current: 75, averange: 80, fullMark: 100,
        },
        {
            label: 'Test', current: 60, averange: 70, fullMark: 100,
        },
        {
            label: 'Implement', current: 30, averange: 50, fullMark: 100,
        },
    ];

    return (
        <div className="section data-section">
            
            
            <div className="col1">

                <header className="info_header">
                    I tuoi contributi
                </header>

            </div>


            <div className="col4">

                <RadarChartComp 
                    data={data1}
                    label1={"Attuale"}
                    label2={"Ultimo mese"}
                    dataKey1={"current"}
                    dataKey2={"last"}
                />

                {/* <ChartDesignThinking /> */}
            </div>

            <div className="col4">

                <RadarChartComp 
                    data={data2}
                    label1={"Attuale"}
                    label2={"Media"}
                    dataKey1={"current"}
                    dataKey2={"averange"}
                />

                
            </div>  


            <div className="col4">

                <Chart2 />

            </div>
            

        </div>
    );
}



let View = ({ BaseView, BaseHeader, Main, Footer, appstore }) => {

    let profile = profileData;





    return (
        <div className={`ts_view ts_view__profile`}>

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

