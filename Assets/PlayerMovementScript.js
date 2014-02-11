#pragma strict

var walkAcceleration : float = 5;
var cameraObject : GameObject;
var maxWalkSpeed : float = 10;
var horizontalMovement : Vector2;

function Update () {
	
	// On récupère le vecteur mouvement actuel du personnage sur le plan horizontal xy
	horizontalMovement = Vector2(rigidbody.velocity.x, rigidbody.velocity.z);
	
	// magnitude est la longueur du vecteur mouvement sur le plan xy, de 0 au point xy
	// Si ce vecteur est plus grand que maxWalkSpeed c'est que le personnage va trop vite
	if(horizontalMovement.magnitude > maxWalkSpeed)
	{
		// Permet de normaliser le vecteur mouvement c'est à dire de lui donner une longueur de 1
		// mais celui ci reste toujours dans la meme direction
		horizontalMovement = horizontalMovement.normalized;
		// On mutliplie le vecteur mouvement par maxWalkSpeed pour donner au personnage la vitesse max paramétré
		horizontalMovement *= maxWalkSpeed;
	}
	
	// On affecte au personnage les composantes du vecteur mouvement calculées
	rigidbody.velocity.x = horizontalMovement.x;
	rigidbody.velocity.z = horizontalMovement.y;

	transform.rotation = Quaternion.Euler(0, cameraObject.GetComponent(MouseLookScript).currentYRotation, 0);
	// Input.GetAxis Horizontal ou vertical tient compte de la gravité, il renvoit une valeur entre -1 et 1 en fonction
	// du moment ou le bouton est relaché et de la gravité
	// Pour changer les paramètres aller dans Edit -> Project Settings
	rigidbody.AddRelativeForce(Input.GetAxis("Horizontal") * walkAcceleration, 0, Input.GetAxis("Vertical") * walkAcceleration);
}