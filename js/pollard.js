/* pollard.js — Pollard's ρ and Pollard's p−1 */
(function () {
    'use strict';
    const F = window.Fact, U = F.utils;

    /* ============ Pollard ρ ============ */
    F.rho = function (n, o) {
        const c = BigInt(o.c), x0 = BigInt(o.x0);
        const log = new U.StepLog(150, 5);
        const pre = U.precheck(n, log);
        if (pre.done) return { steps: log.finish(), factor: pre.factor, prime: pre.prime };

        log.add({ kind: 'info', key: 'r_start', p: { c, x0 }, lines: [`f(x) = x² + ${c} (mod n)`] });

        const f = (v) => (v * v + c) % n;
        let x = x0, y = x0, d = 1n, i = 0, why = 'why_iters';
        const MAX = 5000000;
        while (d === 1n) {
            if (i >= MAX) break;
            if (i && (i & 255) === 0 && U.timeUp()) { why = 'why_time'; break; }
            i++;
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
            log.add({ kind: 'fail', key: 'r_limit', p: { why: '@' + why } });
            return { steps: log.finish(), factor: null };
        }
        if (d === n) {
            log.add({ kind: 'fail', key: 'r_fail_n' });
            return { steps: log.finish(), factor: null };
        }
        log.add({ kind: 'success', key: 'found', p: { d } });
        U.verify(log, n, d);
        return { steps: log.finish(), factor: d };
    };

    // Suggest: two 30-bit primes (about 60k rounds in the worst case)
    F.rho.suggest = function () {
        const p = U.randPrime(30);
        let q;
        do { q = U.randPrime(30); } while (q === p);
        return { n: p * q, params: { c: 1, x0: 2 } };
    };

    /* ============ Pollard p − 1 ============ */
    F.pm1 = function (n, o) {
        const a0 = BigInt(o.a), B = Number(o.B);
        const log = new U.StepLog(150, 5);
        const pre = U.precheck(n, log);
        if (pre.done) return { steps: log.finish(), factor: pre.factor, prime: pre.prime };

        log.add({ kind: 'info', key: 'p1_start', p: { a: a0, B } });

        const g0 = U.gcd(a0, n);
        if (g0 > 1n) {
            if (g0 < n) {
                log.add({ kind: 'success', key: 'p1_gcd0', p: { g: g0 } });
                U.verify(log, n, g0);
                return { steps: log.finish(), factor: g0 };
            }
            log.add({ kind: 'fail', key: 'p1_fail_n' });
            return { steps: log.finish(), factor: null };
        }

        let a = a0, d = 1n, why = 'why_iters';
        for (let j = 2; j <= B; j++) {
            a = U.modPow(a, BigInt(j), n);
            d = U.gcd(a - 1n, n);
            log.iter({
                kind: 'iter', key: 'p1_iter', p: { j },
                lines: [`a ← a^${j} mod n = ${a}`, `d = gcd(a − 1, n) = ${d}${d === 1n ? '   ↻' : ''}`]
            });
            if (d !== 1n) break;
            if ((j & 1023) === 0 && U.timeUp()) { why = 'why_time'; break; }
        }
        if (d === 1n) {
            log.add({ kind: 'fail', key: 'p1_limit', p: { B } });
            return { steps: log.finish(), factor: null };
        }
        if (d === n) {
            log.add({ kind: 'fail', key: 'p1_fail_n' });
            return { steps: log.finish(), factor: null };
        }
        log.add({ kind: 'success', key: 'found', p: { d } });
        U.verify(log, n, d);
        return { steps: log.finish(), factor: d };
    };

    // Suggest: n = p·q where p − 1 is smooth (primes ≤ 47) and q − 1 has a large prime factor
    function smoothPrime(bits) {
        const sp = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
        for (; ;) {
            let m = 2n;
            while (U.bitLen(m) < bits) m *= BigInt(sp[Math.floor(Math.random() * sp.length)]);
            if (U.isProbablePrime(m + 1n)) return m + 1n;
        }
    }
    function roughPrime(bits) {
        const small = U.primesUpTo(300);
        for (; ;) {
            const q = U.randPrime(bits);
            let r = q - 1n;
            for (const s of small) { const S = BigInt(s); while (r % S === 0n) r /= S; }
            if (r > 1n) return q;
        }
    }
    F.pm1.suggest = function () {
        const p = smoothPrime(40);
        const q = roughPrime(40);
        return { n: p * q, params: { a: 2, B: 300 } };
    };
})();