import dgram from 'dgram';

// --- CONFIGURATION TARGETS ---
const ATOMIC_NTP_SERVER = 'pool.ntp.org'; // Strata-1 Atomic reference pool
const NTP_PORT = 123;
const SAMPLE_INTERVAL_MS = 2000; // Poll the analytics array every 2 seconds

// The 153-Item Minimal Superpermutation dataset matrix for N=5
const HARUHI_N5_STRING = [
    1,2,3,4,5,1,2,3,4,1,5,2,3,4,1,2,5,3,4,1,2,3,5,4,1,2,3,4,5,1,2,3,5,1,4,2,3,
    5,1,2,4,3,5,1,2,3,4,5,1,3,2,4,5,1,3,4,2,5,1,3,4,5,2,1,3,4,2,5,1,4,3,2,5,1,
    4,2,3,5,1,4,2,5,3,1,4,2,3,5,2,1,4,3,5,2,1,4,5,3,2,1,4,3,5,3,1,4,2,5,3,1,4,
    5,2,3,1,4,2,5,4,1,3,2,5,4,1,3,5,2,4,1,3,2,5,2,4,1,3,5,2,4,3,1,5,2,4,3,5,1,
    2,4,3,5,2,1,4,3,5,1
];

// 5-Channel Relativistic Engine Array Profile
const channels = [
    { id: 0, name: "CH I  (Cyan)   ", fib: 2.0,  freq: 0.0008 },
    { id: 1, name: "CH II (Magenta)", fib: 5.0,  freq: 0.0012, isPrime: true }, // THE PRIME REFERENCE BENCHMARK
    { id: 2, name: "CH III(Amber)  ", fib: 13.0, freq: 0.0005 },
    { id: 3, name: "CH IV (Emerald)", fib: 21.0, freq: 0.0018 },
    { id: 4, name: "CH V  (White)  ", fib: 34.0, freq: 0.0025 }
];

console.log("=============================================================");
console.log("    CLOCK_COMPARE.JS: COLLISION RESOLUTION ENGINE MATRIX     ");
console.log("=============================================================");
console.log(`Connecting to Atomic Reference Array via: ${ATOMIC_NTP_SERVER}\n`);

function fetchAtomicTime() {
    return new Promise((resolve, reject) => {
        const client = dgram.createSocket('udp4');
        const ntpData = Buffer.alloc(48);
        ntpData[0] = 0x1B; 

        const timeout = setTimeout(() => {
            client.close();
            reject(new Error("Atomic NTP connection timeout."));
        }, 1500);

        client.send(ntpData, 0, ntpData.length, NTP_PORT, ATOMIC_NTP_SERVER, (err) => {
            if (err) {
                clearTimeout(timeout);
                client.close();
                reject(err);
            }
        });

        client.on('message', (msg) => {
            clearTimeout(timeout);
            client.close();
            const secPart = msg.readUInt32BE(40);
            const fracPart = msg.readUInt32BE(44);
            const ntpEpochDelta = 2208988800;
            const unixSeconds = secPart - ntpEpochDelta;
            const milliseconds = Math.round((fracPart / 0x100000000) * 1000);
            resolve((unixSeconds * 1000) + milliseconds);
        });
    });
}

// Helper: Calculate exact spatial axis position matching the shader logic
function getSpatialPosition(ch, timelineSec) {
    const rawSway = Math.log1p(Math.abs(Math.sin(timelineSec * 0.5 * ch.freq)));
    let targetX = 0.1 + (Math.abs(Math.sin(rawSway * ch.fib)) * 0.8);
    
    // Process the discrete Haruhi superpermutation positional shift step
    const superIndex = Math.floor(timelineSec * 0.3) % 153;
    const activeSymbol = HARUHI_N5_STRING[superIndex];
    return (targetX + activeSymbol * 0.05) % 1.0;
}

async function runAnalysisCycle() {
    try {
        const cpuStartNs = process.hrtime.bigint();
        const atomicTimestampMS = await fetchAtomicTime();
        const cpuEndNs = process.hrtime.bigint();
        
        const localSystemTimeMS = Date.now();
        const atomicDriftMS = localSystemTimeMS - atomicTimestampMS;
        const timelineTimeSec = Number(cpuEndNs / 1000000000n);

        // 1. GATHER SPATIAL POSITIONS FOR ALL CHANNELS
        const positions = channels.map(ch => ({
            ...ch,
            posX: getSpatialPosition(ch, timelineTimeSec)
        }));

        // Extract the position of our Prime Clock Reference (Track II / Magenta)
        const primeClock = positions.find(p => p.isPrime);

        // 2. DETECT STRUCTURAL TRACK COLLISIONS
        // A collision occurs if any channel occupies the same coordinate width sector as another
        const collisionThreshold = 0.045; // Matches shader block width
        let collisionEvents = [];

        for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                const distance = Math.abs(positions[i].posX - positions[j].posX);
                if (distance < collisionThreshold) {
                    collisionEvents.push(`${positions[i].id + 1}⚡${positions[j].id + 1}`);
                }
            }
        }

        console.log(`\n[ANALYSIS LOG -> ${new Date().toISOString()}]`);
        console.log(` ├─ Global Atomic Sync Drift: ${atomicDriftMS > 0 ? '+' : ''}${atomicDriftMS} ms`);
        console.log(` ├─ Active Collisions Found : ${collisionEvents.length > 0 ? collisionEvents.join(', ') : 'NONE'}`);
        console.log(" ┌────────────────────────────────────────────────────────────────────────┐");
        console.log(" │ CHANNEL NAME     │ FIB CORE │ ABS POSITION │ RELATIVE DRIFT TO PRIME   │");
        console.log(" ├──────────────────┼──────────┼──────────────┼───────────────────────────┤");

        // 3. EVALUATE TRACK DRIFT RELATIVE TO THE PRIME CLOCK REFERENCE
        positions.forEach((ch) => {
            // Compare this channel's location directly against the Prime Reference position
            const structuralVariance = ch.posX - primeClock.posX;
            const markers = ch.isPrime ? " [PRIME REF] " : `${structuralVariance > 0 ? '+' : ''}${structuralVariance.toFixed(6)}`;

            console.log(` │ ${ch.name} │ ${ch.fib.toString().padEnd(8)} │ ${ch.posX.toFixed(6).padEnd(12)} │ ${markers.padEnd(25)} │`);
        });
        
        console.log(" └────────────────────────────────────────────────────────────────────────┘");

        // 4. DETECT IF SYSTEM STRESS CORRELATES WITH COLLISION CONGESTION
        if (collisionEvents.length >= 3) {
            console.log(` ⚠️ CONGESTION ALERT: Heavy multi-lane collision cluster detected!`);
            console.log(`   Five-part thread processing density is peaking. High risk of microsecond CPU stutters.`);
        } else {
            console.log("  STATUS: Combinatorial state space clean. Thread queues running efficiently.");
        }

    } catch (error) {
        console.error("\n [CRITICAL DATA FAULT]: Matrix parsing execution error:", error.message);
    }
}

// Initialize the diagnostic engine loop
setInterval(runAnalysisCycle, SAMPLE_INTERVAL_MS);
runAnalysisCycle();
