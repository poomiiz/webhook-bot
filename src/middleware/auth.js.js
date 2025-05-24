// เช็ค JWT / Firebase / LINE Access Token
module.exports = async function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing Authorization' });
  const token = header.replace(/^Bearer\s+/, '');
  try {
    // verifyIdToken() ใช้ Firebase Admin SDK หรือ JWT lib ของคุณ
    const user = await verifyIdToken(token);
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
