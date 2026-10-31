/* fermat.js — Fermat's factorization method */
(function () {
    'use strict';
    const F = window.Fact, U = F.utils;

    F.fermat = function (n, o) {
        const log = new U.StepLog(150, 5);
        const pre = U.precheck(n, log);
        if (pre.done) return { steps: log.finish(), factor: pre.factor, prime: pre.prime };

        let a = U.isqrt(n);
        if (a * a < n) a += 1n;
        log.add({
            kind: 'info', key: 'f_start', p: { a },
            lines: [`⌈√n⌉ = ${a}      (${a}² = ${a * a} ≥ n)`]
        });

        const MAX = 3000000;
        let k = 0, why = 'why_iters';
        while (k < MAX) {
            const b2 = a * a - n;
            const s = U.isqrt(b2);
            if (s * s === b2) {
                log.add({
                    kind: 'success', key: 'f_hit', p: { b2, b: s },
                    lines: [`a = ${a},  b = ${s}`, `a² − b² = ${a * a} − ${s * s} = ${a * a - s * s} = n  ✓`]
                });
                const p = a - s, q = a + s;
                log.add({ kind: 'success', key: 'f_factors', p: { p, q } });
                if (p > 1n) U.verify(log, n, p);
                return { steps: log.finish(), factor: p > 1n ? p : null };
            }
            k++;
            log.iter({
                kind: 'iter', key: 'f_iter', p: { k, a },
                lines: [
                    `b² = a² − n = ${a * a} − ${n} = ${b2}`,
                    `⌊√b²⌋ = ${s},   ${s}² = ${s * s} ≠ ${b2}   ✗`
                ]
            });
            a += 1n;
            if ((k & 255) === 0 && U.timeUp()) { why = 'why_time'; break; }
        }
        log.add({ kind: 'fail', key: 'f_limit', p: { why: '@' + why } });
        return { steps: log.finish(), factor: null };
    };

    // Suggest: two primes p < q with q − p ≈ √(8·p·k), which needs about k trials
    F.fermat.suggest = function () {
        const p = U.randPrime(40);
        const k = BigInt(8 + Math.floor(Math.random() * 50));
        const gap = U.isqrt(8n * p * k);
        const q = U.nextPrime(p + gap);
        return { n: p * q, params: {} };
    };
})();