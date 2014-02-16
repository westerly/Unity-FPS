#pragma strict

var cameraObject : GameObject;
// La rotation actuelle du gun autour de l'axe X
@HideInInspector
var targetXRotation : float;
@HideInInspector
// La rotation actuelle du gun autour de l'axe Y
var targetYRotation : float;
@HideInInspector
var targetXRotationV : float;
@HideInInspector
var targetYRotationV : float;
var rotateSpeed : float = 0.2;

// Le vecteur position de l'arme par rapport à la camera sur l'axe xy, holdHeight est négatif car on veut l'arme un peu plus basse que la caméra
var holdHeight : float = -0.3;
// holdSide est positif car on veut l'arme à droite du personnage
var holdSide : float = 0.4;

// Lorsque cette variable vaut 1, l'arme est placé en mode "normal" à droite du perso, l'orsque elle vaut 0 elle est
// placé devant le perso en mode "tir de précision"
var racioHipHold : float = 1;
// La vitesse à laquelle on passe du mode normal au mode tir de précision
var hipToAimSpeed : float = 0.1;
@HideInInspector
var racioHipHoldV : float;
// Le ratio permettant d'ajuster la sensibilité du mouvement du gun lorsque il est en mode tir de précision
var aimRacio : float = 0.4;
// L'angle de zoom du gun
var zoomAngle : float = 30;

// Le nombre de bullet que l'on peut tirer par seconde 
var fireSpeed : float = 15;
// Cette variable est en fait un timer, si celle ci vaut 0 ou moins on peut tirer sinon on doit attendre
@HideInInspector
var waitTilNextFire : float = 0;
var bullet : GameObject;
var bulletSpawn : GameObject;

// Permet de simuler la perte de précision quand on tire
var shootAngleRandomizationAiming : float = 5;
var shootAngleRandomizationNotAiming : float = 15;

// la distance de recul à chaque tir
var recoilAmount : float = 0.1;
// Le temps pour que le gun revienne à sa position initial 
var recoilRecoverTime : float = 0.2;
@HideInInspector
// La position courrant du gun sur l'axe des Z
var currentRecoilZPos : float;
@HideInInspector
var currentRecoilZPosV : float;
// L'objet permettant de jouer le son d'un tir de gun
var bulletSound : GameObject;

var muzzleFlash : GameObject;

function Update () {
	var holdSound : GameObject;
	var holdMuzzleFlash : GameObject;
	// Si le bouton tir est enfoncé
	if(Input.GetButton("Fire1")){
	// Si on peut tirer
		if(waitTilNextFire <=0){
		 	if(bullet)
		 	// On instancie une bullet à la position et à l'angle de rotation de bulletSpawn (situé juste devant le gun)
		 		Instantiate(bullet, bulletSpawn.transform.position, bulletSpawn.transform.rotation);
		 	if(bulletSound)
		 		// Création du son du tir à la position et rotation de bulletSpawn que l'on save dans holdSound
		 		holdSound = Instantiate(bulletSound, bulletSpawn.transform.position, bulletSpawn.transform.rotation);
		 	if(muzzleFlash)
		 		// Création du flash lors du tir
		 		holdMuzzleFlash = Instantiate(muzzleFlash, bulletSpawn.transform.position, bulletSpawn.transform.rotation);
		 		
		 	targetXRotation += (Random.value - 0.5) * Mathf.Lerp(shootAngleRandomizationAiming, shootAngleRandomizationNotAiming, racioHipHold);
		 	targetYRotation += (Random.value - 0.5) * Mathf.Lerp(shootAngleRandomizationAiming, shootAngleRandomizationNotAiming, racioHipHold);
		 	currentRecoilZPos -= recoilAmount;
		 	// Lorsque on a tiré une balle on remet le timer à 1
		 	waitTilNextFire = 1;
		}
	}
	
	// Ici on décrémente waitTilNextFire par Time.deltaTime qui est le nombre de secondes jusqu'à la prochaine frame
	// multiplié par fireSpeed. 
	// Par exemple si fireSpeed vaut 1 (on tir une balle par seconde) Time.deltaTime * 1 est décrémenté à chaque frame
	// donc waitTillNextFire arrive à 0 (ou un peu moins de 0) en une seconde
	waitTilNextFire -= Time.deltaTime * fireSpeed;
	
	// Si holdSound est intancié
	if(holdSound)
		// On place le gun en tant que parent de l'objet son pour que le son "suive" le perso pendant les déplacements
		holdSound.transform.parent = transform;
		
	// Si holdMuzzleFlash est intancié
	if(holdMuzzleFlash)
		// On place le gun en tant que parent de l'objet muzzleFlash pour que le flash "suive" le perso pendant les déplacements
		holdMuzzleFlash.transform.parent = transform;
		
	
	currentRecoilZPos = Mathf.SmoothDamp(currentRecoilZPos, 0, currentRecoilZPosV, recoilRecoverTime);
	
	cameraObject.GetComponent(MouseLookScript).currentTargetCameraAngle = zoomAngle;
	
	//GetButtonDown retourne true sur la frame ou on détecte que le bouton est enfoncé
	//GetButton retourne true à chaque frame ou le bouton est enfoncé
	if( Input.GetButton("Fire2")){
		cameraObject.GetComponent(MouseLookScript).currentAimRacio = aimRacio;
		racioHipHold = Mathf.SmoothDamp(racioHipHold, 0, racioHipHoldV, hipToAimSpeed);
	}
	if( Input.GetButton("Fire2") == false){
		cameraObject.GetComponent(MouseLookScript).currentAimRacio = 1;
		racioHipHold = Mathf.SmoothDamp(racioHipHold, 1, racioHipHoldV, hipToAimSpeed);
	}	
	
	// Multiplier le vecteur position de l'arme par le Quarternion(0, targetYRotation, 0) permet de lui faire faire une rotation sur l'axe des y d'une valeur de targetYRotation
	// Cela permet de ne pas se retrouver avec le gun a gauche lorsque on fait tourner le perso
	transform.position = cameraObject.transform.position + (Quaternion.Euler(targetXRotation, targetYRotation, 0) * Vector3(holdSide * racioHipHold, holdHeight * racioHipHold, 0)
	// On ajoute cette ligne pour le recul du gun 
	+ Quaternion.Euler(targetXRotation, targetYRotation, 0) * Vector3(0,0, currentRecoilZPos));
	// On calcule la rotation du gun sur l'axe des x et des y avec un smoothDamp pour décaler avec la rotation de la camera. Ainsi on croit que l'arme est lourde.
	targetXRotation = Mathf.SmoothDamp(targetXRotation, cameraObject.GetComponent(MouseLookScript).xRotation, targetXRotationV, rotateSpeed);
	targetYRotation = Mathf.SmoothDamp(targetYRotation, cameraObject.GetComponent(MouseLookScript).yRotation, targetYRotationV, rotateSpeed);
	
	transform.rotation = Quaternion.Euler(targetXRotation, targetYRotation, 0);
}