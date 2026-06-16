# 🌌 Stochastic Axis Clock Matrix

A repository and informational blueprint for analyzing non-linear temporal modeling, stochastic phase dilation, and relativistic frame mechanics across isolated, hardware-bound execution channels. 

This environment serves as a unified relativistic demo library, mapping how independent, asynchronous threads warp, deform, and step through complex combinatorial state spaces.

---
![Stochastic Chronotaxic Drift Matrix Map](phase_space_chart.svg)
## 📂 Unified Relativistic Demo Library Architecture

```text
stochastic-axis-clock/
├── README.md                          # Core theoretical blueprint and system whitepaper
├── clock.html                         # Phase I: Baseline 4-lane WebGL2 non-linear clock engine
├── superclock.html                    # Phase II: Advanced 5-lane shape-morphing & color-cycling engine
├── stochastic-chronotaxic-matrix.html # Phase III: Primary multi-axis matrix & telemetry broadcaster
├── transformer.html                   # Standby Telemetry Deck: 3D point cloud harvester (Awaiting Ingestion)
├── clock_compare.js                   # Multi-channel Node.js atomic reference comparator
├── combinatorial_core.js              # Host-side validation matrix for N=5 superpermutations
├── diagnose_rtc.js                    # Single-channel CPU-to-NTP precision phase profiler
└── package.json                       # Project manifest enabling native ES Module imports
```

---

## 🔬 Core Mathematical & Relativistic Principles

The assets within this unified demo library isolate and demonstrate several overlapping paradigms in low-level graphics processing, inter-process data tracking, and computational physics:

### 1. Chronotaxic Phase Dilation
In standard multi-threaded software engineering, parallel pipelines are forced to wait and synchronize against an invariant, global background clock (t). This project explores an alternative cadence system, where time is an unaligned property unique to each track. This non-linear movement is achieved by applying a **Truncated Fibonacci Progression** to the **Logarithmic Sway** of each lane's processing cycles:

```text
Phase_Delta[n] = ln(1.0 + abs(sin(System_Clock * Wave_Freq[n]))) * Truncated_Fib[index_n]
```

Because the Fibonacci multipliers ($F$) compress or stretch the temporal field, individual tracks experience simulated gravitational time dilation. Lower-tier lanes anchor a sluggish, dense baseline cadence, while higher-tier lanes travel through coordinate space at relativistic speeds.

### 2. Relativistic Lorentz Length Contraction
The primary clock elements translate kinetic velocity changes directly into spatial deformation. The system tracks the instantaneous derivative of each lane's position vector ($dx/dt$) relative to a local speed of light threshold ($c$) to calculate the Lorentz contraction factor ($\gamma$):

$$\beta = \frac{v}{c} \qquad \gamma = \sqrt{1.0 - \beta^2}$$

When a track enters a high-velocity inflection zone cutting across the viewport, its structural width contracts via the Lorentz factor. The shapes compress fluidly along their direction of motion, providing a direct visual representation of microarchitectural velocity.

### 3. Bounded Combinatorial Chaos (The Haruhi Superpermutation)
To maximize data superpositioning without decaying into simple, repeating loops, the clock integrates the **Haruhi Minimal Superpermutation String** for five independent variables ($N=5$). This exact 153-element sequence contains all 120 unique permutations of the 5 channels as distinct contiguous substrings. As the timeline ticks forward, the tracks dynamically shift their horizontal coordinate offsets to step through every possible spatial ordering. This simulates an incomplete quantum clock tracking all available geometric world-lines before collapsing back into alignment.

---

## 🏎️ Component Structural Breakdown

### 🖥️ 1. The Core Visual Engines
- **`clock.html` & `superclock.html`:** These files function as the primary graphics generators. They compute the logarithmic and Fibonacci phase transformations entirely inside the GPU's native fragment shader pipelines, forcing zero CPU allocation overhead. They use Signed Distance Fields (SDF) to morph node profiles from **Rectangles** (static, rest-frame turning points) into **Rhombuses** (transition frames) and **Circles** (peak velocity windows).
- **`stochastic-chronotaxic-matrix.html`:** The primary 5-lane broadcaster workspace. It separates the execution layers cleanly into independent vector math pipelines and integrates a **Visual Alignment Horizon Matrix** (a permanent target cursor and resonance split) to flash indicators when separate lanes step into perfect combinatorial alignment. 

### 🛰️ 2. The Telemetry Translator Core
- **`transformer.html`:** This file operates as an abstract **3D Spatial Telemetry Harvester**. Designed to function as a downstream capture sensor box, it initializes as an open, dark background grid. When linked via a live data stream, it is engineered to intercept external track coordinates, isolate *Resintersections* (points where asynchronous lanes hit a mathematical resonance dictated by their shared Fibonacci nodes), and project them into an iterative, rotating 3D WebGL2 vertex point cloud.

### 🕵️‍♂️ 3. Analytical Diagnostic Host Scripts
- **`clock_compare.js` & `diagnose_rtc.js`:** Command-line scripts that bypass user-interface threads to test local hardware execution stability against reality. They query physical atomic and GPS-disciplined reference clocks (`pool.ntp.org`) over raw UDP socket connections to measure exactly how microsecond system clock drift impacts individual channel phase metrics.

---
Developed as an open platform for parallel processing analysis, non-deterministic system modeling, and geometric clock design.
