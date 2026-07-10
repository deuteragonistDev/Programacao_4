// auth.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = "NIGHT_CITY_SECRET"; // Chave de criptografia do token

module.exports = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ erro: "Acesso negado. Token não fornecido." });
    }

    try {
        // Remove a palavra 'Bearer ' se ela vier junto com o token no front
        const limpo = token.replace('Bearer ', '');
        const verificado = jwt.verify(limpo, SECRET_KEY);
        req.usuario = verificado;
        next(); // Autorizado! Vai para a rota seguinte
    } catch (err) {
        res.status(400).json({ erro: "Token inválido ou expirado." });
    }
};