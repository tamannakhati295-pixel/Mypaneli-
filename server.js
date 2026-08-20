const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const app = express();

app.use(cors());
app.use(express.json());

const serviceAccount = {
  "type": "service_account",
  "project_id": "chiku-voice-chat-new-ac7b5",
  "private_key_id": "9d226b168bdbf02db607e92cd8c6da9cc2f4fde4",
  "private_key": `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDnY/x7IFwz40ZY
CoVPv/2nKOs8P+bUu+33s3/6i6ZUfrKz21a9gCLqX2NlVchUgcnncsdVFIVBhOth
Q2MWg2Sv7DcyfKSVu5nu+ndpo2K16yHxL+krs5xHybadFBHVRckWAQvaW/j9ZN5M
7KEhyxT2rJjEsixHi96m8/ANh7zSEN2sMl+x/Px0c9FyNR0XuOG2G+oUafvkU/qf
2fY3/PSkr+5TADIGtkEqMwFUiGmTAAgpiwCMXrebDisharW8e/BKcLOCMt4VWFQz
OIRpvUTMxq9G7PVbkXM/C53JkW+ZPvB27dg8GnVjrwRImvj9ho9yQg9z5+ZVzzjZ
Frf3TxkxAgMBAAECggEALTJBgcdLWzM8bTv42B/3Kqx6bjVJICppC+X6zHR0k7J/
s1PXeIJLz528K3H7BE6polSwDLVKZgbRdxkThLU7eIVaLrlb6IdRRPWVV4P7Zu87
nQGvuMKHdxo2Wi4uYYsVAQBJUWh/lPcb2MirnI8vVBNYb6shrQPsBI5HSE1IG3ui
xOBHjx0ZncfOi6QG3539nvCUNPRxichmDnkvVNo8bTvzo5cEKxMctfKZrakBvVlf
oyE5IG2NSm3IPObJuyy1QCpup+/GeIUuw/fhADZ33IUhhaksyyZLQdAIk7/fjlIw
l0WICzRen3r0fQ8cN83K39UQIT6Z4Ez4IoQp117McQKBgQD5j0MQKauKAnP3AYF6
inTIG4zU8AlkgCfdY8kBq2Ojz1k4RmBXGYSH8Tl04dfzOAismRDud1O6JqLRsopd
LyowamjDZMTXsR2UqD+K1DJdhiReqtGGPMgFJUUnjfc4sGgac5wwksI7X5cR+4rw
yO5Kg/YhokmKe7AczR+TF7/YjQKBgQDtXLBYzcyuzZBV4bOQj3LU4/gch+WC2S83
mFqsZOQBHDSi5mTx0quywwmswqEdkz1VHWN8vaf7wVoTzgxjyrnK+g4pOR52iW76
eak4xwJkgaEsk6dk3+PXAqa3bpwCHBmsKsDhQyT0PpPRQ2lRzSmk82reCK3+wuLs
8NJR2+1UNQKBgDtwFJ/v3MxVAzusXyNJgMD8VtGMjiAiqdv/3SsJoASu6OgPUvjL
uhYKrQ2akK18Bgzds/un7ggjFZpuNKg3CIxZe7Q19vAMXig+3kt5eLlvro/hjV+0
cEtRciQWmvAki9bo/CVRfvNXNArzZ0csBB05StD97xgNl4d0j3WgLXAtAoGAAgzI
4Rt15xSTaIp4eIkknr4RSH3L96NUixBfyBle9rt9oOKIgKYnIXYZwUo1BgJdhzyn
vU4OA1iaJI2lAb+gdyZNtQFvR+rL8JHYaksdtCyCbdYgnfhpCVRWiEMGSeZgOmJs
JAXmbc2UjTwdzr0M3QXVKHG+vvKD7zPtPRO/KvkCgYAWRTZVOSN+gfyuaEXp4jfn
3OqOH8S8csxQ1/TbKhL1mndsQJWvtFALbn6W5s4tEmTun1msBPoV6TiyUo61R1vN
6lCk4A5RfS15WfI35lZqotBKvLnqaGalOYovOJjgLn6vKy4b1VRtvTQNj8BOQcmj
MdJppAo2k+HU0l2Uqdr0vQ==
-----END PRIVATE KEY-----`,
  "client_email": "firebase-adminsdk-fbsvc@chiku-voice-chat-new-ac7b5.iam.gserviceaccount.com",
  "client_id": "112775636880502828914",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40chiku-voice-chat-new-ac7b5.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ============================================================
// TEST ROUTE
// ============================================================

app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'ZOYO Admin API is running!',
    time: new Date().toISOString()
  });
});

