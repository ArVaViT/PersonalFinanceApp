const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    // Получение токена из заголовка
    const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;

    console.log('Received token:', token); // Логируем полученный токен

    // Проверка наличия токена
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Проверка и валидация токена
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        console.log('Token valid, user:', req.user); // Логируем успешную валидацию токена
        next();
    } catch (err) {
        console.log('Invalid token');
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
