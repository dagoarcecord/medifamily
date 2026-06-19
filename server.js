const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const DATA_FILE = path.join('/tmp', 'medifamily_data.json');

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch (e) { console.error(e.message); }
  return {};
}

function saveData(data) {
  try {
    data._lastUpdated = new Date().toISOString();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) { console.error(e.message); return false; }
}

app.get('/api/data', function(req, res) {
  res.json({ success: true, data: loadData() });
});

app.post('/api/data', function(req, res) {
  var data = req.body.data;
  if (!data) return res.status(400).json({ error: 'No data' });
  saveData(data);
  res.json({ success: true });
});

app.get('/api/health', function(req, res) {
  res.json({ status: 'online', uptime: process.uptime() });
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', function(req, res) {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', function() {
  console.log('MEDIFAMILY online en puerto ' + PORT);
});