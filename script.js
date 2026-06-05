const config = {
  name: "KAUSHO",
  discordProfileUrl: "https://discord.com/users/453319707743748106",
  discordAvatarUrl:
    "https://cdn.discordapp.com/avatars/453319707743748106/a_9cb7bf397783b17e355c5064fc186644.gif",
  discordDecorationUrl:
    "https://cdn.discordapp.com/avatar-decoration-presets/a_d10e9efc4d97fd568e3318a3aa65e615.png?size=256&passthrough=true",
  discordUserId: "453319707743748106",
  typeSpeed: 110,
  deleteSpeed: 70,
  pauseAfterType: 1200,
  pauseAfterDelete: 450,
};

const target = document.querySelector("#typewriter");
const avatar = document.querySelector("#avatar");
const avatarDecoration = document.querySelector("#avatarDecoration");
const avatarLink = document.querySelector("#avatarLink");
const avatarFallback = document.querySelector("#avatarFallback");
let index = 0;
let deleting = false;

function initialsFrom(text) {
  return text
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function showAvatar(url) {
  if (!url) return;

  avatar.src = url;
  avatar.addEventListener("load", () => avatar.classList.add("is-loaded"), {
    once: true,
  });
}

function showDecoration(url) {
  if (!url) return;

  avatarDecoration.src = url;
  avatarDecoration.addEventListener(
    "load",
    () => avatarDecoration.classList.add("is-loaded"),
    { once: true }
  );
}

async function loadDiscordAvatar() {
  const {
    discordAvatarUrl,
    discordDecorationUrl,
    discordProfileUrl,
    discordUserId,
    name,
  } = config;

  avatarFallback.textContent = initialsFrom(name);

  if (discordProfileUrl) {
    avatarLink.href = discordProfileUrl;
  } else if (discordUserId) {
    avatarLink.href = `https://discord.com/users/${discordUserId}`;
  }

  if (discordAvatarUrl) {
    showAvatar(discordAvatarUrl);
    showDecoration(discordDecorationUrl);
    return;
  }

  if (!discordUserId) return;

  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`);
    const { success, data } = await response.json();
    if (!success || !data?.discord_user?.avatar) return;

    const user = data.discord_user;
    const extension = user.avatar.startsWith("a_") ? "gif" : "png";
    showAvatar(
      `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=256`
    );

    if (data.discord_user.avatar_decoration_data?.asset) {
      showDecoration(
        `https://cdn.discordapp.com/avatar-decoration-presets/${data.discord_user.avatar_decoration_data.asset}.png?size=256&passthrough=true`
      );
    }
  } catch {
    avatarFallback.textContent = initialsFrom(name);
  }
}

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
loadDiscordAvatar();
window.setTimeout(tick, 500);
