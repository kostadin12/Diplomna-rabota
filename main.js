"use strict"

var canvas = document.getElementById("renderCanvas");

        var engine = null;
        var scene = null;
        var sceneToRender = null;
        var assetsManager = null;
        var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
        var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

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

    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 0, 0), scene);
    light1.intensity = 0.7;
    light1.setEnabled(false);
    var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(10, 3, 5), scene);
    light2.intensity = 0.7;
    light2.setEnabled(false);
    var light3 = new BABYLON.HemisphericLight("light3", new BABYLON.Vector3(-10, 10, 10), scene);
    light3.intensity = 0.7;
    light3.setEnabled(false);

    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 20, height: 13}, scene);

    const material = new BABYLON.StandardMaterial('material', scene);
    material.diffuseColor = new BABYLON.Color3(0, 1, 1);

    ground.material = material;

    scene.clearColor = new BABYLON.Color3(0.3, 0.2, 0.4);

   var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
   var panel = new BABYLON.GUI.StackPanel();
    panel.adaptWidthToChildren = true;   
    advancedTexture.addControl(panel);

    //moving the objects
    var startingPoint;
    var currentMesh;

    var getGroundPosition = function () {
        // Use a predicate to get position on the ground
        var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == ground; });
        if (pickinfo.hit) {
            return pickinfo.pickedPoint; 
        }

        return null;
    }

    var pickedMeshesInfo = [];
    var pos;
    var pos2;
    var pos3;
    var onPointerDown = function (evt) {
        if (evt.button !== 0) {
            return;
        }

        //for multiple objects select
        if (event.altKey) {
			// check if we are under a mesh
        	var pickInfo = scene.pick(scene.pointerX, scene.pointerY);
        	if (pickInfo.hit) {
            	pickedMeshesInfo.push(pickInfo.pickedMesh);
                startingPoint = getGroundPosition();
                pos = currentMesh.position.x;
                pos2 = currentMesh.position.y;
                pos3 = currentMesh.position.z;
               

	            if (startingPoint) { //disconnect camera from canvas
    	            setTimeout(function () {
        	            camera.detachControl(canvas);
            	    }, 0);
                    }
        		}
		}
		else{
        var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh !== ground; });
        if (pickInfo.hit) {
            currentMesh = pickInfo.pickedMesh;
            startingPoint = getGroundPosition();
            pos = currentMesh.position.x;
            pos2 = currentMesh.position.y;
            pos3 = currentMesh.position.z;

            if (startingPoint) { 
                setTimeout(function () {
                    camera.detachControl(canvas);
                }, 0);
            }
        }
    }
    }

    var onPointerUp = function () {
        if (startingPoint) {
            camera.attachControl(canvas, true);
            startingPoint = null;
            return;
        }
    }

    var onPointerMove = function () {
        if (!startingPoint) {
            return;
        }

        var current = getGroundPosition();

        if (!current) {
            return;
        }

        var diff = current.subtract(startingPoint);
        if (pickedMeshesInfo.length > 0) {
			for (var i = 0; i < pickedMeshesInfo.length; i++) {
				pickedMeshesInfo[i].position.addInPlace(diff);
				startingPoint = current;
			}
		}
		else{
            currentMesh.position.addInPlace(diff);
			startingPoint = current;
        }
        

    }


    canvas.addEventListener("pointerdown", onPointerDown, false);
    canvas.addEventListener("pointerup", onPointerUp, false);
    canvas.addEventListener("pointermove", onPointerMove, false);
    scene.onDispose = function () {
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointermove", onPointerMove);
    }

    document.getElementById("buttonDetach").addEventListener("click",function () {
                pickedMeshesInfo= [];
    });

        var axis = new BABYLON.Vector3(0, 1, 0);
        var angle = 0.5;
        var SaveAngle = 0;
        document.getElementById("buttonRotation").addEventListener("click", function () { 
            if(pickedMeshesInfo.length > 0){
                for (var i = 0; i < pickedMeshesInfo.length; i++) {
                    pickedMeshesInfo[i].rotate(axis, angle, BABYLON.Space.WORLD);
                }
            }
            else{
            currentMesh.rotate(axis, angle, BABYLON.Space.WORLD);
            SaveAngle ++;
            }
        });
        

        document.getElementById("buttonRestart").addEventListener("click",function () {
            light1.setEnabled(false);
            light2.setEnabled(false);
            light3.setEnabled(false);
            scene.clearColor = new BABYLON.Color3(0.3, 0.2, 0.4);
            if(SaveAngle != 0){
            SaveAngle = (38 - SaveAngle) * 0.5;
            }
            else{SaveAngle = 0;}
            currentMesh.rotate(axis, SaveAngle, BABYLON.Space.WORLD);
            SaveAngle = 0;
            currentMesh.position.x = pos;
            currentMesh.position.y = pos2;
            currentMesh.position.z = pos3;
        });

        var objectUrl;
        document.getElementById("buttonSave").addEventListener("click",function () {
        if (confirm('Do you want to download that scene?')) {
             doDownload('scene', scene);
        }
        });
        //moving up and scaling the mesh with sliders
          var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    advancedTexture.layer.layerMask = 2;

    var panel = new BABYLON.GUI.StackPanel();
    panel.width = "220px";
    panel.height = "200px";
    panel.fontSize = "14px";
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_UP;
    advancedTexture.addControl(panel);
          var header = new BABYLON.GUI.TextBlock();
    header.text = "Sizing:";
    header.height = "40px";
    header.color = "white";
    header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    header.marginTop = "10px";
    panel.addControl(header);
          var slider = new BABYLON.GUI.Slider();
    slider.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    slider.minimum = 0;
    slider.maximum = 5;
    slider.color = "green";
    slider.value = 0;
    slider.height = "20px";
    slider.width = "200px";
    slider.onValueChangedObservable.add(function(value) {
        if (currentMesh) {
            currentMesh.scaling = new BABYLON.Vector3(value, value, value);
        }
    });
    panel.addControl(slider);
    var header2 = new BABYLON.GUI.TextBlock();
    header2.text = "Moving up:";
    header2.height = "40px";
    header2.color = "white";
    header2.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    header2.marginTop = "10px";
    panel.addControl(header2);
    var slider2 = new BABYLON.GUI.Slider();
    slider2.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    slider2.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_DOWN;
    slider2.minimum = 0;
    slider2.maximum = 5;
    slider2.color = "green";
    slider2.value = 0;
    slider2.height = "20px";
    slider2.width = "200px";
    slider2.onValueChangedObservable.add(function(value) {
        if (currentMesh) {
            currentMesh.position.y = value;
        }
    });
    panel.addControl(slider2);

        var have1 = 0;
        var have2 = 0;
        var have3 = 0;
        document.getElementById("buttonLight1").addEventListener("click",function () {
            if(have1 % 2 == 1){
                light1.setEnabled(false);
            }
            else{
                light1.setEnabled(true);
            }
            have1++;
        });

        document.getElementById("buttonLight2").addEventListener("click",function () {
            if(have2 % 2 == 1){
                light2.setEnabled(false);
            }
            else{
                light2.setEnabled(true);
            }
            have2++;
        });

        document.getElementById("buttonLight3").addEventListener("click",function () {
            if(have3 % 2 == 1){
                light3.setEnabled(false);
            }
            else{
                light3.setEnabled(true);
            }
            have3++;        
        });

        document.getElementById("buttonBackground1").addEventListener("click",function () {
            scene.clearColor = new BABYLON.Color3(0.5, 0.8, 0.5);
        });

        document.getElementById("buttonBackground2").addEventListener("click",function () {
            scene.clearColor = new BABYLON.Color3(0.5, 0.234, 0.255);
        });

        document.getElementById("buttonBackground3").addEventListener("click",function () {
            scene.clearColor = new BABYLON.Color3(0.6, 0.3, 0.9);
        });
      
        document.getElementById("buttonColor1").addEventListener("click",function () {
            const material2 = new BABYLON.StandardMaterial('material2', scene);
            material2.diffuseColor = new BABYLON.Color3(0.4, 1, 0.4);
            if(pickedMeshesInfo.length > 0){
                for (var i = 0; i < pickedMeshesInfo.length; i++) {
                    pickedMeshesInfo[i].material = material2;
                }
            }
            else{
            currentMesh.material = material2;
            }
        });

        document.getElementById("buttonColor2").addEventListener("click",function () {
            const material3 = new BABYLON.StandardMaterial('material3', scene);
            material3.diffuseColor = new BABYLON.Color3(0.94, 0.5, 0.5);
            if(pickedMeshesInfo.length > 0){
                for (var i = 0; i < pickedMeshesInfo.length; i++) {
                    pickedMeshesInfo[i].material = material3;
                }
            }
            else{
            currentMesh.material = material3;
            }
        });

        document.getElementById("buttonColor3").addEventListener("click",function () {
            const material4 = new BABYLON.StandardMaterial('material4', scene);
            material4.diffuseColor = new BABYLON.Color3(0.94, 0.94, 0);
            if(pickedMeshesInfo.length > 0){
                for (var i = 0; i < pickedMeshesInfo.length; i++) {
                    pickedMeshesInfo[i].material = material4;
                }
            }
            else{
            currentMesh.material = material4;
            }
        });

        document.getElementById("buttonTexture1").addEventListener("click",function () {
            const material = new BABYLON.StandardMaterial('material', scene);
            material.diffuseTexture = new BABYLON.Texture('assets/images/dark blue.jpg', scene);
            if(pickedMeshesInfo.length > 0){
                for (var i = 0; i < pickedMeshesInfo.length; i++) {
                    pickedMeshesInfo[i].material = material;
                }
            }
            else{
            currentMesh.material = material;
            }
        });

        document.getElementById("buttonTexture2").addEventListener("click",function () {
            const material = new BABYLON.StandardMaterial('material', scene);
            material.diffuseTexture = new BABYLON.Texture('assets/images/Colorful.webp', scene);
            if(pickedMeshesInfo.length > 0){
                for (var i = 0; i < pickedMeshesInfo.length; i++) {
                    pickedMeshesInfo[i].material = material;
                }
            }
            else{
            currentMesh.material = material;
            }
        });

        document.getElementById("buttonTexture3").addEventListener("click",function () {
            const material = new BABYLON.StandardMaterial('material', scene);
            material.diffuseTexture = new BABYLON.Texture('assets/images/rocks.jpg', scene);
            if(pickedMeshesInfo.length > 0){
                for (var i = 0; i < pickedMeshesInfo.length; i++) {
                    pickedMeshesInfo[i].material = material;
                }
            }
            else{
            currentMesh.material = material;
            }
        });

        document.getElementById("buttonDelete").addEventListener("click",function () {
        currentMesh.dispose();
        });
                

    return scene;
};

    //that is for downloading the file
       var objectUrl;
        function doDownload(filename, scene) {
            if(objectUrl) {
                window.URL.revokeObjectURL(objectUrl);
            }
            
            var serializedScene = BABYLON.SceneSerializer.Serialize(scene);
                
            var strMesh = JSON.stringify(serializedScene);
            
            
            if (filename.toLowerCase().lastIndexOf(".babylon") !== filename.length - 8 || filename.length < 9){
                filename += ".babylon";
            }
                    
        	var blob = new Blob ( [ strMesh ], { type : "octet/stream" } );
               
            // turn blob into an object URL; saved as a member, so can be cleaned out later
            objectUrl = (window.webkitURL || window.URL).createObjectURL(blob);
            
            var link = window.document.createElement('a');
            link.href = objectUrl;
            link.download = filename;
            var click = document.createEvent("MouseEvents");
            click.initEvent("click", true, false);
            link.dispatchEvent(click);          
        }


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
scene = createScene();

  assetsManager = new BABYLON.AssetsManager(scene);

  //called when a single task has been sucessfull
  assetsManager.onTaskSuccessObservable.add(function (task) {

    console.log('task successful', task);
  });

  assetsManager.onTaskErrorObservable.add(function (task) {
    console.log('task failed', task.errorObject.message, task.errorObject.exception);
  });
};

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

  
  const htmlInput = document.getElementById("local_file");
  
  htmlInput.onchange = function (evt) {
    var files = evt.target.files;
    var filename = files[0].name;
    var blob = new Blob([files[0]]);
  
    BABYLON.FilesInput.FilesToLoad[filename] = blob;
    assetsManager.addMeshTask('task1', "", "file:", filename);
    assetsManager.load();
    return scene;
  };
