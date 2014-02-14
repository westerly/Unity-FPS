#pragma strict

// La distance jusqu'a laquelle on cherche à voir si la bullet rentre en collision avec un element
var maxDist : float = 10000;
var decalHitWall : GameObject;
// La distance par rapport à l'element en colision ou on va dessiner le bullet hole (évite de superposer les textures) 
var floatInFrontOfWall : float = 0.0001;

function Update () {
	var hit : RaycastHit;
	// transform.forward retourne un vecteur de magnitude 1 qui représente la direction ou est tiré la balle
	// On sauvegarde toutes les informations du point de contact dans hit
	// On spécifie le 5ème paramètre afin de ne pas chercher une collision sur une distance sup à maxDist
	if(Physics.Raycast(transform.position, transform.forward, hit, maxDist)){
		// Si decalHitWall est def et le point de contact est situé sur un élément tagé "Level Parts"
		if(decalHitWall && hit.transform.tag == "Level Parts")
			// Ici on instancie la bullet hole à la position du point de contact + la distance paramétré dans floatInFrontOfWall sur la normal du point de contact
			//  Quaternion.LookRotation de hit.normal représente le plan en 2 dimensions perpendiculaire au vecteur normal du point de contact
			// Un Quaternion peut aussi représenter la roataion de ce plan par rapport à l'axe du vecteur normal mais c'est inutile ici
			// On laisse donc le 2ème param de LookRotation vide
			Instantiate(decalHitWall, hit.point + (hit.normal * floatInFrontOfWall), Quaternion.LookRotation(hit.normal));
	}
	// gameObject est l'objet bullet
	Destroy(gameObject);
}