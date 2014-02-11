#pragma strict

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

function Update () {
	
	yRotation += Input.GetAxis("Mouse X") * lookSensitivity;
	xRotation -= Input.GetAxis("Mouse Y") * lookSensitivity;
	
	xRotation = Mathf.Clamp(xRotation, -90, 90);
	
	// Permet de ne pas avoir un effet trop "brut" lors du déplacement de la caméra
	currentXRotation = Mathf.SmoothDamp(currentXRotation, xRotation, xRotationV, lookSmoothDamp);
	currentYRotation = Mathf.SmoothDamp(currentYRotation, yRotation, yRotationV, lookSmoothDamp);
	
	transform.rotation = Quaternion.Euler(currentXRotation, currentYRotation, 0);
}