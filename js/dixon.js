/* dixon.js — Dixon's random-squares method: finds ONE factor of an odd composite number */
(function () {
    'use strict';
    const F = window.Fact, U = F.utils;

    function split(n, o, log) {
        const B0 = Number(o.B);
        log.add({ kind: 'info', key: 'd_start', p: { n, B: B0 } });

        /* ---- 1) factor base: primes p ≤ B with (n/p) = 1 (Euler's criterion) ---- */
        let B = B0, fb = [], excluded = [];
        for (; ;) {
            fb = []; excluded = [];
            for (const p of U.primesUpTo(B)) {
                if (p === 2) { fb.push(2); continue; }
                const P = BigInt(p);
                if (n % P === 0n) { excluded.push(p); continue; }
                if (U.modPow(n % P, (P - 1n) / 2n, P) === 1n) fb.push(p);
            }
            if (fb.length >= 2 || B >= 100000) break;
            B *= 2;
            log.add({ kind: 'warn', key: 'd_fb_extend', p: { B } });
        }
        if (fb.length < 2) {
            log.add({ kind: 'fail', key: 'd_fb_small' });
            return null;
        }
        if (excluded.length) {
            log.add({ kind: 'info', key: 'd_excluded', p: { list: excluded.join(', ') } });
        }
        const fbBig = fb.map((p) => BigInt(p));
        const m = fb.length;
        log.add({ kind: 'info', key: 'd_fb', p: { m }, lines: [fb.join(', ')] });

        /* ---- 2–5) relations → matrix → dependencies (more rounds if all are trivial) ---- */
        const rels = [];
        let x = U.isqrt(n) + 1n;
        let tries = 0, target = m + 2, why = 'why_iters';
        const MAX_TRIES = 400000;

        for (let round = 1; round <= 6; round++) {
            if (round === 1) log.add({ kind: 'info', key: 'd_search', p: { need: target } });

            while (rels.length < target) {
                if (tries >= MAX_TRIES) break;
                if (tries && (tries & 1023) === 0 && U.timeUp()) { why = 'why_time'; break; }
                tries++;
                log.work++;                                 // one candidate x tested

                const g = U.gcd(x, n);
                if (g > 1n && g < n) {
                    log.add({ kind: 'success', key: 'd_gcdx', p: { x, g } });
                    return g;
                }
                const r = (x * x) % n;
                const { exps, rem } = U.smoothFactor(r, fbBig);
                if (rem === 1n) {
                    rels.push({ x, r, exps });
                    log.add({
                        kind: 'rel', key: 'd_rel', p: { i: rels.length, need: target, x, r },
                        lines: [`r = ${U.factorString(exps, fb)}`]
                    });
                } else {
                    log.iter({
                        kind: 'iter', key: 'd_try', p: { x },
                        lines: [`r = x² mod n = ${r}`, { key: 'd_notsmooth', p: { rem } }]
                    });
                }
                x += 1n;
            }
            if (rels.length < target) {
                log.add({ kind: 'fail', key: 'd_nofind', p: { have: rels.length, need: target, why: '@' + why } });
                return null;
            }

            // matrix over GF(2)
            const rows = rels.map((r) => r.exps.map((e) => e & 1));
            log.add({
                kind: 'info', key: 'd_matrix',
                table: { head: ['#', 'x', ...fb], rows: rels.map((r, i) => [i + 1, r.x, ...rows[i]]) }
            });

            // Gaussian elimination, remembering which relations were combined
            const pivots = new Map();
            const deps = [];
            rows.forEach((row, i) => {
                const vec = row.slice();
                const combo = new Set([i]);
                for (let c = 0; c < m; c++) {
                    if (!vec[c]) continue;
                    const pv = pivots.get(c);
                    if (!pv) { pivots.set(c, { vec, combo }); return; }
                    for (let j = c; j < m; j++) vec[j] ^= pv.vec[j];
                    for (const idx of pv.combo) { if (combo.has(idx)) combo.delete(idx); else combo.add(idx); }
                }
                deps.push([...combo].sort((a, b) => a - b));
            });
            log.add({ kind: 'info', key: 'd_elim', p: { k: deps.length } });

            // try every dependency
            for (let j = 0; j < deps.length; j++) {
                const set = deps[j];
                let X = 1n;
                const sum = new Array(m).fill(0);
                for (const idx of set) {
                    X = (X * rels[idx].x) % n;
                    rels[idx].exps.forEach((e, t) => { sum[t] += e; });
                }
                let Y = 1n;
                const parts = [];
                sum.forEach((e, t) => {
                    if (e > 0) {
                        Y = (Y * U.modPow(fbBig[t], BigInt(e / 2), n)) % n;
                        parts.push(e / 2 === 1 ? `${fb[t]}` : `${fb[t]}^${e / 2}`);
                    }
                });
                const lines = [
                    `X = ${set.map((i) => 'x' + (i + 1)).join(' · ')} mod n = ${X}`,
                    `exponent sums = (${sum.join(', ')})   → all even ✓`,
                    `Y = ${parts.join(' · ') || '1'} mod n = ${Y}`,
                    `X² mod n = ${(X * X) % n},   Y² mod n = ${(Y * Y) % n}`
                ];
                const setText = '{' + set.map((i) => i + 1).join(', ') + '}';
                if (X === Y || X === n - Y) {
                    lines.push(`X ≡ ${X === Y ? '+' : '−'}Y (mod n)`);
                    log.add({ kind: 'info', key: 'd_dep', p: { j: j + 1, set: setText }, lines });
                    log.add({ kind: 'warn', key: 'd_trivial' });
                    continue;
                }
                const d = U.gcd(X - Y, n);
                lines.push(`gcd(X − Y, n) = ${d}`);
                log.add({ kind: 'info', key: 'd_dep', p: { j: j + 1, set: setText }, lines });
                if (d > 1n && d < n) {
                    log.add({ kind: 'success', key: 'found', p: { d } });
                    return d;
                }
            }
            target += 6;
            log.add({ kind: 'warn', key: 'd_more', p: { need: target } });
        }
        log.add({ kind: 'fail', key: 'd_alltrivial' });
        return null;
    }

    // Suggest: two 20-bit primes times a small prime
    function suggest() {
        const [p, q] = U.randPrimes(2, 20);
        const smalls = [3n, 5n, 7n, 11n, 13n, 17n];
        const s = smalls[Math.floor(Math.random() * smalls.length)];
        return { n: p * q * s, params: { B: 100 } };
    }

    F.dixon = { split, suggest };
})();