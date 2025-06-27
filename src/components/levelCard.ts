import { fetchTransaction } from "../graphql";

export async function createLevelCard(jwt: string): Promise<HTMLDivElement> {
  const card = document.createElement("div");
  card.className = "card";
  card.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  card.style.textAlign = "center";
  card.style.position = "relative";
  card.style.overflow = "hidden";

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
    const level = await fetchTransaction(jwt);

    const title = document.createElement("h2");
    title.textContent = "Current Level";
    title.style.marginBottom = "0.5rem";
    title.style.position = "relative";
    title.style.zIndex = "2";
    card.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = "Your progress through the curriculum";
    desc.style.fontSize = "0.85rem";
    desc.style.opacity = "0.8";
    desc.style.marginBottom = "2rem";
    desc.style.position = "relative";
    desc.style.zIndex = "2";
    card.appendChild(desc);

    const svgContainer = document.createElement("div");
    svgContainer.style.position = "relative";
    svgContainer.style.zIndex = "2";
    
    const svg = createEnhancedLevelVisualization(level);
    svgContainer.appendChild(svg);
    card.appendChild(svgContainer);

    // Add level details
    const details = document.createElement("div");
    details.style.marginTop = "1.5rem";
    details.style.position = "relative";
    details.style.zIndex = "2";
    
    const progressText = document.createElement("p");
    progressText.textContent = `${level}% Complete`;
    progressText.style.fontSize = "1.1rem";
    progressText.style.fontWeight = "600";
    progressText.style.margin = "0.5rem 0";
    
    const nextLevel = Math.ceil(level / 10) * 10;
    const nextLevelText = document.createElement("p");
    nextLevelText.textContent = `Next milestone: Level ${nextLevel}`;
    nextLevelText.style.fontSize = "0.9rem";
    nextLevelText.style.opacity = "0.7";
    nextLevelText.style.margin = "0";
    
    details.appendChild(progressText);
    details.appendChild(nextLevelText);
    card.appendChild(details);

  } catch {
    const errorMsg = document.createElement("p");
    errorMsg.textContent = "Failed to load level data.";
    errorMsg.className = "error";
    errorMsg.style.position = "relative";
    errorMsg.style.zIndex = "2";
    card.appendChild(errorMsg);
  }

  return card;
}

