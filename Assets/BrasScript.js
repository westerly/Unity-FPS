#pragma strict

@HideInInspector
var cameraObject : GameObject;

var holdHeight : float = -0.44;
var holdSide : float = -0.21;
var holdFront : float = 0.1;
var targetXRotation : float;
var targetYRotation : float;


var currentGun : GameObject;

function Awake () {
	//holdHeight = currentGun.GetComponent(GunScript).holdHeight;
	//holdSide = currentGun.GetComponent(GunScript).holdSide;
	
	holdHeight = -0.44;
	holdSide = -0.21;
	holdFront = 0.1;
	
	cameraObject = GameObject.FindWithTag("MainCamera");
	transform.localScale = Vector3(20,20,20);
	transform.rotation = transform.rotation * Quaternion.Euler(0,90,0);
	
}

function LateUpdate () {


	targetXRotation = currentGun.GetComponent(GunScript).targetXRotation;
	targetYRotation = currentGun.GetComponent(GunScript).targetYRotation;
	
	transform.position = cameraObject.transform.position + (Quaternion.Euler(targetXRotation, targetYRotation, 0)
		 * Vector3(holdSide, holdHeight, holdFront));
		 
	for (var child : Transform in transform) {
    	child.localPosition = Vector3(0,0,0);
	}
	
	//transform.position = cameraObject.transform.position;
	//cameraObject.transform.position - Vector3(0,2,0); //+ (Quaternion.Euler(targetXRotation, targetYRotation, 0));
		 //* Vector3(holdSide, holdHeight, 0));
	
	transform.rotation = Quaternion.Euler(targetXRotation, targetYRotation , 0) * Quaternion.Euler(0,90,0);
	//transform.rotation = cameraObject.transform.rotation * Quaternion.Euler(0,90,0);
	//Quaternion.Euler(targetXRotation, targetYRotation + 90, 0);
	
}