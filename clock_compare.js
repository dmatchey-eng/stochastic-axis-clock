import dgram from 'dgram';

// --- CONFIGURATION TARGETS ---
const ATOMIC_NTP_SERVER = 'pool.ntp.org'; // Strata-1 Atomic reference line
const NTP_PORT = 123;
const SAMPLE_INTERVAL_MS = 2000; 

// FULLY INITIALIZED: The 153-item minimal N=5 superpermutation array
const HARUHI_N5_STRING = new Int32Array([
    1,2,3,4,5,1,2,3,4,1,5,2,3,4,1,2,5,3,4,1,2,3,5,4,1,2,3,4,5,1,2,4,3,5,1,2,4,3,1,5,2,4,3,1,2,5,4,3,1,2,4,
    5,3,1,2,4,3,5,1,4,2,3,5,1,4,2,3,1,5,4,2,3,1,4,5,2,3,1,4,2,5,3,1,4,2,3,5,1,4,3,2,5,1,4,3,2,1,5,4,3,2,1,
    4,5,3,2,1,4,3,5,2,1,4,3,2,5,1,4,3,2,1,5,4,3,1,2,5,4,3,1,5,2,4,3,1,5,4,2,3,1,5,4,3,2,1,5,4,3,1,2,5,4,3
]);

const channels = [
    { id: 0, name: "CH I  (Cyan)   ", fib: 2.0,  freq: 0.0008 },
    { id: 1, name: "CH II (Magenta)", fib: 5.0,  freq: 0.0012, isPrime: true }, // THE PRIME REFERENCE BENCHMARK
    { id: 2, name: "CH III(Amber)  ", fib: 13.0, freq: 0.0005 },
    { id: 3, name: "CH IV (Emerald)", fib: 21.0, freq: 0.0018 },
    { id: 4, name: "CH V  (White)  ", fib: 34.0, freq: 0.0025 }
];

console.log("=============================================================");
console.log("    CLOCK_COMPARE.JS: DUAL-AXIS ATOMIC COLLISION PROFILER     ");
console.log("=============================================================");
console.log(`Connecting to Atomic Reference Array via: ${ATOMIC_NTP_SERVER}\n`);

function fetchAtomicTime() {
    return new Promise((resolve, reject) => {
        const client = dgram.createSocket('udp4');
        const ntpData = Buffer.alloc(48);
        ntpData[0] = 0x1B; 

        const timeout = setTimeout(() => {
            client.close();
            reject(new Error("Atomic clock connection timed out."));
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

function getSpatialPosition(ch, timelineSec) {
    // Aligned to the exact 3.0 frequency multipliers running inside the visual layer
    const rawSway = Math.log1p(Math.abs(Math.sin(timelineSec * ch.freq * 3.0)));
    let targetX = 0.1 + (Math.abs(Math.sin(rawSway * ch.fib)) * 0.8);
    
    const superIdx = Math.floor(timelineSec * 0.2) % 153;
    const activeSymbol = HARUHI_N5_STRING[superIdx];
    return (targetX + activeSymbol * 0.03) % 1.0;
}

async function runAnalysisCycle() {
    try {
        const cpuStartNs = process.hrtime.bigint();
        const atomicTimestampMS = await fetchAtomicTime();
        const cpuEndNs = process.hrtime.bigint();
        
        const networkLatencyMS = Number(cpuEndNs - cpuStartNs) / 1000000;
        const localSystemTimeMS = Date.now();
        const atomicDriftMS = localSystemTimeMS - atomicTimestampMS;
        
        // Convert the monotonic nanosecond ticker into a steady timeline baseline
        const timelineTimeSec = Number(cpuEndNs / 1000000000n);

        const positions = channels.map(ch => ({
            ...ch,
            posX: getSpatialPosition(ch, timelineTimeSec)
        }));

        const primeClock = positions.find(p => p.isPrime);
        const collisionThreshold = 0.05; 
        let collisionEvents = [];

        for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                if (Math.abs(positions[i].posX - positions[j].posX) < collisionThreshold) {
                    collisionEvents.push(`${positions[i].id + 1}⚡${positions[j].id + 1}`);
                }
            }
        }

        console.log(`[SYS METRICS -> ${new Date().toISOString()}]`);
        console.log(` ├─ Net Ingestion Latency : ${networkLatencyMS.toFixed(3)} ms`);
        console.log(` └─ Atomic Drift Variable : ${atomicDriftMS > 0 ? '+' : ''}${atomicDriftMS} ms`);
        console.log(" ┌────────────────────────────────────────────────────────────────────────┐");
        console.log(" │ CHANNEL ID       │ FIB CORE │ ABS POSITION │ RELATIVE DRIFT TO PRIME   │");
        console.log(" ├──────────────────┼──────────┼──────────────┼───────────────────────────┤");

        positions.forEach((ch) => {
            const structuralVariance = ch.posX - primeClock.posX;
            const markers = ch.isPrime ? " [PRIME BENCHMARK] " : `${structuralVariance > 0 ? '+' : ''}${structuralVariance.toFixed(6)}`;
            console.log(` │ ${ch.name} │ ${ch.fib.toString().padEnd(8)} │ ${ch.posX.toFixed(6).padEnd(12)} │ ${markers.padEnd(25)} │`);
        });
        
        console.log(" └────────────────────────────────────────────────────────────────────────┘");
        if (collisionEvents.length > 0) {
            console.log(` 🔥 ACTIVE RESINTERSECTIONS: [ ${collisionEvents.join(', ')} ]`);
        }

    } catch (error) {
        console.error("\n [CRITICAL PROFILER OVERLOAD]: Ingestion halted:", error.message);
    }
}

setInterval(runAnalysisCycle, SAMPLE_INTERVAL_MS);
runAnalysisCycle();
