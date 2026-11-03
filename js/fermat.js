/* fermat.js — Fermat's method: finds ONE factor of an odd composite number */
(function () {
    'use strict';
    const F = window.Fact, U = F.utils;

    function split(n, o, log) {
        let a = U.isqrt(n);
        if (a * a < n) a += 1n;
        log.add({
            kind: 'info', key: 'f_start', p: { n, a },
            lines: [`⌈√n⌉ = ${a}      (${a}² = ${a * a} ≥ n)`]
        });

        const MAX = 3000000;
        let k = 0, why = 'why_iters';
        while (k < MAX) {
            log.work++;                                   // one trial of a
            const b2 = a * a - n;
            const s = U.isqrt(b2);
            if (s * s === b2) {
                log.add({
                    kind: 'success', key: 'f_hit', p: { b2, b: s },
                    lines: [`a = ${a},  b = ${s}`, `a² − b² = ${a * a} − ${s * s} = ${a * a - s * s} = n  ✓`]
                });
                const p = a - s, q = a + s;
                log.add({ kind: 'success', key: 'f_factors', p: { p, q } });
                return p > 1n && p < n ? p : null;
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
        return null;
    }

    // Suggest: two close primes (needs about 8–58 trials)
    function suggest() {
        const p = U.randPrime(40);
        const k = BigInt(8 + Math.floor(Math.random() * 50));
        const gap = U.isqrt(8n * p * k);
        const q = U.nextPrime(p + gap);
        return { n: p * q, params: {} };
    }

    F.fermat = { split, suggest };
})();