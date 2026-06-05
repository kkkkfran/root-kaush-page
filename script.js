const portfolio = {
  name: "Tu Nombre",
  handle: "tu_nombre.dev",
  role: "Developer creativo",
  headline: "Construyo mundos digitales.",
  intro:
    "Muestro mis proyectos, experimento con ideas nuevas y mezclo codigo con una estetica pixel bien marcada.",
  aboutTitle: "Sobre mi",
  about: [
    "Soy creador de proyectos web, bots y herramientas digitales. Me gusta convertir ideas simples en experiencias cuidadas, rapidas y faciles de usar.",
    "Este portfolio esta pensado para crecer contigo: cambia los textos, agrega tus proyectos reales y conecta tu Discord cuando tengas tu ID listo.",
  ],
  stats: [
    { value: "HTML", label: "Base liviana" },
    { value: "CSS", label: "Estilo pixel" },
    { value: "JS", label: "Sin framework" },
  ],
  discord: {
    username: "tu_usuario",
    displayName: "Tu Discord",
    userId: "",
    avatarUrl: "",
    profileUrl: "",
    statusText: "Disponible para colaborar",
    fetchPresence: false,
  },
  contact: {
    title: "Hablemos de una idea",
    links: [
      { label: "Discord", url: "#discord", style: "primary" },
      { label: "GitHub", url: "https://github.com/" },
    ],
  },
  projects: [
    {
      title: "Proyecto survival",
      type: "Web app",
      description:
        "Panel para mostrar estados, enlaces y novedades de una comunidad con identidad propia.",
      tags: ["HTML", "CSS", "Railway"],
      accent: "#51f08a",
      liveUrl: "",
      repoUrl: "",
    },
    {
      title: "Bot de Discord",
      type: "Automatizacion",
      description:
        "Bot modular con comandos, roles y mensajes listos para una comunidad activa.",
      tags: ["Discord", "JavaScript", "API"],
      accent: "#44d9ff",
      liveUrl: "",
      repoUrl: "",
    },
    {
      title: "Launcher visual",
      type: "Interfaz",
      description:
        "Concepto de launcher con tarjetas, accesos rapidos y estilo pixel para proyectos personales.",
      tags: ["UI", "Pixel", "Frontend"],
      accent: "#ffd166",
      liveUrl: "",
      repoUrl: "",
    },
  ],
};

const $ = (selector) => document.querySelector(selector);

function setText(selector, text) {
  const element = $(selector);
  if (element) element.textContent = text;
}

function initialsFrom(text) {
  return text
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function usableUrl(url) {
  return typeof url === "string" && url.trim() && url.trim() !== "#";
}

function renderAbout() {
  const aboutCopy = $("#aboutCopy");
  const paragraphs = portfolio.about
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");
  const stats = portfolio.stats
    .map(
      (stat) => `
        <div class="stat-tile">
          <strong>${stat.value}</strong>
          <span>${stat.label}</span>
        </div>
      `
    )
    .join("");

  aboutCopy.innerHTML = `${paragraphs}<div class="stats-row">${stats}</div>`;
}

function renderDiscord() {
  const discord = portfolio.discord;
  const profileUrl =
    discord.profileUrl ||
    (discord.userId ? `https://discord.com/users/${discord.userId}` : "#discord");

  setText("#discordName", discord.displayName || discord.username);
  setText("#discordStatus", discord.statusText);
  $("#discordProfileLink").href = profileUrl;
  $("#discordCta").href = profileUrl;

  const avatar = $("#discordAvatar");
  if (usableUrl(discord.avatarUrl)) {
    avatar.innerHTML = `<img src="${discord.avatarUrl}" alt="Avatar de ${discord.username}" />`;
  } else {
    avatar.textContent = initialsFrom(discord.displayName || discord.username || "PX");
  }
}

function renderProjects() {
  const grid = $("#projectsGrid");
  grid.innerHTML = portfolio.projects
    .map((project) => {
      const tags = project.tags.map((tag) => `<span>${tag}</span>`).join("");
      const liveButton = usableUrl(project.liveUrl)
        ? `<a class="button button--primary" href="${project.liveUrl}" target="_blank" rel="noreferrer">Demo</a>`
        : "";
      const repoButton = usableUrl(project.repoUrl)
        ? `<a class="button button--ghost" href="${project.repoUrl}" target="_blank" rel="noreferrer">Codigo</a>`
        : "";
      const emptyButton =
        liveButton || repoButton
          ? ""
          : `<a class="button button--ghost" href="#contacto">Pronto</a>`;

      return `
        <article class="project-card" style="--project-accent: ${project.accent}">
          <p class="project-type">${project.type}</p>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="tag-list">${tags}</div>
          <div class="project-actions">${liveButton}${repoButton}${emptyButton}</div>
        </article>
      `;
    })
    .join("");
}

function renderContact() {
  setText("#contactTitle", portfolio.contact.title);
  $("#contactActions").innerHTML = portfolio.contact.links
    .map((link) => {
      const style = link.style === "primary" ? "button--primary" : "button--ghost";
      const external = link.url.startsWith("http");
      const attrs = external ? 'target="_blank" rel="noreferrer"' : "";
      return `<a class="button ${style}" href="${link.url}" ${attrs}>${link.label}</a>`;
    })
    .join("");
}

async function hydrateDiscordPresence() {
  const discord = portfolio.discord;
  if (!discord.fetchPresence || !discord.userId) return;

  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${discord.userId}`);
    const { success, data } = await response.json();
    if (!success || !data) return;

    const user = data.discord_user;
    const avatarExt = user.avatar?.startsWith("a_") ? "gif" : "png";
    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${avatarExt}?size=160`
      : "";
    const statusMap = {
      online: "En linea",
      idle: "Ausente",
      dnd: "Ocupado",
      offline: "Offline",
    };

    if (avatarUrl) {
      $("#discordAvatar").innerHTML = `<img src="${avatarUrl}" alt="Avatar de ${user.username}" />`;
    }

    setText("#discordName", user.global_name || user.username);
    setText("#discordStatus", statusMap[data.discord_status] || portfolio.discord.statusText);
    $("#statusDot").className = `status-dot is-${data.discord_status}`;
  } catch {
    setText("#discordStatus", portfolio.discord.statusText);
  }
}

function bindCopyDiscord() {
  $("#copyDiscord").addEventListener("click", async () => {
    const username = portfolio.discord.username;
    try {
      await navigator.clipboard.writeText(username);
      setText("#copyDiscord", "Copiado");
      window.setTimeout(() => setText("#copyDiscord", "Copiar usuario"), 1400);
    } catch {
      setText("#copyDiscord", username);
    }
  });
}

function boot() {
  document.title = `${portfolio.name} | Portfolio`;
  setText("#brandName", portfolio.handle);
  setText("#heroEyebrow", portfolio.role);
  setText("#heroTitle", portfolio.headline);
  setText("#heroIntro", portfolio.intro);
  setText("#aboutTitle", portfolio.aboutTitle);
  setText("#footerName", portfolio.name);
  setText("#footerYear", new Date().getFullYear().toString());

  renderAbout();
  renderDiscord();
  renderProjects();
  renderContact();
  bindCopyDiscord();
  hydrateDiscordPresence();
}

boot();
