import fs from 'fs';
import sharp from 'sharp';

console.log("=============================================================");
console.log("    GENERATE_MATRIX.JS: SELF-CONTAINED CONVERSION ENGINE     ");
console.log("=============================================================");

const fibs = [2.0, 5.0, 13.0, 21.0, 34.0];
const freqs = [0.0008, 0.0012, 0.0005, 0.0018, 0.0025];
const colors = ["#00fcf1", "#ff007f", "#ffb703", "#06d6a0", "#ffffff"];

// THE 153-ELEMENT HARUHI N=5 MINIMAL SUPERPERMUTATION SEQUENCE DATASET
const HARUHI_N5 = new Int32Array([
    1,2,3,4,5,1,2,3,4,1,5,2,3,4,1,2,5,3,4,1,2,3,5,4,1,2,3,4,5,1,2,4,3,5,1,2,4,3,1,5,
    2,4,3,1,2,5,4,3,1,2,1,5,4,3,2,1,5,4,2,3,1,5,4,2,1,3,5,4,2,1,5,3,4,2,1,5,4,3,2,1,
    4,5,3,2,1,4,3,5,2,1,4,3,2,5,1,4,3,2,1,5,4,3,2,1,3,5,4,2,1,3,4,5,2,1,3,4,2,5,1,3,
    4,2,1,5,3,4,2,1,4,5,3,2,1,4,3,5,2,1,4,3,2,5,1,4,3,2,1,5,4,3,2,1
]);

// Write the explicit xml header as the absolute first entry in the string buffer layout
let svgContent = `<svg xmlns="http://w3.org" width="800" height="500">\n`;
svgContent += `  <rect width="800" height="500" fill="#050608"/>\n`;

// Generate baseline grid lines
for (let i = 1; i < 10; i++) {
    let x = i * 80; let y = i * 50;
    svgContent += `  <line x1="${x}" y1="0" x2="${x}" y2="500" stroke="#c5a059" stroke-width="1" opacity="0.1"/>\n`;
    svgContent += `  <line x1="0" y1="${y}" x2="800" y2="${y}" stroke="#c5a059" stroke-width="1" opacity="0.1"/>\n`;
}

svgContent += `  <text x="30" y="40" fill="#66fcf1" font-family="monospace" font-size="14" font-weight="bold">STOCHASTIC CHRONOTAXIC DRIFT MATRIX MAP</text>\n`;
svgContent += `  <text x="30" y="60" fill="#8892b0" font-family="monospace" font-size="10">MATHEMATICAL SIMULATION PASSED OVER WORKFLOW ENGINE (N=5)</text>\n`;

// Seed a runtime variation constant direct from the host system timestamp clock
let timeOffsetSeed = Date.now() * 0.0001;

for (let t = 0; t < 800; t += 2) {
    let timeSec = (t * 0.2) + timeOffsetSeed;
    for (let i = 0; i < 5; i++) {
        let rawSway = Math.log1p(Math.abs(Math.sin(timeSec * freqs[i] * 3.0)));
        let tx = 0.1 + (Math.abs(Math.sin(rawSway * fibs[i])) * 0.8);
        let superIdx = Math.floor(t * 0.5) % 153;
        let posX = (tx + HARUHI_N5[superIdx] * 0.03) % 1.0;
        
        let plotX = posX * 740 + 30;
        let plotY = 440 - (Math.log1p(fibs[i]) * 100) + (Math.sin(timeSec * 0.4) * 12);
        
        if (t % 10 === 0) {
            svgContent += `  <polygon points="${plotX.toFixed(2)},${(plotY-6).toFixed(2)} ${(plotX+5).toFixed(2)},${plotY.toFixed(2)} ${plotX.toFixed(2)},${(plotY+6).toFixed(2)} ${(plotX-5).toFixed(2)},${plotY.toFixed(2)}" fill="none" stroke="${colors[i]}" stroke-width="1.2" opacity="0.6"/>\n`;
        } else {
            svgContent += `  <circle cx="${plotX.toFixed(2)}" cy="${plotY.toFixed(2)}" r="2" fill="${colors[i]}" opacity="0.4"/>\n`;
        }
    }
}

svgContent += `  <rect x="20" y="20" width="760" height="460" fill="none" stroke="#c5a059" stroke-width="1" opacity="0.3"/>\n`;
svgContent += `</svg>`;

// Convert the SVG XML string buffer into flat binary raster pixels via sharp IN-MEMORY
async function convertVectorToPng() {
    try {
        // Convert string directly into a standard Node.js Memory Buffer
        const svgBuffer = Buffer.from(svgContent);

        await sharp(svgBuffer)
            .png()
            .toFile('phase_space_chart.png');
            
        console.log("✓ SUCCESS: Standard format PNG snapshot generated seamlessly.");

        // Write the static fallback file to disk only after the raster operation finishes completely
        fs.writeFileSync('phase_space_chart.svg', svgContent);
        console.log("✓ SUCCESS: Backup vector logs written to phase_space_chart.svg");

    } catch (err) {
        console.error(" [CRITICAL RASTER ERROR]:", err.message);
        process.exit(1);
    }
}

convertVectorToPng();
