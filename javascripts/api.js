var apiName = 'tasks'
var apiVersion = 'v1'
var clientId = '461317286070-csbrouq2mlscb8gru49g3hsdsklir5eu.apps.googleusercontent.com';
var scopes = 'https://www.googleapis.com/auth/tasks';
var apiKey = 'AIzaSyCqCWh7YGfoxyhLp2WE1uKMq6iiJ-eKl84';

//* Google Authentication

function handleClientLoad() { 
  gapi.client.setApiKey(apiKey);
  window.setTimeout(checkAuth,1);
  console.log("handleClientLoad()"); 
}

function checkAuth() {
  gapi.auth.authorize({client_id: clientId, scope: scopes}, handleAuthResult);
  // removed immediate: true 
  console.log("checkAuth()"); 
}

function handleAuthResult(authResult) {
  var authorizeButton = document.getElementById('authorize-button');
   
  if (authResult && !authResult.error) {
    authorizeButton.style.visibility = 'hidden';
    makeApiCall();
  } else {
    console.log(authResult.error);
    authorizeButton.style.visibility = '';
    authorizeButton.onclick = handleAuthClick;
  }
}

function handleAuthClick(event) {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
  return false;
}  

function getTasks(taskList) {
  var request = gapi.client.tasks.tasks.list({"tasklist":taskList});
  request.execute(function(resp) {  
    if (resp.items !== undefined) {
      resp.items.forEach(function(task) {
        updateList(task.title, $("#" + taskList + " ul"));
      });
    } 
  });
}

function getTaskLists() {
  var request = gapi.client.tasks.tasklists.list({});
  request.execute(function(resp) {
    resp.items.forEach(function(taskList) { 
      newList(taskList.title, taskList.id);
      getTasks(taskList.id); 
    });
  });
}

function makeApiCall() {
  gapi.client.load('tasks', 'v1', function() { 
    console.log("loaded.");
    getTaskLists();
  }); 
}                      
