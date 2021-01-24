"use strict"

var canvas = document.getElementById("renderCanvas");

        var engine = null;
        var scene = null;
        var sceneToRender = null;
        var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
        var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
   // var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    //camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    //camera.attachControl(canvas, true);

        // This creates and initially positions a follow camera 	
        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);

        // This positions the camera
        camera.setPosition(new BABYLON.Vector3(0, 5, -10));
        
        //camera.target is set after the target's creation
        
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
        var keys={forward:0, jump:false};
        window.addEventListener('keydown',function(event){
     
               if (event.keyCode==87){		keys.forward=1;	}
            if (event.keyCode==32){		keys.jump=true;	}
        });
    
        window.addEventListener('keyup',function(event){
             
               if (event.keyCode==87){		keys.forward=0;	}
            if (event.keyCode==32){		keys.jump=false;	}
        });

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light0 = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light0.intensity = 0.7;

    // Our built-in 'sphere' shape.
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 20, height: 13}, scene);

    //Putting materials on objects
    const material = new BABYLON.StandardMaterial('marterial', scene);
    material.diffuseTexture = new BABYLON.Texture('assets/images/picture.png', scene);

    sphere.material = material;

    const material2 = new BABYLON.StandardMaterial('marterial', scene);
    material2.diffuseColor = new BABYLON.Color3(0, 1, 1);

    ground.material = material2;


   var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
   var panel = new BABYLON.GUI.StackPanel();
    panel.adaptWidthToChildren = true;   
    advancedTexture.addControl(panel);

   /*var button = BABYLON.GUI.Button.CreateSimpleButton("button", "Reset");
        button.width = 0.2;
        button.height = "40px";
        button.color = "white";
        button.background = "black";
        button.top = "100px"
        button.left = "510px";
        
        panel.addControl(button);

        button.onPointerClickObservable.add(function (){
            setPositionSphere1();
        });


        var dropdownA = new Dropdown(advancedTexture, "40px", "180px");
        dropdownA.top = "250px";
        dropdownA.left = "520px";
        dropdownA.addOption(0, "Light 1");
        dropdownA.addOption(1, "Light 2");
        dropdownA.addOption(2, "Light 3");

        var dropdownB = new Dropdown(advancedTexture, "40px", "180px");
        dropdownB.top = "250px";
        dropdownB.left = "320px";
        dropdownB.addOption(0, "Backgroung Color 1");
        dropdownB.addOption(1, "Backgroung Color 2");
        dropdownB.addOption(2, "Backgroung Color 3");

        dropdownA.options.isVisible = true;
        dropdownB.options.isVisible = true;*/

        document.getElementById("button1").addEventListener("click",function () {
           /* this._htmlInput = document.getElementById("is-local-files");

            this._htmlInput.addEventListener(
                "change",
                event => {
                  let filesToLoad = null;
                  // Handling data transfer via drag'n'drop
                  if (event && event.dataTransfer && event.dataTransfer.files) {
                    filesToLoad = event.dataTransfer.files;
                  }
                  // Handling files from input files
                  if (event && event.target && event.target.files) {
                    filesToLoad = event.target.files;
                  }
                  if (filesToLoad.length == 0) {
                    return;
                  }
          
                  const format = filesToLoad[0].name.split(".").pop();
          
                  this.reload(Array.from(filesToLoad), format);
                },
                false
            );
            var sphere = BABYLON.MeshBuilder.CreateSphere("sphere1", 16, 2, scene);
		// Move the sphere upward 1/2 its height
		sphere.position.y = 10;*/
        });
        
        
        document.getElementById("button2").addEventListener("click",function () {
            location.reload(); 
        });

        var flag = 0;
        var have1 = 0;
        var have2 = 0;
        var have3 = 0;
        document.getElementById("button3").addEventListener("click",function () {
            /*if(flag == 0){
                light0.intensity = 0;
            }
            if(flag == 2){
                light2.intensity = 0;
            }
            if(flag == 3){
                light3.intensity = 0;
            }*/
            if(have1 == 0){
            var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 0, 0), scene);
            }
            have1 += 1;
            light1.intensity = 0.7;
            flag = 1;
        });

        document.getElementById("button4").addEventListener("click",function () {
            /*if(flag == 0){
                light0.intensity = 0;
            }
            if(flag == 1){
                light1.intensity = 0;
            }
            if(flag == 3){
                light3.intensity = 0;
            }*/
            if(have2 == 0){
            var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(10, 3, 5), scene);
            }
            have2 += 1;
            light2.intensity = 0.7;
            flag = 2;
        });

        document.getElementById("button5").addEventListener("click",function () {
            /*if(flag == 0){
                light0.intensity = 0;
            }
            if(flag == 1){
                light1.intensity = 0;
            }
            if(flag == 2){
                light2.intensity = 0;
            }*/
            if(have3 == 0){
            var light3 = new BABYLON.HemisphericLight("light3", new BABYLON.Vector3(-10, 10, 10), scene);
            }
            have3 += 1;
            light3.intensity = 0.7;
            flag = 3;
        });

      

    return scene;
};



