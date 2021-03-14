import React from 'react';
import Loadable from 'react-loadable';

import Loading from '__src/components/loading/Loading.jsx';


const LoadingCustom = ({type}) => <Loading type={type} isLoading={true}/>;

import Ideas from '__src/views/ideas/Ideas.jsx';

const getViews = (loadingType = 4) => {

    // import NotFound from '__src/views/notfound/NotFound.jsx';
    const NotFound = Loadable({
        loader: () => import(/* webpackChunkName: "NotFound" */ "__src/views/notfound/NotFound.jsx"),
        loading: () => <LoadingCustom type={loadingType}/>
    }); 

    const Home = Loadable({
        loader: () => import(/* webpackChunkName: "Home" */ "__src/views/home/Home.jsx"),
        loading: () => <LoadingCustom type={loadingType}/>
    });

    const Team = Loadable({
        loader: () => import(/* webpackChunkName: "Team" */ "__src/views/team/Team.jsx"),
        loading: () => <LoadingCustom type={loadingType}/>
    });

    const Workwithus = Loadable({
        loader: () => import(/* webpackChunkName: "Workwithus" */ "__src/views/workwithus/Workwithus.jsx"),
        loading: () => <LoadingCustom type={loadingType}/>
    });


    const Platform = Loadable({
        loader: () => import(/* webpackChunkName: "Platform" */ "__src/views/platform/Platform.jsx"),
        loading: () => <LoadingCustom type={loadingType}/>
    });

    
    // const Ideas = Loadable({
    //     loader: () => import(/* webpackChunkName: "Ideas" */ "__src/views/ideas/Ideas.jsx"),
    //     loading: () => <LoadingCustom type={loadingType}/>
    // });
    const IdeaDetail = Loadable({
        loader: () => import(/* webpackChunkName: "IdeaDetail" */ "__src/views/IdeaDetail/IdeaDetail.jsx"),
        loading: () => <LoadingCustom type={loadingType}/>
    });



    const Login = Loadable({
        loader: () => import(/* webpackChunkName: "Login" */ "__src/views/login/Login.jsx"),
        loading: () => <LoadingCustom type={loadingType}/>
    });
    const Register = Loadable({
        loader: () => import(/* webpackChunkName: "Register" */ "__src/views/login/Register.jsx"),
        loading: () => <LoadingCustom type={loadingType}/>
    });

    


    const Profile = Loadable({
        loader: () => import(/* webpackChunkName: "Profile" */ "__src/views/profile/Profile.jsx"),
        loading: () => <LoadingCustom type={loadingType}/>
    });
    


    return {
        
        NotFound,

        Home,
        Team,
        Workwithus,

        Platform,
        Ideas,
        IdeaDetail,
        
        Login,
        Register,
        
        Profile,
        
    }
};


export default getViews;

