/* lenstra.js — Lenstra's elliptic-curve method (stage 1): finds ONE factor of an odd composite number */
(function () {
    'use strict';
    const F = window.Fact, U = F.utils;

    // y² = x³ + a·x + b (mod n); null = point at infinity.
    // A failed inversion throws { ecFactor: gcd, den } — that gcd is our factor.
    function ecAdd(P, Q, a, n) {
        if (!P) return Q;
        if (!Q) return P;
        let num, den;
        if (P.x === Q.x) {
            if (U.mod(P.y + Q.y, n) === 0n) return null;
            if (P.y !== Q.y) throw { ecFactor: U.gcd(P.y - Q.y, n), den: U.mod(P.y - Q.y, n) };
            num = U.mod(3n * P.x * P.x + a, n);
            den = U.mod(2n * P.y, n);
        } else {
            num = U.mod(Q.y - P.y, n);
            den = U.mod(Q.x - P.x, n);
        }
        const g = U.gcd(den, n);
        if (g !== 1n) throw { ecFactor: g, den };
        const lam = (num * U.modInv(den, n)) % n;
        const x3 = U.mod(lam * lam - P.x - Q.x, n);
        const y3 = U.mod(lam * (P.x - x3) - P.y, n);
        return { x: x3, y: y3 };
    }

    function ecMul(k, P, a, n) {
        let R = null, Q = P;
        while (k > 0n) {
            if (k & 1n) R = ecAdd(R, Q, a, n);
            k >>= 1n;
            if (k > 0n) Q = ecAdd(Q, Q, a, n);
        }
        return R;
    }

    function split(n, o, log) {
        const B1 = Number(o.B1), maxC = Number(o.curves);
        const primes = U.primesUpTo(B1);
        const L = BigInt(B1);
        const ks = primes.map((p) => {
            const P = BigInt(p);
            let k = P;
            while (k * P <= L) k *= P;
            return k;
        });
        log.add({ kind: 'info', key: 'e_start', p: { n, B1, count: primes.length } });

        let tried = 0, why = 'why_curves';
        for (let c = 1; c <= maxC; c++) {
            if (U.timeUp()) { why = 'why_time'; break; }
            tried = c;

            const a = U.randBelow(n), x0 = U.randBelow(n), y0 = U.randBelow(n);
            const b = U.mod(y0 * y0 - x0 * x0 * x0 - a * x0, n);
            const cl = new U.StepLog(60, 4);
            const g = U.gcd(4n * a * a * a + 27n * b * b, n);
            cl.add({
                kind: 'info', key: 'e_curve', p: { c, x: x0, y: y0, a, b },
                lines: ['E: y² = x³ + a·x + b (mod n)', `gcd(4a³ + 27b², n) = ${g}`]
            });

            let found = null, outcome = 'none', curP = 0, curK = 0n;
            if (g > 1n && g < n) {
                found = g;
                cl.add({ kind: 'success', key: 'e_disc', p: { d: g } });
            } else if (g === n) {
                outcome = 'n';
            } else {
                let P = { x: x0, y: y0 };
                try {
                    for (let i = 0; i < primes.length; i++) {
                        curP = primes[i]; curK = ks[i];
                        log.work++;                             // one point multiplication k·P
                        P = ecMul(curK, P, a, n);
                        cl.iter({
                            kind: 'iter', key: 'e_iter', p: { p: curP, k: curK },
                            lines: [P ? `P = (${P.x}, ${P.y})` : 'P = O  (point at infinity)']
                        });
                        if (!P) { outcome = 'inf'; break; }
                    }
                } catch (e) {
                    if (!e || e.ecFactor === undefined) throw e;
                    if (e.ecFactor > 1n && e.ecFactor < n) {
                        found = e.ecFactor;
                        cl.add({
                            kind: 'success', key: 'e_hit', p: { d: found, p: curP, k: curK },
                            lines: [`denominator ≡ ${e.den} (mod n)`, `gcd(denominator, n) = ${found}`]
                        });
                    } else {
                        outcome = 'n';
                    }
                }
            }

            const list = cl.finish();
            if (found) {
                list.forEach((s) => log.add(s));
                log.add({ kind: 'success', key: 'found', p: { d: found } });
                return found;
            }
            // full log for the first curve, only the header for later failed curves
            (c === 1 ? list : [list[0]]).forEach((s) => log.add(s));
            log.add({ kind: 'warn', key: 'e_curve_fail', p: { c, why: '@e_why_' + outcome } });
        }

        log.add({ kind: 'fail', key: 'e_limit', p: { c: tried, why: '@' + why } });
        return null;
    }

    // Suggest: three 28-bit primes
    function suggest() {
        const [p, q, r] = U.randPrimes(3, 28);
        return { n: p * q * r, params: { B1: 1000, curves: 100 } };
    }

    F.ecm = { split, suggest };
})();