const exprees = require('express')
const router = exprees.Router()
const db = require('../db');
const ExpressError = require('../expressError');

router.get('/', async (req, res, next) => {
    try{
        const resp = await db.query(`SELECT * FROM companies`);
        return res.json( {companies: resp.rows} )
    } catch(e) {
        next(e)
    } 
})

router.post('/', async (req, res, next) => {
    try{
        const { code, name, description } = req.body;
        const resp = await db.query(`INSERT INTO companies VALUES ($1, $2, $3) Returning *`, [code, name, description]);
        return res.status(201).json( {companies: resp.rows[0]} )
    } catch(e) {
        next(e)
    } 
})

router.get('/:comp_code', async (req, res, next) => {
    try{
        const { comp_code } = req.params;
        const resp = await db.query(`SELECT * FROM companies WHERE code = $1`, [comp_code])
        if (resp.rows.length === 0) throw new ExpressError('company not found', 404)
        return res.json({ company: resp.rows})
    } catch(e) {
        next(e)
    }
})

router.put('/:comp_code', async (req, res, next) => {
    try{
        const { comp_code } = req.params;
        const { code, name, description } = req.body;
        const resp = await db.query('UPDATE companies SET code=$1, name=$2, description=$3 WHERE code=$4 RETURNING *', [code, name, description, comp_code])
        if (resp.rows.length === 0) throw new ExpressError('company not found', 404)

        return res.json( {companies: resp.rows[0]} )
    } catch(e) {
        next(e)
    }
})

router.delete('/:comp_code', async (req, res, next) => {
    try{
        const { comp_code } = req.params;
        const resp = await db.query('DELETE FROM companies WHERE code = $1', [comp_code])
        if (resp.rows.length === 0) throw new ExpressError('company not found', 404)
        
        return res.json( { msg: 'deleted' } )
    } catch(e) {
        next(e)
    }
})





module.exports = router