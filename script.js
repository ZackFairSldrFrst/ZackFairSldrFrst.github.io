<script>
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

        let currentEndDate = new Date(endDate);

        tasks.reverse().forEach((task, index) => {
            const taskDuration = parseInt(task.querySelector('.taskDuration').value, 10) || 0;
            const taskName = task.querySelector('.taskName').value;
            const taskOwner = task.querySelector('.taskOwner').value;
            const isDependent = task.querySelector('.taskDependency').checked;
            let taskStartDate = new Date(currentEndDate);
            let taskEndDate = new Date(currentEndDate);

         for (let i = 0; i < taskDuration; ) {
    taskEndDate.setDate(taskEndDate.getDate() - 1);

    if (excludeWeekends && (taskEndDate.getDay() === 6 || taskEndDate.getDay() === 0)) {
        continue;
    }

    if (excludedDatesFormatted.some(excludedDate => isSameDate(excludedDate, taskEndDate))) {
        continue;
    }

    i++; // Increment i if the day is valid
}


            taskStartDate.setDate(taskEndDate.getDate() - taskDuration + 1);
            taskDetails.push({ name: taskName, owner: taskOwner, startDate: taskStartDate, endDate: taskEndDate });

            // If the task is dependent, the next task's end date is this task's end date
            if (isDependent) {
                currentEndDate = new Date(taskEndDate);
            }
        });

        // Reverse back to original order for displaying
        taskDetails.reverse();

        // Update the table display
        const tableBody = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; // Clear existing rows

        taskDetails.forEach((task, index) => {
            let row = tableBody.insertRow();

            let cellTaskNumber = row.insertCell(0);
            let cellTaskName = row.insertCell(1);
            let cellTaskOwner = row.insertCell(2);
            let cellStartDate = row.insertCell(3);
            let cellEndDate = row.insertCell(4);

            cellTaskNumber.innerHTML = index + 1;
            cellTaskName.innerHTML = task.name;
            cellTaskOwner.innerHTML = task.owner;
            cellStartDate.innerHTML = task.startDate.toDateString();
            cellEndDate.innerHTML = task.endDate.toDateString();
        });

        // Update kickoff date display
        let kickoffDate = taskDetails.length > 0 ? new Date(taskDetails[0].startDate) : new Date();
        document.getElementById('kickoffDate').textContent = kickoffDate.toDateString();
    };
});
</script>