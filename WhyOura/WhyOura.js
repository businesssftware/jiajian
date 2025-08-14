class SleepTrackerInterface {
  constructor() {
    this.currentMonth = "june";
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    const monthBtns = document.querySelectorAll(".month-btn");
    monthBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const month = e.target.dataset.month;
        if (month !== this.currentMonth) {
          this.switchMonth(month);
        }
      });
    });
  }

  switchMonth(newMonth) {
    // Button Switch
    document.querySelectorAll(".month-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.month === newMonth);
    });

    // Background Image Switch
    document
      .getElementById(`bg-${this.currentMonth}`)
      ?.classList.remove("active");
    document.getElementById(`bg-${newMonth}`)?.classList.add("active");

    // Middle Image Swtich
    document
      .getElementById(`img-${this.currentMonth}`)
      ?.classList.remove("active");
    document.getElementById(`img-${newMonth}`)?.classList.add("active");

    this.currentMonth = newMonth;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new SleepTrackerInterface();
});