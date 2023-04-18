var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const createConnection = require('../mysqlConnection');
const connection = createConnection();

/**
 * @swagger
 * /api/users:
 *   get:
 *     description: Returns a greeting message
 *     produces:
 *       - application/json
 *     tags:
 *       - users
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: ok
 */
router.get('/', function (req, res, next) {
  const token = req.headers.token;
  if (!token) {
    // If no token is present, send a 401 Unauthorized response
    res.sendStatus(401).send("Error verifying token");;
  } else {
    // Verify the token and extract the username
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        console.error('Error verifying token', error);
        res.sendStatus(401).send("Error verifying token");
      } else {
        console.log(decoded);
        const data = decoded;
        // Query the database for the user with the given username
        connection.query('SELECT * FROM `users`', (error, results) => {
          if (error) {
            console.error('Error querying database', error);
            res.sendStatus(500).send('Error querying database');
          } else if (results.length > 0) {
            const dataResults = [];
            for (const loopData of results) {
              delete loopData.password;
              dataResults.push(loopData)
            }
            // If the user exists, send a success response with the user's data
            res.json(dataResults);
          } else {
            // If the user does not exist, send a 401 Unauthorized response
            res.sendStatus(401).send('Error verifying token');
          }
        });
      }
    });
  }
})
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     description: Returns a greeting message
 *     produces:
 *       - application/json
 *     tags:
 *       - users
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *         type: string
 *       - name: id
 *         description: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: ok
 */
router.get('/:id', function (req, res, next) {
  const id = req.params.id;
  const token = req.headers.token;
  if (!token) {
    // If no token is present, send a 401 Unauthorized response
    res.sendStatus(401).send("Error verifying token");;
  } else {
    // Verify the token and extract the username
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        console.error('Error verifying token', error);
        res.sendStatus(401).send("Error verifying token");
      } else {
        console.log(decoded);
        const data = decoded;
        // Query the database for the user with the given username
        connection.query('SELECT * FROM users WHERE id = ?', [id], (error, results) => {
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
  // connection.query(
  //   'SELECT * FROM `users` WHERE `id` = ?',
  //   [id],
  //   function(err, results) {
  //     res.json(results);
  //   }
  // );
})
/**
 * @swagger
 * /api/users:
 *   post:
 *     description: Create a new user
 *     produces:
 *       - application/json
 *     tags:
 *       - users
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
 *       - name: fname
 *         description: User fname
 *         in: query
 *         required: true
 *         type: string
 *       - name: lname
 *         description: User lname
 *         in: query
 *         required: true
 *         type: string
 *       - name: email
 *         description: User email
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: User created
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: 1234567890abcdef
 *             username:
 *               type: string
 *               example: user001
 *             fname:
 *               type: string
 *               example: user001
 *             lname:
 *               type: string
 *               example: user001
 *             email:
 *               type: string
 *               example: user001@gmail.com
 */

// router.post('/', function (req, res, next) {
//   connection.query(
//     'INSERT INTO `users`( `username`, `password`, `fname`, `lname`, `email`) VALUES (?, ?, ?, ?, ?)',
//     [req.query.username, req.query.password, req.query.fname, req.query.lname, req.query.email],
//     function(err, results) {
//       res.status(201).json(req.query);
//     }
//   );
// })
// router.put('/', function (req, res, next) {
//   connection.query(
//     'UPDATE `users` SET `id`= ?, `username`= ?, `password`= ?, `fname`= ?, `lname`= ? , `email`= ? WHERE id = ?',
//     [req.body.id, req.body.username, req.body.password, req.body.fname, req.body.lname, req.body.email, req.body.id],
//     function(err, results) {
//       res.json(results);
//     }
//   );
// })
// router.delete('/', function (req, res, next) {
//   connection.query(
//     'DELETE FROM `users` WHERE id = ?',
//     [req.body.id],
//     function(err, results) {
//       res.json(results);
//     }
//   );
// })
module.exports = router;