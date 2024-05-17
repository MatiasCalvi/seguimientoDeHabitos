function loadHabits() {
  const user = JSON.parse(localStorage.getItem("user")) || { habits: [] };
  createdForm();
  if (user.habits.length === 0) {
    displayNoHabitsMessage();
  } else {
    user.habits.forEach(createHabitCard);
  }
}

function displayNoHabitsMessage() {
  const noHabitsMessage = document.createElement("h2");
  noHabitsMessage.textContent =
    "There are no registered habits, please create your habit so you can visualize it";
  noHabitsMessage.classList.add("no-habits-message");
  noHabitsMessage.classList.add("montserrat-normal");
  noHabitsMessage.style.fontSize = "1.3em";
  noHabitsMessage.style.marginTop = "9rem";
  document.getElementById("habitContainer").appendChild(noHabitsMessage);
  window.addEventListener("resize", adjustMarginTop);
}

function adjustMarginTop() {
  const screenWidth = window.innerWidth;
  const noHabitsMessage = document.querySelector(".no-habits-message");

  if (screenWidth <= 768) {
    noHabitsMessage.style.marginTop = "2rem";
  } else {
    noHabitsMessage.style.marginTop = "9rem";
  }
}

function getCardById(id) {
  const user = JSON.parse(localStorage.getItem("user")) || { habits: [] };
  return user.habits.find((h) => h.id === id);
}

window.onload = loadHabits;

function createdForm(habitData = null, isUpdate = false) {
  let today = new Date();
  const container = document.querySelector(".container");
  const formAction = isUpdate
    ? `updateHabit('${habitData.id}')`
    : "saveHabit(event)";
  container.innerHTML = `
  <div class="form-container">
    <h1 class="montserrat-bold">${
      isUpdate ? "Update" : "Creation"
    } of Personal Habits</h1>
    <form class="habit-form" onsubmit="${formAction}; return false;">
      <input type="hidden" id="habitId" value="${
        habitData ? habitData.id : ""
      }" />
      <select id="category" required>
        <option value="">Select a category</option>
        <option value="Health">Health</option>
        <option value="Fitness">Fitness</option>
        <option value="Wellness">Wellness</option>
        <option value="Mindfulness">Mindfulness</option>
        <option value="Productivity">Productivity</option>
        <option value="Self-care">Self-care</option>
        <option value="Learning">Learning</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Social">Social</option>
        <option value="Family">Family</option>
        <option value="Career">Career</option>
        <option value="Finance">Finance</option>
      </select>
      <input type="hidden" id="followUpDate" value="${today}" />
      <input type="text" id="title" placeholder="Habit Title" required />
      <input type="date" id="endDate" placeholder="End Date" required />
      <input type="number" id="hours" placeholder="Hours" required min="0" max="24" />
      <input type="number" id="minutes" placeholder="Minutes" min="0" max="59" required />
      <button class="montserrat-normal" type="submit">${
        isUpdate ? "Update" : "Save"
      } Habit</button>
      ${
        isUpdate
          ? `<button class="montserrat-normal" onclick="goBack()"> Cancel </button>`
          : ""
      }
    </form>
  </div>
  ${
    isUpdate
      ? `<div class="habit-container" id="habitContainer" style="display: none;"></div>`
      : `<div class="habit-container" id="habitContainer"></div>`
  }
`;
  if (habitData) {
    fillFormFields(habitData);
  }
}

function createHabitCard(habitData) {
  const habitCard = document.createElement("div");
  habitCard.classList.add("habit-card");
  habitCard.setAttribute("id", habitData.id);
  const startDate = new Date(habitData.startDate).toISOString().split("T")[0];
  const endDate = new Date(habitData.endDate).toISOString().split("T")[0];
  habitCard.innerHTML = createCardHTML(habitData, startDate, endDate);
  document.getElementById("habitContainer").appendChild(habitCard);
}

function createCardHTML(habitData) {
  const startDateTime = new Date(habitData.startDate).toLocaleString("en-US", {
    timeZone: "UTC",
  });
  const endDateTime = new Date(habitData.endDate).toLocaleString("en-US", {
    timeZone: "UTC",
  });

  return `
    <div class="card-container">
      <div class="card-details">
        <p class="montserrat-normal" style="font-size:.8em;">Category: ${habitData.category}</p>
        <p class="montserrat-normal" style="font-size:.8em;">Title: ${habitData.title}</p>
        <p class="montserrat-normal" style="font-size:.8em;">Start Date: ${startDateTime}</p>
        <p class="montserrat-normal" style="font-size:.8em;">End Date: ${endDateTime}</p>
        <p class="montserrat-normal" style="font-size:.8em;">Daily Duration: ${habitData.duration.hours} hours, ${habitData.duration.minutes} minutes</p>
      </div>
      <div class="card-buttons">
        <span class="close-btn" onclick="deleteHabit('${habitData.id}')"><i class="fa-solid fa-trash"></i></span>
        <span class="follow-up-btn" onclick="showFollowUpForm('${habitData.id}')"><i class="fa-solid fa-plus"></i></span>
        <span class="update-btn" onclick="updateHabitForm('${habitData.id}')"><i class="fa-solid fa-pen-to-square"></i></span>
      </div>
    </div>
  `;
}

function showFollowUpForm(habitId) {
  let today = new Date().toISOString().split("T")[0];
  const container = document.querySelector(".container");
  container.innerHTML = `
    <div class="follow-up-form">
      <input type="hidden" id="followUpDate2" value="${today}" />
      <input type="number" id="followUpHours" placeholder="Hours" min="0" max="24" required />
      <input type="number" id="followUpMinutes" placeholder="Minutes" min="0" max="59" required />
      <button onclick="addGlobalFollowUp('${habitId}')">Add Follow-Up</button>
      <button onclick="goBack()">Cancel</button>
    </div>
    <div class="habit-container" id="habitContainer"></div>
  `;
  let card = getCardById(habitId);
  createHabitCard(card);
}

