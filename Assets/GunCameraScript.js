#pragma strict

var cameraObject : GameObject;

function Awake () {
	cameraObject = GameObject.FindWithTag("MainCamera");
}

function Update () {
	camera.fieldOfView = cameraObject.camera.fieldOfView;
}