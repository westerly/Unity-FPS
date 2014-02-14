#pragma strict

// Le temps au bout duquel le bullet hole disparait
var destroyAfterTime : float = 30;
// Un peu de random pour que tous les bullet hole ne disparaissent pas au meme moment
var destroyAfterTimeRandomization : float = 0;
@HideInInspector
var countToTime : float;

function Awake(){
	destroyAfterTime += Random.value * destroyAfterTimeRandomization;
}

function Update () {
	countToTime += Time.deltaTime;
	if(countToTime >= destroyAfterTime)
		Destroy(gameObject);
}