const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token manquant' });

  const token = authHeader.split(' ')[1]; // "Bearer <token>"
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ajouter l'id de l'utilisateur à req.user
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
  }
};
