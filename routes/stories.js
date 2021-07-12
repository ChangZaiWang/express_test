const { Router } = require('express')
const db = require('../database')

const router = Router()

router.use((req, res, next) => {
    console.log('Request made to /STORIES ROUTE')
    next()
})

//GET
router.get('/', async(req, res) => {
    const results = await db.promise().query(`SELECT * FROM stories`)
    res.status(200).send(results[0])
})
//指定文章id
router.get('/:id', async (req, res) => {
    const { id } = req.params
    const results = await db.promise().query(`SELECT * FROM stories WHERE id = ?`, [id])
    const post = results[0].find((post) => post.id === Number(id))
    res.status(200).send(post)
})

//POST
router.post('/', (req, res) => {
    const { title, content } = req.body
    if (title && content) {
        try {
            db.promise().query(`INSERT INTO stories(title, content) VALUES(?, ?)`, [title, content])
            res.status(201).send({msg: 'Story Created' })
        }
        catch (err) {
            console.log(err)
        }
    }
})

//PUT
router.put('/', (req, res) => {
    const { id, title, content } = req.body
    if (title) {
        try {
            db.promise().query(`UPDATE stories SET title = ? WHERE id = ?`, [title, id])
            res.status(201).send({msg: 'Title Updated' })
        }
        catch (err) {
            console.log(err)
        }
    }
    else if (content) {
        try {
            db.promise().query(`UPDATE stories SET content = ? WHERE id = ?`, [content, id])
            res.status(201).send({msg: 'Content Updated' })
        }
        catch (err) {
            console.log(err)
        } 
    }
})

//DELETE
router.delete('/', (req, res) => {
    const { id } = req.body
    if (id) {
        try {
            db.promise().query(`DELETE FROM stories WHERE id = ?`, [id])
            res.status(201).send({msg: 'Story Deleted' })
        }
        catch (err) {
            console.log(err)
        }
    }
})

module.exports = router