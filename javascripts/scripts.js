/*
 * 15-237 Homework 4
 * Adam Weis (aweis)
 * Maria Khutoretsky (mkhutore)
 *
 */

// Gets the reference to the task form and saves it in a variable
var taskForm = document.getElementById('task_form');

// Attaching the submit event to the form
// Different browsers do it differently so we include both ways
if (taskForm.attachEvent) {
  taskForm.attachEvent("submit", processForm);
} else {
  taskForm.addEventListener("submit", processForm); 
}

function processForm(e) {
  // By default, the HTML will submit by POSTing to another page.
  // We prevent this behavior
  // e is the event argument passed into the function
  if (e.preventDefault) e.preventDefault();
  
  var formData = new Object();
  formData['new_task'] = document.getElementById('new_task').value;

  //Perform validation
  if (validateForm(formData)) {
    console.log('Validation passed');
    updateList(formData);
    clearForm();
  } else {
    console.log('Validation failed');
  }

  // You must return false to prevent the default form submit behavior
  return false;
}

/*
Return true if the form is valid, and false otherwise

*/
function validateForm(formData) {
  var task = formData['new_task'];
  if(typeof task === "string" && task !== "") {
    console.log("Validation passed on task: " + task);
  } else {
    console.log("Validation failed on task: " + task);
    return false;
  }
  return true;
}

function updateList(formData) {
  var todoList = document.getElementById('todoList');
  var task = formData['new_task'];
  var taskText = document.createTextNode(task);
  var item = document.createElement('li');
  item.appendChild(taskText);
  todoList.appendChild(item);
}

/*
 * Resets the form and sets the focus back to the first field
*/
function clearForm() {
  taskForm.reset();
  document.getEelementById('new_task').focus();
}
