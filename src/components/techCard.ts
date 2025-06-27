import { fetchUserTech } from "../graphql";

export async function createTechCard(jwt: string): Promise<HTMLDivElement> {
  const techCard = document.createElement("div");
  techCard.className = "card";
  techCard.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  techCard.style.textAlign = "center";
  techCard.style.position = "relative";
  techCard.style.overflow = "hidden";
  
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
  techCard.appendChild(particles);

  try {
    const techs = await fetchUserTech(jwt);
    const heading = document.createElement("h2");
    heading.textContent = `Technologies`;
    heading.style.marginBottom = "0.5rem";
    techCard.appendChild(heading);
    const desc = document.createElement("p");
    desc.textContent = "Skills with the Highest completion rates by category.";
    desc.style.fontSize = "0.9rem";
    desc.style.opacity = "0.8";
    techCard.appendChild(desc);
    const chart = createTechRadarChart(techs);
    chart.style.marginTop = "1.5rem";
    techCard.appendChild(chart);
  } catch {
    techCard.innerHTML = "<p>Failed to load technologies.</p>";
  }

  return techCard;
}

function getTechDisplayName(techType: string): string {
  const techMap: { [key: string]: string } = {
    "skill_git": "Git",
    "skill_go": "Go",
    "skill_js": "JS",
    "skill_html": "HTML",
    "skill_css": "CSS",
    "skill_unix": "Unix/Linux",
    "skill_docker": "Docker",
    "skill_sql": "SQL"
  };
  return techMap[techType] || `💻 ${techType.replace("skill_", "").toUpperCase()}`;
}

function createTechRadarChart(techs: { type: string; amount: number }[]): SVGSVGElement {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 120;
  const graphScale = 0.7;
  const levels = 5;
  const angleStep = (2 * Math.PI) / techs.length;
  const maxVal = Math.max(...techs.map(t => t.amount)) || 1;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.style.width = "100%";
  svg.style.maxWidth = `${size}px`;
  svg.classList.add("tech-radar");

  // Create gradients
  const defs = document.createElementNS(svgNS, "defs");
  const techGradient = document.createElementNS(svgNS, "radialGradient");
  techGradient.setAttribute("id", "techGradient");
  techGradient.setAttribute("cx", "50%");
  techGradient.setAttribute("cy", "50%");
  techGradient.setAttribute("r", "50%");
  const stop1 = document.createElementNS(svgNS, "stop");
  stop1.setAttribute("offset", "0%");
  stop1.setAttribute("stop-color", "rgba(255,255,255,0.6)");
  const stop2 = document.createElementNS(svgNS, "stop");
  stop2.setAttribute("offset", "100%");
  stop2.setAttribute("stop-color", "rgba(118,75,162,0.3)");
  techGradient.appendChild(stop1);
  techGradient.appendChild(stop2);
  defs.appendChild(techGradient);
  svg.appendChild(defs);

  // Grid circles
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

  // Spokes and labels
  techs.forEach((tech, idx) => {
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
    // Tech point
    const percent = tech.amount / maxVal;
    const scaledR = percent * radius * graphScale;
    const pointX = cx + Math.cos(angle) * scaledR;
    const pointY = cy + Math.sin(angle) * scaledR;
    const point = document.createElementNS(svgNS, "circle");
    point.setAttribute("cx", `${pointX}`);
    point.setAttribute("cy", `${pointY}`);
    point.setAttribute("r", "4");
    point.setAttribute("fill", "#e10098"); 
    point.setAttribute("stroke", "#fff");
    point.setAttribute("stroke-width", "2");
    // Pulse animation
    const animate = document.createElementNS(svgNS, "animate");
    animate.setAttribute("attributeName", "r");
    animate.setAttribute("values", "4;6;4");
    animate.setAttribute("dur", "2s");
    animate.setAttribute("repeatCount", "indefinite");
    point.appendChild(animate);
    svg.appendChild(point);
    // Label background
    const labelX = cx + Math.cos(angle) * (radius + 20);
    const labelY = cy + Math.sin(angle) * (radius + 20);
    const labelBg = document.createElementNS(svgNS, "circle");
    labelBg.setAttribute("cx", `${labelX}`);
    labelBg.setAttribute("cy", `${labelY}`);
    labelBg.setAttribute("r", "18");
    labelBg.setAttribute("fill", "rgba(0,0,0,0.6)");
    labelBg.setAttribute("stroke", "#e10098");
    labelBg.setAttribute("stroke-width", "1");
    svg.appendChild(labelBg);
    // Label text
    const label = document.createElementNS(svgNS, "text");
    label.textContent = getTechDisplayName(tech.type);
    label.setAttribute("x", `${labelX}`);
    label.setAttribute("y", `${labelY}`);
    label.setAttribute("fill", "#fff");
    label.setAttribute("font-size", "10");
    label.setAttribute("font-weight", "600");
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("dominant-baseline", "middle");
    svg.appendChild(label);
  });

  // Tech polygon
  const points = techs.map((t, idx) => {
    const percent = t.amount / maxVal;
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


