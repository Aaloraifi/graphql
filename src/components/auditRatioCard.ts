import { fetchAuditRatio } from "../graphql";
import { formatBytes } from "../tools";

export async function createAuditRatioCard(jwt: string): Promise<HTMLDivElement> {
  const card = document.createElement("div");
  card.className = "card";
  card.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  card.style.textAlign = "center";
  card.style.position = "relative";
  card.style.overflow = "hidden";

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
  card.appendChild(pattern);

  const heading = document.createElement("h2");
  heading.textContent = "Audit Statistics";
  card.appendChild(heading);

  let totalUp = 0;
  let totalDown = 0;

  try {
    const data = await fetchAuditRatio(jwt);

    let ratioValue = null as number | null;

    Object.entries(data).forEach(([key, value]) => {
      const lower = key.toLowerCase();

      if (lower.includes("totalup"))       { totalUp   = Number(value); return; }
      if (lower.includes("totaldown"))     { totalDown = Number(value); return; }
      if (lower.includes("ratio"))         { ratioValue = value; return; }

      const p = document.createElement("p");
      p.textContent =
        typeof value === "number" ? `${key}: ${value.toFixed(1)}` : `${key}: ${value}`;
      card.appendChild(p);
    });


    // Add the SVG bar chart
    card.appendChild(createAuditBarChart(totalUp, totalDown));

    // Show the actual Audit Ratio value below the chart if available
    if (ratioValue !== null) {
      const ratioHeading = document.createElement("p");
      ratioHeading.textContent = `Audit Ratio: ${ratioValue.toFixed(1)}`;
      ratioHeading.style.fontSize = "1.25rem";
      ratioHeading.style.fontWeight = "sans-serif";
      ratioHeading.style.marginTop = "1.2rem";
      ratioHeading.style.color = "#fff";
      ratioHeading.style.textAlign = "center";
      ratioHeading.style.textShadow = "0 0 4px rgba(0,0,0,0.4)";
      card.appendChild(ratioHeading);
    }
  } catch {
    const errorMsg = document.createElement("p");
    errorMsg.textContent = "Failed to load audit data.";
    errorMsg.className = "error";
    card.appendChild(errorMsg);
  }

  return card;
}

/**
 * Enhanced two-row horizontal bar chart with gradients and animations
 */
function createAuditBarChart(totalUp: number, totalDown: number): SVGSVGElement {
  const max = Math.max(totalUp, totalDown) || 1;
  const fullWidth = 300;
  const barHeight = 20;
  const gap = 12;

  const upWidth = (totalUp / max) * fullWidth;
  const downWidth = (totalDown / max) * fullWidth;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${fullWidth} ${barHeight * 2 + gap + 40}`);
  svg.classList.add("audit-bar-chart");

  // Create gradients
  const defs = document.createElementNS(svgNS, "defs");
  
  // Green gradient for up audits
  const greenGradient = document.createElementNS(svgNS, "linearGradient");
  greenGradient.setAttribute("id", "greenGradient");
  greenGradient.setAttribute("x1", "0%");
  greenGradient.setAttribute("y1", "0%");
  greenGradient.setAttribute("x2", "100%");
  greenGradient.setAttribute("y2", "0%");
  
  const greenStop1 = document.createElementNS(svgNS, "stop");
  greenStop1.setAttribute("offset", "0%");
  greenStop1.setAttribute("stop-color", "#4ade80");
  
  const greenStop2 = document.createElementNS(svgNS, "stop");
  greenStop2.setAttribute("offset", "100%");
  greenStop2.setAttribute("stop-color", "#22c55e");
  
  greenGradient.appendChild(greenStop1);
  greenGradient.appendChild(greenStop2);
  
  // Red gradient for down audits
  const redGradient = document.createElementNS(svgNS, "linearGradient");
  redGradient.setAttribute("id", "redGradient");
  redGradient.setAttribute("x1", "0%");
  redGradient.setAttribute("y1", "0%");
  redGradient.setAttribute("x2", "100%");
  redGradient.setAttribute("y2", "0%");
  
  const redStop1 = document.createElementNS(svgNS, "stop");
  redStop1.setAttribute("offset", "0%");
  redStop1.setAttribute("stop-color", "#f87171");
  
  const redStop2 = document.createElementNS(svgNS, "stop");
  redStop2.setAttribute("offset", "100%");
  redStop2.setAttribute("stop-color", "#ef4444");
  
  redGradient.appendChild(redStop1);
  redGradient.appendChild(redStop2);
  
  defs.appendChild(greenGradient);
  defs.appendChild(redGradient);
  svg.appendChild(defs);

  const makeRect = (y: number, width: number, cls: string) => {
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", "0");
    rect.setAttribute("y", y.toString());
    rect.setAttribute("width", width.toString());
    rect.setAttribute("height", barHeight.toString());
    rect.setAttribute("rx", "6");
    rect.classList.add(cls);
    
    // Add animation
    const animate = document.createElementNS(svgNS, "animate");
    animate.setAttribute("attributeName", "width");
    animate.setAttribute("from", "0");
    animate.setAttribute("to", width.toString());
    animate.setAttribute("dur", "1s");
    animate.setAttribute("fill", "freeze");
    rect.appendChild(animate);
    
    return rect;
  };

  const makeText = (y: number, width: number, value: number) => {
    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", (width / 2).toString());
    text.setAttribute("y", (y + barHeight / 2).toString());
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.classList.add("bar-value");
    text.textContent = formatBytes(value);
    
    // Add fade-in animation
    const animate = document.createElementNS(svgNS, "animate");
    animate.setAttribute("attributeName", "opacity");
    animate.setAttribute("from", "0");
    animate.setAttribute("to", "1");
    animate.setAttribute("dur", "1.5s");
    animate.setAttribute("fill", "freeze");
    text.appendChild(animate);
    
    return text;
  };


  // Bars
  svg.appendChild(makeRect(20, upWidth, "bar-up"));
  svg.appendChild(makeText(20, upWidth, totalUp));

  svg.appendChild(makeRect(barHeight + gap + 20, downWidth, "bar-down"));
  svg.appendChild(makeText(barHeight + gap + 20, downWidth, totalDown));

  return svg;
}
