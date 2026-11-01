/* app.js — UI: tabs, task / log views, stepper, theme, language */
(function () {
    'use strict';
    const F = window.Fact, U = F.utils, I = F.i18n, t = I.t;
    const $ = (s, r) => (r || document).querySelector(s);
    const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
    const h = (tag, cls, text) => {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text !== undefined) e.textContent = text;
        return e;
    };

    /* ---------- algorithm configuration ---------- */
    const ALGOS = {
        fermat: { algo: F.fermat, desc: 'desc_fermat', hintN: 'hint_n_fermat', fields: [] },
        dixon: {
            algo: F.dixon, desc: 'desc_dixon', hintN: 'hint_n_dixon',
            fields: [{ id: 'B', lbl: 'lbl_B_dixon', hint: 'hint_B_dixon', def: '100', min: () => 10n, max: () => 5000n }]
        },
        pollard: {
            algo: F.rho, desc: 'desc_rho', hintN: 'hint_n_rho',
            fields: [
                { id: 'c', lbl: 'lbl_c', hint: 'hint_c', def: '1', min: () => 1n, max: (n) => n - 1n },
                { id: 'x0', lbl: 'lbl_x0', hint: 'hint_x0', def: '2', min: () => 0n, max: (n) => n - 1n }
            ]
        },
        ecm: {
            algo: F.ecm, desc: 'desc_ecm', hintN: 'hint_n_ecm',
            fields: [
                { id: 'B1', lbl: 'lbl_B1', hint: 'hint_B1', def: '1000', min: () => 10n, max: () => 100000n },
                { id: 'curves', lbl: 'lbl_curves', hint: 'hint_curves', def: '50', min: () => 1n, max: () => 500n }
            ]
        }
    };

    const state = {
        algo: 'fermat', view: 'task',
        steps: [], shown: 0, res: null,
        timer: null, msg: null, curBody: null, lastEl: null
    };
    const cfg = () => ALGOS[state.algo];

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
        renderResult();
        renderAll();
        updateProgress();
        updateLogUi();
    }

    /* ---------- messages ---------- */
    function setMsg(k, params, type) {
        state.msg = k ? { k, params: params || {}, type: type || 'err' } : null;
        renderMsg();
    }
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
        $$('[data-lang]').forEach((b) => b.classList.toggle('active', b.dataset.lang === l));
        try { localStorage.setItem('fact-lang', l); } catch (e) { /* ignore */ }
        applyI18n();
    }

    /* ---------- views ---------- */
    function showView(v) {
        if (v === 'log' && !state.steps.length) v = 'task';
        state.view = v;
        $('#taskView').hidden = v !== 'task';
        $('#logView').hidden = v !== 'log';
        $$('.view-btn').forEach((b) => b.classList.toggle('active', b.dataset.view === v));
        if (v === 'task') stopPlay();
        window.scrollTo({ top: 0, behavior: 'auto' });
        updateToTop();
    }
    function updateToTop() { $('#toTop').hidden = !(state.view === 'log' && window.scrollY > 500); }

    function updateLogUi() {
        const has = state.steps.length > 0;
        $('#viewLog').disabled = !has;
        const badge = $('#logBadge');
        badge.hidden = !has;
        badge.textContent = has ? String(state.steps.length) : '';
        $('#logSummary').textContent = state.res
            ? t('log_for', { algo: t('tab_' + state.res.algo), n: state.res.n })
            : '';
    }

    /* ---------- fields ---------- */
    function buildFields() {
        const box = $('#extraFields');
        box.innerHTML = '';
        cfg().fields.forEach((f) => {
            const w = h('div', 'field');
            w.innerHTML =
                `<label for="f_${f.id}" data-i18n="${f.lbl}"></label>` +
                `<input id="f_${f.id}" type="text" inputmode="numeric" autocomplete="off">` +
                `<small class="hint" data-i18n="${f.hint}"></small>`;
            box.appendChild(w);
            $('#f_' + f.id).value = f.def;
        });
    }

    function selectAlgo(algo) {
        state.algo = algo;
        $$('.tab').forEach((b) => b.classList.toggle('active', b.dataset.algo === algo));
        resetViz();
        buildFields();
        setMsg(null);
        showView('task');
        applyI18n();
    }

    /* ---------- result (task page) ---------- */
    function renderResult() {
        const box = $('#resultCard');
        const r = state.res;
        if (!r) { box.hidden = true; box.innerHTML = ''; return; }
        box.hidden = false;
        box.innerHTML = '';
        box.className = 'card result ' + (r.prime ? 'neutral' : r.complete ? 'ok' : 'bad');
        box.appendChild(h('h2', '', (r.complete ? '✓ ' : '! ') + t('res_title')));

        if (r.prime) {
            box.appendChild(h('div', 'expr', t('res_prime', { n: r.n })));
        } else {
            box.appendChild(h('div', 'expr', `${r.n} = ${U.exprOf(r.factors)}`));
            if (!r.complete) box.appendChild(h('p', 'note', t('res_incomplete')));

            const wrap = h('div', 'table-wrap');
            const tb = h('table', 'ftable');
            const head = h('tr');
            ['res_col_prime', 'res_col_exp', 'res_col_check'].forEach((k) => head.appendChild(h('th', '', t(k))));
            tb.appendChild(head);
            r.factors.forEach((f) => {
                const tr = h('tr');
                tr.appendChild(h('td', '', String(f.v)));
                tr.appendChild(h('td', '', String(f.e)));
                tr.appendChild(h('td', f.prime ? 'ok' : 'bad', f.prime ? '✓ ' + t('prime') : '✗ ' + t('composite')));
                tb.appendChild(tr);
            });
            wrap.appendChild(tb);
            box.appendChild(wrap);
        }

        box.appendChild(h('div', 'stats', t('res_stats', {
            digits: String(r.n).length, steps: state.steps.length, ms: r.ms, algo: t('tab_' + r.algo)
        })));
        const open = h('button', 'btn primary', t('res_open_log'));
        open.addEventListener('click', () => showView('log'));
        box.appendChild(open);
    }

    /* ---------- log rendering ---------- */
    function stepEl(s, i) {
        const el = h('article', 'step step-' + s.kind);
        el.appendChild(h('div', 'step-idx', s.kind === 'skip' ? '…' : String(i + 1)));
        const main = h('div', 'step-main');
        main.appendChild(h('div', 'step-title', t(s.key, s.p)));

        if (s.lines && s.lines.length) {
            main.appendChild(h('pre', 'step-lines',
                s.lines.map((l) => (typeof l === 'string' ? l : t(l.key, l.p))).join('\n')));
        }
        if (s.table) {
            const wrap = h('div', 'table-wrap');
            const tb = h('table');
            const trh = h('tr');
            s.table.head.forEach((x) => trh.appendChild(h('th', '', String(x))));
            tb.appendChild(trh);
            s.table.rows.forEach((r) => {
                const tr = h('tr');
                r.forEach((c) => tr.appendChild(h('td', '', String(c))));
                tb.appendChild(tr);
            });
            wrap.appendChild(tb);
            main.appendChild(wrap);
        }
        el.appendChild(main);
        return el;
    }

    function addStep(i) {
        const s = state.steps[i], box = $('#steps');
        if (s.kind === 'group') {
            const det = h('details', 'group');
            det.open = true;
            det.style.setProperty('--depth', s.depth || 0);
            const sum = h('summary');
            sum.append(h('span', 'gnum', '#' + (i + 1)), h('span', 'gtitle', t(s.key, s.p)));
            const body = h('div', 'group-body');
            det.append(sum, body);
            box.appendChild(det);
            state.curBody = body;
            return det;
        }
        const el = stepEl(s, i);
        (state.curBody || box).appendChild(el);
        return el;
    }

    function markCurrent() {
        $$('#steps .current').forEach((e) => e.classList.remove('current'));
        if (state.lastEl) state.lastEl.classList.add('current');
    }

    function renderAll() {
        const box = $('#steps');
        box.innerHTML = '';
        state.curBody = null;
        state.lastEl = null;
        if (!state.steps.length) { box.appendChild(h('div', 'empty', t('empty'))); return; }
        const frag = document.createDocumentFragment();
        const holder = box; // addStep appends to #steps / group bodies directly
        void frag; void holder;
        for (let i = 0; i < state.shown; i++) state.lastEl = addStep(i);
        markCurrent();
    }

    function appendUpTo(count, scroll) {
        count = Math.min(count, state.steps.length);
        while (state.shown < count) { state.lastEl = addStep(state.shown); state.shown++; }
        markCurrent();
        if (scroll && state.lastEl) state.lastEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        updateProgress();
    }

    function next() {
        if (state.shown >= state.steps.length) { stopPlay(); return; }
        appendUpTo(state.shown + 1, true);
        if (state.shown >= state.steps.length) stopPlay();
    }
    function prev() {
        if (state.shown <= 1) return;
        state.shown--;
        renderAll();
        updateProgress();
        if (state.lastEl) state.lastEl.scrollIntoView({ block: 'nearest' });
    }
    function showAll() { stopPlay(); appendUpTo(state.steps.length, false); }
    function restart() {
        stopPlay();
        state.shown = Math.min(1, state.steps.length);
        renderAll();
        updateProgress();
        window.scrollTo({ top: 0 });
    }

    function updateProgress() {
        const n = state.steps.length;
        $('#bar').style.width = n ? (state.shown / n) * 100 + '%' : '0';
        $('#progressText').textContent = n ? t('progress', { i: state.shown, n }) : '';
    }

    /* ---------- play / pause ---------- */
    function updatePlayBtn() { $('#playBtn').textContent = t(state.timer ? 'ctl_pause' : 'ctl_play'); }
    function stopPlay() {
        if (state.timer) { clearInterval(state.timer); state.timer = null; }
        updatePlayBtn();
    }
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
        renderResult(); renderAll(); updateProgress(); updateLogUi();
    }

    /* ---------- run / suggest / clear ---------- */
    function onRun() {
        stopPlay();
        const nStr = $('#nInput').value.trim().replace(/[\s_,']/g, '');
        if (!/^\d+$/.test(nStr) || BigInt(nStr) < 2n) return setMsg('err_n');
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
                U.startTimer(30000);
                const t0 = performance.now();
                const out = F.factorize(n, cfg().algo, o);
                state.res = {
                    n, algo: state.algo, factors: out.factors, complete: out.complete,
                    prime: out.prime, ms: Math.round(performance.now() - t0)
                };
                state.steps = out.steps;
                state.shown = Math.min(1, out.steps.length);
                setMsg(null);
            } catch (e) {
                console.error(e);
                setMsg('err_internal', { e: String((e && e.message) || e) });
            }
            $('#runBtn').disabled = false;
            renderResult(); renderAll(); updateProgress(); updateLogUi();
            const rc = $('#resultCard');
            if (!rc.hidden) rc.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 30);
    }

    function onSuggest() {
        const s = cfg().algo.suggest();
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
        showView('task');
        applyI18n();
    }

    /* ---------- init ---------- */
    function init() {
        $$('.tab').forEach((b) => b.addEventListener('click', () => selectAlgo(b.dataset.algo)));
        $$('[data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
        $$('.view-btn').forEach((b) => b.addEventListener('click', () => showView(b.dataset.view)));
        $('#themeBtn').addEventListener('click', () => {
            setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
        });
        $('#runBtn').addEventListener('click', onRun);
        $('#suggestBtn').addEventListener('click', onSuggest);
        $('#clearBtn').addEventListener('click', onClear);
        $('#backBtn').addEventListener('click', () => showView('task'));
        $('#prevBtn').addEventListener('click', () => { stopPlay(); prev(); });
        $('#nextBtn').addEventListener('click', () => { stopPlay(); next(); });
        $('#playBtn').addEventListener('click', play);
        $('#allBtn').addEventListener('click', showAll);
        $('#restartBtn').addEventListener('click', restart);
        $('#collapseBtn').addEventListener('click', () => $$('#steps details').forEach((d) => { d.open = false; }));
        $('#expandBtn').addEventListener('click', () => $$('#steps details').forEach((d) => { d.open = true; }));
        $('#speed').addEventListener('change', () => {
            if (state.timer) { clearInterval(state.timer); state.timer = setInterval(next, Number($('#speed').value)); }
        });
        $('#toTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        window.addEventListener('scroll', updateToTop, { passive: true });
        $('#nInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') onRun(); });

        initTheme();
        buildFields();
        let l = 'en';
        try { l = localStorage.getItem('fact-lang') || 'en'; } catch (e) { /* ignore */ }
        setLang(l);
        showView('task');
    }

    init();
})();