#pragma strict

// L'angle de vision par défault de la caméra
var defaultCameraAngle : float = 60;
// L'angle de vision de la camera lorsque le gun est en mode "tir de précision"
// Cette valeur dépend donc du gun
@HideInInspector
var currentTargetCameraAngle : float = 60;
// Le ratio pour le zoom, si racioZoom = 1, l'angle de vision de la camera vaudra defaultCameraAngle (le gun est en mode normal)
// si racioZoom vaut 0, l'angle  de vision de la camera vaudra currentTargetCameraAngle
@HideInInspector
var racioZoom : float = 1;
@HideInInspector
var racioZoomV : float;
// La vitesse du zoom
var racioZoomSpeed : float = 0.1;

var lookSensitivity : float = 5;
// Permet de supprimer les variables de l'inspector (On a pas besoin de les modifier depuis l'inspector manuellement)
@HideInInspector
var xRotation : float;
@HideInInspector
var yRotation : float;
@HideInInspector
var currentYRotation : float;
@HideInInspector
var currentXRotation : float;
@HideInInspector
var yRotationV : float;
@HideInInspector
var xRotationV : float;
var lookSmoothDamp : float = 0.1;
// Variable permettant d'ajuster la sensibilité de la souris lorsque le gun est en mode tir de précision
// C'est GunScript qui s'occupe de changer sa valeur
@HideInInspector
var currentAimRacio : float = 1;

function Update () {
	
	// Si currentAimRacio vaut 1 cela veu dire que le gun est en mode normal (fire2 not pressed)
	if( currentAimRacio == 1)
		// Ici on smoothDamp racioZoom vers 1 pour atteindre defaultCameraAngle 
		racioZoom = Mathf.SmoothDamp(racioZoom, 1, racioZoomV, racioZoomSpeed);
	else
		// la on est en mode tir de précision donc on smoothDamp racioZoom vers 0 pour atteindre la valeur currentTargetCameraAngle
		// qui dépend du gun que l'on utilise
		racioZoom = Mathf.SmoothDamp(racioZoom, 0, racioZoomV, racioZoomSpeed);
	
	// La propriété fieldOfView permet de changer l'angle de vision de la camera
	// Mathf.Lerp permet de donner un nombre entre param1 et param2 suivant param3 qui est comprit entre 0 et 1
	// Si param3 vaut 0 Lerp donnera currentTargetCameraAngle 
	// Si param3 vaut 1 Lerp donnera defaultCameraAngle
	// Cela permet de ne pas zoomer et dezoomer brusquement 
	camera.fieldOfView = Mathf.Lerp(currentTargetCameraAngle, defaultCameraAngle, racioZoom);
	
	yRotation += Input.GetAxis("Mouse X") * lookSensitivity * currentAimRacio;
	xRotation -= Input.GetAxis("Mouse Y") * lookSensitivity * currentAimRacio;
	
	xRotation = Mathf.Clamp(xRotation, -90, 90);
	
	// Permet de ne pas avoir un effet trop "brut" lors du déplacement de la caméra
	currentXRotation = Mathf.SmoothDamp(currentXRotation, xRotation, xRotationV, lookSmoothDamp);
	currentYRotation = Mathf.SmoothDamp(currentYRotation, yRotation, yRotationV, lookSmoothDamp);
	
	transform.rotation = Quaternion.Euler(currentXRotation, currentYRotation, 0);
}