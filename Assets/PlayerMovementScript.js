#pragma strict

var walkAcceleration : float = 800;
// Cette variable permet d'attenuer le controle du perso quand il est dans les airs mais celui ci peut toujours être contrôlé 
var walkAccelAirRation : float = 0.5;
// Variable servant à paramétré la vitesse que met le perso à s'arrêter ou a changer de direction
var walkDeacceleration : float = 0.1;
@HideInInspector
var walkDeaccelerationVolx : float;
@HideInInspector
var walkDeaccelerationVolz : float;
var cameraObject : GameObject;
var maxWalkSpeed : float = 10;
@HideInInspector
var horizontalMovement : Vector2;
// La puissance du saut
var jumpVelocity : float = 500;
// True si le personnage touche le sol et false dans le cas contraire
@HideInInspector
var grounded : boolean = false;
// Variable representant l'angle d'inclinaison maximum entre le perso et l'objet de contact ou le perso est capable d'effectuer un saut  
var maxSlope : float = 60; 

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
	
	if(grounded){
		// SmoothDamp permet de réduire la vitesse de mouvement en fonction du paramètre walkDeacceleration qui est en seconde
		// current 	The current position.
		// target 	The position we are trying to reach.
		// currentVelocity 	The current velocity, this value is modified by the function every time you call it.
		// smoothTime 	Approximately the time it will take to reach the target. A smaller value will reach the target faster.
		
		// Le mouvement du perso lorsque les touches mouvement sont relaché est donc atténué jusqu'a arriver à 0 (le perso ne ralentit pas brusquement)
		// smoothDamp permet d'avoir le meme comportement quelque soit le framerate du jeu puisque il utilise un temps en seconde pour atténuer la valeur velocity du mouvement
		rigidbody.velocity.x = Mathf.SmoothDamp(rigidbody.velocity.x, 0, walkDeaccelerationVolx, walkDeacceleration);
		rigidbody.velocity.z = Mathf.SmoothDamp(rigidbody.velocity.z, 0, walkDeaccelerationVolz, walkDeacceleration);
	}

	transform.rotation = Quaternion.Euler(0, cameraObject.GetComponent(MouseLookScript).currentYRotation, 0);
	// Input.GetAxis Horizontal ou vertical tient compte de la gravité, il renvoit une valeur entre -1 et 1 en fonction
	// du moment ou le bouton est relaché et de la gravité
	// Pour changer les paramètres aller dans Edit -> Project Settings
	// Multiplier par Time.deltaTime permet de ne pas avoir une vitesse de mouvement qui dépend du framerate du jeu mais qui dépend du temps
	if(grounded)
		rigidbody.AddRelativeForce(Input.GetAxis("Horizontal") * walkAcceleration * Time.deltaTime, 0, Input.GetAxis("Vertical") * walkAcceleration * Time.deltaTime);
	else
		rigidbody.AddRelativeForce(Input.GetAxis("Horizontal") * walkAcceleration * walkAccelAirRation * Time.deltaTime, 0, Input.GetAxis("Vertical") * walkAcceleration * walkAccelAirRation * Time.deltaTime);
	
	
	if(Input.GetButtonDown("Jump") && grounded)
		rigidbody.AddForce(0, jumpVelocity, 0);
}


// Cette fonction est appelée à chaque fois que le rigidbody (le perso) est en contact avec un boject collider
function OnCollisionStay (collision : Collision){
	// Pour chaque point de contact entre le perso et les objets collider de la Scene
	for(var contact : ContactPoint in collision.contacts){
		// Si l'angle entre la normal du point de contact et le vecteur y est plus petit que maxSlope alors le perso peut sauter
		if(Vector3.Angle(contact.normal, Vector3.up) < maxSlope)
			grounded = true;
	}

}

// Fonction appelée dès que le perso sort d'une collision
function OnCollisionExit(){
	grounded = false;
}