// ============================================================
// GET ALL DATA
// ============================================================

app.get('/api/all-data', async (req, res) => {
  try {
    // Try to get data from Firestore
    const [usersSnapshot, roomsSnapshot, reportsSnapshot, blockedUsersSnapshot] = await Promise.all([
      db.collection('users').limit(100).get(),
      db.collection('rooms').limit(100).get(),
      db.collection('reports').limit(100).get(),
      db.collection('blockedUsers').limit(100).get()
    ]);

    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const rooms = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const reports = reportsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const blacklist = blockedUsersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({
      success: true,
      users: users,
      rooms: rooms,
      reports: reports,
      blacklist: blacklist,
      counts: {
        users: users.length,
        rooms: rooms.length,
        reports: reports.length,
        blacklist: blacklist.length
      }
    });
  } catch (e) {
    console.error('Error fetching data:', e.message);
    res.status(500).json({ 
      success: false, 
      error: e.message,
      message: 'Failed to fetch data from Firestore'
    });
  }
});

// ============================================================
// BAN USER
// ============================================================

app.post('/api/ban-user/:id', async (req, res) => {
  try {
    await db.collection('users').doc(req.params.id).update({
      isBanned: true,
      bannedAt: new Date().toISOString()
    });
    res.json({ success: true, message: `User ${req.params.id} banned` });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ============================================================
// UNBAN USER
// ============================================================

app.post('/api/unban-user/:id', async (req, res) => {
  try {
    await db.collection('users').doc(req.params.id).update({
      isBanned: false,
      bannedAt: null
    });
    res.json({ success: true, message: `User ${req.params.id} unbanned` });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ============================================================
// ADD TO BLACKLIST
// ============================================================

app.post('/api/blacklist/:id', async (req, res) => {
  try {
    await db.collection('blockedUsers').doc(req.params.id).set({
      id: req.params.id,
      reason: req.body.reason || 'Admin action',
      addedAt: new Date().toISOString()
    });
    res.json({ success: true, message: `User ${req.params.id} added to blacklist` });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ============================================================
// REMOVE FROM BLACKLIST
// ============================================================

app.delete('/api/blacklist/:id', async (req, res) => {
  try {
    await db.collection('blockedUsers').doc(req.params.id).delete();
    res.json({ success: true, message: `User ${req.params.id} removed from blacklist` });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ============================================================
// BAN ROOM
// ============================================================

app.post('/api/ban-room/:id', async (req, res) => {
  try {
    await db.collection('rooms').doc(req.params.id).update({
      isBanned: true,
      bannedAt: new Date().toISOString()
    });
    res.json({ success: true, message: `Room ${req.params.id} banned` });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ============================================================
// UNBAN ROOM
// ============================================================

app.post('/api/unban-room/:id', async (req, res) => {
  try {
    await db.collection('rooms').doc(req.params.id).update({
      isBanned: false,
      bannedAt: null
    });
    res.json({ success: true, message: `Room ${req.params.id} unbanned` });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ============================================================
// GET USER PROFILE
// ============================================================

app.get('/api/user/:id', async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user: { id: doc.id, ...doc.data() } });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 ZOYO Admin API running on port ${PORT}`);
  console.log(`📍 Test: https://zoyo-admin-api-v2.onrender.com/`);
});  }
});

app.post('/api/ban-room/:id', async (req, res) => {
  try {
    await db.collection('rooms').doc(req.params.id).update({ isBanned: true, bannedAt: new Date().toISOString() });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/unban-room/:id', async (req, res) => {
  try {
    await db.collection('rooms').doc(req.params.id).update({ isBanned: false, bannedAt: null });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 ZOYO Admin API running on port ${PORT}`);
});
