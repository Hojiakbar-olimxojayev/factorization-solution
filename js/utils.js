/* utils.js — BigInt math helpers, primality test, step log */
(function () {
    'use strict';
    const F = (window.Fact = window.Fact || {});

    const mod = (a, n) => { const r = a % n; return r >= 0n ? r : r + n; };
    const abs = (a) => (a < 0n ? -a : a);
    const bitLen = (n) => n.toString(2).length;

    function gcd(a, b) {
        a = abs(a); b = abs(b);
        while (b) { const t = a % b; a = b; b = t; }
        return a;
    }

    function modPow(base, exp, m) {
        let result = 1n;
        base = mod(base, m);
        while (exp > 0n) {
            if (exp & 1n) result = (result * base) % m;
            base = (base * base) % m;
            exp >>= 1n;
        }
        return result;
    }

    function modInv(a, m) {
        let r0 = mod(a, m), r1 = m, s0 = 1n, s1 = 0n;
        while (r1) {
            const q = r0 / r1;
            [r0, r1] = [r1, r0 - q * r1];
            [s0, s1] = [s1, s0 - q * s1];
        }
        return mod(s0, m);
    }

    function isqrt(n) {
        if (n < 2n) return n;
        let x = 1n << BigInt((bitLen(n) + 1) >> 1);
        for (; ;) {
            const y = (x + n / x) >> 1n;
            if (y >= x) return x;
            x = y;
        }
    }

    // floor of the k-th root
    function iroot(m, k) {
        if (k === 1) return m;
        const K = BigInt(k);
        let lo = 1n, hi = 1n << BigInt(Math.ceil(bitLen(m) / k) + 1);
        while (lo < hi) {
            const mid = (lo + hi + 1n) >> 1n;
            if (mid ** K <= m) lo = mid; else hi = mid - 1n;
        }
        return lo;
    }

    // m = r^k with the largest possible k ≥ 2, or null
    function perfectPower(m) {
        for (let k = bitLen(m); k >= 2; k--) {
            const r = iroot(m, k);
            if (r > 1n && r ** BigInt(k) === m) return { r, k };
        }
        return null;
    }

    const SMALL = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n];

    function isProbablePrime(n) {
        if (n < 2n) return false;
        for (const p of SMALL) {
            if (n === p) return true;
            if (n % p === 0n) return false;
        }
        let d = n - 1n, s = 0;
        while ((d & 1n) === 0n) { d >>= 1n; s++; }
        outer:
        for (const a of SMALL) {
            let x = modPow(a, d, n);
            if (x === 1n || x === n - 1n) continue;
            for (let r = 1; r < s; r++) {
                x = (x * x) % n;
                if (x === n - 1n) continue outer;
            }
            return false;
        }
        return true;
    }

    function primesUpTo(limit) {
        if (limit < 2) return [];
        if (primesUpTo.cache && primesUpTo.cacheLimit >= limit) {
            return primesUpTo.cache.filter((p) => p <= limit);
        }
        const sieve = new Uint8Array(limit + 1);
        const out = [];
        for (let i = 2; i <= limit; i++) {
            if (!sieve[i]) {
                out.push(i);
                for (let j = i * i; j <= limit; j += i) sieve[j] = 1;
            }
        }
        primesUpTo.cache = out;
        primesUpTo.cacheLimit = limit;
        return out;
    }

    function randBitsRaw(bits) {
        let r = 0n;
        for (let i = 0; i < bits; i += 30) {
            r = (r << 30n) | BigInt(Math.floor(Math.random() * 1073741824));
        }
        return r & ((1n << BigInt(bits)) - 1n);
    }
    const randBits = (bits) => randBitsRaw(bits) | (1n << BigInt(bits - 1));
    const randBelow = (n) => randBitsRaw(bitLen(n) + 32) % n;

    function randPrime(bits) {
        for (; ;) {
            const r = randBits(bits) | 1n;
            if (isProbablePrime(r)) return r;
        }
    }
    function nextPrime(n) {
        n = n + 1n;
        if ((n & 1n) === 0n) n += 1n;
        while (!isProbablePrime(n)) n += 2n;
        return n;
    }
    // distinct random primes
    function randPrimes(count, bits) {
        const out = [];
        while (out.length < count) {
            const p = randPrime(bits);
            if (!out.includes(p)) out.push(p);
        }
        return out;
    }

    /* ---------- time limit ---------- */
    let deadline = Infinity;
    const startTimer = (ms) => { deadline = performance.now() + ms; };
    const timeUp = () => performance.now() > deadline;

    /* ---------- step log ---------- */
    class StepLog {
        constructor(head = 100, tail = 4) {
            this.head = head; this.tail = tail;
            this.steps = []; this.count = 0; this.buf = [];
        }
        iter(step) {
            this.count++;
            if (this.count <= this.head) this.steps.push(step);
            else {
                this.buf.push(step);
                if (this.buf.length > this.tail) this.buf.shift();
            }
        }
        flush() {
            const skipped = this.count - this.head - this.buf.length;
            if (skipped > 0) this.steps.push({ kind: 'skip', key: 'skipped', p: { n: skipped } });
            for (const s of this.buf) this.steps.push(s);
            this.count = 0; this.buf = [];
        }
        add(step) { this.flush(); this.steps.push(step); }
        finish() { this.flush(); return this.steps; }
    }

    /* ---------- Dixon helpers ---------- */
    function smoothFactor(r, fbBig) {
        const exps = new Array(fbBig.length).fill(0);
        for (let i = 0; i < fbBig.length; i++) {
            const p = fbBig[i];
            while (r % p === 0n) { r /= p; exps[i]++; }
            if (r === 1n) break;
        }
        return { exps, rem: r };
    }
    function factorString(exps, fb) {
        const parts = [];
        exps.forEach((e, i) => { if (e > 0) parts.push(e === 1 ? `${fb[i]}` : `${fb[i]}^${e}`); });
        return parts.length ? parts.join(' · ') : '1';
    }

    /* ---------- pretty factorization string:  2³ × 3² × 5 ---------- */
    const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
    const sup = (e) => String(e).split('').map((c) => SUP[c]).join('');
    function exprOf(factors) {
        return factors
            .map((f) => {
                const base = f.prime ? `${f.v}` : `[${f.v}]`;
                return f.e > 1 ? base + sup(f.e) : base;
            })
            .join(' × ');
    }

    F.utils = {
        mod, abs, bitLen, gcd, modPow, modInv, isqrt, iroot, perfectPower, isProbablePrime,
        primesUpTo, randBits, randBelow, randPrime, randPrimes, nextPrime,
        startTimer, timeUp, StepLog, smoothFactor, factorString, exprOf
    };
})();