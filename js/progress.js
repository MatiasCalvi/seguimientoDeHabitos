class Habit {
  constructor(category, title, endDate, hours = 0, minutes = 0) {
    this.id = Habit.generateId();
    this.category = category;
    this.title = title;
    this.startDate = new Date();
    this.endDate = new Date(endDate);
    this.duration = { hours, minutes };
    this.updates = [];
  }

  static generateId() {
    const timestamp = new Date().getTime().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `Hb_${timestamp}_${random}`;
  }

  addUpdate(date, hours, minutes) {
    this.updates.push({ date, duration: { hours, minutes } });
  }

  calculateProgress() {
    const totalMinutesPerDay = this.duration.hours * 60 + this.duration.minutes;
    const totalDays = Math.ceil(
      (this.endDate - new Date()) / (1000 * 60 * 60 * 24)
    );
    const totalMinutes = totalMinutesPerDay * totalDays;

    let completedMinutes = this.updates.reduce((acc, update) => {
      return acc + (update.duration.hours * 60 + update.duration.minutes);
    }, 0);

    const monthlyProgressPercentage = (completedMinutes / totalMinutes) * 100;

    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
    const totalMinutesThisWeek = totalMinutesPerDay * 7;

    let completedMinutesThisWeek = this.updates.reduce((acc, update) => {
      const updateDate = new Date(update.date);
      if (updateDate >= startOfWeek && updateDate <= endOfWeek) {
        return acc + (update.duration.hours * 60 + update.duration.minutes);
      }
      return acc;
    }, 0);

    const weeklyProgressPercentage =
      (completedMinutesThisWeek / totalMinutesThisWeek) * 100;

    return {
      monthly: monthlyProgressPercentage.toFixed(2),
      weekly: weeklyProgressPercentage.toFixed(2),
    };
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
}

const habit = new Habit("entertainment", "Ver Shrek", "2024-06-13", 1, 10);
habit.addUpdate("2024-05-14", 0, 30);
habit.addUpdate("2024-05-15", 1, 0);

const progress = habit.calculateProgress();
console.log(`Progreso mensual: ${progress.monthly}%`);
console.log(`Progreso semanal: ${progress.weekly}%`);

const timeRemaining = habit.timeLeft();
console.log(
  `Tiempo restante: ${timeRemaining.days} días, ${timeRemaining.hours} horas, ${timeRemaining.minutes} minutos`
);

console.log(habit);
