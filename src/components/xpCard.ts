import { fetchXP } from "../graphql";
import { formatBytes } from "../tools";

export async function createXPCard(jwt: string): Promise<HTMLDivElement> {
  const xpCard = document.createElement("div");
  xpCard.className = "card";
  xpCard.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  xpCard.style.textAlign = "center";
  xpCard.style.position = "relative";
  xpCard.style.overflow = "hidden";

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
  xpCard.appendChild(pattern);

  const heading = document.createElement("h2");
  heading.textContent = "Experience (XP)";
  xpCard.appendChild(heading);

  try {
    const xp = await fetchXP(jwt);
    const xpAmount = typeof xp === "number" ? xp : (xp as { amount?: number }).amount ?? 0;
    const formattedXP = formatBytes(xpAmount);

    // Label
    const label = document.createElement("p");
    label.textContent = "Total Experience Earned:";
    label.style.margin = "0.5rem 0 0 0";
    label.style.fontWeight = "500";
    label.style.fontSize = "0.8rem";
    xpCard.appendChild(label);

    // XP value with gradient
    const xpValue = document.createElement("p");
    xpValue.textContent = formattedXP;
    xpValue.style.fontSize = "2rem";
    xpValue.style.fontWeight = "700";
    xpValue.style.margin = "0.5rem 0";
    xpValue.style.background = "linear-gradient(45deg, #ffd700, #ff6b35)";
    xpValue.style.webkitBackgroundClip = "text";
    xpValue.style.webkitTextFillColor = "transparent";
    xpValue.style.backgroundClip = "text";
    xpCard.appendChild(xpValue);
  } catch (err) {
    const errorMsg = document.createElement("p");
    errorMsg.textContent = "Failed to load XP.";
    xpCard.appendChild(errorMsg);
  }

  return xpCard;
}