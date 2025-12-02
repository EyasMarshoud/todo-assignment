// File: js/app.js
// Student: Eyas Marshoud (12428791)
// This file is intentionally incomplete.
// Your task is to implement the required behaviour using JavaScript and the Fetch API.

/*
  API ENDPOINTS (already implemented on the server):

  Base URL:
    http://portal.almasar101.com/assignment/api

  1) Add task  (POST)
     add.php?stdid=STUDENT_ID&key=API_KEY
     Body (JSON): { "title": "Task title" }
     Returns JSON with the added task.

  2) Get tasks (GET)
     get.php?stdid=STUDENT_ID&key=API_KEY
     - If "id" is omitted: returns all tasks for this student.
     - If "id=NUMBER" is provided: returns one task.

  3) Delete task (GET or DELETE)
     delete.php?stdid=STUDENT_ID&key=API_KEY&id=TASK_ID
     Deletes the task with that ID for the given student.
*/

// Configuration for this student (do not change STUDENT_ID value)
const STUDENT_ID = "12428791";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";

// Grab elements from the DOM
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const statusDiv = document.getElementById("status");
const list = document.getElementById("task-list");

/**
 * Helper to update status message.
 * You can use this in your code.
 */
function setStatus(message, isError = false) {
  if (!statusDiv) return;
  statusDiv.textContent = message || "";
  statusDiv.style.color = isError ? "#d9363e" : "#666666";
}

/**
 * TODO 1:
 * When the page loads, fetch all existing tasks for this student using:
 *   GET: API_BASE + "/get.php?stdid=" + STUDENT_ID + "&key=" + API_KEY
 * Then:
 *   - Parse the JSON response.
 *   - Loop over the "tasks" array (if it exists).
 *   - For each task, create an <li> with class "task-item"
 *     and append it to #task-list.
 */
document.addEventListener("DOMContentLoaded", function () {
  setStatus("Loading tasks...");
  
  var getUrl = API_BASE + "/get.php?stdid=" + STUDENT_ID + "&key=" + API_KEY;
  
  fetch(getUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      list.innerHTML = "";
      
      if (data.tasks) {
        var tasks = data.tasks;
        var taskCount = tasks.length;
        
        for (var i = 0; i < taskCount; i++) {
          var currentTask = tasks[i];
          renderTask(currentTask);
        }
        
        setStatus("Loaded " + taskCount + " task(s)");
      } else {
        setStatus("No tasks found");
      }
    })
    .catch(function(err) {
      setStatus("Error loading tasks", true);
    });
});

/**
 * TODO 2:
 * When the form is submitted:
 *   - prevent the default behaviour.
 *   - read the value from #task-input.
 *   - send a POST request using fetch to:
 *       API_BASE + "/add.php?stdid=" + STUDENT_ID + "&key=" + API_KEY
 *     with headers "Content-Type: application/json"
 *     and body JSON: { title: "..." }
 *   - on success, add the new task to the DOM and clear the input.
 */
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    
    var taskTitle = input.value.trim();
    
    if (taskTitle === "") {
      setStatus("Please enter a task", true);
      return;
    }
    
    setStatus("Adding task...");
    
    var addUrl = API_BASE + "/add.php?stdid=" + STUDENT_ID + "&key=" + API_KEY;
    var taskData = { title: taskTitle };
    
    fetch(addUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(taskData)
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(result) {
        if (result.task) {
          renderTask(result.task);
          input.value = "";
          setStatus("Task added successfully!");
        } else {
          setStatus("Failed to add task", true);
        }
      })
      .catch(function(err) {
        setStatus("Error adding task", true);
      });
  });
}

/**
 * TODO 3:
 * For each task that you render, create a "Delete" button.
 * When clicked:
 *   - send a request to:
 *       API_BASE + "/delete.php?stdid=" + STUDENT_ID + "&key=" + API_KEY + "&id=" + TASK_ID
 *   - on success, remove that <li> from the DOM.
 *
 * You can create a helper function like "renderTask(task)" that:
 *   - Creates <li>, <span> for title, and a "Delete" <button>.
 *   - Attaches a click listener to the delete button.
 *   - Appends the <li> to #task-list.
 */

// Suggested helper (you can modify it or make your own):
function renderTask(task) {
  var li = document.createElement("li");
  li.className = "task-item";
  li.setAttribute("data-id", task.id);
  
  var titleSpan = document.createElement("span");
  titleSpan.textContent = task.title;
  
  var deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "delete-btn";
  
  deleteButton.onclick = function() {
    setStatus("Deleting task...");
    
    var deleteUrl = API_BASE + "/delete.php?stdid=" + STUDENT_ID + "&key=" + API_KEY + "&id=" + task.id;
    
    fetch(deleteUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if (data.success) {
          li.remove();
          setStatus("Task deleted successfully!");
        } else {
          setStatus("Failed to delete task", true);
        }
      })
      .catch(function(err) {
        setStatus("Error deleting task", true);
      });
  };
  
  li.appendChild(titleSpan);
  li.appendChild(deleteButton);
  list.appendChild(li);
}