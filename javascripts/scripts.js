/*
 * 15-237 Homework 4
 * Adam Weis (aweis)
 * Maria Khutoretsky (mkhutore)
 *
 */

// Gets the reference to the task form and saves it in a variable
var taskForm = document.getElementById('task_form');
var listForm = document.getElementById("list_form");

// Attaching the submit event to the form
// Different browsers do it differently so we include both ways
if (taskForm.attachEvent) {
  taskForm.attachEvent("submit", processForm);
} else {
  taskForm.addEventListener("submit", processForm); 
}

if(listForm.attachEvent) {
	listForm.attachEvent("submit", processListForm);
} else {
	listForm.addEventListener("submit", processListForm);
}

function processForm(e) {
  // By default, the HTML will submit by POSTing to another page.
  // We prevent this behavior
  // e is the event argument passed into the function
  if (e.preventDefault) e.preventDefault();
  var formData = new Object();
	var form = $($(e.target).children()[0]).val();
	formData["input"] = form;

	var list = $(e.target.parentNode).children()[0];

  //Perform validation
  if (validateForm(formData)) {
    console.log('Validation passed');
    updateList(formData, $(list));
    clearForm(e.target);
  } else {
    console.log('Validation failed');
  }

  // You must return false to prevent the default form submit behavior
  return false;
}

function processListForm(e) {
	// By default, the HTML will submit by POSTing to another page.
	// We prevent this behavior
	// e is the event argument passed into the function
	if (e.preventDefault) e.preventDefault();
	var formData = new Object();
	formData["input"] = document.getElementById("new_list").value;
	
	//Perform validation
	if (validateForm(formData)) {
		console.log('Validation passed');
		newList(formData);
		clearForm(listForm);
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
  var input = formData['input'];
  if(typeof input === "string" && input !== "") {
    console.log("Validation passed on task: " + input);
  } else {
    console.log("Validation failed on task: " + input);
    return false;
  }
  return true;
}

function updateList(formData, list) {
  var task = formData['input'];
  var taskText = $(document.createTextNode(task));
  var item = $("<li/>");
  item.append(taskText);
  list.append(item);
}

function newList(formData) {
	var listList = $(document.getElementById("lists"));
	var newL = formData["input"];
	
	var listName = $("<div>" + newL + "</div>");
	listName.addClass("listName");

	var list = $("<div/>");
	list.addClass("list");

	var tdl = $("<ul/>");
	tdl.addClass("toDoList");

	var label = $("<label>Add your task here</label>");
	label.attr("for", "new_task");
	var form = $("<form/>");
	var text = $("<input/>");
	text.attr("type", "text");
	var button = $("<input>");
	button.attr("type", "submit");
	button.attr("value", "Add");

	form.append(text);
	form.append(button);
	form.submit(processForm);

	list.append(tdl);
	list.append(label);
	list.append(form);

	var listBox = $("<div/>");
	listBox.addClass("listBox");

	listBox.append(listName);
	listBox.append(list);
	listList.append(listBox);
}

/*
 * Resets the form and sets the focus back to the first field
*/
function clearForm(form) {
  form.reset();
  $(form).children()[0].focus();
}
