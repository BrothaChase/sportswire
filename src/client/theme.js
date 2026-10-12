import { useEffect, useState } from "react";

export const themes = {
  green: { accent: "#b7ff3c", accent2: "#83d900", rgb: "183,255,60", hover: "#cbff72", avatar: "#31450f", heroMid: "#172d37", heroEnd: "#1d3924", metric: "#3f6500" },
  gold: { accent: "#d0a42c", accent2: "#a87b12", rgb: "208,164,44", hover: "#e1bb51", avatar: "#4a3b16", heroMid: "#1a1916", heroEnd: "#27220f", metric: "#72550e" },
  orange: { accent: "#ff8a24", accent2: "#d76400", rgb: "255,138,36", hover: "#ffad66", avatar: "#5c2d08", heroMid: "#211712", heroEnd: "#3c200b", metric: "#803d07" },
  red: { accent: "#ff4d5a", accent2: "#d92635", rgb: "255,77,90", hover: "#ff7a84", avatar: "#5b1820", heroMid: "#231416", heroEnd: "#3d1218", metric: "#7d1720" },
  purple: { accent: "#a970ff", accent2: "#7b42d4", rgb: "169,112,255", hover: "#c59dff", avatar: "#37205d", heroMid: "#1d1727", heroEnd: "#2b1746", metric: "#57308d" },
  blue: { accent: "#49b7ff", accent2: "#138bd6", rgb: "73,183,255", hover: "#82ceff", avatar: "#163f5d", heroMid: "#172536", heroEnd: "#12334d", metric: "#15587e" },
  analytics: { accent: "#65d9e8", accent2: "#2aaec0", rgb: "101,217,232", hover: "#8be5ef", avatar: "#2a2a28", heroMid: "#1b1b1a", heroEnd: "#20201f", metric: "#2b8998" },
};

export function applyTheme(name) {
  const selectedName = themes[name] ? name : "gold";
  const theme = themes[selectedName];
  const root = document.documentElement;

  root.dataset.theme = selectedName;
  root.style.setProperty("--acid", theme.accent);
  root.style.setProperty("--acid-2", theme.accent2);
  root.style.setProperty("--blue", theme.accent);
  root.style.setProperty("--gold", theme.accent);
  root.style.setProperty("--accent-rgb", theme.rgb);
  root.style.setProperty("--accent-hover", theme.hover);
  root.style.setProperty("--avatar-start", theme.avatar);
  root.style.setProperty("--hero-mid", theme.heroMid);
  root.style.setProperty("--hero-end", theme.heroEnd);
  root.style.setProperty("--metric-start", theme.metric);

  return selectedName;
}

export function useTheme() {
  const [themeName, setThemeName] = useState(
    () => localStorage.getItem("sportswire-theme") || localStorage.getItem("handshake-theme") || "gold",
  );

  useEffect(() => {
    const selectedName = applyTheme(themeName);
    localStorage.setItem("sportswire-theme", selectedName);
  }, [themeName]);

  return [themes[themeName] ? themeName : "gold", setThemeName];
}
