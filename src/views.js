import React from 'react';
import Loadable from 'react-loadable';

import Loading from '__src/components/loading/loading.jsx';


const LoadingBase = () => <div>Loading ...</div>;
const LoadingCustom = ({type}) => <Loading type={type} isLoading={true}/>;


let _loadingType = 4;


// import NotFound from '__src/views/notfound/NotFound.jsx';



const getViews = (loadingType) => {

    if (loadingType) { _loadingType = loadingType; }

    const NotFound = Loadable({
        loader: () => import(/* webpackChunkName: "NotFound" */ "__src/views/notfound/NotFound.jsx"),
        loading: () => <LoadingCustom type={_loadingType}/>
    }); 

    const Home = Loadable({
        loader: () => import(/* webpackChunkName: "Home" */ "__src/views/home/Home.jsx"),
        loading: () => <LoadingCustom type={_loadingType}/>
    });

    const Team = Loadable({
        loader: () => import(/* webpackChunkName: "Team" */ "__src/views/team/Team.jsx"),
        loading: () => <LoadingCustom type={_loadingType}/>
    });

    const Ideas = Loadable({
        loader: () => import(/* webpackChunkName: "Ideas" */ "__src/views/ideas/Ideas.jsx"),
        loading: () => <LoadingCustom type={_loadingType}/>
    });

    const Workwithus = Loadable({
        loader: () => import(/* webpackChunkName: "Workwithus" */ "__src/views/workwithus/Workwithus.jsx"),
        loading: () => <LoadingCustom type={_loadingType}/>
    });





    // // import Home from "__src/views/home/Home.jsx";
    // const Profilo = Loadable({
    //     loader: () => import(/* webpackChunkName: "Profilo" */ "__src/views/profilo/Profilo.jsx"),
    //     loading: () => <LoadingCustom type={_loadingType}/>
    // });
    // // import Profilo from "__src/views/profilo/Profilo.jsx";
    // const Admin = Loadable({
    //     loader: () => import(/* webpackChunkName: "Admin" */ "__src/views/admin/Admin.jsx"),
    //     loading: () => <LoadingCustom type={_loadingType}/>
    // });
    // // import Admin from "__src/views/admin/Admin.jsx";


    // const Login = Loadable({
    //     loader: () => import(/* webpackChunkName: "Login" */ "__src/views/login/Login.jsx"),
    //     loading: () => <LoadingCustom type={_loadingType}/>
    // });
    // const ResetPassword = Loadable({
    //     loader: () => import(/* webpackChunkName: "ResetPassword" */ "__src/views/login/ResetPassword.jsx"),
    //     loading: () => <LoadingCustom type={_loadingType}/>
    // });
    // const ChangePassword = Loadable({
    //     loader: () => import(/* webpackChunkName: "ChangePassword" */ "__src/views/login/ChangePassword.jsx"),
    //     loading: () => <LoadingCustom type={_loadingType}/>
    // });






    return {
        
        NotFound,

        Home,
        Team,
        Ideas,
        Workwithus,


        // Profilo,
        // Admin,
        
        // Login,
        // ResetPassword,
        // ChangePassword,


    
    }
};


export default getViews;
