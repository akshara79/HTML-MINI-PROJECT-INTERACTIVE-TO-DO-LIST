const taskInput = document.getElementById("taskInput");
const deadlineInput = document.getElementById("deadlineInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function formatTime(ms) {
  if (ms <= 0) return "Deadline passed";

  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms / (1000 * 60)) % 60);

  return `${hours}h ${minutes}m remaining`;
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    const remaining = new Date(task.deadline) - new Date();
    const timerText = formatTime(remaining);

    li.innerHTML = `
      <div class="${task.completed ? "completed" : ""}">
        <strong>${task.text}</strong>
      </div>
      <div class="timer ${remaining <= 0 ? "overdue" : ""}">
        ${task.deadline ? timerText : ""}
      </div>
      <button onclick="toggleTask(${index})">✔</button>
      <button onclick="deleteTask(${index})">Delete</button>
    `;

    if (remaining < 60000 && remaining > 0) {
      alert(`Reminder: "${task.text}" is due soon!`);
    }

    taskList.appendChild(li);
  });
}

addBtn.addEventListener("click", () => {
  if (!taskInput.value || !deadlineInput.value) return;

  tasks.push({
    text: taskInput.value,
    deadline: deadlineInput.value,
    completed: false
  });

  taskInput.value = "";
  deadlineInput.value = "";

  saveTasks();
  renderTasks();
});

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

setInterval(renderTasks, 30000);
renderTasks();
