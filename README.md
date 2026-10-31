# Integer Factorization Suite

An interactive web application that factors large integers with **five classic algorithms** and shows every step of the computation, so each result can be verified by hand.

**Live demo:** https://factorization-solution.vercel.app/

Built for the course _Mathematical Foundations of Cryptography_ — topic: _"Faktorizatsiyalashni amalga oshiruvchi kompleks dasturiy ta'minot ishlab chiqish"_.

## Features

- **Fermat, Dixon, Pollard (ρ and p − 1) and Lenstra ECM** in one app
- **Step-by-step visualisation:** Next / Prev, Play with speed control, Show all, Restart
- **Verification:** every run ends with `p × q = n ✓` and a Miller–Rabin check of both factors
- **Big numbers:** JavaScript `BigInt`, tested with 30+ digit inputs
- **Input help:** each parameter has a description with allowed ranges, and a **💡 Suggest inputs** button fills in numbers that are known to work
- **EN / UZ** language toggle and **dark / light** mode (both remembered in the browser)
- No libraries, no build step, no server — plain HTML, CSS and JavaScript

## Algorithms

| Algorithm         | Idea                                                                  | Best when                            |
| ----------------- | --------------------------------------------------------------------- | ------------------------------------ |
| **Fermat**        | n = a² − b² = (a − b)(a + b), search a ≥ ⌈√n⌉                         | p ≈ q                                |
| **Dixon**         | collect x² ≡ r (mod n) with smooth r, solve over GF(2), gcd(X − Y, n) | medium n (≤ ~18 digits in a browser) |
| **Pollard ρ**     | cycle detection of x² + c (mod n), gcd(\|x − y\|, n)                  | small prime factor p, ~√p steps      |
| **Pollard p − 1** | gcd(a^(B!) − 1, n)                                                    | p − 1 has only small prime factors   |
| **Lenstra ECM**   | random elliptic curve, failed modular inversion reveals a factor      | factors up to ~15 digits, large n    |

## Project structure

```
factorization-suite/
├── index.html
├── css/style.css
├── js/
│   ├── utils.js      BigInt math, Miller–Rabin, step log, shared checks
│   ├── i18n.js       English / Uzbek texts
│   ├── fermat.js
│   ├── dixon.js
│   ├── pollard.js    ρ and p − 1
│   ├── lenstra.js    ECM (stage 1, affine coordinates)
│   └── app.js        UI, stepper, theme, language
├── favicon.svg
├── og-image.png      social preview (1200×630)
├── site.webmanifest
├── robots.txt
├── sitemap.xml
└── vercel.json       security headers and caching
```

## Usage tips

| Algorithm     | Try this                                     |
| ------------- | -------------------------------------------- |
| Fermat        | press **Suggest inputs**, then **Factorize** |
| Dixon         | `n` ≈ 10¹²–10¹⁶, `B` = 100                   |
| Pollard ρ     | `c` = 1, `x₀` = 2                            |
| Pollard p − 1 | `a` = 2, `B` = 300–1000                      |
| Lenstra ECM   | `B₁` = 1000, up to 100 curves                |

If a run fails, the last step explains why and what to change (another `c`, a larger `B`, more curves, a different algorithm).

## Limits

- `n` up to 80 digits
- every run stops after 25 seconds and reports the reason
- very long logs keep the first ~150 and the last few iterations, with a "N iterations hidden" line in between
- primality is checked with Miller–Rabin using 13 bases (deterministic below 3.3·10²⁴, extremely reliable above)

## Tech

HTML5 · CSS3 (custom properties for themes) · JavaScript ES2020 (`BigInt`, no dependencies)

## Author

Hojiakbarxon Olimxo'jayev