import { fetchUserSkill } from "../graphql";
import type { UserSkill } from "../types";

export async function createSkillsCard(jwt: string): Promise<HTMLDivElement> {
  const card = document.createElement("div");
  card.className = "card";
  card.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  card.style.textAlign = "center";
  card.style.position = "relative";
  card.style.overflow = "hidden";
  card.style.marginLeft = "25rem";


  const particles = document.createElement("div");
  particles.style.position = "absolute";
  particles.style.top = "0";
  particles.style.left = "0";
  particles.style.right = "0";
  particles.style.bottom = "0";
  particles.style.pointerEvents = "none";
  particles.style.background = `
    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 1px, transparent 1px),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 1px, transparent 1px),
    radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 1px, transparent 1px)
  `;
  particles.style.backgroundSize = "50px 50px, 30px 30px, 70px 70px";
  particles.style.animation = "float 20s infinite linear";
  card.appendChild(particles);

  try {
    const skills = await fetchUserSkill(jwt);

    const title = document.createElement("h2");
    title.textContent = "Best Skills";
    title.style.marginBottom = "0.5rem";
    card.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = "Highest completion rates by category.";
    desc.style.fontSize = "0.9rem";
    desc.style.opacity = "0.8";
    card.appendChild(desc);

    const chart = createRadarChart(skills);
    chart.style.marginTop = "1.5rem";
    card.appendChild(chart);
  } catch {
    const errorMsg = document.createElement("p");
    errorMsg.textContent = "Failed to load skills data.";
    errorMsg.className = "error";
    card.appendChild(errorMsg);
  }

  return card;
}

function createRadarChart(skills: UserSkill[]): SVGSVGElement {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 120;
  const graphScale = 0.7;
  const levels = 5;
  const angleStep = (2 * Math.PI) / skills.length;
  const maxVal = Math.max(...skills.map(s => s.amount)) || 1;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.style.width = "100%";
  svg.style.maxWidth = `${size}px`;
  svg.classList.add("skill-radar");

  // Create gradients
  const defs = document.createElementNS(svgNS, "defs");
  
  // Radial gradient for the skill polygon
  const skillGradient = document.createElementNS(svgNS, "radialGradient");
  skillGradient.setAttribute("id", "skillGradient");
  skillGradient.setAttribute("cx", "50%");
  skillGradient.setAttribute("cy", "50%");
  skillGradient.setAttribute("r", "50%");
  
  const skillStop1 = document.createElementNS(svgNS, "stop");
  skillStop1.setAttribute("offset", "0%");
  skillStop1.setAttribute("stop-color", "rgba(255,255,255,0.6)");
  
  const skillStop2 = document.createElementNS(svgNS, "stop");
  skillStop2.setAttribute("offset", "100%");
  skillStop2.setAttribute("stop-color", "rgba(225,0,152,0.3)");
  
  skillGradient.appendChild(skillStop1);
  skillGradient.appendChild(skillStop2);
  defs.appendChild(skillGradient);
  svg.appendChild(defs);

  // Grid circles with glow effect
  for (let i = 1; i <= levels; i++) {
    const r = (radius / levels) * i;
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", `${cx}`);
    circle.setAttribute("cy", `${cy}`);
    circle.setAttribute("r", `${r}`);
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", "#ffffff40");
    circle.setAttribute("stroke-width", i === levels ? "1.5" : "0.8");
    
    if (i === levels) {
      circle.setAttribute("filter", "drop-shadow(0 0 4px rgba(255,255,255,0.3))");
    }
    
    svg.appendChild(circle);
  }

  // Spokes and labels with enhanced styling
  skills.forEach((skill, idx) => {
    const angle = angleStep * idx - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;

    // Spoke line
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", `${cx}`);
    line.setAttribute("y1", `${cy}`);
    line.setAttribute("x2", `${x}`);
    line.setAttribute("y2", `${y}`);
    line.setAttribute("stroke", "#ffffff40");
    line.setAttribute("stroke-width", "1");
    svg.appendChild(line);

    // Skill point
    const point = document.createElementNS(svgNS, "circle");
    const percent = skill.amount / maxVal;
    const scaledR = percent * radius * graphScale;
    const pointX = cx + Math.cos(angle) * scaledR;
    const pointY = cy + Math.sin(angle) * scaledR;
    
    point.setAttribute("cx", `${pointX}`);
    point.setAttribute("cy", `${pointY}`);
    point.setAttribute("r", "4");
    point.setAttribute("fill", "#e10098");
    point.setAttribute("stroke", "#fff");
    point.setAttribute("stroke-width", "2");
    
    // Add pulse animation
    const animate = document.createElementNS(svgNS, "animate");
    animate.setAttribute("attributeName", "r");
    animate.setAttribute("values", "4;6;4");
    animate.setAttribute("dur", "2s");
    animate.setAttribute("repeatCount", "indefinite");
    point.appendChild(animate);
    
    svg.appendChild(point);

    // Label with background
    const labelX = cx + Math.cos(angle) * (radius + 20);
    const labelY = cy + Math.sin(angle) * (radius + 20);
    
    // Background circle for label
    const labelBg = document.createElementNS(svgNS, "circle");
    labelBg.setAttribute("cx", `${labelX}`);
    labelBg.setAttribute("cy", `${labelY}`);
    labelBg.setAttribute("r", "18");
    labelBg.setAttribute("fill", "rgba(0,0,0,0.6)");
    labelBg.setAttribute("stroke", "#e10098");
    labelBg.setAttribute("stroke-width", "1");
    svg.appendChild(labelBg);
    
    const label = document.createElementNS(svgNS, "text");
    label.textContent = skill.type.replace("skill_", "").toUpperCase();
    label.setAttribute("x", `${labelX}`);
    label.setAttribute("y", `${labelY}`);
    label.setAttribute("fill", "#fff");
    label.setAttribute("font-size", "10");
    label.setAttribute("font-weight", "600");
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("dominant-baseline", "middle");
    svg.appendChild(label);
  });

  // Skill polygon with animation
  const points = skills.map((s, idx) => {
    const percent = s.amount / maxVal;
    const angle = angleStep * idx - Math.PI / 2;
    const scaledR = percent * radius * graphScale;
    const x = cx + Math.cos(angle) * scaledR;
    const y = cy + Math.sin(angle) * scaledR;
    return `${x},${y}`;
  }).join(" ");

  const poly = document.createElementNS(svgNS, "polygon");
  poly.setAttribute("points", points);
  poly.setAttribute("fill", "url(#skillGradient)");
  poly.setAttribute("stroke", "#e10098");
  poly.setAttribute("stroke-width", "2");
  poly.setAttribute("opacity", "0");
  
  // Fade in animation
  const polyAnimate = document.createElementNS(svgNS, "animate");
  polyAnimate.setAttribute("attributeName", "opacity");
  polyAnimate.setAttribute("from", "0");
  polyAnimate.setAttribute("to", "1");
  polyAnimate.setAttribute("dur", "1.5s");
  polyAnimate.setAttribute("fill", "freeze");
  poly.appendChild(polyAnimate);
  
  svg.appendChild(poly);

  return svg;
}

