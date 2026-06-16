import dgram from 'dgram';

const ATOMIC_NTP_SERVER = 'pool.ntp.org';
const NTP_PORT = 123;
const SAMPLE_INTERVAL_MS = 2000; 

const HARUHI_N5_STRING = new Int32Array([
    1,2,3,4,5,1,2,3,4,1,5,2,3,4,1,2,5,3,4,1,2,3,5,4,1,2,3,4,5,1,2,4,3,5,1,2,4,3,1,5,2,4,3,1,2,5,4,3,1,2,4,
    5,3,1,2,4,3,5,1,4,2,3,5,1,4,2,3,1,5,4,2,3,1,4,5,2,3,1,4,2,5,3,1,4,2,3,5,1,4,3,2,5,1,4,3,2,1,5,4,3,2,1,
    4,5,3,2,1,4,3,5,2,1,4,3,2,5,1,4,3,2,1,5,4,3,1,2,5,4,3,1,5,2,4,3,1,5,4,2,3,1,5,4,3,2,1,5,4,3,1,2,5,4,3
]);

const TARGET_FIB = 5.0;  // Benchmarked to the Magenta lane
const TARGET_FREQ = 0.0012;

console.log("=============================================================");
console.log("    DIAGNOSE_RTC.JS: MONOTONIC CPU PHASE DRIFT DETECTOR      ");
console.log("=============================================================");

function fetchAtomicTime() {
    return new Promise((resolve, reject) => {
        const client = dgram.createSocket('udp4');
        const ntpData = Buffer.alloc(48);
        ntpData[0] = 0x1B; 

        const timeout = setTimeout(() => {
            client.close();
            reject(new Error("Timeout connecting to stratum reference."));
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

async function verifyClockAccuracy() {
    try {
        const startNs = process.hrtime.bigint();
        const atomicTimeMS = await fetchAtomicTime();
        const endNs = process.hrtime.bigint();

        const latencyMS = Number(endNs - startNs) / 1000000;
        const localTimeMS = Date.now();
        const driftMS = localTimeMS - atomicTimeMS;
        const timelineSec = Number(endNs / 1000000000n);

        // Compute localized phase metrics matching the exact visual math equations
        const rawSway = Math.log1p(Math.abs(Math.sin(timelineSec * TARGET_FREQ * 3.0)));
        let tx = 0.1 + (Math.abs(Math.sin(rawSway * TARGET_FIB)) * 0.8);
        const superIdx = Math.floor(timelineSec * 0.2) % 153;
        const phaseDeltaRad = (tx + HARUHI_N5_STRING[superIdx] * 0.03) % 1.0;

        console.log(`\n[RTC TIMESTAMP -> ${new Date().toISOString()}]`);
        console.log(` -> Net Ingestion Delay  : ${latencyMS.toFixed(3)} ms`);
        console.log(` -> Atomic UTC Baseline  : ${atomicTimeMS} ms`);
        console.log(` -> Hardware Sync Offset : ${driftMS > 0 ? '+' : ''}${driftMS} ms`);
        console.log(` -> Mapped Phase Delta   : ${phaseDeltaRad.toFixed(14)} rad`);

        if (Math.abs(driftMS) > 30) {
            console.log(" ⚠️ ALERT: Local clock is drifting. Real-time shader vectors will destabilize.");
        } else {
            console.log(" ✓ STATUS: Clock grid stable. Processing phase anchored correctly.");
        }

    } catch (error) {
        console.error(" [DATA ERROR]: Could not parse hardware timing cycles:", error.message);
    }
}

setInterval(verifyClockAccuracy, SAMPLE_INTERVAL_MS);
verifyClockAccuracy();
