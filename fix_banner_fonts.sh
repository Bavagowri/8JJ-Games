#!/bin/bash
# ============================================================
# fix_banner_fonts.sh
# Run from project root: bash fix_banner_fonts.sh
#
# What this does:
#   1. Strips blocking @import Google Fonts from all 15 banner CSS files
#   2. Adds loadBannerFont() useEffect to each matching banner JSX file
#   3. Copies loadBannerFont.js utility into src/utils/
# ============================================================

set -e

UTILS_DIR="react-app/src/utils"
UTIL_FILE="$UTILS_DIR/loadBannerFont.js"

# ── 0. Create utils dir if needed ────────────────────────────
mkdir -p "$UTILS_DIR"

# ── 1. Write loadBannerFont.js utility ───────────────────────
cat > "$UTIL_FILE" << 'UTIL_EOF'
// react-app/src/utils/loadBannerFont.js
const loaded = new Set();

export function loadBannerFont(url) {
  if (!url || loaded.has(url)) return;
  loaded.add(url);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
}

export const BANNER_FONTS = {
  PromoBannerGridV2:
    'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap',
  CarouselCardsBannerV2:
    'https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500&display=swap',
  HeroBannerV2:
    'https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&family=Rajdhani:wght@500;600;700&family=DM+Sans:wght@300;400;500&display=swap',
  CountdownBannerV2:
    'https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@300;400;500&family=Oswald:wght@400;500;600;700&display=swap',
  WideStripBannerV2:
    'https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700;800;900&family=Share+Tech+Mono&display=swap',
  MultiPanelBannerV2:
    'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap',
  SplitHeroBannerV2:
    'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Syne+Mono&family=Inter:wght@300;400;500&display=swap',
  VideoHeroBannerV2:
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Nunito+Sans:wght@300;400;600;700&display=swap',
  MobileSplitBannerV2:
    'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Syne+Mono&family=Inter:wght@300;400;500&display=swap',
  MobileCountdownBannerV2:
    'https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@300;400;500&family=Oswald:wght@400;500;600;700&display=swap',
  MobilePromoScrollV2:
    'https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500&display=swap',
  MobileHeroBannerV2:
    'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Rajdhani:wght@500;700&display=swap',
  MobilePromoBannerV2:
    'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&family=Mulish:wght@400;600;700;900&display=swap',
  MobileStackedPromoV2:
    'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600&family=Orbitron:wght@600;800&display=swap',
  MobileVideoHeroBannerV2:
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Nunito+Sans:wght@300;400;600;700&display=swap',
};
UTIL_EOF

echo "✅ Created $UTIL_FILE"

# ── 2. Strip @import lines from all banner CSS files ─────────
CSS_FILES=(
  "react-app/src/components/UniversalBanner/templates/PromoBannerGridV2.css"
  "react-app/src/components/UniversalBanner/templates/CarouselCardsBannerV2.css"
  "react-app/src/components/UniversalBanner/templates/HeroBannerV2.css"
  "react-app/src/components/UniversalBanner/templates/CountdownBannerV2.css"
  "react-app/src/components/UniversalBanner/templates/WideStripBannerV2.css"
  "react-app/src/components/UniversalBanner/templates/MultiPanelBannerV2.css"
  "react-app/src/components/UniversalBanner/templates/SplitHeroBannerV2.css"
  "react-app/src/components/UniversalBanner/templates/VideoHeroBannerV2.css"
  "react-app/src/components/UniversalBanner/templates/mobile/MobileSplitBannerV2.css"
  "react-app/src/components/UniversalBanner/templates/mobile/MobileCountdownBannerV2.css"
  "react-app/src/components/UniversalBanner/templates/mobile/MobilePromoScrollV2.css"
  "react-app/src/components/UniversalBanner/templates/mobile/MobileHeroBannerV2.css"
  "react-app/src/components/UniversalBanner/templates/mobile/MobilePromoBannerV2.css"
  "react-app/src/components/UniversalBanner/templates/mobile/MobileStackedPromoV2.css"
  "react-app/src/components/UniversalBanner/templates/mobile/MobileVideoHeroBannerV2.css"
)

echo ""
echo "── Stripping @import Google Fonts from CSS files ──"
for f in "${CSS_FILES[@]}"; do
  if [ -f "$f" ]; then
    # macOS sed needs '' after -i; Linux sed uses -i alone — this handles both
    sed -i.bak "/@import url.*fonts\.googleapis\.com/d" "$f"
    rm -f "${f}.bak"
    echo "  ✅ $f"
  else
    echo "  ⚠️  Not found (skip): $f"
  fi
done

