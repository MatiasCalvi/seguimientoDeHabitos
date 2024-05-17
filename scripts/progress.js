function renderHabitsProgress() {
  const storedHabits = JSON.parse(localStorage.getItem("user")) || {
    habits: [],
  };
  const mainContainer = document.getElementById("mainContainer");
  mainContainer.innerHTML = "";
  if (storedHabits.habits.length === 0) {
    displayNoHabitsMessage();
    return;
  }

  storedHabits.habits.forEach((habitData) => {
    const habit = new Habit(
      habitData.category,
      habitData.title,
      habitData.startDate,
      habitData.endDate,
      habitData.duration.hours,
      habitData.duration.minutes
    );
    habitData.followUp.forEach((followUp) => {
      habit.addFollowUp(followUp.duration.hours, followUp.duration.minutes);
    });

    const progress = habit.calculateProgress();
    const remainingTime = habit.timeLeft();
    const encouragementMessage = habit.getEncouragementMessage(progress.total);
    const timeDedicateWeek = habit.timeDedicatedThisWeek();
    const totalTime = habit.totalTimeToReachGoal();
    const totalTimeWeek = habit.totalTimePerWeek();

    const habitContainer = document.createElement("div");
    habitContainer.id = "habitContainer";
    habitContainer.innerHTML = `
    <button class="close-button" onclick="deleteHabit('${habitData.id}')">
      <i class="fa-solid fa-circle-xmark"></i>
    </button>
    <div class="habit-container">
      <div class="habit-card">
        <h2>Habit: ${habitData.title}</h2>
        <p>Category: ${habitData.category}</p>
        <p>Date Start: ${new Date(habitData.startDate).toLocaleString()}</p>
        <p>Date End: ${new Date(habitData.endDate).toLocaleString()}</p>
        <p>Duration by day: ${habitData.duration.hours} hours, ${
      habitData.duration.minutes
    } minutes</p>
      </div>
      <div class="habit-progress">
        <div class="habit-monthly">
          <h2>Total progress</h2>
          <div class="progress-estadistics-container">
            <div class="progress-bar-container">
              <div class="progress-bar" style="width: ${progress.total}%"></div>
            </div>
            <p class="porcentage">${progress.total}%</p>
          </div>
        </div>
        <div class="habit-weekly">
          <h2>Weekly progress</h2>
          <div class="progress-estadistics-container">
            <div class="progress-bar-container">
              <div class="progress-bar" style="width: ${
                progress.weekly
              }%"></div>
            </div>
            <p class="porcentage">${progress.weekly}%</p>
          </div>
        </div>
      </div>
    </div>
    <div class="habit-container-notifications">
      <div class="habit-container-notifications-dates">
        <p>Total time to reach goal: ${totalTime.hours} hours and ${
      totalTime.minutes
    } minutes</p>
        <p>Remaining time: ${remainingTime.days} days, ${
      remainingTime.hours
    } hours, ${remainingTime.minutes} minutes</p>
        <p>Total time per week: ${totalTimeWeek.hours} hours and ${
      totalTimeWeek.minutes
    } minutes</p>
        <p>Time spent from ${timeDedicateWeek.startOfWeek} to ${
      timeDedicateWeek.endOfWeek
    }: ${timeDedicateWeek.days} days, ${timeDedicateWeek.hours} hours, ${
      timeDedicateWeek.minutes
    } minutes</p>
      </div>
      <div class="habit-container-notifications-phrase">
        <p>${encouragementMessage}</p>
      </div>
    </div>
  `;
    mainContainer.appendChild(habitContainer);
  });
}

function displayNoHabitsMessage() {
  const mainContainer = document.getElementById("mainContainer");
  mainContainer.innerHTML = `<h1 class="no-habits-message">There are no registered habits, please create your habit so you can view it.
  To do this click <span class ="link"><a href="../pages/create-habit.html">here.</a></span></h1>`;
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

      renderHabitsProgress();
    } else {
      swal("Your habit is safe");
    }
  });
}

renderHabitsProgress();
