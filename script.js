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
        list.innerHTML = '';
        excludedDates.forEach(function(date) {
            const listItem = document.createElement('li');
            listItem.textContent = date;
            list.appendChild(listItem);
        });
    }

    // Function to check if two dates are the same
    function isSameDate(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    // Function to check if a day is valid (not a weekend or excluded date)
    function isDayValid(date) {
        const excludeWeekends = document.getElementById('excludeWeekends').checked;
        if (excludeWeekends && (date.getDay() === 0 || date.getDay() === 6)) {
            return false; // It's a weekend
        }
        return !excludedDates.some(excludedDate => isSameDate(new Date(excludedDate), date)); // Check for excluded dates
    }

    // Function to adjust date to next valid day if it's not valid
    function adjustToNextValidDay(date, moveBackward = false) {
        while (!isDayValid(date)) {
            date.setDate(date.getDate() + (moveBackward ? -1 : 1));
        }
        return date;
    }

    // Function to calculate the schedule
    window.calculateSchedule = function() {
        const endDate = new Date(document.getElementById('projectEndDate').value);
        let tasks = Array.from(document.querySelectorAll('.task'));
        let taskDetails = [];
        let currentEndDate = adjustToNextValidDay(new Date(endDate), true);

        for (let i = tasks.length - 1; i >= 0; i--) {
            const task = tasks[i];
            const taskName = task.querySelector('.taskName').value;
            const taskOwner = task.querySelector('.taskOwner').value;
            const taskDuration = parseInt(task.querySelector('.taskDuration').value);

            let taskEndDate = new Date(currentEndDate);
            let taskStartDate = new Date(taskEndDate);

            taskStartDate.setDate(taskStartDate.getDate() - (taskDuration - 1));
            taskStartDate = adjustToNextValidDay(taskStartDate, true);

            taskDetails.unshift({ name: taskName, owner: taskOwner, startDate: new Date(taskStartDate), endDate: new Date(taskEndDate) });

            // Update current end date for the next (actually previous) task
            currentEndDate = new Date(taskStartDate);
            currentEndDate.setDate(currentEndDate.getDate() - 1);
            currentEndDate = adjustToNextValidDay(currentEndDate, true);
        }

        // Update the table and kick-off date display
        updateTableDisplay(taskDetails);
        updateKickoffDateDisplay(taskDetails);
    };

    function updateTableDisplay(taskDetails) {
        const tableBody = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';

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
    }

    function updateKickoffDateDisplay(taskDetails) {
        let kickoffDate = taskDetails.length > 0 ? taskDetails[0].startDate : new Date();
        document.getElementById('kickoffDate').textContent = kickoffDate.toDateString();
    }
});
</script>