# ── 3. Patch JSX files with useEffect lazy loading ───────────
# Each entry: "JSXpath|BANNER_FONTS_KEY"
BANNER_JSX=(
  "react-app/src/components/UniversalBanner/templates/PromoBannerGridV2.jsx|PromoBannerGridV2"
  "react-app/src/components/UniversalBanner/templates/CarouselCardsBannerV2.jsx|CarouselCardsBannerV2"
  "react-app/src/components/UniversalBanner/templates/HeroBannerV2.jsx|HeroBannerV2"
  "react-app/src/components/UniversalBanner/templates/CountdownBannerV2.jsx|CountdownBannerV2"
  "react-app/src/components/UniversalBanner/templates/WideStripBannerV2.jsx|WideStripBannerV2"
  "react-app/src/components/UniversalBanner/templates/MultiPanelBannerV2.jsx|MultiPanelBannerV2"
  "react-app/src/components/UniversalBanner/templates/SplitHeroBannerV2.jsx|SplitHeroBannerV2"
  "react-app/src/components/UniversalBanner/templates/VideoHeroBannerV2.jsx|VideoHeroBannerV2"
  "react-app/src/components/UniversalBanner/templates/mobile/MobileSplitBannerV2.jsx|MobileSplitBannerV2"
  "react-app/src/components/UniversalBanner/templates/mobile/MobileCountdownBannerV2.jsx|MobileCountdownBannerV2"
  "react-app/src/components/UniversalBanner/templates/mobile/MobilePromoScrollV2.jsx|MobilePromoScrollV2"
  "react-app/src/components/UniversalBanner/templates/mobile/MobileHeroBannerV2.jsx|MobileHeroBannerV2"
  "react-app/src/components/UniversalBanner/templates/mobile/MobilePromoBannerV2.jsx|MobilePromoBannerV2"
  "react-app/src/components/UniversalBanner/templates/mobile/MobileStackedPromoV2.jsx|MobileStackedPromoV2"
  "react-app/src/components/UniversalBanner/templates/mobile/MobileVideoHeroBannerV2.jsx|MobileVideoHeroBannerV2"
)

echo ""
echo "── Patching JSX files with lazy font loading ──"

# Relative path from templates dir to utils (used for depth calculation)
UTIL_IMPORT_DESKTOP="../../../../utils/loadBannerFont"
UTIL_IMPORT_MOBILE="../../../../../utils/loadBannerFont"

for entry in "${BANNER_JSX[@]}"; do
  JSX_FILE="${entry%%|*}"
  FONT_KEY="${entry##*|}"

  if [ ! -f "$JSX_FILE" ]; then
    echo "  ⚠️  Not found (skip): $JSX_FILE"
    continue
  fi

  # Decide import depth (mobile folder is one level deeper)
  if [[ "$JSX_FILE" == *"/mobile/"* ]]; then
    IMPORT_PATH="$UTIL_IMPORT_MOBILE"
  else
    IMPORT_PATH="$UTIL_IMPORT_DESKTOP"
  fi

  # Skip if already patched
  if grep -q "loadBannerFont" "$JSX_FILE"; then
    echo "  ⏭️  Already patched: $JSX_FILE"
    continue
  fi

  # ── a. Ensure useEffect is imported ──
  # If 'useEffect' is not yet imported, add it to the React import line
  if ! grep -q "useEffect" "$JSX_FILE"; then
    # Works for: import { useState } from "react"  →  import { useState, useEffect } from "react"
    # and:        import React from "react"          →  import React, { useEffect } from "react"
    sed -i.bak \
      's/^import { \(.*\) } from ["'"'"']react["'"'"']/import { \1, useEffect } from "react"/' \
      "$JSX_FILE"
    # Fallback for bare default import
    sed -i.bak \
      's/^import React from ["'"'"']react["'"'"']/import React, { useEffect } from "react"/' \
      "$JSX_FILE"
    rm -f "${JSX_FILE}.bak"
  fi

  # ── b. Add loadBannerFont import after the last import line ──
  # Find line number of last import, then insert after it
  LAST_IMPORT=$(grep -n "^import " "$JSX_FILE" | tail -1 | cut -d: -f1)

  if [ -n "$LAST_IMPORT" ]; then
    INJECT_IMPORT="import { loadBannerFont, BANNER_FONTS } from '${IMPORT_PATH}';"
    # Use awk to insert the import after LAST_IMPORT line
    awk -v n="$LAST_IMPORT" -v line="$INJECT_IMPORT" \
      'NR==n{print; print line; next}1' "$JSX_FILE" > "${JSX_FILE}.tmp"
    mv "${JSX_FILE}.tmp" "$JSX_FILE"
  fi

  # ── c. Inject useEffect after the first opening { of the component function ──
  # Strategy: find first line that matches "export default function" or "const X = (" or "function X("
  # then find the '{' that opens the function body, and add useEffect right after.
  USEEFFECT_BLOCK="  useEffect(() => { loadBannerFont(BANNER_FONTS.${FONT_KEY}); }, []);"

  # Find line number of component body open brace
  # We look for the function/arrow component declaration, then grab the line with the opening {
  COMP_LINE=$(grep -n "export default\|export const\|export function" "$JSX_FILE" | head -1 | cut -d: -f1)

  if [ -n "$COMP_LINE" ]; then
    # Find the first { at or after COMP_LINE (the function body open)
    BRACE_LINE=$(awk -v start="$COMP_LINE" 'NR>=start && /\{/{print NR; exit}' "$JSX_FILE")

    if [ -n "$BRACE_LINE" ]; then
      awk -v n="$BRACE_LINE" -v block="$USEEFFECT_BLOCK" \
        'NR==n{print; print block; next}1' "$JSX_FILE" > "${JSX_FILE}.tmp"
      mv "${JSX_FILE}.tmp" "$JSX_FILE"
      echo "  ✅ Patched: $JSX_FILE"
    else
      echo "  ⚠️  Could not find component body brace in: $JSX_FILE (patch import manually)"
    fi
  else
    echo "  ⚠️  Could not find export in: $JSX_FILE (patch import manually)"
  fi
done

echo ""
echo "════════════════════════════════════════════════════"
echo "✅  All done!"
echo ""
echo "Next steps:"
echo "  1. git diff to review changes"
echo "  2. cd react-app && npm run build && npm run preview"
echo "  3. Run Lighthouse on http://localhost:4173"
echo "════════════════════════════════════════════════════"