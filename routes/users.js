const { Router } = require('express')
const db = require('../database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/check-auth')
require('dotenv').config()

const router = Router()

router.use((req, res, next) => {
    console.log('Request made to /USERS ROUTE')
    next()
})

//POST
//Register
router.post('/register', async (req, res, next) => {
    const { username, password, email } = req.body
    function validateEmail(email) {
        const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        return re.test(email)
    }
    if (validateEmail(email) == true) {
        const results = await db.promise().query(`SELECT * FROM users WHERE email = ?`, [email])
        const user = results[0].find((user) => user.email === String(email))
        if (user) {
            return res.status(409).json({
                msg: 'Mail Exitsts'
            })
        }
        else {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    })
                }
                else {
                    try {
                        db.promise().query(`INSERT INTO users(username, password, email) VALUES(?, ?, ?)`, [username, hash, email])
                        res.status(201).send({
                            msg: 'User Created'
                        })
                    }
                    catch (err) {
                        console.log(err)
                        res.status(500).json({
                            error: err
                        })
                    }
                }
            })
        }
    }
    else {
        return res.status(400).json({
            msg: 'Email Format Error'
        })
    }
})
//Login
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body
    const results = await db.promise().query(`SELECT * FROM users WHERE email = ?`, [email])
    const user = results[0].find((user) => user.email === String(email))
    if (!user) {
        return res.status(401).json({
            msg: 'Auth Failed'
        })
    }
    bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
            return res.status(401).json({
                msg: 'Auth Failed'
            })
        }
        if (result) {
            const token = jwt.sign(
            {
                email: user.email,
                userId: user.id
            }, process.env.JWT_KEY, 
            {
                expiresIn: "1h"
            })
            return res.status(200).json({
                msg: 'Auth Successful',
                token: token
            })
        }
        return res.status(401).json({
            msg: 'Auth Failed'
        })
    })    
})

//GET
router.get('/myprofile', checkAuth, async (req, res, next) => {
    const { email } = req.userData
    const results = await db.promise().query(`SELECT * FROM users WHERE email = ?`, [email])
    const user = results[0].find((user) => user.email === String(email))
    res.status(200).send(user)
})

//DELETE


module.exports = router