document.addEventListener('DOMContentLoaded', function() {
    var excludedDates = [];

    // Function to add a new task
    window.addTask = function() {
        const tasksContainer = document.getElementById('tasksContainer');
        const newTask = document.createElement('div');
        newTask.className = 'task';
        newTask.innerHTML = `
            <input type="text" class="taskName" placeholder="Task Name">
            <input type="text" class="taskOwner" placeholder="Task Owner">
            <input type="number" class="taskDuration" placeholder="Duration (days)">
            <label><input type="checkbox" class="taskDependency"> Dependent on previous task</label>
            <button onclick="removeTask(this)">Remove</button>
        `;
        tasksContainer.appendChild(newTask);
    };

    // Function to remove a task
    window.removeTask = function(button) {
        const task = button.parentNode;
        task.parentNode.removeChild(task);
    };

    // Function to add excluded date
    window.addExcludedDate = function() {
        const excludedDate = document.getElementById('excludedDates').value;
        if (excludedDate && !excludedDates.includes(excludedDate)) {
            excludedDates.push(excludedDate);
            updateExcludedDatesDisplay();
        }
    };

    // Function to update the display of excluded dates
    function updateExcludedDatesDisplay() {
        const list = document.getElementById('excludedDatesDisplay');
        list.innerHTML = ''; // Clear current list
        excludedDates.forEach(function(date) {
            const listItem = document.createElement('li');
            listItem.textContent = date;
            list.appendChild(listItem);
        });
    };

    // Function to check if two dates are the same
    function isSameDate(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    };

    // Function to calculate the schedule
    window.calculateSchedule = function() {
        const endDate = new Date(document.getElementById('projectEndDate').value);
        const excludeWeekends = document.getElementById('excludeWeekends').checked;
        let tasks = Array.from(document.querySelectorAll('.task'));
        let taskDetails = [];

        // Convert excludedDates to Date objects for comparison
        let excludedDatesFormatted = excludedDates.map(date => new Date(date));

        let previousTaskEndDate = new Date(endDate);

        tasks.reverse().forEach((task, index) => {
            const taskDuration = parseInt(task.querySelector('.taskDuration').value, 10) || 0;
            const taskName = task.querySelector('.taskName').value;
            const taskOwner = task.querySelector('.taskOwner').value;
            const isDependent = task.querySelector('.taskDependency').checked;
            let taskEndDate = new Date(previousTaskEndDate);

            if (!isDependent || index === 0) { // If it's the first task or not dependent
                taskEndDate = new Date(endDate);
            }

            for (let i = 0; i < taskDuration; ) {
                taskEndDate.setDate(taskEndDate.getDate() - 1);

                if (excludeWeekends && (taskEndDate.getDay() === 6 || taskEndDate.getDay() === 0)) {
                    continue;
                }

                if (excludedDatesFormatted.some(excludedDate => isSameDate(excludedDate, taskEndDate))) {
                    continue;
                }

                i++;
            }

            taskDetails.push({ name: taskName, owner: taskOwner, endDate: taskEndDate });

            // If the task is dependent, the next task's end date is this task's end date
            if (isDependent) {
                previousTaskEndDate = new Date(taskEndDate);
            }
        });

        // Reverse back to original order for displaying
        taskDetails.reverse();

        // Update the result display
        const result = document.getElementById('result');
        result.innerHTML = '<h3>Task Details:</h3>';
        taskDetails.forEach((task, index) => {
            result.innerHTML += `<p>Task ${index + 1}: ${task.name} - Owner: ${task.owner}, Due Date: ${task.endDate.toDateString()}</p>`;
        });

        // Update kickoff date display
        let kickoffDate = taskDetails.length > 0 ? new Date(taskDetails[0].endDate) : new Date();
        document.getElementById('kickoffDate').textContent = kickoffDate.toDateString();
    };
});
