function changeCalculator() {
    const calculatorSelector = document.getElementById('calculatorType');
    const workBackCalculator = document.getElementById('workBackCalculator');
    const forwardCalculator = document.getElementById('forwardCalculator');

    if (calculatorSelector.value === 'workBack') {
        workBackCalculator.style.display = 'block';
        forwardCalculator.style.display = 'none';
    } else {
        workBackCalculator.style.display = 'none';
        forwardCalculator.style.display = 'block';
    }
}

// Assume that statutory holidays are defined for each country and state
const statutoryHolidays = {
    usa: {
        ny: ['2024-01-01', '2024-07-04', '2024-12-25'], // Example holidays for New York
        ca: ['2024-01-01', '2024-07-04', '2024-12-25']  // Example holidays for California
        // Add more states and their respective holidays as needed
    },
    canada: {
        on: ['2024-01-01', '2024-07-01', '2024-12-25'], // Example holidays for Ontario
        bc: ['2024-01-01', '2024-07-01', '2024-12-25']  // Example holidays for British Columbia
        // Add more provinces and their respective holidays as needed
    }
    // Add more countries and their respective holidays as needed
};

function calculateNewDate(currentDate, duration, excludeWeekends, excludeHolidays) {
    const newDate = new Date(currentDate);

    while (duration > 0) {
        newDate.setDate(newDate.getDate() - 1);

        const isWeekend = excludeWeekends && (newDate.getDay() === 0 || newDate.getDay() === 6);
        const isHoliday = excludeHolidays && isStatutoryHoliday(newDate);

        if (!(isWeekend || isHoliday)) {
            duration--;
        }
    }

    return newDate;
}

function isStatutoryHoliday(date) {
    const country = document.getElementById('country').value;
    const state = document.getElementById('provinceState').value;

    const holidays = statutoryHolidays[country]?.[state] || [];
    const holidayDates = holidays.map(holiday => new Date(holiday));

    return holidayDates.some(holidayDate => date.toDateString() === holidayDate.toDateString());
}

function addTask() {
    const tasksContainer = document.getElementById('tasksContainer');
    
    const newTask = document.createElement('div');
    newTask.classList.add('task');

    newTask.innerHTML = `
        <input type="text" class="taskName" placeholder="Task Name">
        <input type="number" class="taskDuration" placeholder="Duration (days)">
        <button onclick="removeTask(this)">Remove</button>
    `;

    tasksContainer.appendChild(newTask);
}

function removeTask(button) {
    const taskDiv = button.parentElement;
    taskDiv.remove();
}

function calculateSchedule() {
    const projectEndDate = new Date(document.getElementById('projectEndDate').value);
    const tasks = getTasks();
    const excludeWeekends = document.getElementById('excludeWeekends').checked;
    const excludeHolidays = document.getElementById('excludeHolidays').checked;

    const schedule = calculateTaskDates(projectEndDate, tasks, excludeWeekends, excludeHolidays);

    displaySchedule(schedule);
    
    // Calculate and display the suggested kick-off date
    calculateKickoffDate();
}

function calculateTaskDates(endDate, tasks, excludeWeekends, excludeHolidays) {
    const schedule = [];
    let currentDate = new Date(endDate);

    for (let i = tasks.length - 1; i >= 0; i--) {
        const task = tasks[i].name;
        const duration = tasks[i].duration;

        currentDate = calculateNewDate(currentDate, duration, excludeWeekends, excludeHolidays);
        schedule.push({ task, date: new Date(currentDate) });
    }

    return schedule.reverse();
}

function getTasks() {
    const taskElements = document.querySelectorAll('.task');
    const tasks = [];

    taskElements.forEach(taskElement => {
        const taskName = taskElement.querySelector('.taskName').value;
        const taskDuration = parseInt(taskElement.querySelector('.taskDuration').value, 10);

        if (taskName && !isNaN(taskDuration)) {
            tasks.push({ name: taskName, duration: taskDuration });
        }
    });

    return tasks;
}

function displaySchedule(schedule) {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = '';

    schedule.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.textContent = `${task.task}: ${task.date.toDateString()}`;
        resultContainer.appendChild(taskElement);
    });
}

function calculateKickoffDate() {
    const projectEndDate = new Date(document.getElementById('projectEndDate').value);
    const tasks = getTasks();
    const excludeWeekends = document.getElementById('excludeWeekends').checked;
    const excludeHolidays = document.getElementById('excludeHolidays').checked;

    let totalDuration = tasks.reduce((acc, task) => acc + task.duration, 0);
    if (excludeWeekends || excludeHolidays) {
        totalDuration = calculateAdjustedDuration(projectEndDate, tasks, excludeWeekends, excludeHolidays);
    }

    const kickoffDate = calculateNewDate(projectEndDate, totalDuration, excludeWeekends, excludeHolidays);
    document.getElementById('kickoffDate').textContent = kickoffDate.toDateString();
}

function calculateAdjustedDuration(endDate, tasks, excludeWeekends, excludeHolidays) {
    let adjustedDuration = 0;
    let currentDate = new Date(endDate);

    for (let i = tasks.length - 1; i >= 0; i--) {
        const duration = tasks[i].duration;
        currentDate = calculateNewDate(currentDate, duration, excludeWeekends, excludeHolidays);
        adjustedDuration += duration;
    }

    return adjustedDuration;
}

