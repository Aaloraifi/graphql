import { fetchLastThreeProjects } from "../graphql";
import type { LastProject } from "../types";

export async function createLearningProgressCardWithProjects(jwt: string): Promise<HTMLDivElement> {
  const card = document.createElement("div");
  card.className = "card";
  card.style.background = "linear-gradient(135deg, #667eea 0%, #e10098 100%)";
  card.style.textAlign = "center";
  card.style.position = "relative";
  card.style.overflow = "hidden";

  const heading = document.createElement("h2");
  heading.textContent = "Learning Progress";
  heading.style.marginBottom = "0.5rem";
  card.appendChild(heading);

  const msg = document.createElement("div");
  msg.style.marginTop = "1.5rem";
  msg.style.fontSize = "1rem";
  msg.style.opacity = "0.95";
  msg.style.color = "#fff";
  msg.textContent = "Every day is a new chance to learn and grow. Keep going!🔥🚀";
  card.appendChild(msg);

  // Last 3 projects
  const projects: LastProject[] = await fetchLastThreeProjects(jwt);
  if (projects.length) {
    const projTitle = document.createElement("h3");
    projTitle.textContent = "Last 3 Projects";
    projTitle.style.margin = "1.5rem 0 0.5rem 0";
    projTitle.style.color = "#fff";
    card.appendChild(projTitle);
    const list = document.createElement("div");
    list.style.display = "flex";
    list.style.flexDirection = "row";
    list.style.justifyContent = "flex-start";
    list.style.gap = "1.2rem";
    list.style.margin = "0";
    list.style.overflowX = "auto";
    list.style.paddingBottom = "0.5rem";
    list.style.scrollbarWidth = "thin";
    list.style.maxWidth = "100%";
    projects.forEach(p => {
      const projCard = document.createElement("div");
      projCard.style.background = "rgba(255,255,255,0.10)";
      projCard.style.borderRadius = "14px";
      projCard.style.padding = "1.1rem 1.3rem";
      projCard.style.minWidth = "180px";
      projCard.style.maxWidth = "220px";
      projCard.style.boxShadow = "0 2px 12px rgba(0,0,0,0.10)";
      projCard.style.display = "flex";
      projCard.style.flexDirection = "column";
      projCard.style.alignItems = "flex-start";
      projCard.style.transition = "transform 0.2s";
      projCard.style.fontSize = "1.05rem";
      projCard.style.color = "#fff";
      projCard.style.position = "relative";
      // Project name
      const name = document.createElement("div");
      name.innerHTML = `📛 <strong>${p.name}</strong>`;
      name.style.marginBottom = "0.5rem";
      projCard.appendChild(name);
      // Date completed
      const date = document.createElement("div");
      date.innerHTML = `🕓 <span style='color:#e0e0e0;'>${new Date(p.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>`;
      date.style.marginBottom = "0.5rem";
      projCard.appendChild(date);
      // XP earned
      const xp = document.createElement("div");
      xp.innerHTML = `💯 <span style='color:#ffd700;'>${p.amount}</span> XP`;
      xp.style.marginBottom = "0.5rem";
      projCard.appendChild(xp);
      list.appendChild(projCard);
    });
    card.appendChild(list);
  }

  return card;
}
