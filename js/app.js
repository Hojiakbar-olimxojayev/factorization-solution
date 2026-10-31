/* app.js — UI: tabs, inputs, stepper, theme, language */
(function () {
    'use strict';
    const F = window.Fact, U = F.utils, I = F.i18n, t = I.t;
    const $ = (s, r) => (r || document).querySelector(s);
    const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

    /* ---------- algorithm configuration ---------- */
    const ALGOS = {
        fermat: { run: F.fermat, desc: 'desc_fermat', hintN: 'hint_n_fermat', fields: [] },
        dixon: {
            run: F.dixon, desc: 'desc_dixon', hintN: 'hint_n_dixon',
            fields: [{ id: 'B', lbl: 'lbl_B_dixon', hint: 'hint_B_dixon', def: '100', min: () => 10n, max: () => 5000n }]
        },
        rho: {
            run: F.rho, desc: 'desc_rho', hintN: 'hint_n_rho',
            fields: [
                { id: 'c', lbl: 'lbl_c', hint: 'hint_c', def: '1', min: () => 1n, max: (n) => n - 1n },
                { id: 'x0', lbl: 'lbl_x0', hint: 'hint_x0', def: '2', min: () => 0n, max: (n) => n - 1n }
            ]
        },
        pm1: {
            run: F.pm1, desc: 'desc_pm1', hintN: 'hint_n_pm1',
            fields: [
                { id: 'a', lbl: 'lbl_a', hint: 'hint_a', def: '2', min: () => 2n, max: (n) => n - 2n },
                { id: 'B', lbl: 'lbl_B_pm1', hint: 'hint_B_pm1', def: '1000', min: () => 10n, max: () => 2000000n }
            ]
        },
        ecm: {
            run: F.ecm, desc: 'desc_ecm', hintN: 'hint_n_ecm',
            fields: [
                { id: 'B1', lbl: 'lbl_B1', hint: 'hint_B1', def: '1000', min: () => 10n, max: () => 100000n },
                { id: 'curves', lbl: 'lbl_curves', hint: 'hint_curves', def: '50', min: () => 1n, max: () => 500n }
            ]
        }
    };

    const state = { algo: 'fermat', mode: 'rho', steps: [], shown: 0, res: null, timer: null, msg: null };

    const key = () => (state.algo === 'pollard' ? state.mode : state.algo);
    const cfg = () => ALGOS[key()];

    /* ---------- i18n ---------- */
    function applyI18n() {
        document.documentElement.lang = I.getLang();
        $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
        $$('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
        $$('[data-i18n-title]').forEach((el) => {
            el.title = t(el.dataset.i18nTitle);
            el.setAttribute('aria-label', el.title);
        });
        $('#algoDesc').textContent = t(cfg().desc);
        $('#nHint').textContent = t(cfg().hintN);
        document.title = t('app_title');
        updatePlayBtn();
        renderMsg();
        renderAll();
        renderResult();
        updateProgress();
    }

    /* ---------- messages ---------- */
    function setMsg(k, params, type) { state.msg = k ? { k, params: params || {}, type: type || 'err' } : null; renderMsg(); }
    function renderMsg() {
        const el = $('#msg');
        if (!state.msg) { el.textContent = ''; el.className = 'msg'; return; }
        el.textContent = t(state.msg.k, state.msg.params);
        el.className = 'msg ' + state.msg.type;
    }

    /* ---------- theme ---------- */
    function setTheme(th) {
        document.documentElement.dataset.theme = th;
        $('#themeBtn').textContent = th === 'dark' ? '☀️' : '🌙';
        try { localStorage.setItem('fact-theme', th); } catch (e) { /* ignore */ }
    }
    function initTheme() {
        let th = null;
        try { th = localStorage.getItem('fact-theme'); } catch (e) { /* ignore */ }
        if (!th) th = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setTheme(th);
    }

    /* ---------- language ---------- */
    function setLang(l) {
        I.setLang(l);
        $$('.seg-btn').forEach((b) => b.classList.toggle('active', b.dataset.lang === l));
        try { localStorage.setItem('fact-lang', l); } catch (e) { /* ignore */ }
        applyI18n();
    }

    /* ---------- fields ---------- */
    function buildFields() {
        const box = $('#extraFields');
        box.innerHTML = '';
        cfg().fields.forEach((f) => {
            const w = document.createElement('div');
            w.className = 'field';
            w.innerHTML =
                `<label for="f_${f.id}" data-i18n="${f.lbl}"></label>` +
                `<input id="f_${f.id}" type="text" inputmode="numeric" autocomplete="off">` +
                `<small class="hint" data-i18n="${f.hint}"></small>`;
            box.appendChild(w);
            $('#f_' + f.id).value = f.def;
        });
    }

    function selectAlgo(algo) {
        stopPlay();
        state.algo = algo;
        $$('.tab').forEach((b) => b.classList.toggle('active', b.dataset.algo === algo));
        $('#modeBox').hidden = algo !== 'pollard';
        resetViz();
        buildFields();
        setMsg(null);
        applyI18n();
    }

    /* ---------- stepper rendering ---------- */
    function stepEl(s, i) {
        const el = document.createElement('article');
        el.className = 'step step-' + s.kind;
        const idx = document.createElement('div');
        idx.className = 'step-idx';
        idx.textContent = s.kind === 'skip' ? '…' : String(i + 1);
        const main = document.createElement('div');
        main.className = 'step-main';
        const title = document.createElement('div');
        title.className = 'step-title';
        title.textContent = t(s.key, s.p);
        main.appendChild(title);

        if (s.lines && s.lines.length) {
            const pre = document.createElement('pre');
            pre.className = 'step-lines';
            pre.textContent = s.lines.map((l) => (typeof l === 'string' ? l : t(l.key, l.p))).join('\n');
            main.appendChild(pre);
        }
        if (s.table) {
            const wrap = document.createElement('div');
            wrap.className = 'table-wrap';
            const tb = document.createElement('table');
            const trh = document.createElement('tr');
            s.table.head.forEach((h) => { const th = document.createElement('th'); th.textContent = String(h); trh.appendChild(th); });
            tb.appendChild(trh);
            s.table.rows.forEach((r) => {
                const tr = document.createElement('tr');
                r.forEach((c) => { const td = document.createElement('td'); td.textContent = String(c); tr.appendChild(td); });
                tb.appendChild(tr);
            });
            wrap.appendChild(tb);
            main.appendChild(wrap);
        }
        el.append(idx, main);
        return el;
    }

    function markCurrent() {
        $$('#steps .step.current').forEach((e) => e.classList.remove('current'));
        const last = $('#steps').lastElementChild;
        if (last && last.classList.contains('step')) last.classList.add('current');
    }

    function renderAll() {
        const box = $('#steps');
        box.innerHTML = '';
        if (!state.steps.length) {
            const e = document.createElement('div');
            e.className = 'empty';
            e.textContent = t('empty');
            box.appendChild(e);
            return;
        }
        const frag = document.createDocumentFragment();
        for (let i = 0; i < state.shown; i++) frag.appendChild(stepEl(state.steps[i], i));
        box.appendChild(frag);
        markCurrent();
    }

    function appendUpTo(count, scroll) {
        const box = $('#steps');
        count = Math.min(count, state.steps.length);
        const frag = document.createDocumentFragment();
        while (state.shown < count) { frag.appendChild(stepEl(state.steps[state.shown], state.shown)); state.shown++; }
        box.appendChild(frag);
        markCurrent();
        if (scroll && box.lastElementChild) box.lastElementChild.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        updateProgress();
        renderResult();
    }

    function next() {
        if (state.shown >= state.steps.length) { stopPlay(); return; }
        appendUpTo(state.shown + 1, true);
        if (state.shown >= state.steps.length) stopPlay();
    }
    function prev() {
        if (state.shown <= 1) return;
        const box = $('#steps');
        box.removeChild(box.lastElementChild);
        state.shown--;
        markCurrent();
        updateProgress();
        renderResult();
    }
    function showAll() { stopPlay(); appendUpTo(state.steps.length, true); }
    function restart() {
        stopPlay();
        state.shown = Math.min(1, state.steps.length);
        renderAll(); updateProgress(); renderResult();
    }

    function updateProgress() {
        const n = state.steps.length;
        $('#bar').style.width = n ? (state.shown / n) * 100 + '%' : '0';
        $('#progressText').textContent = n ? t('progress', { i: state.shown, n }) : '';
    }

    function renderResult() {
        const box = $('#result');
        if (!state.res || !state.steps.length || state.shown < state.steps.length) { box.hidden = true; return; }
        const r = state.res;
        box.hidden = false;
        box.className = 'result ' + (r.factor ? 'ok' : r.prime ? '' : 'bad');
        box.innerHTML = '';
        const h = document.createElement('h3');
        h.textContent = t('res_title');
        const p = document.createElement('div');
        p.className = 'big';
        if (r.factor) p.textContent = t('res_ok', { n: r.n, p: r.factor, q: r.n / r.factor });
        else if (r.prime) p.textContent = t('res_prime', { n: r.n });
        else p.textContent = t('res_fail');
        const s = document.createElement('small');
        s.textContent = t('res_elapsed', { ms: r.ms, count: state.steps.length });
        box.append(h, p, s);
    }

    /* ---------- play / pause ---------- */
    function updatePlayBtn() { $('#playBtn').textContent = t(state.timer ? 'ctl_pause' : 'ctl_play'); }
    function stopPlay() { if (state.timer) { clearInterval(state.timer); state.timer = null; } updatePlayBtn(); }
    function play() {
        if (!state.steps.length) return;
        if (state.timer) { stopPlay(); return; }
        if (state.shown >= state.steps.length) restart();
        state.timer = setInterval(next, Number($('#speed').value));
        updatePlayBtn();
    }

    function resetViz() {
        stopPlay();
        state.steps = []; state.shown = 0; state.res = null;
        renderAll(); updateProgress(); renderResult();
    }

    /* ---------- run / suggest / clear ---------- */
    function onRun() {
        stopPlay();
        const nStr = $('#nInput').value.trim().replace(/[\s_,']/g, '');
        if (!/^\d+$/.test(nStr)) return setMsg('err_n');
        if (nStr.length > 80) return setMsg('err_big');
        const n = BigInt(nStr);

        const o = {};
        for (const f of cfg().fields) {
            const raw = $('#f_' + f.id).value.trim();
            const lo = f.min(n), hi = f.max(n);
            if (!/^\d+$/.test(raw) || BigInt(raw) < lo || BigInt(raw) > hi) {
                return setMsg('err_param', { name: t(f.lbl), range: `${lo} … ${hi}` });
            }
            o[f.id] = BigInt(raw);
        }

        setMsg('status_running', {}, 'info');
        $('#runBtn').disabled = true;
        setTimeout(() => {
            try {
                U.startTimer(25000);
                const t0 = performance.now();
                const out = cfg().run(n, o);
                state.res = { n, factor: out.factor, prime: out.prime, ms: Math.round(performance.now() - t0) };
                state.steps = out.steps;
                state.shown = Math.min(1, out.steps.length);
                setMsg(null);
            } catch (e) {
                console.error(e);
                setMsg('err_internal', { e: String((e && e.message) || e) });
            }
            $('#runBtn').disabled = false;
            renderAll(); updateProgress(); renderResult();
        }, 30);
    }

    function onSuggest() {
        const s = cfg().run.suggest();
        const nIn = $('#nInput');
        nIn.value = s.n.toString();
        flash(nIn);
        Object.entries(s.params || {}).forEach(([k, v]) => {
            const el = $('#f_' + k);
            if (el) { el.value = String(v); flash(el); }
        });
        setMsg(null);
    }
    function flash(el) { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }

    function onClear() {
        $('#nInput').value = '';
        buildFields();
        resetViz();
        setMsg(null);
        applyI18n();
    }

    /* ---------- init ---------- */
    function init() {
        $$('.tab').forEach((b) => b.addEventListener('click', () => selectAlgo(b.dataset.algo)));
        $('#modeSel').addEventListener('change', (e) => {
            state.mode = e.target.value;
            stopPlay(); resetViz(); buildFields(); setMsg(null); applyI18n();
        });
        $$('.seg-btn').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
        $('#themeBtn').addEventListener('click', () => {
            setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
        });
        $('#runBtn').addEventListener('click', onRun);
        $('#suggestBtn').addEventListener('click', onSuggest);
        $('#clearBtn').addEventListener('click', onClear);
        $('#prevBtn').addEventListener('click', () => { stopPlay(); prev(); });
        $('#nextBtn').addEventListener('click', () => { stopPlay(); next(); });
        $('#playBtn').addEventListener('click', play);
        $('#allBtn').addEventListener('click', showAll);
        $('#restartBtn').addEventListener('click', restart);
        $('#speed').addEventListener('change', () => {
            if (state.timer) { clearInterval(state.timer); state.timer = setInterval(next, Number($('#speed').value)); }
        });
        $('#nInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') onRun(); });

        initTheme();
        buildFields();
        let l = 'en';
        try { l = localStorage.getItem('fact-lang') || 'en'; } catch (e) { /* ignore */ }
        setLang(l);
    }

    init();
})();