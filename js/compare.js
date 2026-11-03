/* compare.js — runs the SAME number through every algorithm and collects iterations / time */
(function () {
    'use strict';
    const F = window.Fact, U = F.utils;

    const ORDER = ['fermat', 'dixon', 'pollard', 'ecm'];
    const LIMIT_MS = 10000;                       // time limit for EACH algorithm

    // default parameters used for the comparison
    const PARAMS = {
        fermat: {},
        dixon: { B: 100n },
        pollard: { c: 1n, x0: 2n },
        ecm: { B1: 1000n, curves: 50n }
    };
    const ALGO = { fermat: F.fermat, dixon: F.dixon, pollard: F.rho, ecm: F.ecm };

    const pause = () => new Promise((r) => setTimeout(r, 30));   // lets the browser repaint

    // Runs the algorithms one after another. `onUpdate(rows)` is called after every change,
    // `cancelled()` lets the caller stop the loop (e.g. when a new comparison was started).
    async function compareAll(n, onUpdate, cancelled) {
        const rows = ORDER.map((id) => ({ id, params: PARAMS[id], status: 'pending' }));
        onUpdate(rows);

        for (const row of rows) {
            if (cancelled && cancelled()) break;
            row.status = 'running';
            onUpdate(rows);
            await pause();
            try {
                U.startTimer(LIMIT_MS);
                const t0 = performance.now();
                const out = F.factorize(n, ALGO[row.id], row.params);
                row.ms = performance.now() - t0;
                row.out = out;
                row.timeout = !out.complete && U.timeUp();
                row.status = 'done';
            } catch (e) {
                row.status = 'error';
                row.error = String((e && e.message) || e);
            }
            onUpdate(rows);
        }
        return rows;
    }

    F.compare = { ORDER, PARAMS, LIMIT_MS, compareAll };
})();