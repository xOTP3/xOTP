@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Outfit", "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
  
  --color-brand-bg: #0A0A0B;
  --color-card-bg: #141416;
  --color-card-bg-alt: #1A1A1D;
  --color-border-subtle: rgba(255, 255, 255, 0.05);
  --color-border-muted: rgba(255, 255, 255, 0.1);
}

body {
  background-color: var(--color-brand-bg);
  color: #E0E0E0;
}
