/**
 * Cycle phase visualization — educational demo.
 * On combined hormonal contraception, natural ovulation is typically suppressed.
 */

(function () {
  const ring = document.getElementById("cycle-ring");
  const daySlider = document.getElementById("cycle-day");
  const dayDisplay = document.getElementById("day-display");
  const phaseTitle = document.getElementById("phase-title");
  const phaseDesc = document.getElementById("phase-desc");
  const pills = document.getElementById("pills");
  const bcCheckbox = document.getElementById("on-bc");

  if (
    !ring ||
    !daySlider ||
    !dayDisplay ||
    !phaseTitle ||
    !phaseDesc ||
    !pills ||
    !bcCheckbox
  ) {
    return;
  }

  const phasesNatural = [
    { start: 1, end: 5, title: "Menstrual phase", tags: ["Shedding the uterine lining", "Energy may dip"] },
    {
      start: 6,
      end: 13,
      title: "Follicular phase",
      tags: ["Estrogen rises", "Follicles develop", "Fertile window begins toward the end"],
    },
    {
      start: 14,
      end: 16,
      title: "Ovulation (approx.)",
      tags: ["Egg release", "Peak fertility ~3 days"],
    },
    {
      start: 17,
      end: 28,
      title: "Luteal phase",
      tags: ["Progesterone rises", "Possible PMS", "Prep for next cycle or pregnancy"],
    },
  ];

  const phasesBC = [
    {
      start: 1,
      end: 7,
      title: "Hormonal contraception weeks 1–2 (example)",
      tags: ["Typically no ovulation on CHC", "Bleeding may be withdrawal, not menstruation"],
    },
    {
      start: 8,
      end: 14,
      title: "Steady hormone levels",
      tags: ["Cervical mucus often thick", "Fertility modeled by method, not calendar alone"],
    },
    {
      start: 15,
      end: 21,
      title: "Active pills / ring / patch (example)",
      tags: ["Consistent dosing matters", "Talk to clinician about missed doses"],
    },
    {
      start: 22,
      end: 28,
      title: "Placebo week or late cycle (methods vary)",
      tags: ["Some methods have no placebo week", "Your pattern follows your prescription"],
    },
  ];

  function arcPath(cx, cy, r, startAngle, endAngle) {
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const large = endAngle - startAngle > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  }

  function renderRing(day, onBC) {
    const phases = onBC ? phasesBC : phasesNatural;
    const cx = 100;
    const cy = 100;
    const r = 78;
    const innerR = 48;
    const totalDays = 28;
    ring.innerHTML = "";

    phases.forEach((p, idx) => {
      const startDeg = ((p.start - 1) / totalDays) * 360 - 90;
      const endDeg = (p.end / totalDays) * 360 - 90;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const palette = ["#8B7355", "#6B9080", "#B89B9F", "#8FA399"];
      path.setAttribute("d", arcPath(cx, cy, r, (startDeg * Math.PI) / 180, (endDeg * Math.PI) / 180));
      path.setAttribute("fill", palette[idx % palette.length]);
      path.setAttribute("opacity", day >= p.start && day <= p.end ? "1" : "0.38");
      path.setAttribute("stroke", "#faf8f6");
      path.setAttribute("stroke-width", "2");
      ring.appendChild(path);
    });

    const hole = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    hole.setAttribute("cx", cx);
    hole.setAttribute("cy", cy);
    hole.setAttribute("r", innerR);
    hole.setAttribute("fill", "#fffcfa");
    ring.appendChild(hole);

    const angleDeg = ((day - 1) / totalDays) * 360 - 90;
    const rad = (angleDeg * Math.PI) / 180;
    const ix = cx + (innerR + 6) * Math.cos(rad);
    const iy = cy + (innerR + 6) * Math.sin(rad);
    const ox = cx + (r - 4) * Math.cos(rad);
    const oy = cy + (r - 4) * Math.sin(rad);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", ix);
    line.setAttribute("y1", iy);
    line.setAttribute("x2", ox);
    line.setAttribute("y2", oy);
    line.setAttribute("stroke", "#2a332f");
    line.setAttribute("stroke-width", "3");
    line.setAttribute("stroke-linecap", "round");
    ring.appendChild(line);

    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", ox);
    dot.setAttribute("cy", oy);
    dot.setAttribute("r", "6");
    dot.setAttribute("fill", "#2a332f");
    ring.appendChild(dot);
  }

  function update(day) {
    const onBC = bcCheckbox.checked;
    const phases = onBC ? phasesBC : phasesNatural;
    const d = Number(day);
    dayDisplay.textContent = d;

    const active = phases.find((p) => d >= p.start && d <= p.end) || phases[0];
    phaseTitle.textContent = active.title;
    phaseDesc.textContent = onBC
      ? "Illustrative only — Combined pills, patches, rings, injections, implants, and IUDs differ. Confirm your method’s pattern with your clinician."
      : "Average 28-day model; cycles from ~21–35 days are common. Ovulation timing varies.";
    pills.innerHTML = "";
    active.tags.forEach((t) => {
      const s = document.createElement("span");
      s.textContent = t;
      pills.appendChild(s);
    });
    renderRing(d, onBC);
  }

  daySlider.addEventListener("input", (e) => update(e.target.value));
  bcCheckbox.addEventListener("change", () => update(daySlider.value));
  update(daySlider.value);
})();