function createEnhancedLevelVisualization(level: number): SVGSVGElement {
  const size = 200;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const progress = (level / 100) * circumference;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.setAttribute("width", "200");
  svg.setAttribute("height", "200");
  svg.classList.add("level-visualization");

  // Create gradients
  const defs = document.createElementNS(svgNS, "defs");
  
  // Progress gradient
  const progressGradient = document.createElementNS(svgNS, "linearGradient");
  progressGradient.setAttribute("id", "progressGradient");
  progressGradient.setAttribute("x1", "0%");
  progressGradient.setAttribute("y1", "0%");
  progressGradient.setAttribute("x2", "100%");
  progressGradient.setAttribute("y2", "100%");
  
  const progStop1 = document.createElementNS(svgNS, "stop");
  progStop1.setAttribute("offset", "0%");
  progStop1.setAttribute("stop-color", "#ffd700");
  
  const progStop2 = document.createElementNS(svgNS, "stop");
  progStop2.setAttribute("offset", "100%");
  progStop2.setAttribute("stop-color", "#ff6b35");
  
  progressGradient.appendChild(progStop1);
  progressGradient.appendChild(progStop2);
  
  // Glow filter
  const filter = document.createElementNS(svgNS, "filter");
  filter.setAttribute("id", "glow");
  
  const feGaussianBlur = document.createElementNS(svgNS, "feGaussianBlur");
  feGaussianBlur.setAttribute("stdDeviation", "3");
  feGaussianBlur.setAttribute("result", "coloredBlur");
  
  const feMerge = document.createElementNS(svgNS, "feMerge");
  const feMergeNode1 = document.createElementNS(svgNS, "feMergeNode");
  feMergeNode1.setAttribute("in", "coloredBlur");
  const feMergeNode2 = document.createElementNS(svgNS, "feMergeNode");
  feMergeNode2.setAttribute("in", "SourceGraphic");
  
  feMerge.appendChild(feMergeNode1);
  feMerge.appendChild(feMergeNode2);
  filter.appendChild(feGaussianBlur);
  filter.appendChild(feMerge);
  
  defs.appendChild(progressGradient);
  defs.appendChild(filter);
  svg.appendChild(defs);

  // Background circle
  const bgCircle = document.createElementNS(svgNS, "circle");
  bgCircle.setAttribute("cx", `${size / 2}`);
  bgCircle.setAttribute("cy", `${size / 2}`);
  bgCircle.setAttribute("r", `${radius}`);
  bgCircle.setAttribute("fill", "none");
  bgCircle.setAttribute("stroke", "rgba(255,255,255,0.2)");
  bgCircle.setAttribute("stroke-width", `${strokeWidth}`);
  svg.appendChild(bgCircle);

  // Progress circle
  const progressCircle = document.createElementNS(svgNS, "circle");
  progressCircle.setAttribute("cx", `${size / 2}`);
  progressCircle.setAttribute("cy", `${size / 2}`);
  progressCircle.setAttribute("r", `${radius}`);
  progressCircle.setAttribute("fill", "none");
  progressCircle.setAttribute("stroke", "url(#progressGradient)");
  progressCircle.setAttribute("stroke-width", `${strokeWidth}`);
  progressCircle.setAttribute("stroke-linecap", "round");
  progressCircle.setAttribute("stroke-dasharray", `${circumference}`);
  progressCircle.setAttribute("stroke-dashoffset", `${circumference - progress}`);
  progressCircle.setAttribute("transform", `rotate(-90 ${size / 2} ${size / 2})`);
  progressCircle.setAttribute("filter", "url(#glow)");
  
  // Add animation
  const animate = document.createElementNS(svgNS, "animate");
  animate.setAttribute("attributeName", "stroke-dashoffset");
  animate.setAttribute("from", `${circumference}`);
  animate.setAttribute("to", `${circumference - progress}`);
  animate.setAttribute("dur", "2s");
  animate.setAttribute("fill", "freeze");
  progressCircle.appendChild(animate);
  
  svg.appendChild(progressCircle);
  
  const centerGroup = document.createElementNS(svgNS, "g");
  
  // Inner circle
  const innerCircle = document.createElementNS(svgNS, "circle");
  innerCircle.setAttribute("cx", `${size / 2}`);
  innerCircle.setAttribute("cy", `${size / 2}`);
  innerCircle.setAttribute("r", `${radius - 20}`);
  innerCircle.setAttribute("fill", "rgba(0,0,0,0.3)");
  innerCircle.setAttribute("stroke", "rgba(255,255,255,0.1)");
  innerCircle.setAttribute("stroke-width", "1");
  centerGroup.appendChild(innerCircle);

  // Level number
  const levelText = document.createElementNS(svgNS, "text");
  levelText.setAttribute("x", `${size / 2}`);
  levelText.setAttribute("y", `${size / 2 - 5}`);
  levelText.setAttribute("text-anchor", "middle");
  levelText.setAttribute("dominant-baseline", "middle");
  levelText.setAttribute("fill", "#fff");
  levelText.setAttribute("font-size", "32");
  levelText.setAttribute("font-weight", "bold");
  levelText.textContent = `${level}`;
  
  // Add number animation
  const textAnimate = document.createElementNS(svgNS, "animate");
  textAnimate.setAttribute("attributeName", "opacity");
  textAnimate.setAttribute("from", "0");
  textAnimate.setAttribute("to", "1");
  textAnimate.setAttribute("dur", "1s");
  textAnimate.setAttribute("fill", "freeze");
  levelText.appendChild(textAnimate);
  
  centerGroup.appendChild(levelText);

  // "LEVEL" text
  const levelLabel = document.createElementNS(svgNS, "text");
  levelLabel.setAttribute("x", `${size / 2}`);
  levelLabel.setAttribute("y", `${size / 2 + 20}`);
  levelLabel.setAttribute("text-anchor", "middle");
  levelLabel.setAttribute("dominant-baseline", "middle");
  levelLabel.setAttribute("fill", "rgba(255,255,255,0.7)");
  levelLabel.setAttribute("font-size", "12");
  levelLabel.setAttribute("font-weight", "600");
  levelLabel.setAttribute("letter-spacing", "1px");
  levelLabel.textContent = "LEVEL";
  centerGroup.appendChild(levelLabel);

  svg.appendChild(centerGroup);

  return svg;
}
