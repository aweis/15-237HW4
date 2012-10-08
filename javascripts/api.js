function GoogleApi() {}

GoogleApi.prototype.apiKey = 'AIzaSyCqCWh7YGfoxyhLp2WE1uKMq6iiJ-eKl84';
GoogleApi.prototype.apiName = "N/A"

function TasksApi() {
  GoogleApi.call(this);
}

// Inherit form Google Api
TasksApi.prototype = new GoogleApi();

//Correct the constructor pointer
TasksApi.prototype.constructor = TasksApi;

TasksApi.prototype.apiName = 'tasks';
TasksApi.prototype.clientId = '461317286070-csbrouq2mlscb8gru49g3hsdsklir5eu.apps.googleusercontent.com';
TasksApi.prototype.scopes = 'https://www.googleapis.com/auth/tasks';
TasksApi.prototype.version = 'v1';

//Instantiate the new object for the tasks API
tasksApi = new TasksApi();

//Keep track of number of tasks for Canvas counter
var tasksLeft = 0;

//* Google Authentication
window.onload = function() {
    handleClientLoad();
  };

// Google Authentication
function handleClientLoad() { 
  gapi.client.setApiKey(tasksApi.apiKey);
  window.setTimeout(checkAuth,1);
  console.log("handleClientLoad()"); 
}

// Google Authentication
function checkAuth() {
  gapi.auth.authorize({client_id: tasksApi.clientId, scope: tasksApi.scopes}, handleAuthResult);
  // removed immediate: true 
  console.log("checkAuth()"); 
}

// Google Authentication
function handleAuthResult(authResult) {
  var authorizeButton = document.getElementById('authorize-button');
   
  if (authResult && !authResult.error) {
    makeApiCall();
  } else {
    console.log(authResult.error);
  }
}

// Google Authentication
function handleAuthClick(event) {
  gapi.auth.authorize({client_id: tasksApi.clientId, scope: tasksApi.scopes, immediate: false}, handleAuthResult);
  return false;
}  

//Get the tasks from the Google Tasks API
//Populates the lists with the Tasks and Taskslist already on the server
//taskList = tasklist id
function getTasks(taskList) {
  var request = gapi.client.tasks.tasks.list({"tasklist":taskList});
  request.execute(function(resp) {  
    if (resp.items !== undefined) {
      resp.items.forEach(function(task) {
        updateList(task.id, task.title, $("#" + taskList + "taskBox" + " ul")); 
        tasksLeft++;
				if(task.status === "completed") {
					tasksLeft--;
          $('#'+task.id).addClass("complete");
          $('#'+task.id + " :checkbox").prop("checked", true);
        }
      });
    } 
  });
}

//Gets All the taskslists from the server
function getTaskLists() {
  var request = gapi.client.tasks.tasklists.list({});
  request.execute(function(resp) {
    resp.items.forEach(function(taskList) { 
      newList(taskList.title, taskList.id);
      getTasks(taskList.id); 
    });
  });
}

//Simple command to grab start connection with API
function makeApiCall() {
  gapi.client.load(tasksApi.apiName, tasksApi.version, function() { 
    console.log("loaded.");
    getTaskLists();
  }); 
}

//Given a name of a task list, add the task list to Google and to the form
//title = name of a task list
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

//Given a name of a task, add the task to the task list
//title = name of a task
function addTask(title) {
	tasksLeft++;
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

//Given a task_id, set it to the completed state
//task = task_id
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
	tasksLeft--;
}

//Given a completed task, uncomplete it
//task = task_id
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
	tasksLeft++;
}
