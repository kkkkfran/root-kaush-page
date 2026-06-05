const config = {
  name: "TU NOMBRE",
  typeSpeed: 110,
  deleteSpeed: 70,
  pauseAfterType: 1200,
  pauseAfterDelete: 450,
};

const target = document.querySelector("#typewriter");
let index = 0;
let deleting = false;

function tick() {
  const { name, typeSpeed, deleteSpeed, pauseAfterType, pauseAfterDelete } = config;

  if (!deleting) {
    index += 1;
    target.textContent = name.slice(0, index);

    if (index === name.length) {
      deleting = true;
      window.setTimeout(tick, pauseAfterType);
      return;
    }

    window.setTimeout(tick, typeSpeed);
    return;
  }

  index -= 1;
  target.textContent = name.slice(0, index);

  if (index === 0) {
    deleting = false;
    window.setTimeout(tick, pauseAfterDelete);
    return;
  }

  window.setTimeout(tick, deleteSpeed);
}

document.title = config.name;
window.setTimeout(tick, 500);
