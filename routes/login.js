var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const createConnection = require('../mysqlConnection');
const connection = createConnection();
/**
 * @swagger
 * /api/login:
 *   post:
 *     description: login user
 *     produces:
 *       - application/json
 *     tags:
 *       - login
 *     parameters:
 *       - name: username
 *         description: User username
 *         in: query
 *         required: true
 *         type: string
 *       - name: password
 *         description: User password
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: User login
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               example: user001
 *             password:
 *               type: string
 *               example: user001
 */

router.post('/', function (req, res, next) {
    const {
        username,
        password
    } = req.query;
    // Query the database for the user with the given username and password
    connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, results) => {
        if (error) {
            console.error('Error querying database', error);
            res.sendStatus(500);
        } else if (results.length > 0) {
            // If the user credentials are correct, generate a JWT token and send it in the response
            const data = results[0];
            const token = jwt.sign({
                id: data.id,
                username: data.username
            }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            });
            res.json({
                token
            });
        } else {
            // If the user credentials are incorrect, send a 401 Unauthorized response
            res.sendStatus(401);
        }
    });
})
/**
 * @swagger
 * /api/login/protected:
 *   post:
 *     description: login user
 *     produces:
 *       - application/json
 *     tags:
 *       - login
 *     parameters:
 *       - name: token
 *         description: protected username
 *         in: header
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: protected login
 *         schema:
 *           type: object
 */

router.post('/protected', (req, res) => {
    const token = req.headers.token;
    if (!token) {
        // If no token is present, send a 401 Unauthorized response
        res.sendStatus(401).send("Error verifying token");;
    } else {
        // Verify the token and extract the username
        jwt.verify(token,  process.env.JWT_SECRET, (error, decoded) => {
            if (error) {
                console.error('Error verifying token', error);
                res.sendStatus(401).send("Error verifying token");
            } else {
                console.log(decoded);
                const data = decoded;
                // Query the database for the user with the given username
                connection.query('SELECT * FROM users WHERE id = ?', [data.id], (error, results) => {
                    if (error) {
                        console.error('Error querying database', error);
                        res.sendStatus(500).send('Error querying database');
                    } else if (results.length > 0) {
                        // If the user exists, send a success response with the user's data
                        const user = results[0];
                        res.json({
                            id: user.id,
                            username: user.username,
                            email: user.email
                        });
                    } else {
                        // If the user does not exist, send a 401 Unauthorized response
                        res.sendStatus(401).send('Error verifying token');
                    }
                });
            }
        });
    }
});

module.exports = router;