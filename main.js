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
    //light1.setEnabled(false);
    light1.actionManager = new BABYLON.ActionManager(scene);
	light1.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function () {
		alert('player clicked');
	}));
    var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(10, 3, 5), scene);
    light2.intensity = 0.7;
    light2.setEnabled(false);
    var light3 = new BABYLON.HemisphericLight("light3", new BABYLON.Vector3(-10, 10, 10), scene);
    light3.intensity = 0.7;
    light3.setEnabled(false);

    // Our built-in 'sphere' shape.
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
    var sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere2", {diameter: 2, segments: 32}, scene);
        sphere2.position.x = 5;
        sphere2.position.y = 1;

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 20, height: 13}, scene);

    //Putting materials on objects
    const material = new BABYLON.StandardMaterial('material', scene);
    material.diffuseTexture = new BABYLON.Texture('assets/images/picture.png', scene);

    sphere2.material = material;

    const material2 = new BABYLON.StandardMaterial('material', scene);
    material2.diffuseColor = new BABYLON.Color3(0, 1, 1);

    ground.material = material2;

    scene.clearColor = new BABYLON.Color3(0.3, 0.2, 0.4);

   var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
   var panel = new BABYLON.GUI.StackPanel();
    panel.adaptWidthToChildren = true;   
    advancedTexture.addControl(panel);

    //moving the objects
    // var canvas = engine.getRenderingCanvas();
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
               

	            if (startingPoint) { //disconnect camera from canvas
    	            setTimeout(function () {
        	            camera.detachControl(canvas);
            	    }, 0);
                    }
        		}
		}
		else{
        // check if we are under a mesh
        var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh !== ground; });
        if (pickInfo.hit) {
            currentMesh = pickInfo.pickedMesh;
            startingPoint = getGroundPosition();

            if (startingPoint) { //disconnect camera from canvas
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
    var s = function(){
        var S = startingPoint;
        return S;
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
				//SavePos = startingPoint;
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
            //location.reload(); 
            /*light1.setEnabled(false);
            light2.setEnabled(false);
            light3.setEnabled(false);
            scene.clearColor = new BABYLON.Color3(0.3, 0.2, 0.4);*/
            if(SaveAngle != 0){
            SaveAngle = (38 - SaveAngle) * 0.5;
            }
            else{SaveAngle = 0;}
            currentMesh.rotate(axis, SaveAngle, BABYLON.Space.WORLD);
            SaveAngle = 0;

           currentMesh.position.addInPlace(s);
        });

        var objectUrl;
        document.getElementById("buttonSave").addEventListener("click",function () {
        if (confirm('Do you want to download that scene?')) {
             doDownload('scene', scene);
        } 
        });

        var toSize = function(but) {
            var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh !== ground; });
            currentMesh = sphere;
        if (pickInfo.hit) {
            currentMesh = pickInfo.pickedMesh;
        }
            switch(but) {
                case 0: 
                    currentMesh.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
                break
                case 1: 
                    currentMesh.scaling = new BABYLON.Vector3(1, 1, 1);
                break
                case 2:
                    currentMesh.scaling = new BABYLON.Vector3(2, 2, 2);
                break
        }
    }
        
        var toPlace = function(isChecked) {
            var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh !== ground; });
            currentMesh = sphere;
        if (pickInfo.hit) {
            currentMesh = pickInfo.pickedMesh;
        }
            if (isChecked) {
                currentMesh.position.y = 1.5;
            }
            else {
                currentMesh.position.y = 0.5;
            }
        }
        
        var setColor = function(but) {   
            var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh !== ground; });
            currentMesh = sphere;
        if (pickInfo.hit) {
            currentMesh = pickInfo.pickedMesh;
        }
            switch(but) {
                case 0: 
                const material2 = new BABYLON.StandardMaterial('material2', scene);
            material2.diffuseColor = new BABYLON.Color3(0.4, 1, 0.4);
                    currentMesh.material = material2;
                break
                case 1: 
                const material3 = new BABYLON.StandardMaterial('material3', scene);
            material3.diffuseColor = new BABYLON.Color3(0.94, 0.5, 0.5);
                    currentMesh.material = material3;
                break
                case 2: 
                const material4 = new BABYLON.StandardMaterial('material4', scene);
            material4.diffuseColor = new BABYLON.Color3(0.94, 0.94, 0);
                    currentMesh.material = material4;
                break
            }
        }

        var setTexture = function(but) {   
            var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh !== ground; });
            currentMesh = sphere;
        if (pickInfo.hit) {
            currentMesh = pickInfo.pickedMesh;
        }
            switch(but) {
                case 0: 
                const material4 = new BABYLON.StandardMaterial('material', scene);
            material4.diffuseTexture = new BABYLON.Texture('assets/images/dark blue.jpg', scene);
                    currentMesh.material = material4;
                break
                case 1: 
                const material5 = new BABYLON.StandardMaterial('material', scene);
            material5.diffuseTexture = new BABYLON.Texture('assets/images/Colorful.webp', scene);
                    currentMesh.material = material5;
                break
                case 2: 
                const material6 = new BABYLON.StandardMaterial('material', scene);
            material6.diffuseTexture = new BABYLON.Texture('assets/images/rocks.jpg', scene);
                    currentMesh.material = material6;
                break
            }
        }
        
        var selectBox = new BABYLON.GUI.SelectionPanel("sp");
    selectBox.width = 0.25;
    selectBox.height = 0.9;
    selectBox.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    selectBox.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
     
    advancedTexture.addControl(selectBox);

	var transformGroup = new BABYLON.GUI.CheckboxGroup("Transformation");
    transformGroup.addCheckbox("High", toPlace);

    var SizeGroup = new BABYLON.GUI.RadioGroup("Size");
    SizeGroup.addRadio("Small", toSize, true);
    SizeGroup.addRadio("Medium", toSize);
    SizeGroup.addRadio("Big", toSize);
	
	var colorGroup = new BABYLON.GUI.RadioGroup("Color");
	colorGroup.addRadio("Green", setColor, true);
    colorGroup.addRadio("Red", setColor);
    colorGroup.addRadio("Yellow", setColor);

    var textureGroup = new BABYLON.GUI.RadioGroup("Texture");
	textureGroup.addRadio("Dark Blue", setTexture, true);
    textureGroup.addRadio("Colorful", setTexture);
    textureGroup.addRadio("Rocks", setTexture);

    selectBox.addGroup(transformGroup);
    selectBox.addGroup(SizeGroup);
    selectBox.addGroup(colorGroup);
    selectBox.addGroup(textureGroup);


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
            currentMesh.material = 4;
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
        //new for upploading
        var loadFile = function (event) {
            var output = document.getElementById('output');
            output.src = URL.createObjectURL(event.target.files[0]);
            output.onload = function () {
              URL.revokeObjectURL(output.src) // free memory
            }
          };

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
//new for uppload
  assetsManager = new BABYLON.AssetsManager(scene);

  //called when a single task has been sucessfull
  assetsManager.onTaskSuccessObservable.add(function (task) {

    // var mesh = task.loadedMeshes[0]; //will hold the mesh that has been loaded recently
    console.log('task successful', task);
  });

  assetsManager.onTaskErrorObservable.add(function (task) {
    console.log('task failed', task.errorObject.message, task.errorObject.exception);
  });
};
//
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

function doImport() {

    var f = browseBut.files[0];
    if (f) {
      var r = new FileReader();
      r.onloadend = function (evt) { doImport(evt.target.result) };
      //r.readAsText(f);
    }
    else {
      alert("Failed to load file");
    }
  };
  
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
