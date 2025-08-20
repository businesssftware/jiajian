document.addEventListener("DOMContentLoaded", function () {
  const colorDots = document.querySelectorAll(".color-dot");
  const ringImages = document.querySelectorAll(".ring-image");
  const colors = [
    "silver",
    "black",
    "brushed-silver",
    "stealth",
    "gold",
    "rose-gold",
  ];
  let currentIndex = 0;

  colorDots.forEach((dot, index) => {
    dot.addEventListener("click", function () {
      const selectedColor = this.getAttribute("data-color");
      const newIndex = colors.indexOf(selectedColor);

      if (newIndex === currentIndex) return;

      colorDots.forEach((d) => d.classList.remove("active"));

      this.classList.add("active");

      const currentActive = document.querySelector(".ring-image.active");
      const newImage = document.querySelector(
        `.ring-image[data-color="${selectedColor}"]`
      );

      if (currentActive && newImage) {
        const slideFromRight = newIndex > currentIndex;

        newImage.classList.remove("slide-left", "slide-right", "active");
        newImage.style.opacity = "1";

        if (slideFromRight) {
          newImage.classList.add("slide-right");
          setTimeout(() => {
            currentActive.classList.add("slide-left");
            currentActive.classList.remove("active");
            newImage.classList.remove("slide-right");
            newImage.classList.add("active");
          }, 50);
        } else {
          newImage.classList.add("slide-left");
          setTimeout(() => {
            currentActive.classList.add("slide-right");
            currentActive.classList.remove("active");
            newImage.classList.remove("slide-left");
            newImage.classList.add("active");
          }, 50);
        }

        setTimeout(() => {
          currentActive.classList.remove("slide-left", "slide-right");
        }, 800);
      }

      currentIndex = newIndex;
    });
  });
});