/*var Dropdown = (function () {
	function Dropdown(advancedTexture, height, width, color, background) {
		// Members
        this.height = height;
        this.width = width;
        this.color = color || "black";
        this.background = background || "white";

        this.advancedTexture = advancedTexture;

        // Container
		this.container = new BABYLON.GUI.Container();
        this.container.width = this.width;
        this.container.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.container.isHitTestVisible = false;
        
        // Primary button
        this.button = BABYLON.GUI.Button.CreateSimpleButton(null, "Menu");
        this.button.height = this.height;
        this.button.background = this.background;
        this.button.color = this.color;
        this.button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

        // Options panel
        this.options = new BABYLON.GUI.StackPanel();
        this.options.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.options.top = this.height;
        this.options.isVisible = false;
        this.options.isVertical = true;

        var _this = this;
        this.button.onPointerUpObservable.add(function() {
            _this.options.isVisible = !_this.options.isVisible;
        });

        // add controls
        this.advancedTexture.addControl(this.container);
        this.container.addControl(this.button);
        this.container.addControl(this.options);
        
        // Selection
        this.selected = null;
        this.selectedValue = null;
	}
    Object.defineProperty(Dropdown.prototype, 'top', {
		get: function() { 
			return this.container.top;
		},
		set : function(value) {
            this.container.top = value;
		},
		enumerable: true,
		configurable: true
	});
    Object.defineProperty(Dropdown.prototype, 'left', {
		get: function() { 
			return this.container.left;
		},
		set : function(value) {
            this.container.left = value;
		},
		enumerable: true,
		configurable: true
	});
    Dropdown.prototype.addOption = function(value, text, color, background){
        var _this = this;
        var button = BABYLON.GUI.Button.CreateSimpleButton(text, text);
        button.height = _this.height;
        button.paddingTop = "-1px";
        button.background = background || _this.background;
        button.color = color || _this.color;
        button.onPointerUpObservable.add(function() {
            _this.options.isVisible = false;
            _this.button.children[0].text = text;
            _this.selected = button;
            _this.selectedValue = value;
        });
        this.options.addControl(button);
    };
	return Dropdown;
}());*/
                var engine;
                var scene;
                var initFunction = async function() {               
                    var asyncEngineCreation = async function() {
                        try {
                        return createDefaultEngine();
                        } catch(e) {
                        console.log("the available createEngine function failed. Creating the default engine instead");
                        return createDefaultEngine();
                        }
                    }

                    engine = await asyncEngineCreation();
        if (!engine) throw 'engine should not be null.';
        scene = createScene();};
        initFunction().then(() => {sceneToRender = scene        
            engine.runRenderLoop(function () {
                if (sceneToRender && sceneToRender.activeCamera) {
                    sceneToRender.render();
                }
            });
        });

        // Resize
        window.addEventListener("resize", function () {
            engine.resize();
        });
