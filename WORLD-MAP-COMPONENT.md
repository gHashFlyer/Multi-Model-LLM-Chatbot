# World Map React Component

A React component that renders an SVG world map and highlights specific countries based on mock data.

---

## Table of Contents

- [Overview](#overview)
- [Mock Data](#mock-data)
- [Architecture](#architecture)
- [Dependencies](#dependencies)
- [Component Code](#component-code)
  - [WorldMap.jsx](#worldmapjsx)
- [Country Code Matching](#country-code-matching)
- [Tooltip Enhancement](#tooltip-enhancement)
- [Usage in App](#usage-in-app)

---

## Overview

This component uses **react-simple-maps** to render a world map from Natural Earth 110m TopoJSON data. Countries from the mock dataset are shaded in red (`#FF5533`), while all other countries appear in gray (`#D6D6DA`). The map supports hover effects, zoom/pan via `ZoomableGroup`, and an optional tooltip integration.

---

## Mock Data

The following countries are highlighted on the map:

| Date         | Code | Country                  |
|--------------|------|--------------------------|
| 2016-Feb-12  | us   | United States of America |
| 2016-Feb-14  | fr   | France                   |
| 2016-Feb-14  | gb   | United Kingdom           |
| 2016-Feb-14  | ie   | Ireland                  |
| 2016-Feb-14  | nl   | Netherlands              |
| 2016-Feb-14  | no   | Norway                   |
| 2016-Feb-15  | de   | Germany                  |
| 2016-Feb-15  | pl   | Poland                   |
| 2016-Feb-16  | in   | India                    |
| 2016-Feb-17  | cn   | China                    |
| 2016-Feb-17  | jp   | Japan                    |
| 2016-Feb-22  | sg   | Singapore                |
| 2016-Feb-22  | ph   | Philippines              |
| 2016-Feb-23  | ae   | United Arab Emirates     |
| 2016-Feb-28  | at   | Austria                  |

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   WorldMap Component             │
│                                                  │
│  ┌──────────────┐    ┌────────────────────────┐  │
│  │  Mock Data   │───▶│  alpha2ToAlpha3 Map    │  │
│  │  (alpha-2)   │    │  us→USA, fr→FRA, etc.  │  │
│  └──────────────┘    └────────┬───────────────┘  │
│                               │                  │
│                               ▼                  │
│                    ┌──────────────────┐           │
│                    │ highlightedAlpha3│           │
│                    │   Set<string>    │           │
│                    └────────┬─────────┘           │
│                             │                    │
│  ┌──────────────┐           │                    │
│  │  TopoJSON    │           │                    │
│  │  world-atlas │           │                    │
│  └──────┬───────┘           │                    │
│         │                   │                    │
│         ▼                   ▼                    │
│  ┌─────────────────────────────────────┐         │
│  │         Geographies Loop            │         │
│  │  For each geo:                      │         │
│  │    geo.id ∈ highlightedAlpha3?      │         │
│  │      YES → fill: #FF5533 (red)      │         │
│  │      NO  → fill: #D6D6DA (gray)    │         │
│  └─────────────────────────────────────┘         │
│                                                  │
│  ┌─────────────────────────────────────┐         │
│  │            Legend                    │         │
│  │  ■ Highlighted Country              │         │
│  │  ■ Other                            │         │
│  └─────────────────────────────────────┘         │
└─────────────────────────────────────────────────┘
```

---

## Dependencies

```bash
npm install react-simple-maps
```

This library internally uses **d3-geo** and **topojson-client** to parse and project geographic data. The world geometry is fetched at runtime from a CDN-hosted TopoJSON file.

---

## Component Code

### WorldMap.jsx

```jsx
import React, { memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

// World TopoJSON — Natural Earth 110m (lightweight ~100KB)
const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ─── Mock Data ───────────────────────────────────────────────
const highlightedCountries = [
  { date: "2016-Feb-12", code: "us", name: "United States of America" },
  { date: "2016-Feb-14", code: "fr", name: "France" },
  { date: "2016-Feb-14", code: "gb", name: "United Kingdom" },
  { date: "2016-Feb-14", code: "ie", name: "Ireland" },
  { date: "2016-Feb-14", code: "nl", name: "Netherlands" },
  { date: "2016-Feb-14", code: "no", name: "Norway" },
  { date: "2016-Feb-15", code: "de", name: "Germany" },
  { date: "2016-Feb-15", code: "pl", name: "Poland" },
  { date: "2016-Feb-16", code: "in", name: "India" },
  { date: "2016-Feb-17", code: "cn", name: "China" },
  { date: "2016-Feb-17", code: "jp", name: "Japan" },
  { date: "2016-Feb-22", code: "sg", name: "Singapore" },
  { date: "2016-Feb-22", code: "ph", name: "Philippines" },
  { date: "2016-Feb-23", code: "ae", name: "United Arab Emirates" },
  { date: "2016-Feb-28", code: "at", name: "Austria" },
];

// ─── ISO 3166-1 alpha-2 → alpha-3 Mapping ───────────────────
// react-simple-maps / world-atlas uses alpha-3 or numeric codes
const alpha2ToAlpha3 = {
  us: "USA",
  fr: "FRA",
  gb: "GBR",
  ie: "IRL",
  nl: "NLD",
  no: "NOR",
  de: "DEU",
  pl: "POL",
  in: "IND",
  cn: "CHN",
  jp: "JPN",
  sg: "SGP",
  ph: "PHL",
  ae: "ARE",
  at: "AUT",
};

// world-atlas@2 uses ISO 3166-1 numeric IDs as geo.id
// Fallback mapping for numeric → alpha-3
const numericToAlpha3 = {
  "840": "USA",
  "250": "FRA",
  "826": "GBR",
  "372": "IRL",
  "528": "NLD",
  "578": "NOR",
  "276": "DEU",
  "616": "POL",
  "356": "IND",
  "156": "CHN",
  "392": "JPN",
  "702": "SGP",
  "608": "PHL",
  "784": "ARE",
  "040": "AUT",
};

// Build a Set of alpha-3 codes for O(1) lookup
const highlightedAlpha3 = new Set(
  highlightedCountries.map((c) => alpha2ToAlpha3[c.code])
);

// Build a map from alpha-3 → full record (for tooltips)
const countryDataMap = new Map(
  highlightedCountries.map((c) => [alpha2ToAlpha3[c.code], c])
);

// ─── Component ───────────────────────────────────────────────
const WorldMap = memo(() => {
  return (
    <div style={{ width: "100%", maxWidth: 960, margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: 8 }}>
        Country Highlight Map
      </h2>

      <ComposableMap
        projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}
        style={{ width: "100%", height: "auto" }}
      >
        <ZoomableGroup>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                // Resolve the alpha-3 code from either properties or numeric ID
                const alpha3 =
                  geo.properties?.ISO_A3 ||
                  numericToAlpha3[geo.id] ||
                  "";

                const isHighlighted = highlightedAlpha3.has(alpha3);
                const record = countryDataMap.get(alpha3);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isHighlighted ? "#FF5533" : "#D6D6DA"}
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: {
                        fill: isHighlighted ? "#E42" : "#F5F4F6",
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={() => {
                      if (record) {
                        console.log(
                          `${record.name} (${record.code.toUpperCase()}) — ${record.date}`
                        );
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 24,
          justifyContent: "center",
          marginTop: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              display: "inline-block",
              width: 16,
              height: 16,
              backgroundColor: "#FF5533",
              borderRadius: 3,
            }}
          />
          <span>Highlighted Country</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              display: "inline-block",
              width: 16,
              height: 16,
              backgroundColor: "#D6D6DA",
              borderRadius: 3,
            }}
          />
          <span>Other</span>
        </div>
      </div>
    </div>
  );
});

export default WorldMap;
```

---

## Country Code Matching

The mock data uses **ISO 3166-1 alpha-2** codes (e.g., `us`, `fr`, `gb`), but the TopoJSON data used by `react-simple-maps` can vary in format:

| TopoJSON Source | ID Format | Properties Available |
|---|---|---|
| `world-atlas@2` (countries-110m.json) | Numeric (`"840"`, `"250"`) | `name` only |
| `naturalearth` (world-countries.json) | Alpha-3 (`"USA"`, `"FRA"`) | `ISO_A3`, `name` |

The component handles both cases with a **dual fallback** strategy:

```
geo.properties?.ISO_A3  →  numericToAlpha3[geo.id]  →  ""
```

### Mappings Used

| Alpha-2 | Alpha-3 | Numeric | Country |
|---------|---------|---------|---------|
| us | USA | 840 | United States of America |
| fr | FRA | 250 | France |
| gb | GBR | 826 | United Kingdom |
| ie | IRL | 372 | Ireland |
| nl | NLD | 528 | Netherlands |
| no | NOR | 578 | Norway |
| de | DEU | 276 | Germany |
| pl | POL | 616 | Poland |
| in | IND | 356 | India |
| cn | CHN | 156 | China |
| jp | JPN | 392 | Japan |
| sg | SGP | 702 | Singapore |
| ph | PHL | 608 | Philippines |
| ae | ARE | 784 | United Arab Emirates |
| at | AUT | 040 | Austria |

---

## Tooltip Enhancement

For proper hover tooltips instead of `console.log`, install `react-tooltip`:

```bash
npm install react-tooltip
```

Then modify the component:

```jsx
import { Tooltip } from "react-tooltip";

// On each <Geography>:
<Geography
  data-tooltip-id="map-tooltip"
  data-tooltip-content={
    record
      ? `${record.name} — ${record.date}`
      : geo.properties.name
  }
  // ... rest of props
/>

// After </ComposableMap>:
<Tooltip id="map-tooltip" />
```

---

## Usage in App

```jsx
import React from "react";
import WorldMap from "./WorldMap";

function App() {
  return (
    <div className="App">
      <WorldMap />
    </div>
  );
}

export default App;
```

---

## Alternative TopoJSON Sources

If the default `world-atlas@2` source doesn't include `ISO_A3` in properties, you can switch to one of these alternatives:

| Source | URL | Notes |
|---|---|---|
| world-atlas@2 110m | `https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json` | Lightweight (~100KB), numeric IDs |
| world-atlas@2 50m | `https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json` | Medium detail (~300KB), numeric IDs |
| Natural Earth (GitHub) | `https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json` | Has `ISO_A3` in properties |

---

## Styling Customization

| Property | Default Value | Description |
|---|---|---|
| Highlighted fill | `#FF5533` | Red shade for target countries |
| Default fill | `#D6D6DA` | Light gray for other countries |
| Hover (highlighted) | `#E42` | Darker red on hover |
| Hover (default) | `#F5F4F6` | Light highlight on hover |
| Stroke | `#FFFFFF` | White country borders |
| Stroke width | `0.5` | Border thickness |

These values can be extracted into a theme object or CSS custom properties for easy customization.
