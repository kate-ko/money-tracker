const express = require('express')
//---------------------------------------
const router = express.Router()
const { User, Record, Category, PaymentMethod } = require('../dataAccess/userModel');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
//--------------------------------------
const bcrypt = require('bcrypt');
const saltRounds = 10;
//----------------Post-------------------
//Add new user
router.post('/addUser', jsonParser, async (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log("username", req.body.username);
  User.findOne({ where: { name: req.body.username } })
    .then(user => {
      // console.log("user", user);
      if (!user) {
        bcrypt.hash(req.body.password, 10, function (err, hash) {
          if (err) { throw (err); }
          console.log("here", hash);
          User.create({
            name: req.body.username,
            password: hash,
          })
            .then((data) => {
              res.json(data)
            })
            .error((err) => {
              res.status(500).send(err);
            })
        });
      }
      else {
        console.log("already exist")
        res.send("already exist");
      }
    })
})

router.post('/category', jsonParser, async (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log("new category", req.body);
  Category.create(req.body)
    .then((data) => {
      res.json(data)
    })
    .error((err) => {
      res.status(500).send(err);
    })
});

router.post('/record', jsonParser, async (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log("new record", req.body);
  Record.create(req.body)
    .then((data) => {
      res.json(data)
    })
    .error((err) => {
      res.status(500).send(err);
    })
});

router.put('/category', jsonParser, async (req, res) => {
  if (!req.body) return res.sendStatus(400);
  // console.log("update", req.body);
  Category.findOne({ where: { id: req.body.id } })
    .then((row) => {
      // console.log("row",row);
      row.update(req.body)
        .then((data) => {
          res.json(data)
        })
        .error((err) => {
          res.send("error");
        })
    })
    .error((err) => {
      res.status(500).send(err);
    })
});

router.put('/record', jsonParser, async (req, res) => {
  if (!req.body) return res.sendStatus(400);
  // console.log("update", req.body);
  Record.findOne({ where: { id: req.body.id } })
    .then((row) => {
      row.update(req.body)
        .then((data) => {
          res.json(data)
        })
        .error((err) => {
          res.send("error");
        })
    })
    .error((err) => {
      res.status(500).send(err);
    })
});
//----------------LogIn----------------
router.post('/logIn', jsonParser, async (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log("username", req.body.username);
  User.findOne({
    where: {
      name: req.body.username,
    }
  })
    .then((user) => {
      console.log("data", user);
      // res.json(user)
      if (user) {
        console.log("req.body.password", req.body.password);
        console.log("user.data.password", user.dataValues.password);
        bcrypt.compare(req.body.password, user.dataValues.password, function (err, isPasswordMatch) {
          console.log(isPasswordMatch);
          if (isPasswordMatch) {
            res.json(user)
          } else {
            res.send(false);
            // Passwords don't match
            console.log(err);
          }
        })
      }
      else res.send("user doesn't exist");
    });
});
//---------DELETE--------------------
router.delete('/delete/record/:id', function (req, res) {
  var item_id = req.params.id;
  Record.findById(item_id)
    .then((row) => {
      row.destroy()
        .then((data) => {
          res.json(data)
        })
        .error((err) => {
          res.send("error");
        })
    })
    .error((err) => {
      res.status(500).send(err);
    })
});
router.delete('/delete/category/:id', function (req, res) {
  var item_id = req.params.id;
  Category.findById(item_id)
    .then((row) => {
      row.destroy()
        .then((data) => {
          res.json(data)
        })
        .error((err) => {
          res.send("error");
        })
    })
    .error((err) => {
      res.status(500).send(err);
    })
});
// ----------------Get-------------------

// router.get('/getUsers', async (req, res) => {
//     Person.findAll()
//         .then(users => res.json(users))
// })

router.get('/getData/:id', async (req, res) => {
  userId = req.params.id;
  console.log("userId", userId);
  User.findAll({
    attributes: ['id', 'name'],
    include: [{
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
    where: { id: userId }
  }).then(user => {
    res.send(user)

  }).error((err) => {
    console.error(err);
    res.status(500).send(err)
  })
})

router.get('/categories', async (req, res) => {
  Category.findAll({
  })
    .then(category => {
      res.send(category)
      console.log("categories", category);
    })
    .error((err) => {
      console.error(err);
      res.status(500).send(err)
    })
})

module.exports = router;