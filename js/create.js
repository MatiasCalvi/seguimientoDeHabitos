let habits = [];

function addHabit() {
    const habitInput = document.getElementById('habit');
    const timeLimitInput = document.getElementById('time-limit');

    const habit = habitInput.value.trim();
    const timeLimit = parseInt(timeLimitInput.value);

    if (habit === '' || isNaN(timeLimit)) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    const newHabit = {
        habit: habit,
        timeLimit: timeLimit,
        progress: 0
    };

    habits.push(newHabit);
    habitInput.value = '';
    timeLimitInput.value = '';

    displayHabits();
    calculateStatistics();
}

function displayHabits() {
    const habitList = document.getElementById('habit-list');
    habitList.innerHTML = '';

    habits.forEach((habit, index) => {
        const habitItem = document.createElement('div');
        habitItem.classList.add('habit-item');
        habitItem.innerHTML = `
            <strong>${habit.habit}</strong> - Tiempo límite: ${habit.timeLimit} minutos
            <progress value="${habit.progress}" max="${habit.timeLimit}"></progress>
            <button onclick="updateProgress(${index})">Actualizar Progreso</button>
        `;
        habitList.appendChild(habitItem);
    });
}

function updateProgress(index) {
    const newProgress = parseInt(prompt('Ingrese el progreso actual en minutos:'));

    if (!isNaN(newProgress) && newProgress >= 0 && newProgress <= habits[index].timeLimit) {
        habits[index].progress = newProgress;
        displayHabits();
        calculateStatistics();
    } else {
        alert('Por favor, ingrese un valor válido.');
    }
}

function calculateStatistics() {
    const statisticsContainer = document.getElementById('statistics');
    statisticsContainer.innerHTML = '';

    const totalTimeLimit = habits.reduce((total, habit) => total + habit.timeLimit, 0);
    const totalProgress = habits.reduce((total, habit) => total + habit.progress, 0);
    const percentage = (totalProgress / totalTimeLimit) * 100;

    const statisticsItem = document.createElement('div');
    statisticsItem.classList.add('statistics-item');
    statisticsItem.innerHTML = `
        <h2>Estadísticas Semanales</h2>
        <p>Porcentaje de progreso: ${percentage.toFixed(2)}%</p>
        <p>Tiempo total planificado: ${totalTimeLimit} minutos</p>
        <p>Tiempo total progresado: ${totalProgress} minutos</p>
    `;
    statisticsContainer.appendChild(statisticsItem);
}

displayHabits();
calculateStatistics();
