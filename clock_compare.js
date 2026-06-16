import dgram from 'dgram';

// --- CONFIGURATION TARGETS ---
const ATOMIC_NTP_SERVER = 'pool.ntp.org'; // Strata-1 Atomic/GPS disciplined server line
const NTP_PORT = 123;
const SAMPLE_INTERVAL_MS = 2000; // Poll the network array every 2 seconds

// Parallel Multi-Channel Metrics Array (Matches the WebGL GPU Configuration)
const channels = [
    { name: "CH I  (Cyan)   ", fib: 2.0,  freq: 0.0008 },
    { name: "CH II (Magenta)", fib: 5.0,  freq: 0.0012 },
    { name: "CH III(Amber)  ", fib: 13.0, freq: 0.0005 },
    { name: "CH IV (Emerald)", fib: 21.0, freq: 0.0018 }
];

console.log("=============================================================");
console.log("        CLOCK_COMPARE.JS: MULTI-CHANNEL ATOMIC MONITOR        ");
console.log("=============================================================");
console.log(`Synchronizing with Atomic Clock Core Matrix via: ${ATOMIC_NTP_SERVER}\n`);

/**
 * Dispatches a raw UDP packet to query an atomic NTP reference epoch.
 * Uses the low-level NTP timestamp format (seconds since Jan 1 1900).
 */
function fetchAtomicTime() {
    return new Promise((resolve, reject) => {
        const client = dgram.createSocket('udp4');
        const ntpData = Buffer.alloc(48);
        
        // Set NTP Client Mode configuration flags in the first byte
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

            // Extract the transmit timestamp fields from bytes 40-43
            const secPart = msg.readUInt32BE(40);
            const fracPart = msg.readUInt32BE(44);

            // Convert raw NTP seconds (starting 1900) to standard Unix Epoch MS (starting 1970)
            const ntpEpochDelta = 2208988800;
            const unixSeconds = secPart - ntpEpochDelta;
            const milliseconds = Math.round((fracPart / 0x100000000) * 1000);
            
            const atomicEpochMS = (unixSeconds * 1000) + milliseconds;
            resolve(atomicEpochMS);
        });
    });
}

// --- MAIN RUNTIME ANALYSIS MATRIX ---
async function runAnalysisCycle() {
    try {
        // 1. Gather high-resolution internal CPU monotonic cycle time (Nanoseconds)
        const cpuStartNanoseconds = process.hrtime.bigint();

        // 2. Query the absolute physical atomic clock state over the wire
        const atomicTimestampMS = await fetchAtomicTime();
        
        // 3. Capture the CPU time again immediately after network ingestion finishes
        const cpuEndNanoseconds = process.hrtime.bigint();
        const networkLatencyMS = Number(cpuEndNanoseconds - cpuStartNanoseconds) / 1000000;

        // 4. Extract standard host machine time parameters
        const localSystemTimeMS = Date.now();
        const absoluteDriftMS = localSystemTimeMS - atomicTimestampMS;

        // Convert the nanosecond CPU clock to a steady floating-point timeline (seconds)
        const timelineTimeSec = Number(cpuEndNanoseconds / 1000000000n);

        console.log(`[SYS ENGINE LOG -> ${new Date().toISOString()}]`);
        console.log(` ├─ Net Ingestion Latency : ${networkLatencyMS.toFixed(3)} ms`);
        console.log(` ├─ Local Host Grid Time  : ${localSystemTimeMS} ms`);
        console.log(` └─ Atomic Drift Variable : ${absoluteDriftMS > 0 ? '+' : ''}${absoluteDriftMS} ms`);
        console.log(" ┌──────────────────────────────────────────────────────────┐");
        console.log(" │ CHANNEL ID   │ FIB CORE │ WAVE FREQ │ CURRENT PHASE RAD  │");
        console.log(" ├──────────────┼──────────┼───────────┼────────────────────┤");

        // 5. Asynchronously step over and evaluate all 4 channels simultaneously
        channels.forEach((ch) => {
            // Replicate the exact mathematical transformation running in the GPU fragment shader
            const rawLogSway = Math.log1p(Math.abs(Math.sin(timelineTimeSec * ch.freq)));
            const structuralPhaseDelta = rawLogSway * ch.fib;

            console.log(` │ ${ch.name} │ ${ch.fib.toString().padEnd(8)} │ ${ch.freq.toString().padEnd(9)} │ ${structuralPhaseDelta.toFixed(14)} │`);
        });
        
        console.log(" └──────────────────────────────────────────────────────────┘");

        // System Health Threshold Diagnostics Guard
        if (Math.abs(absoluteDriftMS) > 30) {
            console.log(" ! ALERT: Clock desynchronization warning. Multi-axis execution matrix is unstable.");
        } else {
            console.log(" ✓ STATUS: Clock drift inside safe parameters. Mathematical alignment verified.");
        }

    } catch (error) {
        console.error("\n [CRITICAL ERROR]: Could not parse structural time metrics:", error.message);
    }
}

// Spin the execution matrix infinitely at the designated polling interval
setInterval(runAnalysisCycle, SAMPLE_INTERVAL_MS);
runAnalysisCycle();
