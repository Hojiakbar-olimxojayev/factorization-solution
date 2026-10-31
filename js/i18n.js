/* i18n.js — English / Uzbek texts. Use "{name}" placeholders; params starting with "@" are translated keys. */
(function () {
    'use strict';
    const F = (window.Fact = window.Fact || {});

    const DICT = {
        en: {
            app_title: "Integer Factorization Suite",
            app_sub: "Fermat · Dixon · Pollard (ρ and p−1) · Lenstra ECM — step-by-step visualisation",
            theme_toggle: "Toggle dark / light mode",
            tab_fermat: "Fermat", tab_dixon: "Dixon", tab_pollard: "Pollard", tab_ecm: "Lenstra (ECM)",
            sec_input: "1 · Input", sec_viz: "2 · Step-by-step visualisation",

            desc_fermat: "Fermat's method writes an odd number as a difference of two squares, n = a² − b² = (a − b)(a + b). It starts at a = ⌈√n⌉ and increases a until a² − n is a perfect square. It is very fast when the two factors are close to each other.",
            desc_dixon: "Dixon's random-squares method collects many congruences x² ≡ r (mod n) where r factors completely over a small factor base. Linear algebra over GF(2) then finds a subset whose product is a perfect square, giving X² ≡ Y² (mod n) and the factor gcd(X − Y, n).",
            desc_rho: "Pollard's ρ method iterates f(x) = x² + c (mod n). Modulo a prime factor p the sequence repeats after about √p steps, so with Floyd's cycle detection (x moves one step, y moves two) gcd(|x − y|, n) becomes greater than 1.",
            desc_pm1: "Pollard's p − 1 method: if p | n and p − 1 has only small prime factors, then p − 1 divides B!, and by Fermat's little theorem a^(B!) ≡ 1 (mod p). Therefore gcd(a^(B!) − 1, n) reveals p.",
            desc_ecm: "Lenstra's elliptic-curve method picks a random curve E: y² = x³ + ax + b over Z/nZ and a point P, then computes k·P where k is a product of small prime powers. If the group order modulo some prime factor p of n is B₁-smooth, a modular inversion fails and the failing gcd reveals p.",

            lbl_mode: "Pollard variant", mode_rho: "Pollard ρ (rho)", mode_pm1: "Pollard p − 1",
            lbl_n: "Number n to factor", ph_n: "e.g. 1000036000099",
            hint_n_fermat: "Enter an odd composite integer n > 10, digits only (up to about 40 digits). Works best when n = p·q with p and q close to each other.",
            hint_n_dixon: "Enter an odd composite integer n > 10 that is not a prime power. Up to ~18 digits is comfortable in a browser; bigger numbers need a larger B and much more time.",
            hint_n_rho: "Enter a composite integer n > 10 (up to ~30 digits). It finds a prime factor p in about √p steps.",
            hint_n_pm1: "Enter a composite integer n > 10. It works only if p − 1 is smooth (has only small prime factors) for some prime p dividing n.",
            hint_n_ecm: "Enter a composite integer n > 10 (30+ digits are fine). Best for numbers whose smallest prime factor has up to ~15 digits.",
            lbl_B_dixon: "Smoothness bound B",
            hint_B_dixon: "Integer B from 10 to 5000 (for example 50–300). The factor base is the set of primes ≤ B for which n is a quadratic residue. A larger B gives more relations but a bigger matrix.",
            lbl_c: "Constant c in f(x) = x² + c",
            hint_c: "Integer from 1 to n − 1 (usually 1). If the run fails, try another c (not 0 or −2).",
            lbl_x0: "Start value x₀", hint_x0: "Integer from 0 to n − 1 (usually 2).",
            lbl_a: "Base a",
            hint_a: "Integer 2 ≤ a ≤ n − 2, coprime to n (usually 2). If the run ends with gcd = n, try another base.",
            lbl_B_pm1: "Bound B",
            hint_B_pm1: "Integer B from 10 to 2 000 000 (for example 1000–100000). It succeeds when the prime powers of p − 1 are about ≤ B.",
            lbl_B1: "Stage-1 bound B₁",
            hint_B1: "Integer B₁ from 10 to 100 000 (for example 500–5000). A larger B₁ finds larger factors, but every curve takes longer.",
            lbl_curves: "Maximum number of curves",
            hint_curves: "Integer from 1 to 500 (for example 50). Every new curve is another independent chance to succeed.",

            btn_suggest: "💡 Suggest inputs", btn_run: "▶ Factorize", btn_clear: "✕ Clear",
            ctl_prev: "◀ Prev", ctl_next: "Next ▶", ctl_play: "▶ Play", ctl_pause: "⏸ Pause",
            ctl_all: "⏭ Show all", ctl_restart: "↺ Restart",
            lbl_speed: "Speed", speed_slow: "Slow", speed_normal: "Normal", speed_fast: "Fast", speed_max: "Very fast",
            progress: "Step {i} / {n}",
            empty: "Enter n (or press “Suggest inputs”) and click “Factorize”. The steps will appear here one by one.",
            status_running: "Computing…",
            err_n: "Please enter n as a positive integer (digits only).",
            err_big: "n is too large (limit: 80 digits).",
            err_param: "Parameter “{name}” must be an integer in the range {range}.",
            err_internal: "Unexpected error: {e}",
            res_title: "Result",
            res_ok: "n = {n} = {p} × {q}",
            res_prime: "n = {n} is prime, so there is nothing to factor.",
            res_fail: "No non-trivial factor was found. Read the last step for the reason and the suggested fix.",
            res_elapsed: "Computed in {ms} ms · {count} steps shown in the log.",
            footer: "Plain HTML · CSS · JavaScript (BigInt) — no libraries, no server.",

            why_iters: "iteration limit", why_time: "time limit", why_curves: "curve limit",
            prime: "(probably) prime", composite: "composite",

            pre_small: "n = {n} is too small. Enter an integer n > 3.",
            pre_even: "n = {n} is even, so 2 is a factor immediately: n = 2 × {q}.",
            pre_prime: "The Miller–Rabin test says n = {n} is (probably) prime, so it has no non-trivial factors.",
            pre_square: "n = {r}² is a perfect square, so {r} is a factor.",
            skipped: "… {n} intermediate iterations hidden (the log is shortened) …",
            found: "Non-trivial factor found: d = {d} (1 < d < n).",
            verify: "Verification: multiply the factors back together.",
            verify_prime: "{x} is {s}.",

            f_start: "Start with a₀ = ⌈√n⌉ = {a}. We look for the smallest a ≥ a₀ such that b² = a² − n is a perfect square.",
            f_iter: "Trial {k}: a = {a}",
            f_hit: "b² = {b2} = {b}² is a perfect square! Hence n = a² − b² = (a − b)(a + b).",
            f_factors: "Factors: p = a − b = {p}, q = a + b = {q}.",
            f_limit: "Search limit reached ({why}) without a perfect square. The factors of n are probably far apart — try Pollard or Lenstra instead.",

            d_start: "Factor n = {n} with smoothness bound B = {B}.",
            d_fb_small: "The factor base is too small (fewer than 2 primes). Increase B.",
            d_fb: "Factor base: {m} primes ≤ B (p = 2, or n is a quadratic residue mod p — checked with Euler's criterion).",
            d_search: "Search for relations x² ≡ r (mod n) with x = ⌊√n⌋ + 1 + k (k = 0, 1, 2, …) where r factors completely over the factor base. We need {need} relations (base size + 2).",
            d_try: "x = {x}",
            d_notsmooth: "✗ not smooth: cofactor {rem} still has a prime factor > B",
            d_rel: "Relation {i}/{need} saved: x = {x}, x² mod n = {r}",
            d_gcdx: "gcd(x, n) = {g} > 1 — a factor was found by luck.",
            d_nofind: "Only {have} of {need} relations were found within the limit ({why}). Increase B or try another n.",
            d_matrix: "Exponent matrix over GF(2): each row is a relation, each column a prime of the factor base (entry = exponent mod 2).",
            d_elim: "Gaussian elimination over GF(2): a row that becomes all-zero is a dependency — a set of relations whose product has only even exponents, i.e. a perfect square. Found {k} dependencies.",
            d_dep: "Dependency {j}: combine relations {set} → X² ≡ Y² (mod n)",
            d_trivial: "X ≡ ±Y (mod n), so gcd(X − Y, n) is 1 or n — a trivial result. Try the next dependency.",
            d_alltrivial: "All dependencies gave trivial results. Increase B or change n.",

            r_start: "Pollard ρ with f(x) = x² + {c} (mod n), x₀ = y₀ = {x0}. Each round: x ← f(x), y ← f(f(y)), d = gcd(|x − y|, n). While d = 1 we continue; 1 < d < n is a factor.",
            r_iter: "Round {i}",
            r_fail_n: "d = n: the sequences collided modulo every prime factor at the same time. Restart with another c or x₀.",
            r_limit: "Limit reached ({why}) without a factor. Try another c, or use Lenstra's method.",

            p1_start: "Pollard p − 1 with base a = {a}, bound B = {B}. In round j we replace a by a^j mod n, so after round j we hold a^(j!) mod n. Then d = gcd(a − 1, n).",
            p1_gcd0: "gcd(a, n) = {g} > 1 — a factor was found immediately.",
            p1_iter: "Round j = {j}",
            p1_fail_n: "d = n: all prime factors were captured at once. Try a different base a or a smaller B.",
            p1_limit: "Reached B = {B} without a factor. For every prime p | n, p − 1 probably has a prime factor larger than B. Increase B or use ρ / ECM.",

            e_start: "Lenstra ECM with B₁ = {B1}. Primes ≤ B₁: {count}. For each prime p we multiply the point by k = the largest power p^e ≤ B₁. All coordinates are computed modulo n; every slope needs a modular inverse.",
            e_curve: "Curve {c}: random point P = ({x}, {y}), a = {a}, b = y² − x³ − a·x mod n = {b}",
            e_disc: "Δ = 4a³ + 27b² shares a factor with n, so d = {d} is found without any further work.",
            e_iter: "p = {p}: P ← {k}·P",
            e_hit: "A modular inversion failed while computing {k}·P (p = {p}): gcd(denominator, n) = {d}. The curve's order modulo that prime factor is B₁-smooth!",
            e_curve_fail: "Curve {c} finished without a factor ({why}). Next curve.",
            e_why_none: "all inversions succeeded",
            e_why_n: "the gcd was n — all prime factors failed at once",
            e_why_inf: "reached the point at infinity",
            e_limit: "No factor was found after {c} curves ({why}). Increase B₁ or the number of curves."
        },

        uz: {
            app_title: "Butun sonlarni faktorlash kompleksi",
            app_sub: "Fermat · Dixon · Pollard (ρ va p−1) · Lenstra ECM — bosqichma-bosqich vizualizatsiya",
            theme_toggle: "Tungi / kunduzgi rejimni almashtirish",
            tab_fermat: "Fermat", tab_dixon: "Dikson", tab_pollard: "Pollard", tab_ecm: "Lenstra (ECM)",
            sec_input: "1 · Kiritish", sec_viz: "2 · Bosqichma-bosqich vizualizatsiya",

            desc_fermat: "Fermat usuli toq sonni ikki kvadrat ayirmasi ko'rinishida yozadi: n = a² − b² = (a − b)(a + b). U a = ⌈√n⌉ dan boshlanadi va a² − n to'liq kvadrat bo'lguncha a ni oshiradi. Ko'paytuvchilar bir-biriga yaqin bo'lsa, juda tez ishlaydi.",
            desc_dixon: "Dikson (tasodifiy kvadratlar) usuli x² ≡ r (mod n) taqqoslamalarini yig'adi, bunda r kichik faktor bazasi bo'yicha to'liq yoyiladi. GF(2) ustidagi chiziqli algebra ko'paytmasi to'liq kvadrat bo'ladigan qism to'plamni topadi va X² ≡ Y² (mod n) hamda gcd(X − Y, n) bo'luvchisi hosil bo'ladi.",
            desc_rho: "Pollard ρ usuli f(x) = x² + c (mod n) ketma-ketligini hosil qiladi. n ning p tub bo'luvchisi modulida ketma-ketlik taxminan √p qadamdan keyin takrorlanadi, shuning uchun Floyd sikl aniqlash usulida (x — 1 qadam, y — 2 qadam) gcd(|x − y|, n) > 1 bo'ladi.",
            desc_pm1: "Pollard p − 1 usuli: agar p | n bo'lib, p − 1 faqat kichik tub ko'paytuvchilardan iborat bo'lsa, p − 1 soni B! ni bo'ladi va Fermaning kichik teoremasiga ko'ra a^(B!) ≡ 1 (mod p). Shuning uchun gcd(a^(B!) − 1, n) p ni ochib beradi.",
            desc_ecm: "Lenstra elliptik egri chiziq usuli Z/nZ ustida tasodifiy E: y² = x³ + ax + b egri chiziq va P nuqtani tanlaydi, so'ng k·P ni hisoblaydi (k — kichik tub darajalar ko'paytmasi). Agar n ning biror p tub bo'luvchisi bo'yicha guruh tartibi B₁-silliq bo'lsa, modulli teskari element topilmaydi va gcd p ni ochib beradi.",

            lbl_mode: "Pollard varianti", mode_rho: "Pollard ρ (ro)", mode_pm1: "Pollard p − 1",
            lbl_n: "Faktorlanadigan n soni", ph_n: "masalan, 1000036000099",
            hint_n_fermat: "10 dan katta toq murakkab butun n sonini kiriting (faqat raqamlar, taxminan 40 xonagacha). n = p·q bo'lib, p va q bir-biriga yaqin bo'lsa, eng yaxshi ishlaydi.",
            hint_n_dixon: "10 dan katta, tub son darajasi bo'lmagan toq murakkab n sonini kiriting. Brauzerda taxminan 18 xonagacha qulay; kattaroq sonlar uchun B kattaroq va vaqt ancha ko'p kerak.",
            hint_n_rho: "10 dan katta murakkab butun n sonini kiriting (taxminan 30 xonagacha). p tub bo'luvchini taxminan √p qadamda topadi.",
            hint_n_pm1: "10 dan katta murakkab butun n sonini kiriting. Usul faqat n ning biror p tub bo'luvchisi uchun p − 1 silliq (faqat kichik tub ko'paytuvchilar) bo'lsa ishlaydi.",
            hint_n_ecm: "10 dan katta murakkab butun n sonini kiriting (30 va undan ortiq xonali sonlar ham mumkin). Eng kichik tub bo'luvchisi taxminan 15 xonagacha bo'lgan sonlar uchun yaxshi.",
            lbl_B_dixon: "Silliqlik chegarasi B",
            hint_B_dixon: "10 dan 5000 gacha butun B soni (masalan, 50–300). Faktor bazasi — n kvadratik chegirma bo'ladigan, B dan oshmaydigan tub sonlar. B katta bo'lsa munosabatlar ko'p topiladi, lekin matritsa kattalashadi.",
            lbl_c: "f(x) = x² + c dagi c doimiysi",
            hint_c: "1 dan n − 1 gacha butun son (odatda 1). Usul muvaffaqiyatsiz bo'lsa, boshqa c ni sinang (0 va −2 emas).",
            lbl_x0: "Boshlang'ich qiymat x₀", hint_x0: "0 dan n − 1 gacha butun son (odatda 2).",
            lbl_a: "Asos a",
            hint_a: "2 ≤ a ≤ n − 2 oralig'idagi, n bilan o'zaro tub butun son (odatda 2). Natija gcd = n bo'lsa, boshqa asosni sinang.",
            lbl_B_pm1: "Chegara B",
            hint_B_pm1: "10 dan 2 000 000 gacha butun B soni (masalan, 1000–100000). p − 1 dagi tub darajalar taxminan B dan oshmasa, usul muvaffaqiyatli bo'ladi.",
            lbl_B1: "1-bosqich chegarasi B₁",
            hint_B1: "10 dan 100 000 gacha butun B₁ soni (masalan, 500–5000). B₁ katta bo'lsa, kattaroq bo'luvchilar topiladi, lekin har bir egri chiziq uchun vaqt ko'proq ketadi.",
            lbl_curves: "Egri chiziqlarning maksimal soni",
            hint_curves: "1 dan 500 gacha butun son (masalan, 50). Har bir yangi egri chiziq — yana bir mustaqil imkoniyat.",

            btn_suggest: "💡 Misol taklif qilish", btn_run: "▶ Faktorlash", btn_clear: "✕ Tozalash",
            ctl_prev: "◀ Orqaga", ctl_next: "Keyingi ▶", ctl_play: "▶ Avto", ctl_pause: "⏸ To'xtatish",
            ctl_all: "⏭ Hammasini ko'rsatish", ctl_restart: "↺ Qayta boshlash",
            lbl_speed: "Tezlik", speed_slow: "Sekin", speed_normal: "O'rtacha", speed_fast: "Tez", speed_max: "Juda tez",
            progress: "{i} / {n}-qadam",
            empty: "n ni kiriting (yoki “Misol taklif qilish” tugmasini bosing) va “Faktorlash” ni bosing. Qadamlar shu yerda birma-bir paydo bo'ladi.",
            status_running: "Hisoblanmoqda…",
            err_n: "n ni musbat butun son sifatida kiriting (faqat raqamlar).",
            err_big: "n juda katta (chegara: 80 xona).",
            err_param: "“{name}” parametri {range} oralig'idagi butun son bo'lishi kerak.",
            err_internal: "Kutilmagan xatolik: {e}",
            res_title: "Natija",
            res_ok: "n = {n} = {p} × {q}",
            res_prime: "n = {n} tub son, shuning uchun uni faktorlab bo'lmaydi.",
            res_fail: "Nolik bo'lmagan bo'luvchi topilmadi. Sababi va tavsiyani oxirgi qadamdan o'qing.",
            res_elapsed: "{ms} ms da hisoblandi · jurnalda {count} ta qadam.",
            footer: "Oddiy HTML · CSS · JavaScript (BigInt) — kutubxonalarsiz, serversiz.",

            why_iters: "iteratsiyalar chegarasi", why_time: "vaqt chegarasi", why_curves: "egri chiziqlar chegarasi",
            prime: "(ehtimol) tub son", composite: "murakkab son",

            pre_small: "n = {n} juda kichik. n > 3 bo'lgan butun son kiriting.",
            pre_even: "n = {n} juft son, demak 2 darhol bo'luvchi: n = 2 × {q}.",
            pre_prime: "Miller–Rabin testi n = {n} ni (ehtimol) tub son deb topdi, demak uning nolik bo'lmagan bo'luvchilari yo'q.",
            pre_square: "n = {r}² to'liq kvadrat, demak {r} bo'luvchi.",
            skipped: "… {n} ta oraliq iteratsiya yashirildi (jurnal qisqartirildi) …",
            found: "Nolik bo'lmagan bo'luvchi topildi: d = {d} (1 < d < n).",
            verify: "Tekshirish: ko'paytuvchilarni qayta ko'paytiramiz.",
            verify_prime: "{x} — {s}.",

            f_start: "a₀ = ⌈√n⌉ = {a} dan boshlaymiz. b² = a² − n to'liq kvadrat bo'ladigan eng kichik a ≥ a₀ ni qidiramiz.",
            f_iter: "{k}-urinish: a = {a}",
            f_hit: "b² = {b2} = {b}² to'liq kvadrat! Demak, n = a² − b² = (a − b)(a + b).",
            f_factors: "Ko'paytuvchilar: p = a − b = {p}, q = a + b = {q}.",
            f_limit: "Qidiruv chegarasiga ({why}) yetildi, to'liq kvadrat topilmadi. n ning ko'paytuvchilari bir-biridan uzoq bo'lsa kerak — Pollard yoki Lenstra usulini sinang.",

            d_start: "n = {n} sonini B = {B} silliqlik chegarasi bilan faktorlaymiz.",
            d_fb_small: "Faktor bazasi juda kichik (2 tadan kam tub son). B ni oshiring.",
            d_fb: "Faktor bazasi: B dan oshmaydigan {m} ta tub son (p = 2 yoki n soni p modulida kvadratik chegirma — Eyler mezoni bilan tekshirilgan).",
            d_search: "x = ⌊√n⌋ + 1 + k (k = 0, 1, 2, …) uchun x² ≡ r (mod n) munosabatlarini qidiramiz, bunda r faktor bazasi bo'yicha to'liq yoyilishi kerak. Bizga {need} ta munosabat kerak (baza hajmi + 2).",
            d_try: "x = {x}",
            d_notsmooth: "✗ silliq emas: {rem} ko'paytuvchida B dan katta tub bo'luvchi qoldi",
            d_rel: "{i}/{need}-munosabat saqlandi: x = {x}, x² mod n = {r}",
            d_gcdx: "gcd(x, n) = {g} > 1 — bo'luvchi tasodifan topildi.",
            d_nofind: "Chegara ({why}) ichida {need} tadan faqat {have} ta munosabat topildi. B ni oshiring yoki boshqa n ni sinang.",
            d_matrix: "GF(2) ustidagi daraja matritsasi: har bir satr — munosabat, har bir ustun — faktor bazasidagi tub son (qiymat = daraja mod 2).",
            d_elim: "GF(2) ustida Gauss usuli: nolga aylangan satr — bog'liqlik, ya'ni ko'paytmasida barcha darajalar juft (to'liq kvadrat) bo'lgan munosabatlar to'plami. {k} ta bog'liqlik topildi.",
            d_dep: "{j}-bog'liqlik: {set} munosabatlarni birlashtiramiz → X² ≡ Y² (mod n)",
            d_trivial: "X ≡ ±Y (mod n), shuning uchun gcd(X − Y, n) 1 yoki n — ahamiyatsiz natija. Keyingi bog'liqlikni sinaymiz.",
            d_alltrivial: "Barcha bog'liqliklar ahamiyatsiz natija berdi. B ni oshiring yoki n ni o'zgartiring.",

            r_start: "Pollard ρ: f(x) = x² + {c} (mod n), x₀ = y₀ = {x0}. Har bir raundda: x ← f(x), y ← f(f(y)), d = gcd(|x − y|, n). d = 1 bo'lsa davom etamiz; 1 < d < n bo'lsa — bo'luvchi topildi.",
            r_iter: "{i}-raund",
            r_fail_n: "d = n: ketma-ketliklar n ning barcha tub bo'luvchilari bo'yicha bir vaqtda to'qnashdi. Boshqa c yoki x₀ bilan qayta boshlang.",
            r_limit: "Chegaraga ({why}) yetildi, bo'luvchi topilmadi. Boshqa c ni sinang yoki Lenstra usulidan foydalaning.",

            p1_start: "Pollard p − 1: asos a = {a}, chegara B = {B}. j-raundda a ni a^j mod n bilan almashtiramiz, shuning uchun j-raunddan keyin a^(j!) mod n ga ega bo'lamiz. So'ng d = gcd(a − 1, n).",
            p1_gcd0: "gcd(a, n) = {g} > 1 — bo'luvchi darhol topildi.",
            p1_iter: "j = {j} raund",
            p1_fail_n: "d = n: barcha tub bo'luvchilar bir vaqtda ushlandi. Boshqa a asosni yoki kichikroq B ni sinang.",
            p1_limit: "B = {B} ga yetildi, bo'luvchi topilmadi. n ning har bir p tub bo'luvchisi uchun p − 1 da B dan katta tub ko'paytuvchi bor ko'rinadi. B ni oshiring yoki ρ / ECM usulidan foydalaning.",

            e_start: "Lenstra ECM: B₁ = {B1}. B₁ gacha tub sonlar: {count} ta. Har bir p tub son uchun nuqtani k = p^e ≤ B₁ bo'lgan eng katta daraja bilan ko'paytiramiz. Barcha koordinatalar n modulida hisoblanadi; har bir qiyalik uchun modulli teskari element kerak.",
            e_curve: "{c}-egri chiziq: tasodifiy P = ({x}, {y}) nuqta, a = {a}, b = y² − x³ − a·x mod n = {b}",
            e_disc: "Δ = 4a³ + 27b² soni n bilan umumiy bo'luvchiga ega, shuning uchun d = {d} qo'shimcha hisoblarsiz topildi.",
            e_iter: "p = {p}: P ← {k}·P",
            e_hit: "{k}·P (p = {p}) hisoblashda modulli teskari element topilmadi: gcd(maxraj, n) = {d}. Egri chiziq tartibi shu tub bo'luvchi bo'yicha B₁-silliq!",
            e_curve_fail: "{c}-egri chiziq bo'luvchisiz tugadi ({why}). Keyingi egri chiziq.",
            e_why_none: "barcha teskari elementlar topildi",
            e_why_n: "gcd = n — barcha tub bo'luvchilar bir vaqtda ishlamadi",
            e_why_inf: "cheksiz uzoq nuqtaga yetildi",
            e_limit: "{c} ta egri chiziqdan keyin ham bo'luvchi topilmadi ({why}). B₁ yoki egri chiziqlar sonini oshiring."
        }
    };

    let lang = 'en';

    function t(key, params) {
        const table = DICT[lang] || DICT.en;
        let s = table[key];
        if (s === undefined) s = DICT.en[key];
        if (s === undefined) return key;
        if (params) {
            s = s.replace(/\{(\w+)\}/g, (m, k) => {
                if (!(k in params)) return m;
                const v = params[k];
                if (typeof v === 'string' && v.charAt(0) === '@') return t(v.slice(1));
                return String(v);
            });
        }
        return s;
    }

    F.i18n = {
        t,
        setLang(l) { if (DICT[l]) lang = l; },
        getLang() { return lang; }
    };
})();