document.getElementById("mobile-menu").addEventListener("click", function () {
  var navList = document.getElementById("nav-list");
  this.classList.toggle("open");
  navList.classList.toggle("active");
});

class Habit {
  constructor(category, title, startDate, endDate, hours = 0, minutes = 0) {
    this.id = Habit.generateId();
    this.category = category;
    this.title = title;
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
    this.duration = { hours, minutes };
    this.followUp = [];
  }

  static generateId() {
    const timestamp = new Date().getTime().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `Hb_${timestamp}_${random}`;
  }

  addFollowUp(hours, minutes) {
    const now = new Date();
    const updateDate = now.toISOString().split("T")[0];
    const updateTime = now.toTimeString().split(" ")[0];

    const existingUpdateIndex = this.followUp.findIndex(
      (update) =>
        new Date(update.date).toISOString().split("T")[0] === updateDate
    );

    if (existingUpdateIndex >= 0) {
      this.followUp[existingUpdateIndex].duration = { hours, minutes };
    } else {
      this.followUp.push({
        date: `${updateDate}T${updateTime}Z`,
        duration: { hours, minutes },
      });
    }
  }

  sumFollowUps(followUps) {
    return followUps.reduce((totalMinutos, followUp) => {
      const minutos = followUp.duration.hours * 60 + followUp.duration.minutes;
      return totalMinutos + minutos;
    }, 0);
  }

  totalTimeToReachGoal() {
    const totalDays = Math.ceil(
      (this.endDate - this.startDate) / (1000 * 60 * 60 * 24)
    );

    const totalPlannedMinutes =
      totalDays * (this.duration.hours * 60 + this.duration.minutes);

    const hours = Math.floor(totalPlannedMinutes / 60);
    const minutes = totalPlannedMinutes % 60;

    return {
      hours: hours,
      minutes: minutes,
    };
  }

  totalTimePerWeek() {
    const weeklyPlannedMinutes =
      (this.duration.hours * 60 + this.duration.minutes) * 7;

    const hours = Math.floor(weeklyPlannedMinutes / 60);
    const minutes = weeklyPlannedMinutes % 60;

    return {
      hours: hours,
      minutes: minutes,
    };
  }

  calculateProgress() {
    const totalDays = Math.ceil(
      (this.endDate - this.startDate) / (1000 * 60 * 60 * 24)
    );

    const plannedTotalTime =
      totalDays * (this.duration.hours * 60 + this.duration.minutes);

    const dedicatedTime = this.sumFollowUps(this.followUp);

    const totalProgressPercentage = (dedicatedTime / plannedTotalTime) * 100;

    const weeklyProgressPercentage = this.calculateWeeklyProgress();

    return {
      total: totalProgressPercentage.toFixed(2),
      weekly: weeklyProgressPercentage.toFixed(2),
    };
  }

  calculateWeeklyProgress() {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
    endOfWeek.setHours(23, 59, 59, 999);

    const totalMinutesThisWeek =
      (this.duration.hours * 60 + this.duration.minutes) * 7;

    let completedMinutesThisWeek = this.followUp.reduce((acc, update) => {
      const updateDate = new Date(update.date);
      if (updateDate >= startOfWeek && updateDate <= endOfWeek) {
        return acc + (update.duration.hours * 60 + update.duration.minutes);
      }
      return acc;
    }, 0);

    const weeklyProgressPercentage =
      completedMinutesThisWeek > 0
        ? (completedMinutesThisWeek / totalMinutesThisWeek) * 100
        : 0;

    return weeklyProgressPercentage;
  }

  timeLeft() {
    const now = new Date();
    const timeRemaining = this.endDate - now;
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );

    return { days, hours, minutes };
  }

  hasReachedGoal() {
    const totalMinutesPerDay = this.duration.hours * 60 + this.duration.minutes;
    const totalDays = Math.ceil(
      (this.endDate - this.startDate) / (1000 * 60 * 60 * 24)
    );
    const goalMinutes = totalMinutesPerDay * totalDays;

    let completedMinutes = this.followUp.reduce((acc, update) => {
      return acc + (update.duration.hours * 60 + update.duration.minutes);
    }, 0);

    return completedMinutes >= goalMinutes;
  }

  getEncouragementMessage(progressPercentage) {
    if (progressPercentage >= 100) {
      return "You did it!";
    } else if (progressPercentage >= 75) {
      return "Almost there!";
    } else if (progressPercentage >= 50) {
      return "Let's go, we're halfway there!";
    } else if (progressPercentage > 0) {
      return "Keep going, you can do it!";
    } else {
      return "Start your habit to see progress!";
    }
  }

  timeDedicatedThisWeek() {
    const now = new Date();

    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    startOfWeek.setHours(0, 0, 0, 0);
    endOfWeek.setHours(23, 59, 59, 999);

    let dedicatedMinutesThisWeek = this.followUp.reduce((acc, update) => {
      const updateDate = new Date(update.date);
      if (updateDate >= startOfWeek && updateDate <= endOfWeek) {
        return acc + (update.duration.hours * 60 + update.duration.minutes);
      }
      return acc;
    }, 0);

    const days = Math.floor(dedicatedMinutesThisWeek / (60 * 24));
    const hours = Math.floor((dedicatedMinutesThisWeek % (60 * 24)) / 60);
    const minutes = dedicatedMinutesThisWeek % 60;

    return {
      startOfWeek: startOfWeek.toISOString().split("T")[0],
      endOfWeek: endOfWeek.toISOString().split("T")[0],
      days,
      hours,
      minutes,
    };
  }
}