function goBack() {
  loadHabits();
}

function addGlobalFollowUp(habitId) {
  const dateInput = document.getElementById("followUpDate2").value;
  const hoursInput = parseInt(
    document.getElementById("followUpHours").value,
    10
  );
  const minutesInput = parseInt(
    document.getElementById("followUpMinutes").value,
    10
  );

  const now = new Date();
  const currentTime = now.toISOString().split("T")[1];

  let user = JSON.parse(localStorage.getItem("user"));
  const habitIndex = user.habits.findIndex((h) => h.id === habitId);
  const habit = user.habits[habitIndex];

  const followUpDateTime = `${dateInput}T${currentTime}`;

  const existingFollowUpIndex = habit.followUp.findIndex(
    (f) => new Date(f.date).toISOString().split("T")[0] === dateInput
  );

  if (existingFollowUpIndex >= 0) {
    habit.followUp[existingFollowUpIndex].duration = {
      hours: hoursInput,
      minutes: minutesInput,
    };
    swal(
      "Updated!",
      "Your follow-up has been updated successfully.",
      "success"
    );
  } else {
    habit.followUp.push({
      date: followUpDateTime,
      duration: { hours: hoursInput, minutes: minutesInput },
    });
    swal("Success!", "Your habit has been successfully tracked", "success");
  }

  localStorage.setItem("user", JSON.stringify(user));
  swal("Success!", "Your habit has been successfully tracked", "success").then(
    () => {
      goBack();
    }
  );
}

function saveHabit(event) {
  event.preventDefault();

  const date = document.getElementById("followUpDate").value;
  const category = document.getElementById("category").value;
  const title = document.getElementById("title").value;
  const endDate = document.getElementById("endDate").value;
  const hours = parseInt(document.getElementById("hours").value, 10);
  const minutes = parseInt(document.getElementById("minutes").value, 10);

  let user = JSON.parse(localStorage.getItem("user")) || { habits: [] };

  const startDate = new Date(date);
  const endHabitDate = new Date(endDate);

  if (endHabitDate < startDate) {
    swal(
      "Error",
      "You cannot create a habit with a date before the current one.",
      "error"
    );
    return;
  }

  const existingHabitIndex = user.habits.findIndex((h) => h.title === title);
  if (existingHabitIndex !== -1) {
    swal("Error", "There is already a habit with that title.", "error");
    return;
  }

  const newHabit = new Habit(category, title, date, endDate, hours, minutes);
  newHabit.startDate = new Date(date).toISOString();
  newHabit.endDate = new Date(endDate).toISOString();

  user.habits.push(newHabit);
  localStorage.setItem("user", JSON.stringify(user));

  const noHabitsMessage = document.querySelector(".no-habits-message");
  if (noHabitsMessage) {
    noHabitsMessage.remove();
  }

  createHabitCard(newHabit);

  swal("Success!", "Habit saved successfully.", "success").then(() => {
    document.getElementById("category").value = "";
    document.getElementById("title").value = "";
    document.getElementById("endDate").value = "";
    document.getElementById("hours").value = "";
    document.getElementById("minutes").value = "";
  });
}

function fillFormFields(habitData) {
  document.getElementById("category").value = habitData.category;
  document.getElementById("title").value = habitData.title;
  document.getElementById("endDate").value = habitData.endDate.split("T")[0];
  document.getElementById("hours").value = habitData.duration.hours;
  document.getElementById("minutes").value = habitData.duration.minutes;
}

function updateHabitForm(habitId) {
  const habitData = getCardById(habitId);
  createdForm(habitData, true);
}

function updateHabit(habitId) {
  const category = document.getElementById("category").value;
  const title = document.getElementById("title").value;
  const endDate = document.getElementById("endDate").value;
  const hours = parseInt(document.getElementById("hours").value, 10);
  const minutes = parseInt(document.getElementById("minutes").value, 10);

  let user = JSON.parse(localStorage.getItem("user"));

  const habitIndex = user.habits.findIndex((h) => h.id === habitId);

  user.habits[habitIndex].category = category;
  user.habits[habitIndex].title = title;

  if (endDate !== user.habits[habitIndex].endDate) {
    user.habits[habitIndex].endDate = endDate;
    const startDate = new Date(user.habits[habitIndex].startDate);
    const newEndDate = new Date(endDate);
    if (newEndDate < startDate) {
      swal("Error", "The end date cannot be before the start date.", "error");
      return;
    }
  }
  user.habits[habitIndex].duration.hours = hours;
  user.habits[habitIndex].duration.minutes = minutes;

  localStorage.setItem("user", JSON.stringify(user));

  swal("Success!", "Habit updated successfully.", "success").then(() => {
    createdForm();
    loadHabits();
  });
}

function deleteHabit(habitId) {
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this habit.",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      let user = JSON.parse(localStorage.getItem("user"));
      user.habits = user.habits.filter((habit) => habit.id !== habitId);
      localStorage.setItem("user", JSON.stringify(user));

      const habitCard = document.getElementById(habitId);
      if (habitCard) habitCard.remove();

      if (user.habits.length === 0) {
        displayNoHabitsMessage();
      }

      swal("The habit has been deleted", {
        icon: "success",
      });
    } else {
      swal("Your habit is safe");
    }
  });
}
