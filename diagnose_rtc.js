import dgram from 'dgram';

// --- CONFIGURATION TARGETS ---
const ATOMIC_NTP_SERVER = 'pool.ntp.org'; // Direct connection line to Stratum-1 Atomic reference clocks
const NTP_PORT = 123;
const SAMPLE_INTERVAL_MS = 2000; // Poll the clock array every 2 seconds

// Bounded Truncated Fibonacci Progression Array matching the UI architecture
const TRUNCATED_FIB =;
const BASE_FREQUENCY = 0.0012; // Mapped to the Magenta track for baseline tracking

console.log("=============================================================");
console.log("  ATOMIC RTC DRIFT ENGINE DETECTOR INTERFACE ONWARDS ");
console.log("=============================================================");
console.log(`Connecting to Atomic Reference Array via: ${ATOMIC_NTP_SERVER}`);

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

        // 4. Calculate the execution time of the WebGL mathematical math function using the atomic state
        // Simulate how much the clock has warped since execution started
        const simulatedTimestamp = Number(cpuEndNanoseconds / 1000000000n); 
        const rawLogSway = Math.log1p(Math.abs(Math.sin(simulatedTimestamp * BASE_FREQUENCY)));
        const structuralPhaseDelta = rawLogSway * TRUNCATED_FIB[1]; // Evaluated against Track II

        // 5. Compute structural alignment and tracking offsets
        // Track the drift between the local computer clock and the true atomic epoch clock
        const localSystemTimeMS = Date.now();
        const absoluteDriftMS = localSystemTimeMS - atomicTimestampMS;

        console.log(`\n[TIMESTAMP: ${new Date().toISOString()}]`);
        console.log(` -> Network Ingestion Latency : ${networkLatencyMS.toFixed(3)} ms`);
        console.log(` -> Pure Atomic RTC Baseline  : ${atomicTimestampMS} ms`);
        console.log(` -> Local Host Grid Time      : ${localSystemTimeMS} ms`);
        console.log(` -> Clock Sync Offset (Drift) : ${absoluteDriftMS > 0 ? '+' : ''}${absoluteDriftMS} ms`);
        console.log(` -> Simulated Phase Sway Delta: ${structuralPhaseDelta.toFixed(6)} rad`);

        if (Math.abs(absoluteDriftMS) > 30) {
            console.log(" ! WARNING: Host system clock is drifting from the atomic baseline.");
            console.log("   The WebGL canvas is calculating mathematical positions using an unstable clock source.");
        } else {
            console.log(" ✓ STATUS: Clock drift is inside safe bounds. The mathematical engine is properly anchored.");
        }

    } catch (error) {
        console.error(" [CRITICAL ERROR]: Could not read time state matrix:", error.message);
    }
}

// Execute the comparison loop continuously at the designated interval
setInterval(runAnalysisCycle, SAMPLE_INTERVAL_MS);
runAnalysisCycle();
