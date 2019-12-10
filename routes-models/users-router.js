const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../routes-models/users-model');
const private = require('../config/private')
// console.log(private);

// for endpoints beginning with /api/users
router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      const token = genToken(saved);
      res.status(201).json({ newUser: saved, token });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;
  console.log(username)

  Users.findBy({ username })
    .first()
    .then(user => {
      console.log('search results: ', user)
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = genToken(user);

        res.status(200).json({
          message: `Welcome ${user.username}!`,
          yourToken: token
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json({error: `database error, or wrong db set up, ${error}`});
    });
});

function genToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
    department: user.department, 
  }
  
  const options = {
    expiresIn: '3h',
  }

  const token = jwt.sign(payload, private.jwtSecret, options);
  return token;
}

module.exports = router;
