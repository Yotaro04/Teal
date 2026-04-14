'use strict';

/**
 * TealFolder 同期サーバー（お試し用・認証なし）
 *
 * 起動: npm install && npm start
 * ブラウザ: http://127.0.0.1:3847/index.html?sync=auto
 * 別端末: 同じLANの IP で上記を開く（例: http://192.168.1.10:3847/index.html?sync=auto）
 *
 * 同期対象: vol-user-* の募集 JSON、参加申請・ありがとう付与などの通知配列
 * 非対象: デモの vol-1〜、DMスレッド（まだローカルのみ）
 */

const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 3847;
const DATA_FILE = path.join(__dirname, 'data.json');
const ROOT = path.join(__dirname, '..');

function loadBundle() {
    try {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const d = JSON.parse(raw);
        if (!d.vols || typeof d.vols !== 'object') d.vols = {};
        if (!Array.isArray(d.notifications)) d.notifications = [];
        return d;
    } catch (_) {
        return { vols: {}, notifications: [] };
    }
}

function saveBundle(b) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(b, null, 2), 'utf8');
}

let bundle = loadBundle();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: '18mb' }));

app.get('/api/health', function (_, res) {
    res.json({ ok: true, name: 'tealfolder-sync' });
});

app.get('/api/bundle', function (_, res) {
    res.json({ vols: bundle.vols, notifications: bundle.notifications });
});

app.post('/api/vols', function (req, res) {
    const vol = req.body;
    if (!vol || typeof vol.id !== 'string' || vol.id.indexOf('vol-user-') !== 0) {
        return res.status(400).json({ error: 'invalid vol id' });
    }
    bundle.vols[vol.id] = vol;
    saveBundle(bundle);
    res.json({ ok: true, id: vol.id });
});

app.delete('/api/vols/:id', function (req, res) {
    const id = req.params.id;
    if (!id || id.indexOf('vol-user-') !== 0) {
        return res.status(400).json({ error: 'bad id' });
    }
    const vol = bundle.vols[id];
    const key = String(req.get('x-tealdevice') || '');
    if (vol && vol.hostedByLocal) {
        if (!key || vol.hostedByLocal !== key) {
            return res.status(403).json({ error: 'not owner' });
        }
    }
    delete bundle.vols[id];
    saveBundle(bundle);
    res.json({ ok: true });
});

app.post('/api/notifications', function (req, res) {
    const n = req.body;
    if (!n || typeof n.id !== 'string') {
        return res.status(400).json({ error: 'bad notification' });
    }
    bundle.notifications = bundle.notifications.filter(function (x) {
        return x && x.id !== n.id;
    });
    bundle.notifications.unshift(n);
    if (bundle.notifications.length > 200) {
        bundle.notifications.length = 200;
    }
    saveBundle(bundle);
    res.json({ ok: true });
});

app.patch('/api/notifications/:id', function (req, res) {
    const id = req.params.id;
    const it = bundle.notifications.find(function (x) {
        return x && x.id === id;
    });
    if (!it) {
        return res.status(404).json({ error: 'not found' });
    }
    Object.assign(it, req.body || {});
    saveBundle(bundle);
    res.json({ ok: true });
});

app.post('/api/notifications/prune-vol', function (req, res) {
    const volId = req.body && req.body.volId;
    if (!volId || typeof volId !== 'string') {
        return res.status(400).json({ error: 'volId' });
    }
    bundle.notifications = bundle.notifications.filter(function (n) {
        return n && n.volId !== volId;
    });
    saveBundle(bundle);
    res.json({ ok: true });
});

app.use(express.static(ROOT));

app.listen(PORT, function () {
    /* eslint-disable no-console */
    console.log('');
    console.log('TealFolder sync + static  http://127.0.0.1:' + PORT + '/index.html?sync=auto');
    console.log('Health                    http://127.0.0.1:' + PORT + '/api/health');
    console.log('');
});
