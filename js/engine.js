/* engine.js — complete prime factorization.
   The chosen algorithm only has to find ONE non-trivial factor of a composite number;
   this driver then recursively factors both parts until only primes are left. */
(function () {
    'use strict';
    const F = window.Fact, U = F.utils;

    function compress(parts) {
        const map = new Map();
        for (const p of parts) {
            const k = (p.prime ? 'p' : 'c') + p.v;
            const e = map.get(k);
            if (e) e.e++; else map.set(k, { v: p.v, prime: p.prime, e: 1 });
        }
        return [...map.values()].sort((a, b) => (a.v < b.v ? -1 : a.v > b.v ? 1 : 0));
    }

    F.factorize = function (n, algo, o) {
        const log = new U.StepLog(100, 4);
        let splits = 0;
        const status = (x) => ({ key: U.isProbablePrime(x) ? 'g_part_prime' : 'g_part_comp', p: { x } });
        const result = (extra) => Object.assign({ steps: log.finish(), work: log.work, splits }, extra);

        // m is any positive number: primes are collected, composites are factored further
        function handle(m, depth, out) {
            if (m === 1n) return;
            if (U.isProbablePrime(m)) out.push({ v: m, prime: true });
            else rec(m, depth, out);
        }

        // m is composite
        function rec(m, depth, out) {
            log.add({ kind: 'group', key: 'g_factor', p: { n: m }, depth });

            // 1) factors of 2
            if (m % 2n === 0n) {
                let r = m, v = 0;
                while (r % 2n === 0n) { r /= 2n; v++; }
                for (let i = 0; i < v; i++) out.push({ v: 2n, prime: true });
                const lines = [`${m} = 2^${v} × ${r}`];
                if (r > 1n) lines.push(status(r));
                log.add({ kind: 'info', key: 'g_even', p: { n: m, v, r }, lines });
                handle(r, depth, out);
                return;
            }

            // 2) perfect powers  m = r^k
            const pw = U.perfectPower(m);
            if (pw) {
                log.add({
                    kind: 'info', key: 'g_power', p: { n: m, r: pw.r, k: pw.k },
                    lines: [`${m} = ${pw.r}^${pw.k}`, status(pw.r)]
                });
                const sub = [];
                handle(pw.r, depth + 1, sub);
                for (let i = 0; i < pw.k; i++) for (const s of sub) out.push({ v: s.v, prime: s.prime });
                return;
            }

            // 3) the chosen algorithm finds one non-trivial factor
            const d = algo.split(m, o, log);
            if (d === null || d <= 1n || d >= m) {
                log.add({ kind: 'fail', key: 'g_stuck', p: { n: m } });
                out.push({ v: m, prime: false });
                return;
            }
            splits++;
            const q = m / d;
            const a = d < q ? d : q;
            const b = d < q ? q : d;
            log.add({
                kind: 'success', key: 'g_split', p: { n: m, a, b },
                lines: [`${m} = ${a} × ${b}`, status(a), status(b)]
            });
            handle(a, depth + 1, out);
            handle(b, depth + 1, out);
        }

        if (n < 2n) {
            log.add({ kind: 'fail', key: 'pre_small', p: { n } });
            return result({ factors: [], complete: false, prime: false, n });
        }
        if (U.isProbablePrime(n)) {
            log.add({ kind: 'info', key: 'pre_prime', p: { n } });
            return result({ factors: [{ v: n, e: 1, prime: true }], complete: true, prime: true, n });
        }

        const parts = [];
        rec(n, 0, parts);
        const factors = compress(parts);
        const complete = factors.every((f) => f.prime);
        const expr = U.exprOf(factors);

        // final verification
        log.add({ kind: 'group', key: 'g_final', p: {}, depth: 0 });
        log.add({
            kind: complete ? 'success' : 'warn',
            key: complete ? 'g_result' : 'g_result_partial',
            p: { expr }, lines: [`${n} = ${expr}`]
        });
        let prod = 1n;
        for (const f of factors) prod *= f.v ** BigInt(f.e);
        log.add({
            kind: 'verify', key: 'g_verify', p: {},
            lines: [
                `${factors.map((f) => (f.e > 1 ? `${f.v}^${f.e}` : `${f.v}`)).join(' · ')} = ${prod}`,
                `${prod} ${prod === n ? '=' : '≠'} n   ${prod === n ? '✓' : '✗'}`
            ]
        });
        log.add({
            kind: 'verify', key: 'g_verify_primes', p: {},
            lines: factors.map((f) => ({
                key: 'verify_prime', p: { x: f.v, s: U.isProbablePrime(f.v) ? '@prime' : '@composite' }
            }))
        });

        return result({ factors, complete, prime: false, n });
    };
})();