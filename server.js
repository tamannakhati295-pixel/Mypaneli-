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
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDnY/x7IFwz40ZY\nCoVPv/2nKOs8P+bUu+33s3/6i6ZUfrKz21a9gCLqX2NlVchUgcnncsdVFIVBhOth\nQ2MWg2Sv7DcyfKSVu5nu+ndpo2K16yHxL+krs5xHybadFBHVRckWAQvaW/j9ZN5M\n7KEhyxT2rJjEsixHi96m8/ANh7zSEN2sMl+x/Px0c9FyNR0XuOG2G+oUafvkU/qf\n2fY3/PSkr+5TADIGtkEqMwFUiGmTAAgpiwCMXrebDisharW8e/BKcLOCMt4VWFQz\nOIRpvUTMxq9G7PVbkXM/C53JkW+ZPvB27dg8GnVjrwRImvj9ho9yQg9z5+ZVzzjZ\nFrf3TxkxAgMBAAECggEALTJBgcdLWzM8bTv42B/3Kqx6bjVJICppC+X6zHR0k7J/\ns1PXeIJLz528K3H7BE6polSwDLVKZgbRdxkThLU7eIVaLrlb6IdRRPWVV4P7Zu87\nnQGvuMKHdxo2Wi4uYYsVAQBJUWh/lPcb2MirnI8vVBNYb6shrQPsBI5HSE1IG3ui\nxOBHjx0ZncfOi6QG3539nvCUNPRxichmDnkvVNo8bTvzo5cEKxMctfKZrakBvVlf\noyE5IG2NSm3IPObJuyy1QCpup+/GeIUuw/fhADZ33IUhhaksyyZLQdAIk7/fjlIw\nl0WICzRen3r0fQ8cN83K39UQIT6Z4Ez4IoQp117McQKBgQD5j0MQKauKAnP3AYF6\ninTIG4zU8AlkgCfdY8kBq2Ojz1k4RmBXGYSH8Tl04dfzOAismRDud1O6JqLRsopd\nLyowamjDZMTXsR2UqD+K1DJdhiReqtGGPMgFJUUnjfc4sGgac5wwksI7X5cR+4rw\nyO5Kg/YhokmKe7AczR+TF7/YjQKBgQDtXLBYzcyuzZBV4bOQj3LU4/gch+WC2S83\nmFqsZOQBHDSi5mTx0quywwmswqEdkz1VHWN8vaf7wVoTzgxjyrnK+g4pOR52iW76\neak4xwJkgaEsk6dk+3PXAqa3bpwCHBmsKsDhQyT0PpPRQ2lRzSmk82reCK3+wuLs\n8NJR2+1UNQKBgDtwFJ/v3MxVAzusXyNJgMD8VtGMjiAiqdv/3SsJoASu6OgPUvjL\nuhYKrQ2akK18Bgzds/un7ggjFZpuNKg3CIxZe7Q19vAMXig+3kt5eLlvro/hjV+0\ncEtRciQWmvAki9bo/CVRfvNXNArzZ0csBB05StD97xgNl4d0j3WgLXAtAoGAAgzI\n4Rt15xSTaIp4eIkknr4RSH3L96NUixBfyBle9rt9oOKIgKYnIXYZwUo1BgJdhzyn\nvU4OA1iaJI2lAb+gdyZNtQFvR+rL8JHYaksdtCyCbdYgnfhpCVRWiEMGSeZgOmJs\nJAXmbc2UjTwdzr0M3QXVKHG+vvKD7zPtPRO/KvkCgYAWRTZVOSN+gfyuaEXp4jfn\n3OqOH8S8csxQ1/TbKhL1mndsQJWvtFALbn6W5s4tEmTun1msBPoV6TiyUo61R1vN\n6lCk4A5RfS15WfI35lZqotBKvLnqaGalOYovOJjgLn6vKy4b1VRtvTQNj8BOQcmj\nMdJppAo2k+HU0l2Uqdr0vQ==\n-----END PRIVATE KEY-----\n",
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

app.get('/api/all-data', async (req, res) => {
  try {
    const [users, rooms, reports, blockedUsers] = await Promise.all([
      db.collection('users').get(),
      db.collection('rooms').get(),
      db.collection('reports').get(),
      db.collection('blockedUsers').get()
    ]);

    res.json({
      users: users.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      rooms: rooms.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      reports: reports.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      blacklist: blockedUsers.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/ban-user/:id', async (req, res) => {
  try {
    await db.collection('users').doc(req.params.id).update({ isBanned: true, bannedAt: new Date().toISOString() });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/unban-user/:id', async (req, res) => {
  try {
    await db.collection('users').doc(req.params.id).update({ isBanned: false, bannedAt: null });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/blacklist/:id', async (req, res) => {
  try {
    await db.collection('blockedUsers').doc(req.params.id).set({
      id: req.params.id,
      reason: req.body.reason || 'Admin action',
      addedAt: new Date().toISOString()
    });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/blacklist/:id', async (req, res) => {
  try {
    await db.collection('blockedUsers').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
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
