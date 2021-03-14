import React from 'react';
import { inject, observer } from 'mobx-react';


import ScrollToTop from "__src/components/ScrollToTop/ScrollToTop.jsx";


import './Platform.scss';




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
                                <span className="icon-logo_light_path"></span>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
};
HeaderContent = inject("appstore")(observer(HeaderContent));


class Object3d extends React.Component {
    
    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();
        this.started = false;
    }


    showWorldAxis(scene, size) {
        var makeTextPlane = function(text, color, size) {
            var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
            dynamicTexture.hasAlpha = true;
            dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
            var plane = BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
            plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
            plane.material.backFaceCulling = false;
            plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
            plane.material.diffuseTexture = dynamicTexture;
        return plane;
         };
        var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
          BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
          new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
          ], scene);
        axisX.color = new BABYLON.Color3(1, 0, 0);
        var xChar = makeTextPlane("X", "red", size / 10);
        xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
        var axisY = BABYLON.Mesh.CreateLines("axisY", [
            BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
            new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
            ], scene);
        axisY.color = new BABYLON.Color3(0, 1, 0);
        var yChar = makeTextPlane("Y", "green", size / 10);
        yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
        var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
            BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
            new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
            ], scene);
        axisZ.color = new BABYLON.Color3(0, 0, 1);
        var zChar = makeTextPlane("Z", "blue", size / 10);
        zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
    };


    createScene(engine, canvas) {
        
        const radius = this.props.radius || 2;
        const alpha = this.props.alpha || Math.PI/4;
        const beta = this.props.beta || Math.PI/12*4;


        var scene = new BABYLON.Scene(engine);
        
        // var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
        var camera = new BABYLON.ArcRotateCamera("Camera", alpha, beta, radius, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        camera.minZ = 0.1;

        camera.wheelPrecision = 100;

        camera.setTarget(BABYLON.Vector3.Zero());
        
        // camera.attachControl(canvas, false, false);
        camera.attachControl(canvas, false, true, 2);


        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
        
        return scene;
    }

    

    async start()  {
        try {
            
            const filePath = this.props.filePath || "";
            const fileName = this.props.fileName;

            const canvas = this.canvasRef.current;

            canvas.addEventListener("wheel", evt => evt.preventDefault());
    
            var engine = new BABYLON.Engine(canvas, true, {
                preserveDrawingBuffer: true, 
                stencil: true
            });
            
            var scene = this.createScene(engine, canvas);
    
    
            // this.showWorldAxis(scene, 4);
    
            scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
            
            var { meshes } = await BABYLON.SceneLoader.ImportMeshAsync(null, filePath, fileName, scene)
            // console.log("meshes", meshes);
            
            var node = new BABYLON.TransformNode("", scene);
            meshes.forEach(m => m.parent = node);

            node.rotate(BABYLON.Axis.Z, BABYLON.Tools.ToRadians(90), BABYLON.Space.LOCAL);

            scene.registerBeforeRender(() => {
                node.rotate(BABYLON.Axis.X, BABYLON.Tools.ToRadians(-0.5), BABYLON.Space.LOCAL);
            });
    
    
            engine.runRenderLoop(function(){
                scene.render();
            });
            
            window.addEventListener('resize', function(){
                engine.resize();
            });

            this.started = true;
            this.engine =engine;
            this.scene = scene;

        } catch (error) {
            console.log(error);
        }
    }


    componentDidMount() {

        this.start();

    }


    componentWillUnmount() {

        // this.scene.getEngine().dispose();
        
        // window.removeEventListener('resize', resize);
        
    }


    render() {
        return(
            <div className="box_grafica">

                <canvas ref={this.canvasRef}></canvas>
                
            </div>
        )
    }

}



let VideoComp = ({ className, source }) => {
    return (
        <video 
            className={`video ${className || ""}`}
            // width="320" 
            // height="240" 
            controls
        >
            <source src={source} type="video/mp4" />
            {"Your browser does not support the video tag."}
        </video>
    );
};



let View = ({ BaseView, BaseHeader, Main, Footer, appstore }) => {
    return (
        <div className={`ts_view ts_view__platform`}>
            
            <ScrollToTop scrollStepInPx="50" delayInMs="16.66" />

            <BaseHeader>
                <HeaderContent />
            </BaseHeader>

            <Main>
                

                <Object3d 
                    filePath={"./media/"}
                    fileName={"book.glb"}
                    radius={1.5}
                />


                <div className="box_video">
                    <VideoComp 
                        source={"./media/test.mp4"}
                    /> 
                </div>



            </Main>

            <Footer />

        </div>
    )
};
View = inject("appstore")(observer(View));


export default View;

