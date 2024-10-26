const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const SECRET_KEY = 'tu_clave_secreta';

const users = {
    Pedrito: 'Pedron',
    Canela: 'Canelon'
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'vistas', 'login.html'));
});

app.get('/inicio', (req, res) => {
    res.sendFile(path.join(__dirname, 'vistas', 'inicio.html'));
});

app.get('/galeria', (req, res) => {
    res.sendFile(path.join(__dirname, 'vistas', 'galeria.html'));
});

app.get('/pedido', (req, res) => {
    res.sendFile(path.join(__dirname, 'vistas', 'pedido.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (users[username] && users[username] === password) {

        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token });
    }

    res.status(401).json({ message: 'Credenciales incorrectas' });
});


const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Esta es una ruta protegida', user: req.user });
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});