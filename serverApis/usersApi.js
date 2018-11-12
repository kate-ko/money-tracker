const express = require('express')
const router = express.Router()
const { User, Record, Category, PaymentMethod } = require('../dataAccess/userModel');

// ----------------Get-------------------
router.get('/getData/:id', async (req, res) => {
  userId = req.params.id;
  User.findAll({
    attributes: ['id', 'name'],
    include: [{
      attributes: ['id', 'userid', 'date', 'type', 'categoryid', 'paymentmethodid', 'amount', 'currency', 'comment'],
      model: Record,
      as: "record",
      include: [{
        attributes: ['name'],
        model: Category,
        as: "category"
      }, {
        attributes: ['name'],
        model: PaymentMethod,
        as: "paymentMethod"
      }]
    }],
    where: { id: userId },
    order: [[Record, 'date', 'DESC']]
  }).then(user => {
    res.send(user)
  }).error((err) => {
    res.status(500).send(err);
  })
})

router.get('/categories', async (req, res) => {
  Category.findAll({
  }).then(category => {
      res.send(category)
    })
    .error((err) => {
      res.status(500).send(err)
    })
})

//----------------Post-------------------
router.post('/record', async (req, res) => {
  if (!req.body) return res.sendStatus(400);
  Record.create(req.body)
    .then((data) => {
      res.json(data)
    })
    .error((err) => {
      res.status(500).send(err);
    })
});

//----------------PUT-------------------
router.put('/record', async (req, res) => {
  if (!req.body) return res.sendStatus(400);
  Record.findOne({ where: { id: req.body.id } })
    .then((row) => {
      row.update(req.body)
        .then((data) => {
          res.json(data)
        })
        .error((err) => {
          res.send(err);
        })
    })
    .error((err) => {
      res.status(500).send(err);
    })
});

//---------DELETE--------------------
router.delete('/delete/record/:id', function (req, res) {
  Record.findById(req.params.id)
    .then((row) => {
      row.destroy()
        .then((data) => {
          res.json(data)
        })
        .error((err) => {
          res.send(err);
        })
    })
    .error((err) => {
      res.status(500).send(err);
    })
});

module.exports = router;