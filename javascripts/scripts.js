/*
 * 15-237 Homework 4
 * Adam Weis (aweis)
 * Maria Khutoretsky (mkhutore)
 *
 */

// Gets the reference to the task form and saves it in a variable
var listForm = document.getElementById("list_form");

// Attaching the submit event to the form
// Different browsers do it differently so we include both ways

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
  
	var form = $($(e.target).children()[0]).val();
	var input = form;

	var list = $(e.target.parentNode).children()[0];

  //Perform validation
  if (validateForm(input)) {
    console.log('Validation passed');
    updateList(input, $(list));
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
	var input = document.getElementById("new_list").value;
	
	//Perform validation
	if (validateForm(input)) {
		console.log('Validation passed');
		var listList = $("#lists");
		var numLists = listList.children().length;
		newList(input, numLists);
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
function validateForm(input) {
  if(typeof input === "string" && input !== "") {
    console.log("Validation passed on task: " + input);
  } else {
    console.log("Validation failed on task: " + input);
    return false;
  }
  return true;
}

function updateList(taskName, list) {
  var item = $("<li>" + taskName + "</li>");
	var checkbox = $("<input/>");
	checkbox.attr("type", "checkbox");
	checkbox.change(taskDone);

	item.append(checkbox);

	list.append(item);
}

function taskDone(e)
{
	$(e.target.parentNode).remove();
}

function newList(newL, id) {
	// hide old list
	var activeList = $(".listBoxOn")[0];
	$(activeList).attr("class", "listBoxOff");

	var listList = $("#lists");

	// set list name
	var listName = $("<div>" + newL + "</div>");
	listName.addClass("listName");

	// add empty list
	var list = $("<div/>");
	list.addClass("list");

	var tdl = $("<ul/>");
	tdl.addClass("toDoList");

	// add new task form
	var label = $("<label>Add your task here:</label>");
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
	listBox.addClass("listBoxOn");
	listBox.attr("id", id);

	listBox.append(listName);
	listBox.append(list);
	listList.append(listBox);

	// add new list to the menu
	var menu = $("#menu");
	var menuItem = $("<div>" + newL + "</div>");
	menuItem.addClass("menuItem");
	menuItem.attr("id", id);
	menuItem.click(chooseList);

	menu.append(menuItem);
}

function chooseList(e){
	var listID = $(e.target).attr("id");
	
	var activeList = $(".listBoxOn")[0];
	$(activeList).attr("class", "listBoxOff");

	var newList = $("#" + listID);
	newList.attr("class", "listBoxOn");
}

/*
 * Resets the form and sets the focus back to the first field
*/
function clearForm(form) {
  form.reset();
  $(form).children()[0].focus();
}