function calculateEarliestFinishDate() {
    if (!validateForwardInputs()) {
        return;
    }

    const projectStartDate = new Date(document.getElementById('projectStartDate').value);
    const tasks = getTasks();
    const excludeWeekends = document.getElementById('excludeWeekends').checked;
    const excludeHolidays = document.getElementById('excludeHolidays').checked;

    let totalDuration = tasks.reduce((acc, task) => acc + task.duration, 0);
    if (excludeWeekends || excludeHolidays) {
        totalDuration = calculateAdjustedDuration(projectStartDate, tasks, excludeWeekends, excludeHolidays);
    }

    const earliestFinishDate = calculateNewDate(projectStartDate, totalDuration, excludeWeekends, excludeHolidays);
    document.getElementById('earliestFinishDate').textContent = earliestFinishDate.toDateString();

    // Show the result section
    document.getElementById('kickoffDateSection').style.display = 'block';
}

<<<<<<< Updated upstream
=======
// Function to dynamically add tooltips
function addTooltips() {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            const tooltipMessage = tooltips[input.id];
            if (tooltipMessage) {
                showTooltip(input, tooltipMessage);
            }
        });
        input.addEventListener('blur', hideTooltip);
    });

    // Add tooltips for dynamic tasks
    addTaskTooltips();
}
// Function to validate the form
function validateForm() {
    const projectEndDateInput = document.getElementById('projectEndDate');
    const projectStartDateInput = document.getElementById('projectStartDate');
    const taskNameInputs = document.querySelectorAll('.taskName');
    const taskDurationInputs = document.querySelectorAll('.taskDuration');

    // Placeholder for validation messages
    let validationMessages = [];

    // Validate project end/start date
    if (!projectEndDateInput.value && !projectStartDateInput.value) {
        validationMessages.push('Please enter either the project end date or the project start date.');
    }

    // Validate task names and durations
    taskNameInputs.forEach((taskNameInput, index) => {
        const taskDurationInput = taskDurationInputs[index];
        if (!taskNameInput.value || !taskDurationInput.value) {
            validationMessages.push('All tasks must have both a name and a duration.');
        }
    });

    // Display error messages if any
    if (validationMessages.length > 0) {
        const errorMessage = validationMessages.join('\n');
        alert(errorMessage);
        return false;
    }

    return true;
}

// Event listener for the Calculate Schedule button
document.getElementById('calculateScheduleButton').addEventListener('click', () => {
    if (validateForm()) {
        calculateSchedule();
        calculateKickoffDate();
    }
});
// Define tooltips for each input/select element
const tooltips = {
    calculatorType: 'Choose the type of calculator: Work Back Schedule or Forward Schedule.',
    projectEndDate: 'Choose the date you plan to finish your project, e.g., product launch date.',
    tasks: 'List the tasks needed for your project, such as market research, content creation, and design.',
    excludeWeekends: 'Check this box to exclude weekends from the schedule.',
    excludeHolidays: 'Check this box to exclude statutory holidays from the schedule.',
    country: 'Select your country for holiday considerations.',
    provinceState: 'Select your province/state for more accurate holiday considerations.',
    projectStartDate: 'Choose the date when you want to begin your project.',
    tasksForward: 'List the tasks and estimate their durations, e.g., campaign planning, content creation, and execution.',
    excludeWeekendsForward: 'Check this box to exclude weekends from the schedule.',
    excludeHolidaysForward: 'Check this box to exclude statutory holidays from the schedule.',
    countryForward: 'Select your country for holiday considerations.',
    provinceStateForward: 'Select your province/state for more accurate holiday considerations.'
};

// Function to show tooltips
function showTooltip(element, message) {
    const tooltipContainer = document.getElementById('tooltipContainer');
    tooltipContainer.innerHTML = `<div class="tooltip">${message}</div>`;
    const tooltip = document.querySelector('.tooltip');
    const rect = element.getBoundingClientRect();
    tooltip.style.top = rect.top - tooltip.offsetHeight + 'px';
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
}

// Function to hide tooltips
function hideTooltip() {
    const tooltipContainer = document.getElementById('tooltipContainer');
    tooltipContainer.innerHTML = '';
}

// Function to dynamically add tooltips
function addTooltips() {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            const tooltipMessage = tooltips[input.id];
            if (tooltipMessage) {
                showTooltip(input, tooltipMessage);
            }
        });
        input.addEventListener('blur', hideTooltip);
    });

    // Add tooltips for dynamic tasks
    addTaskTooltips();
}

// Call the addTooltips function when the DOM is ready
document.addEventListener('DOMContentLoaded', addTooltips);
function generateGanttChart(schedule, chartId) {
    const ganttChartContainer = document.getElementById(chartId);
    ganttChartContainer.innerHTML = ''; // Clear previous chart

    const startDate = schedule[0].date;
    const endDate = schedule[schedule.length - 1].date;
    const totalDays = (endDate - startDate) / (1000 * 3600 * 24);

    schedule.forEach(task => {
        const taskStart = (task.date - startDate) / (1000 * 3600 * 24);
        const taskDuration = task.duration;
        const taskBar = document.createElement('div');
        taskBar.classList.add('taskBar');
        taskBar.style.width = `${(taskDuration / totalDays) * 100}%`;
        taskBar.style.marginLeft = `${(taskStart / totalDays) * 100}%`;
        taskBar.textContent = task.name;
        ganttChartContainer.appendChild(taskBar);
    });
}

// Update your calculateSchedule function to call generateGanttChart
function calculateSchedule() {
    // ... existing code ...
    generateGanttChart(schedule, 'ganttChartWorkBack');
}
>>>>>>> Stashed changes
