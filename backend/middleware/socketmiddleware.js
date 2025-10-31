const jwt = require('jsonwebtoken');

function verifyTokenSocket(socket, next) {
  try {
    const token = socket.handshake.auth.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
}

module.exports = { verifyTokenSocket };
