const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const firestore = admin.firestore();

// CREATE: Lisää uuden kappaleen osan tietokantaan
exports.createPart = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== 'POST' || !req.is('application/json')) {
      return res.status(405).send('Method Not Allowed');
    }

    const data = req.body;

    const result = await firestore.collection('kappaleen_osa').add(data);

    return res.status(200).json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error creating part:', error);
    return res.status(500).send('Internal Server Error');
  }
});

// READ: Hae kaikki kappaleen osat tietokannasta
exports.getParts = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('Method Not Allowed');
    }

    const snapshot = await firestore.collection('kappaleen_osa').get();
    const parts = [];

    snapshot.forEach(doc => {
      parts.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json(parts);
  } catch (error) {
    console.error('Error getting parts:', error);
    return res.status(500).send('Internal Server Error');
  }
});

// READ: Hae tietty kappaleen osa tietokannasta
exports.getPart = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('Method Not Allowed');
    }

    const partId = req.query.id;

    if (!partId) {
      return res.status(400).send('Bad Request - Missing part ID');
    }

    const partDoc = await firestore.collection('kappaleen_osa').doc(partId).get();

    if (!partDoc.exists) {
      return res.status(404).send('Not Found - Part not found');
    }

    const partData = { id: partDoc.id, ...partDoc.data() };

    return res.status(200).json(partData);
  } catch (error) {
    console.error('Error getting part:', error);
    return res.status(500).send('Internal Server Error');
  }
});

// UPDATE: Päivitä tietty kappaleen osa tietokannassa
exports.updatePart = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== 'PUT' || !req.is('application/json')) {
      return res.status(405).send('Method Not Allowed');
    }

    const partId = req.query.id;

    if (!partId) {
      return res.status(400).send('Bad Request - Missing part ID');
    }

    const partDoc = firestore.collection('kappaleen_osa').doc(partId);
    const updateData = req.body;

    await partDoc.update(updateData);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating part:', error);
    return res.status(500).send('Internal Server Error');
  }
});

// DELETE: Poista tietty kappaleen osa tietokannasta
exports.deletePart = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== 'DELETE') {
      return res.status(405).send('Method Not Allowed');
    }

    const partId = req.query.id;

    if (!partId) {
      return res.status(400).send('Bad Request - Missing part ID');
    }

    await firestore.collection('kappaleen_osa').doc(partId).delete();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting part:', error);
    return res.status(500).send('Internal Server Error');
  }
});
