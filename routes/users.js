const {Router} = require ('express')
const {Listusers,findid,adduser,change,deletes}=require('../controllers/users');
const router=Router();

router.get('/', Listusers);
router.get('/:id',findid);
router.put('/', adduser);
router.patch('/:id',change);
router.delete('/:id', deletes);

module.exports = router;