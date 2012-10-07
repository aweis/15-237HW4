var apiName = 'tasks'
var apiVersion = 'v1'
var clientId = '461317286070-csbrouq2mlscb8gru49g3hsdsklir5eu.apps.googleusercontent.com';
var scopes = 'https://www.googleapis.com/auth/tasks';
var apiKey = 'AIzaSyCqCWh7YGfoxyhLp2WE1uKMq6iiJ-eKl84';

//* Google Authentication
window.onload = function() {
    handleClientLoad();
  };

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
    makeApiCall();
  } else {
    console.log(authResult.error);
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
        updateList(task.id, task.title, $("#" + taskList + "taskBox" + " ul")); 
        if(task.status === "completed") {
          $('#'+task.id).addClass("complete");
          $('#'+task.id + " :checkbox").prop("checked", true);
        }
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

function addTaskList(title) {
  var tasklist = {
    'title': title
  }
  var request = gapi.client.tasks.tasklists.insert({'resource': tasklist});
  request.execute(function(resp) {
    console.log(resp);
    $('.menuItem').last().attr('id', resp.id); 
    $('.listBoxOn').last().attr('id', resp.id+"taskBox"); 
  });
}

function addTask(title) {
  var task = {
    "title":title
  }
  var taskList = $('.listBoxOn').last().attr('id').replace("taskBox", "");
  console.log(taskList);
  var request = gapi.client.tasks.tasks.insert({
    'tasklist': taskList, 
    'resource': task
  });
  request.execute(function(resp) {
    console.log(resp);
    $('.listBoxOn ul li').last().attr('id', resp.id);
  });
}

function completeTask(task) {
  var taskListId = $('.listBoxOn').last().attr('id').replace("taskBox", "");
  var request = gapi.client.tasks.tasks.patch({
      'tasklist': taskListId,
      'task'    : task,
      'resource': {'status':"completed"}
  });
  request.execute(function(resp) {
    console.log(resp);
  });
}

function uncompleteTask(task) {
  var taskListId = $('.listBoxOn').last().attr('id').replace("taskBox", "");
  var request = gapi.client.tasks.tasks.patch({
      'tasklist': taskListId,
      'task'    : task,
      'resource': {
                   'status':"needsAction",
                   'completed':null
                  }
  });
  request.execute(function(resp) {
    console.log(resp);
  });
}
