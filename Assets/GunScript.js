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
var rotateSpeed : float = 0.3;

// Le vecteur position de l'arme par rapport à la camera sur l'axe xy, holdHeight est négatif car on veut l'arme un peu plus basse que la caméra
var holdHeight : float = -0.3;
// holdSide est positif car on veut l'arme à droite du personnage
var holdSide : float = 0.3;

function Update () {
	
	// Multiplier le vecteur position de l'arme par le Quarternion(0, targetYRotation, 0) permet de lui faire faire une rotation sur l'axe des y d'une valeur de targetYRotation
	// Cela permet de ne pas se retrouver avec le gun a gauche lorsque on fait tourner le perso
	transform.position = cameraObject.transform.position + (Quaternion.Euler(targetXRotation, targetYRotation, 0) * Vector3(holdSide, holdHeight, 0));
	// On calcule la rotation du gun sur l'axe des x et des y avec un smoothDamp pour décaler avec la rotation de la camera. Ainsi on croit que l'arme est lourde.
	targetXRotation = Mathf.SmoothDamp(targetXRotation, cameraObject.GetComponent(MouseLookScript).xRotation, targetXRotationV, rotateSpeed);
	targetYRotation = Mathf.SmoothDamp(targetYRotation, cameraObject.GetComponent(MouseLookScript).yRotation, targetYRotationV, rotateSpeed);
	
	transform.rotation = Quaternion.Euler(targetXRotation, targetYRotation, 0);
}