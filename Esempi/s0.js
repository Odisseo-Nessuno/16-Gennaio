//Step -1: importo le texture
var textures = [];
textures["tetto"] = new THREE.ImageUtils.loadTexture("./media/top.png",null,null);
textures["lato"] = new THREE.ImageUtils.loadTexture("./media/lato.png",null,null);
textures["erba"] = new THREE.ImageUtils.loadTexture("./media/tall_grass.png",null,null);
textures["plato"] = new THREE.ImageUtils.loadTexture("./media/primolato.png",null,null);

//Step 0: creo camera e renderer
var scene = new THREE.Scene();
scene.fog=new THREE.Fog( 0x000000, 1,20 );
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 20 );
camera.position.set(10,5,10);
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Step 1: logica - creo altezza casuali
var hterreno=[];
for(i=0; i<32; i++){
	hterreno[i] = [];
	for(j=0; j<32; j++){
		hterreno[i][j]= (Math.random()*100)%3|0;
	}
}



//Step 2: preparo la funzione per aggiungere l'erba

function grass(x,z){
	var geometry = new THREE.PlaneGeometry(1.4 , 1.4);
	var material = new THREE.MeshBasicMaterial({map:textures["erba"],transparent:true, side: THREE.DoubleSide});
	var mesh = new THREE.Mesh(geometry,material);

	var mesh2 = mesh.clone();

	mesh.rotation.y=Math.PI/4;
	mesh.position.set(x,hterreno[z][x]+1,z);
	mesh2.rotation.y=-Math.PI/4;
	mesh2.position.set(x,hterreno[z][x]+1,z);
	scene.add(mesh);
	scene.add(mesh2);
}
function metto_erba(x,z){
	k=Math.random()*100|0;
	if(k>=75){
		grass(x,z);
	}

}


//Step 3: preparo la funzione per aggiungere i tetti
function tetto(x,z){
	var geometry = new THREE.PlaneGeometry(1,1,1);
	var material = new THREE.MeshBasicMaterial({map:textures["tetto"], side: THREE.DoubleSide});
	var mesh = new THREE.Mesh(geometry,material);

	mesh.rotation.x=Math.PI/2;
	mesh.position.set(x,hterreno[z][x]+0.5,z);
	scene.add(mesh);
}

//Step 4: e ora i lati
function creaLato(textureName){
	var geometry = new THREE.PlaneGeometry(1,1,1);
	var material = new THREE.MeshBasicMaterial({map:textures[textureName], side: THREE.DoubleSide});
	var mesh = new THREE.Mesh(geometry,material);	
	return mesh;
}

function lato(x,z,altezzaCorrente){
	nomeTexture="lato";//voglio distinguere tra lati terminali (con in cima l'erba) e lati di sola terra
	if(altezzaCorrente==hterreno[z][x]){ 
		nomeTexture = "plato";
	}
	//controllo a est
	if(x>0){
		if(hterreno[z][x-1]<altezzaCorrente){
			mesh=creaLato(nomeTexture);
			mesh.rotation.y=Math.PI/2;
			mesh.position.set(x-0.5,altezzaCorrente,z);
			scene.add(mesh);
		}
	}
	//controllo a sud
	if(z<31 && hterreno[z+1][x]<altezzaCorrente){
			mesh=creaLato(nomeTexture);
			mesh.position.set(x,altezzaCorrente,z+0.5);
			scene.add(mesh);		
	}
	//etc
	if(z>0 && hterreno[z-1][x]<altezzaCorrente){
			mesh=creaLato(nomeTexture);
			mesh.position.set(x,altezzaCorrente,z-0.5);
			scene.add(mesh);		
	}	
	if(x<31 && hterreno[z][x+1]<altezzaCorrente){
			mesh=creaLato(nomeTexture);
			mesh.rotation.y=Math.PI/2;
			mesh.position.set(x+0.5,altezzaCorrente,z);
			scene.add(mesh);		
	}	
	if(altezzaCorrente>=0)	//ora vado al cubetto sotto a fare lo stesso controllo (in modo che non ci siano cubi a mezz'aria!)
		lato(x,z,altezzaCorrente-1);

}

//Step 5
//il motore di tutto
function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );
}
render();


//Metto insieme tutto!
for(i=0; i<32;i++){
	for(j=0; j<32;j++){
		tetto(j,i);
		lato(j,i,hterreno[i][j]);
		metto_erba(j,i);
	}
}



//Step 6: l'input.

function mouse_position(e){
	mx = e.clientX;
	my = e.clientY;
	if(mx>700){
		camera.rotation.y-=Math.PI/64;
	}
	else if(mx<500){
		camera.rotation.y+=Math.PI/64;
	}
}

document.addEventListener("keydown",function(event){
		var keyCode = event.which;
	switch(keyCode){
		case 65:
			camera.position.x-=1;
		break;
		case 68:
			camera.position.x+=1;
		break;		
		case 87:
			camera.position.z-=1;
		break;	
		case 83:
			camera.position.z+=1;	
		break;		
		case 69:
			camera.position.y+=1;	
		break;	
		case 81:
			camera.position.y-=1;	
		break;					
	}
});