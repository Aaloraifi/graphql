import { fetchUserTech } from "../graphql";

export async function createTechCard(jwt: string): Promise<HTMLDivElement> {
  const techCard = document.createElement("div");
  techCard.className = "card";
  techCard.className = "card";
  techCard.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  techCard.style.textAlign = "center";
  techCard.style.position = "relative";
  techCard.style.overflow = "hidden";
  techCard.style.marginLeft = "28rem";

  const pattern = document.createElement("div");
  pattern.style.position = "absolute";
  pattern.style.top = "0";
  pattern.style.left = "0";
  pattern.style.right = "0";
  pattern.style.bottom = "0";
  pattern.style.opacity = "0.1";
  pattern.style.background = `
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(255,255,255,0.1) 10px,
      rgba(255,255,255,0.1) 20px
    )
  `;
  techCard.appendChild(pattern);

  try {
    const techs = await fetchUserTech(jwt);

    const heading = document.createElement("h2");
    heading.textContent = `Technologies`;
    techCard.appendChild(heading);

    const chart = createTechBarChart(techs);
    chart.style.margin = "5.5rem auto 0 auto";
    chart.style.display = "block";
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

function createTechBarChart(techs: { type: string; amount: number }[]): SVGSVGElement {
  const width = 380;
  const height = 320;
  const margin = { top: 48, right: 48, bottom: 64, left: 64 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const barWidth = Math.max(14, Math.floor(chartWidth / (techs.length * 1.4)));
  const gap = Math.max(12, Math.floor((chartWidth - barWidth * techs.length) / (techs.length - 1 || 1)));
  const maxVal = Math.max(...techs.map(t => t.amount)) || 1;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.style.width = "100%";
  svg.style.maxWidth = `${width}px`;
  svg.style.display = "block";
  svg.style.margin = "0 auto";
  svg.classList.add("tech-bar-chart");

  // Gradient for bars
  const defs = document.createElementNS(svgNS, "defs");
  const grad = document.createElementNS(svgNS, "linearGradient");
  grad.setAttribute("id", "techBarGradient");
  grad.setAttribute("x1", "0");
  grad.setAttribute("y1", "0");
  grad.setAttribute("x2", "0");
  grad.setAttribute("y2", "1");

  const stop1 = document.createElementNS(svgNS, "stop");
  stop1.setAttribute("offset", "0%");
  stop1.setAttribute("stop-color", "#e10098");
  stop1.setAttribute("stop-opacity", "0.9");

  const stop2 = document.createElementNS(svgNS, "stop");
  stop2.setAttribute("offset", "100%");
  stop2.setAttribute("stop-color", "#764ba2");
  stop2.setAttribute("stop-opacity", "0.7");

  grad.appendChild(stop1);
  grad.appendChild(stop2);
  defs.appendChild(grad);
  svg.appendChild(defs);

  // Draw Y axis
  const yAxis = document.createElementNS(svgNS, "line");
  yAxis.setAttribute("x1", `${margin.left}`);
  yAxis.setAttribute("y1", `${margin.top}`);
  yAxis.setAttribute("x2", `${margin.left}`);
  yAxis.setAttribute("y2", `${height - margin.bottom}`);
  yAxis.setAttribute("stroke", "#fff");
  yAxis.setAttribute("stroke-width", "2");
  yAxis.setAttribute("opacity", "0.7");
  svg.appendChild(yAxis);

  // Draw X axis
  const xAxis = document.createElementNS(svgNS, "line");
  xAxis.setAttribute("x1", `${margin.left}`);
  xAxis.setAttribute("y1", `${height - margin.bottom}`);
  xAxis.setAttribute("x2", `${width - margin.right}`);
  xAxis.setAttribute("y2", `${height - margin.bottom}`);
  xAxis.setAttribute("stroke", "#fff");
  xAxis.setAttribute("stroke-width", "2");
  xAxis.setAttribute("opacity", "0.7");
  svg.appendChild(xAxis);

  // Y axis ticks and labels
  const ticks = 5;
  for (let i = 0; i <= ticks; i++) {
    const value = Math.round((maxVal * (ticks - i)) / ticks);
    const y = margin.top + (chartHeight * i) / ticks;

    const tick = document.createElementNS(svgNS, "line");
    tick.setAttribute("x1", `${margin.left - 6}`);
    tick.setAttribute("y1", `${y}`);
    tick.setAttribute("x2", `${margin.left}`);
    tick.setAttribute("y2", `${y}`);
    tick.setAttribute("stroke", "#fff");
    tick.setAttribute("stroke-width", "1.2");
    tick.setAttribute("opacity", "0.7");
    svg.appendChild(tick);

    const label = document.createElementNS(svgNS, "text");
    label.textContent = `${value}`;
    label.setAttribute("x", `${margin.left - 10}`);
    label.setAttribute("y", `${y + 4}`);
    label.setAttribute("text-anchor", "end");
    label.setAttribute("fill", "#fff");
    label.setAttribute("font-size", "12");
    label.setAttribute("font-weight", "500");
    label.setAttribute("opacity", "0.8");
    svg.appendChild(label);
  }

  // Bars and Labels
  techs.forEach((tech, i) => {
    const x = margin.left + i * (barWidth + gap) + gap / 2;
    const barHeight = (tech.amount / maxVal) * chartHeight;
    const y = margin.top + chartHeight - barHeight;

    // Bar
    const bar = document.createElementNS(svgNS, "rect");
    bar.setAttribute("x", `${x}`);
    bar.setAttribute("y", `${margin.top + chartHeight}`);
    bar.setAttribute("width", `${barWidth}`);
    bar.setAttribute("height", `0`);
    bar.setAttribute("rx", "7");
    bar.setAttribute("fill", "url(#techBarGradient)");
    bar.setAttribute("stroke", "#fff");
    bar.setAttribute("stroke-width", "1.5");
    bar.setAttribute("filter", "drop-shadow(0 0 8px #e10098aa)");

    const animate = document.createElementNS(svgNS, "animate");
    animate.setAttribute("attributeName", "y");
    animate.setAttribute("from", `${margin.top + chartHeight}`);
    animate.setAttribute("to", `${y}`);
    animate.setAttribute("dur", "1.2s");
    animate.setAttribute("fill", "freeze");
    bar.appendChild(animate);

    const animateH = document.createElementNS(svgNS, "animate");
    animateH.setAttribute("attributeName", "height");
    animateH.setAttribute("from", `0`);
    animateH.setAttribute("to", `${barHeight}`);
    animateH.setAttribute("dur", "1.2s");
    animateH.setAttribute("fill", "freeze");
    bar.appendChild(animateH);
    svg.appendChild(bar);

    // Value label above bar
    const value = document.createElementNS(svgNS, "text");
    value.textContent = `${tech.amount}`;
    value.setAttribute("x", `${x + barWidth / 2}`);
    value.setAttribute("y", `${y - 8}`);
    value.setAttribute("text-anchor", "middle");
    value.setAttribute("fill", "#fff");
    value.setAttribute("font-size", "13");
    value.setAttribute("font-weight", "600");
    value.setAttribute("filter", "drop-shadow(0 0 4px #e10098)");
    svg.appendChild(value);

    // X-axis label (multiline)
    const label = document.createElementNS(svgNS, "text");
    const displayLabel = getTechDisplayName(tech.type);
    const words = displayLabel.split(/[\s/-]/); // supports underscores and spaces
    words.forEach((word, index) => {
      const tspan = document.createElementNS(svgNS, "tspan");
      tspan.textContent = word;
      tspan.setAttribute("x", `${x + barWidth / 2}`);
      tspan.setAttribute("dy", index === 0 ? "0" : "1.1em");
      label.appendChild(tspan);
    });

    label.setAttribute("x", `${x + barWidth / 2}`);
    label.setAttribute("y", `${height - margin.bottom + 20}`);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("fill", "#fff");
    label.setAttribute("font-size", "11");
    label.setAttribute("font-weight", "700");
    label.setAttribute("letter-spacing", "0.03em");
    svg.appendChild(label);
  });

  // Y axis label
  const yLabel = document.createElementNS(svgNS, "text");
  yLabel.textContent = "Amount";
  yLabel.setAttribute("x", `${margin.left - 36}`);
  yLabel.setAttribute("y", `${margin.top - 10}`);
  yLabel.setAttribute("text-anchor", "middle");
  yLabel.setAttribute("fill", "#fff");
  yLabel.setAttribute("font-size", "13");
  yLabel.setAttribute("font-weight", "600");
  yLabel.setAttribute("transform", `rotate(-90 ${margin.left - 36},${margin.top - 10})`);
  svg.appendChild(yLabel);

  // X axis label
  const xLabel = document.createElementNS(svgNS, "text");
  xLabel.textContent = "Technology";
  xLabel.setAttribute("x", `${margin.left + chartWidth / 2}`);
  xLabel.setAttribute("y", `${height - 8}`);
  xLabel.setAttribute("text-anchor", "middle");
  xLabel.setAttribute("fill", "#fff");
  xLabel.setAttribute("font-size", "13");
  xLabel.setAttribute("font-weight", "600");
  svg.appendChild(xLabel);

  return svg;
}


