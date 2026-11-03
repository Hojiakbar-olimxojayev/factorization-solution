/* pollard.js — Pollard's ρ method: finds ONE factor of an odd composite number */
(function () {
    'use strict';
    const F = window.Fact, U = F.utils;

    function split(n, o, log) {
        const c0 = BigInt(o.c), x0 = BigInt(o.x0) % n;
        const MAX = 5000000;

        for (let attempt = 0; attempt < 10; attempt++) {
            const c = (c0 + BigInt(attempt)) % n;
            if (c === 0n || c === n - 2n) continue;   // degenerate constants

            log.add({
                kind: 'info', key: 'r_start', p: { n, c, x0 },
                lines: [`f(x) = x² + ${c} (mod ${n})`]
            });

            const f = (v) => (v * v + c) % n;
            let x = x0, y = x0, d = 1n, i = 0, timeout = false;
            while (d === 1n) {
                if (i >= MAX) break;
                if (i && (i & 255) === 0 && U.timeUp()) { timeout = true; break; }
                i++;
                log.work++;                                 // one ρ round
                x = f(x);
                y = f(f(y));
                const diff = x > y ? x - y : y - x;
                d = U.gcd(diff, n);
                log.iter({
                    kind: 'iter', key: 'r_iter', p: { i },
                    lines: [
                        `x = f(x)    = ${x}`,
                        `y = f(f(y)) = ${y}`,
                        `|x − y| = ${diff}`,
                        `d = gcd(|x − y|, n) = ${d}${d === 1n ? '   ↻' : ''}`
                    ]
                });
            }

            if (d === 1n) {
                log.add({ kind: 'fail', key: 'r_limit', p: { why: timeout ? '@why_time' : '@why_iters' } });
                return null;
            }
            if (d === n) {
                log.add({ kind: 'warn', key: 'r_fail_n' });
                continue;                                // try the next constant c
            }
            log.add({ kind: 'success', key: 'found', p: { d } });
            return d;
        }
        log.add({ kind: 'fail', key: 'r_giveup' });
        return null;
    }

    // Suggest: n = p² · q · r with three 18-bit primes → shows repeated factors
    function suggest() {
        const [p, q, r] = U.randPrimes(3, 18);
        return { n: p * p * q * r, params: { c: 1, x0: 2 } };
    }

    F.rho = { split, suggest };
})();