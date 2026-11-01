/* i18n.js — English / Uzbek texts. "{name}" = placeholder; params starting with "@" are translated keys. */
(function () {
    'use strict';
    const F = (window.Fact = window.Fact || {});

    const DICT = {
        en: {
            app_title: "Integer Factorization Suite",
            app_sub: "Fermat · Dixon · Pollard ρ · Lenstra ECM — complete prime factorization with a step-by-step log",
            theme_toggle: "Toggle dark / light mode",
            tab_fermat: "Fermat", tab_dixon: "Dixon", tab_pollard: "Pollard ρ", tab_ecm: "Lenstra (ECM)",
            view_task: "📋 Task", view_log: "📜 Step log", back_task: "← Back to task",
            sec_input: "Input",

            desc_fermat: "Fermat's method writes an odd number as a difference of two squares, n = a² − b² = (a − b)(a + b). It starts at a = ⌈√n⌉ and increases a until a² − n is a perfect square. Each split is repeated on both parts until only primes remain.",
            desc_dixon: "Dixon's random-squares method collects congruences x² ≡ r (mod n) where r factors completely over a small factor base. Linear algebra over GF(2) finds a subset whose product is a perfect square, giving X² ≡ Y² (mod n) and the factor gcd(X − Y, n). Each split is repeated on both parts until only primes remain.",
            desc_rho: "Pollard's ρ method iterates f(x) = x² + c (mod n). Modulo a prime factor p the sequence repeats after about √p steps, so with Floyd's cycle detection (x moves one step, y moves two) gcd(|x − y|, n) becomes greater than 1. Each split is repeated on both parts until only primes remain.",
            desc_ecm: "Lenstra's elliptic-curve method picks a random curve E: y² = x³ + ax + b over Z/nZ and a point P, then computes k·P where k is a product of small prime powers. If the group order modulo some prime factor p of n is B₁-smooth, a modular inversion fails and the failing gcd reveals p. Each split is repeated on both parts until only primes remain.",

            lbl_n: "Number n to factor", ph_n: "e.g. 175",
            hint_n_fermat: "Enter any integer n ≥ 2 (digits only, up to 80 digits). The program finds the complete prime factorization. Fermat is fast when two factors are close to each other; very unbalanced factors can be slow.",
            hint_n_dixon: "Enter any integer n ≥ 2 (digits only). Comfortable up to ~18 digits in a browser; bigger numbers need a larger B and much more time.",
            hint_n_rho: "Enter any integer n ≥ 2 (digits only; up to ~30 digits is comfortable). It finds each prime factor p in about √p steps.",
            hint_n_ecm: "Enter any integer n ≥ 2 (30+ digits are fine). Best when the smallest prime factors have up to ~15 digits.",
            lbl_B_dixon: "Smoothness bound B",
            hint_B_dixon: "Integer B from 10 to 5000 (for example 50–300). The factor base is the set of primes ≤ B for which n is a quadratic residue. A larger B gives more relations but a bigger matrix.",
            lbl_c: "Constant c in f(x) = x² + c",
            hint_c: "Integer from 1 to n − 1 (usually 1). If a run gets d = n, the program automatically tries c + 1, c + 2, …",
            lbl_x0: "Start value x₀", hint_x0: "Integer from 0 to n − 1 (usually 2).",
            lbl_B1: "Stage-1 bound B₁",
            hint_B1: "Integer B₁ from 10 to 100 000 (for example 500–5000). A larger B₁ finds larger factors, but every curve takes longer.",
            lbl_curves: "Maximum number of curves (per split)",
            hint_curves: "Integer from 1 to 500 (for example 50). Every new curve is another independent chance to succeed.",

            btn_suggest: "💡 Suggest inputs", btn_run: "▶ Factorize", btn_clear: "✕ Clear",
            ctl_prev: "◀ Prev", ctl_next: "Next ▶", ctl_play: "▶ Play", ctl_pause: "⏸ Pause",
            ctl_all: "⏭ Show all", ctl_restart: "↺ Restart",
            collapse_all: "Collapse all", expand_all: "Expand all", to_top: "Back to top",
            lbl_speed: "Speed", speed_slow: "Slow", speed_normal: "Normal", speed_fast: "Fast", speed_max: "Very fast",
            progress: "Step {i} / {n}",
            empty: "Run a factorization first. The steps will appear here.",
            status_running: "Computing…",
            err_n: "Please enter n as an integer ≥ 2 (digits only).",
            err_big: "n is too large (limit: 80 digits).",
            err_param: "Parameter “{name}” must be an integer in the range {range}.",
            err_internal: "Unexpected error: {e}",

            res_title: "Result",
            res_prime: "n = {n} is prime, so there is nothing to factor.",
            res_incomplete: "Some factors are composite and could not be split with this algorithm (shown in [brackets]). Try other parameters or another algorithm.",
            res_col_prime: "Prime factor", res_col_exp: "Exponent", res_col_check: "Check",
            res_stats: "{digits} digits · {steps} log steps · {ms} ms · {algo}",
            res_open_log: "Open step-by-step log →",
            log_for: "{algo} · n = {n}",
            footer: "Plain HTML · CSS · JavaScript (BigInt) — no libraries, no server.",

            why_iters: "iteration limit", why_time: "time limit", why_curves: "curve limit",
            prime: "(probably) prime", composite: "composite",

            pre_small: "n = {n} is too small to factor. Enter an integer n ≥ 2.",
            pre_prime: "The Miller–Rabin test says n = {n} is (probably) prime, so it has no non-trivial factors.",
            skipped: "… {n} intermediate iterations hidden (the log is shortened) …",
            found: "Non-trivial factor found: d = {d} (1 < d < n).",
            verify_prime: "{x} is {s}.",

            g_factor: "Factoring {n}",
            g_even: "{n} is even: first divide out the factors of 2 (these algorithms work on odd numbers): n = 2^{v} × {r}.",
            g_power: "{n} = {r}^{k} is a perfect power (an algorithm cannot split a prime power directly), so we factor the base {r} and repeat its factors {k} times.",
            g_split: "Split found: {n} = {a} × {b}",
            g_part_prime: "{x} is (probably) prime ✓ — done",
            g_part_comp: "{x} is composite → factor it further",
            g_stuck: "The algorithm could not split {n}. It stays as a composite factor — try other parameters or another algorithm.",
            g_final: "Final result and verification",
            g_result: "Complete factorization: {expr}",
            g_result_partial: "Partial factorization: {expr}  (numbers in [brackets] are composite and could not be split)",
            g_verify: "Multiply everything back together:",
            g_verify_primes: "Miller–Rabin check of every prime factor:",

            f_start: "Fermat on n = {n}: start with a₀ = ⌈√n⌉ = {a}. We look for the smallest a ≥ a₀ such that b² = a² − n is a perfect square.",
            f_iter: "Trial {k}: a = {a}",
            f_hit: "b² = {b2} = {b}² is a perfect square! Hence n = a² − b² = (a − b)(a + b).",
            f_factors: "Factors: p = a − b = {p}, q = a + b = {q}.",
            f_limit: "Search limit reached ({why}) without a perfect square. The factors of n are probably far apart — try Pollard or Lenstra instead.",

            d_start: "Dixon on n = {n} with smoothness bound B = {B}.",
            d_fb_extend: "Fewer than 2 primes in the factor base — increasing B to {B}.",
            d_fb_small: "The factor base is too small (fewer than 2 primes). Increase B.",
            d_excluded: "Primes that divide n ({list}) cannot be in the factor base, so they are skipped. (If one of them divides some x, gcd(x, n) will reveal it.)",
            d_fb: "Factor base: {m} primes ≤ B (p = 2, or n is a quadratic residue mod p — checked with Euler's criterion).",
            d_search: "Search for relations x² ≡ r (mod n) with x = ⌊√n⌋ + 1 + k (k = 0, 1, 2, …) where r factors completely over the factor base. We need {need} relations (base size + 2).",
            d_try: "x = {x}",
            d_notsmooth: "✗ not smooth: cofactor {rem} still has a prime factor > B",
            d_rel: "Relation {i}/{need} saved: x = {x}, x² mod n = {r}",
            d_gcdx: "x = {x}: gcd(x, n) = {g} > 1 — a factor was found directly.",
            d_nofind: "Only {have} of {need} relations were found within the limit ({why}). Increase B or try another n.",
            d_matrix: "Exponent matrix over GF(2): each row is a relation, each column a prime of the factor base (entry = exponent mod 2).",
            d_elim: "Gaussian elimination over GF(2): a row that becomes all-zero is a dependency — a set of relations whose product has only even exponents, i.e. a perfect square. Found {k} dependencies.",
            d_dep: "Dependency {j}: combine relations {set} → X² ≡ Y² (mod n)",
            d_trivial: "X ≡ ±Y (mod n), so gcd(X − Y, n) is 1 or n — a trivial result. Try the next dependency.",
            d_more: "All dependencies were trivial. Collecting more relations ({need} in total) and trying again.",
            d_alltrivial: "All dependencies gave trivial results, even after collecting more relations. Increase B or use another algorithm.",

            r_start: "Pollard ρ on n = {n}: f(x) = x² + {c} (mod n), x₀ = y₀ = {x0}. Each round: x ← f(x), y ← f(f(y)), d = gcd(|x − y|, n). While d = 1 we continue; 1 < d < n is a factor.",
            r_iter: "Round {i}",
            r_fail_n: "d = n: the sequences collided modulo every prime factor at the same time. Trying the next constant c.",
            r_limit: "Limit reached ({why}) without a factor. Try another c, or use Lenstra's method.",
            r_giveup: "Every tried constant c gave d = n. Try other parameters or another algorithm.",

            e_start: "Lenstra ECM on n = {n} with B₁ = {B1}. Primes ≤ B₁: {count}. For each prime p we multiply the point by k = the largest power p^e ≤ B₁. All coordinates are computed modulo n; every slope needs a modular inverse.",
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
            app_sub: "Fermat · Dikson · Pollard ρ · Lenstra ECM — qadamlar jurnali bilan to'liq tub ko'paytuvchilarga ajratish",
            theme_toggle: "Tungi / kunduzgi rejimni almashtirish",
            tab_fermat: "Fermat", tab_dixon: "Dikson", tab_pollard: "Pollard ρ", tab_ecm: "Lenstra (ECM)",
            view_task: "📋 Topshiriq", view_log: "📜 Qadamlar jurnali", back_task: "← Topshiriqqa qaytish",
            sec_input: "Kiritish",

            desc_fermat: "Fermat usuli toq sonni ikki kvadrat ayirmasi ko'rinishida yozadi: n = a² − b² = (a − b)(a + b). U a = ⌈√n⌉ dan boshlanadi va a² − n to'liq kvadrat bo'lguncha a ni oshiradi. Har bir ajratish ikkala qismga qayta qo'llanadi, to faqat tub sonlar qolguncha.",
            desc_dixon: "Dikson (tasodifiy kvadratlar) usuli x² ≡ r (mod n) taqqoslamalarini yig'adi, bunda r kichik faktor bazasi bo'yicha to'liq yoyiladi. GF(2) ustidagi chiziqli algebra ko'paytmasi to'liq kvadrat bo'ladigan qism to'plamni topadi va X² ≡ Y² (mod n) hamda gcd(X − Y, n) bo'luvchisi hosil bo'ladi. Har bir ajratish ikkala qismga qayta qo'llanadi, to faqat tub sonlar qolguncha.",
            desc_rho: "Pollard ρ usuli f(x) = x² + c (mod n) ketma-ketligini hosil qiladi. n ning p tub bo'luvchisi modulida ketma-ketlik taxminan √p qadamdan keyin takrorlanadi, shuning uchun Floyd sikl aniqlash usulida (x — 1 qadam, y — 2 qadam) gcd(|x − y|, n) > 1 bo'ladi. Har bir ajratish ikkala qismga qayta qo'llanadi, to faqat tub sonlar qolguncha.",
            desc_ecm: "Lenstra elliptik egri chiziq usuli Z/nZ ustida tasodifiy E: y² = x³ + ax + b egri chiziq va P nuqtani tanlaydi, so'ng k·P ni hisoblaydi (k — kichik tub darajalar ko'paytmasi). Agar n ning biror p tub bo'luvchisi bo'yicha guruh tartibi B₁-silliq bo'lsa, modulli teskari element topilmaydi va gcd p ni ochib beradi. Har bir ajratish ikkala qismga qayta qo'llanadi, to faqat tub sonlar qolguncha.",

            lbl_n: "Faktorlanadigan n soni", ph_n: "masalan, 175",
            hint_n_fermat: "Istalgan n ≥ 2 butun sonini kiriting (faqat raqamlar, 80 xonagacha). Dastur to'liq tub ko'paytuvchilarga ajratishni topadi. Fermat usuli ikki ko'paytuvchi bir-biriga yaqin bo'lsa tez ishlaydi; juda farqli ko'paytuvchilarda sekin bo'lishi mumkin.",
            hint_n_dixon: "Istalgan n ≥ 2 butun sonini kiriting (faqat raqamlar). Brauzerda taxminan 18 xonagacha qulay; kattaroq sonlar uchun B kattaroq va vaqt ancha ko'p kerak.",
            hint_n_rho: "Istalgan n ≥ 2 butun sonini kiriting (faqat raqamlar; taxminan 30 xonagacha qulay). Har bir p tub bo'luvchini taxminan √p qadamda topadi.",
            hint_n_ecm: "Istalgan n ≥ 2 butun sonini kiriting (30 va undan ortiq xonali sonlar ham mumkin). Eng kichik tub bo'luvchilari taxminan 15 xonagacha bo'lsa, eng yaxshi ishlaydi.",
            lbl_B_dixon: "Silliqlik chegarasi B",
            hint_B_dixon: "10 dan 5000 gacha butun B soni (masalan, 50–300). Faktor bazasi — n kvadratik chegirma bo'ladigan, B dan oshmaydigan tub sonlar. B katta bo'lsa munosabatlar ko'p topiladi, lekin matritsa kattalashadi.",
            lbl_c: "f(x) = x² + c dagi c doimiysi",
            hint_c: "1 dan n − 1 gacha butun son (odatda 1). Agar natija d = n bo'lsa, dastur avtomatik ravishda c + 1, c + 2, … ni sinaydi.",
            lbl_x0: "Boshlang'ich qiymat x₀", hint_x0: "0 dan n − 1 gacha butun son (odatda 2).",
            lbl_B1: "1-bosqich chegarasi B₁",
            hint_B1: "10 dan 100 000 gacha butun B₁ soni (masalan, 500–5000). B₁ katta bo'lsa, kattaroq bo'luvchilar topiladi, lekin har bir egri chiziq uchun vaqt ko'proq ketadi.",
            lbl_curves: "Egri chiziqlarning maksimal soni (har bir ajratish uchun)",
            hint_curves: "1 dan 500 gacha butun son (masalan, 50). Har bir yangi egri chiziq — yana bir mustaqil imkoniyat.",

            btn_suggest: "💡 Misol taklif qilish", btn_run: "▶ Faktorlash", btn_clear: "✕ Tozalash",
            ctl_prev: "◀ Orqaga", ctl_next: "Keyingi ▶", ctl_play: "▶ Avto", ctl_pause: "⏸ To'xtatish",
            ctl_all: "⏭ Hammasini ko'rsatish", ctl_restart: "↺ Qayta boshlash",
            collapse_all: "Hammasini yig'ish", expand_all: "Hammasini yoyish", to_top: "Yuqoriga",
            lbl_speed: "Tezlik", speed_slow: "Sekin", speed_normal: "O'rtacha", speed_fast: "Tez", speed_max: "Juda tez",
            progress: "{i} / {n}-qadam",
            empty: "Avval faktorlashni ishga tushiring. Qadamlar shu yerda paydo bo'ladi.",
            status_running: "Hisoblanmoqda…",
            err_n: "n ni butun son sifatida kiriting (n ≥ 2, faqat raqamlar).",
            err_big: "n juda katta (chegara: 80 xona).",
            err_param: "“{name}” parametri {range} oralig'idagi butun son bo'lishi kerak.",
            err_internal: "Kutilmagan xatolik: {e}",

            res_title: "Natija",
            res_prime: "n = {n} tub son, shuning uchun uni faktorlab bo'lmaydi.",
            res_incomplete: "Ba'zi ko'paytuvchilar murakkab bo'lib qoldi va bu algoritm bilan ajratilmadi ([qavs] ichida). Boshqa parametrlarni yoki boshqa algoritmni sinab ko'ring.",
            res_col_prime: "Tub ko'paytuvchi", res_col_exp: "Daraja", res_col_check: "Tekshiruv",
            res_stats: "{digits} xonali son · jurnalda {steps} qadam · {ms} ms · {algo}",
            res_open_log: "Qadamlar jurnalini ochish →",
            log_for: "{algo} · n = {n}",
            footer: "Oddiy HTML · CSS · JavaScript (BigInt) — kutubxonalarsiz, serversiz.",

            why_iters: "iteratsiyalar chegarasi", why_time: "vaqt chegarasi", why_curves: "egri chiziqlar chegarasi",
            prime: "(ehtimol) tub son", composite: "murakkab son",

            pre_small: "n = {n} faktorlash uchun juda kichik. n ≥ 2 butun son kiriting.",
            pre_prime: "Miller–Rabin testi n = {n} ni (ehtimol) tub son deb topdi, demak uning nolik bo'lmagan bo'luvchilari yo'q.",
            skipped: "… {n} ta oraliq iteratsiya yashirildi (jurnal qisqartirildi) …",
            found: "Nolik bo'lmagan bo'luvchi topildi: d = {d} (1 < d < n).",
            verify_prime: "{x} — {s}.",

            g_factor: "{n} ni faktorlaymiz",
            g_even: "{n} juft son: avval 2 ko'paytuvchilarini ajratamiz (bu algoritmlar toq sonlar ustida ishlaydi): n = 2^{v} × {r}.",
            g_power: "{n} = {r}^{k} to'liq daraja (algoritm tub son darajasini to'g'ridan-to'g'ri ajrata olmaydi), shuning uchun {r} asosni faktorlab, uning ko'paytuvchilarini {k} marta takrorlaymiz.",
            g_split: "Ajratish topildi: {n} = {a} × {b}",
            g_part_prime: "{x} (ehtimol) tub son ✓ — tayyor",
            g_part_comp: "{x} murakkab son → uni yana faktorlaymiz",
            g_stuck: "Algoritm {n} ni ajrata olmadi. U murakkab ko'paytuvchi bo'lib qoladi — boshqa parametrlarni yoki boshqa algoritmni sinab ko'ring.",
            g_final: "Yakuniy natija va tekshiruv",
            g_result: "To'liq faktorlash: {expr}",
            g_result_partial: "Qisman faktorlash: {expr}  ([qavs] ichidagi sonlar murakkab, ajratib bo'lmadi)",
            g_verify: "Hammasini qayta ko'paytiramiz:",
            g_verify_primes: "Har bir tub ko'paytuvchini Miller–Rabin testi bilan tekshiramiz:",

            f_start: "Fermat, n = {n}: a₀ = ⌈√n⌉ = {a} dan boshlaymiz. b² = a² − n to'liq kvadrat bo'ladigan eng kichik a ≥ a₀ ni qidiramiz.",
            f_iter: "{k}-urinish: a = {a}",
            f_hit: "b² = {b2} = {b}² to'liq kvadrat! Demak, n = a² − b² = (a − b)(a + b).",
            f_factors: "Ko'paytuvchilar: p = a − b = {p}, q = a + b = {q}.",
            f_limit: "Qidiruv chegarasiga ({why}) yetildi, to'liq kvadrat topilmadi. n ning ko'paytuvchilari bir-biridan uzoq bo'lsa kerak — Pollard yoki Lenstra usulini sinab ko'ring.",

            d_start: "Dikson, n = {n}, silliqlik chegarasi B = {B}.",
            d_fb_extend: "Faktor bazasida 2 tadan kam tub son bor — B ni {B} gacha oshiramiz.",
            d_fb_small: "Faktor bazasi juda kichik (2 tadan kam tub son). B ni oshiring.",
            d_excluded: "n ni bo'luvchi tub sonlar ({list}) faktor bazasiga kira olmaydi, shuning uchun o'tkazib yuboriladi. (Ulardan biri biror x ni bo'lsa, gcd(x, n) uni ochib beradi.)",
            d_fb: "Faktor bazasi: B dan oshmaydigan {m} ta tub son (p = 2 yoki n soni p modulida kvadratik chegirma — Eyler mezoni bilan tekshirilgan).",
            d_search: "x = ⌊√n⌋ + 1 + k (k = 0, 1, 2, …) uchun x² ≡ r (mod n) munosabatlarini qidiramiz, bunda r faktor bazasi bo'yicha to'liq yoyilishi kerak. Bizga {need} ta munosabat kerak (baza hajmi + 2).",
            d_try: "x = {x}",
            d_notsmooth: "✗ silliq emas: {rem} ko'paytuvchida B dan katta tub bo'luvchi qoldi",
            d_rel: "{i}/{need}-munosabat saqlandi: x = {x}, x² mod n = {r}",
            d_gcdx: "x = {x}: gcd(x, n) = {g} > 1 — bo'luvchi bevosita topildi.",
            d_nofind: "Chegara ({why}) ichida {need} tadan faqat {have} ta munosabat topildi. B ni oshiring yoki boshqa n ni sinang.",
            d_matrix: "GF(2) ustidagi daraja matritsasi: har bir satr — munosabat, har bir ustun — faktor bazasidagi tub son (qiymat = daraja mod 2).",
            d_elim: "GF(2) ustida Gauss usuli: nolga aylangan satr — bog'liqlik, ya'ni ko'paytmasida barcha darajalar juft (to'liq kvadrat) bo'lgan munosabatlar to'plami. {k} ta bog'liqlik topildi.",
            d_dep: "{j}-bog'liqlik: {set} munosabatlarni birlashtiramiz → X² ≡ Y² (mod n)",
            d_trivial: "X ≡ ±Y (mod n), shuning uchun gcd(X − Y, n) 1 yoki n — ahamiyatsiz natija. Keyingi bog'liqlikni sinaymiz.",
            d_more: "Barcha bog'liqliklar ahamiyatsiz bo'ldi. Ko'proq munosabat yig'amiz (jami {need} ta) va qayta urinamiz.",
            d_alltrivial: "Ko'proq munosabat yig'ilgandan keyin ham barcha bog'liqliklar ahamiyatsiz natija berdi. B ni oshiring yoki boshqa algoritmdan foydalaning.",

            r_start: "Pollard ρ, n = {n}: f(x) = x² + {c} (mod n), x₀ = y₀ = {x0}. Har bir raundda: x ← f(x), y ← f(f(y)), d = gcd(|x − y|, n). d = 1 bo'lsa davom etamiz; 1 < d < n bo'lsa — bo'luvchi topildi.",
            r_iter: "{i}-raund",
            r_fail_n: "d = n: ketma-ketliklar n ning barcha tub bo'luvchilari bo'yicha bir vaqtda to'qnashdi. Keyingi c doimiysini sinaymiz.",
            r_limit: "Chegaraga ({why}) yetildi, bo'luvchi topilmadi. Boshqa c ni sinang yoki Lenstra usulidan foydalaning.",
            r_giveup: "Sinab ko'rilgan barcha c doimiylarida d = n chiqdi. Boshqa parametrlarni yoki boshqa algoritmni sinab ko'ring.",

            e_start: "Lenstra ECM, n = {n}, B₁ = {B1}. B₁ gacha tub sonlar: {count} ta. Har bir p tub son uchun nuqtani k = p^e ≤ B₁ bo'lgan eng katta daraja bilan ko'paytiramiz. Barcha koordinatalar n modulida hisoblanadi; har bir qiyalik uchun modulli teskari element kerak.",
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