import { fetchAudit } from "../graphql";

export async function createAuditGroupsCard(jwt: string): Promise<HTMLDivElement> {
  const auditCard = document.createElement("div");
  auditCard.className = "card";
  auditCard.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  auditCard.style.textAlign = "center";
  auditCard.style.position = "relative";
  auditCard.style.overflow = "hidden";

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
  auditCard.appendChild(particles);
  
  const heading = document.createElement("h2");
  heading.textContent = "Audit Groups";
  auditCard.appendChild(heading);

  try {
    const auditStatus = await fetchAudit(jwt);

    // Helper to extract project name from path
    function getProjectName(path: string) {
      if (!path) return "";
      const parts = path.split("/");
      return parts[parts.length - 1] || path;
    }

    // Table builder
    function buildTable(nodes: any[], caption: string) {
      const table = document.createElement("table");
      table.style.width = "100%";
      table.style.margin = "1rem 0";
      table.style.borderCollapse = "collapse";
      table.style.background = "rgba(255,255,255,0.04)";
      table.style.borderRadius = "8px";
      table.style.overflow = "hidden";
      table.style.fontSize = "1rem";
      table.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";

      const cap = document.createElement("caption");
      cap.textContent = caption;
      cap.style.fontWeight = "bold";
      cap.style.fontSize = "1.1rem";
      cap.style.color = "#fff";
      cap.style.marginBottom = "0.5rem";
      table.appendChild(cap);

      const thead = document.createElement("thead");
      const tr = document.createElement("tr");
      ["Captain", "Project"].forEach((h) => {
        const th = document.createElement("th");
        th.textContent = h;
        th.style.padding = "0.5rem 1rem";
        th.style.background = "#764ba2";
        th.style.color = "#fff";
        th.style.fontWeight = "700";
        th.style.letterSpacing = "0.03em";
        th.style.textAlign = "left";
        th.style.border = "none";
        tr.appendChild(th);
      });
      thead.appendChild(tr);
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      nodes.forEach((node) => {
        const row = document.createElement("tr");
        const captain = document.createElement("td");
        captain.textContent = node.group.captainLogin;
        captain.style.padding = "0.5rem 1rem";
        captain.style.color = "#fff";
        captain.style.background = "rgba(102,126,234,0.15)";
        const project = document.createElement("td");
        project.textContent = getProjectName(node.group.path);
        project.style.padding = "0.5rem 1rem";
        project.style.color = "#fff";
        project.style.background = "rgba(102,126,234,0.10)";
        row.appendChild(captain);
        row.appendChild(project);
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      return table;
    }

    // Helper to build a scrollable table for audits
    function buildScrollableTable(nodes: any[], caption: string) {
      const wrapper = document.createElement("div");
      wrapper.style.margin = "1rem 0";
      wrapper.style.maxHeight = "260px";
      wrapper.style.overflowY = nodes.length > 3 ? "auto" : "visible";
      wrapper.style.borderRadius = "8px";
      wrapper.style.background = "rgba(255,255,255,0.06)";
      wrapper.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
      wrapper.style.padding = "0.5rem 0.5rem 0.5rem 0.5rem";
      const table = buildTable(nodes, caption);
      table.style.margin = "0";
      wrapper.appendChild(table);
      return wrapper;
    }

    // Valid Audits Table (scrollable if needed)
    const validTable = buildScrollableTable(auditStatus.validAudits.nodes, `Passed Audits (${auditStatus.validAudits.nodes.length})`);
    auditCard.appendChild(validTable);

    // Failed Audits Table (scrollable if needed)
    const failedTable = buildScrollableTable(auditStatus.failedAudits.nodes, `Failed Audits (${auditStatus.failedAudits.nodes.length})`);
    auditCard.appendChild(failedTable);
  } catch (err) {
    const errorMsg = document.createElement("p");
    errorMsg.textContent = "Failed to load audit groups.";
    auditCard.appendChild(errorMsg);
  }

  return auditCard;
}