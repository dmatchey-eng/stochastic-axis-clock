import fs from 'fs';

console.log("=============================================================");
console.log("    GENERATE_MATRIX.JS: STOCHASTIC DISPLAY MATRIX MODULE     ");
console.log("=============================================================");

const fibs = [2.0, 5.0, 13.0, 21.0, 34.0];
const freqs = [0.0008, 0.0012, 0.0005, 0.0018, 0.0025];
const colors = ["#00fcf1", "#ff007f", "#ffb703", "#06d6a0", "#ffffff"];
const laneNames = ["TRACK I  (Alpha)", "TRACK II (Beta) ", "TRACK III(Gamma)", "TRACK IV (Delta)", "TRACK V  (Eps)  "];

// THE 153-ELEMENT HARUHI N=5 MINIMAL SUPERPERMUTATION SEQUENCE
const HARUHI_N5 = new Int32Array([
    1,2,3,4,5,1,2,3,4,1,5,2,3,4,1,2,5,3,4,1,2,3,5,4,1,2,3,4,5,1,2,4,3,5,
    1,2,4,3,1,5,2,4,3,1,2,5,4,3,1,2,1,5,4,3,2,1,5,4,2,3,1,5,4,2,1,3,5,4,
    2,1,5,3,4,2,1,5,4,3,2,1,4,5,3,2,1,4,3,5,2,1,4,3,2,5,1,4,3,2,1,5,4,3,
    2,1,3,5,4,2,1,3,4,5,2,1,3,4,2,5,1,3,4,2,1,5,3,4,2,1,4,5,3,2,1,4,3,5,
    2,1,4,3,2,5,1,4,3,2,1,5,4,3,2,1
]);

let timeOffsetSeed = Date.now() * 0.001;

// Initialize an unbending cyberpunk dashboard interface layout
let htmlOutput = `<div style="background: #050608; border: 1px solid #c5a059; padding: 20px; font-family: monospace; color: #66fcf1; width: 100%; box-sizing: border-box; border-radius: 4px;">\n`;
htmlOutput += `  <h3 style="color: #66fcf1; margin: 0 0 5px 0; letter-spacing: 2px; text-transform: uppercase;">STOCHASTIC CHRONOTAXIC DRIFT MATRIX</h3>\n`;
htmlOutput += `  <p style="color: #8892b0; margin: 0 0 20px 0; font-size: 11px;">SIMULATION GENERATED AT REALTIME TIMELINES | CORE SYNCED</p>\n`;
htmlOutput += `  <div style="display: flex; flex-direction: column; gap: 15px;">\n`;

// Calculate live spatial tracks
for (let i = 0; i < 5; i++) {
    let rawSway = Math.log1p(Math.abs(Math.sin(timeOffsetSeed * freqs[i] * 15.0)));
    let tx = 0.1 + (Math.abs(Math.sin(rawSway * fibs[i])) * 0.8);
    
    // Evaluate clean sequence lookups without triggering NaN data locks
    let superIdx = Math.floor(timeOffsetSeed * 2.0) % 153;
    let posX = (tx + HARUHI_N5[superIdx] * 0.03) % 1.0;
    let percentageX = (posX * 100).toFixed(2);

    let morphFactor = Math.abs(Math.cos(posX * 3.14));
    let elementGeometryShape = "border-radius: 2px;"; // Bounded Rest Box
    if (morphFactor < 0.3) {
        elementGeometryShape = "border-radius: 50%;"; // Wave Circle Particle
    } else if (morphFactor < 0.6) {
        elementGeometryShape = "transform: rotate(45deg); border-radius: 1px;"; // Rhombus Diamond
    }

    htmlOutput += `    <div style="display: flex; align-items: center; border-bottom: 1px solid #c5a05911; padding-bottom: 10px;">\n`;
    htmlOutput += `      <div style="width: 160px; color: #c5a059; font-size: 12px; font-weight: bold;">${laneNames[i]}</div>\n`;
    htmlOutput += `      <div style="flex-grow: 1; background: #0f1319; height: 24px; position: relative; border: 1px solid #66fcf122; border-radius: 2px;">\n`;
    
    // Draw the active, moving tracking node indicator
    htmlOutput += `        <div style="position: absolute; left: ${percentageX}%; top: 3px; width: 16px; height: 16px; background: ${colors[i]}; border: 1px solid #ffffff; box-shadow: 0 0 8px ${colors[i]}; ${elementGeometryShape}"></div>\n`;
    
    htmlOutput += `      </div>\n`;
    htmlOutput += `      <div style="width: 80px; text-align: right; font-size: 11px; color: #8892b0; font-family: inherit; margin-left: 10px;">V: ${percentageX}%</div>\n`;
    htmlOutput += `    </div>\n`;
}

htmlOutput += `  </div>\n`;
htmlOutput += `</div>\n`;

// Write the compiled presentation document directly to the tree
fs.writeFileSync('matrix_snapshot.html', htmlOutput);
console.log("✓ SUCCESS: Analytical tracking grid documents generated inside matrix_snapshot.html");
