const router = require('express').Router();
// const sequelize = require('../config/connection');
const { Event, User, Task } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all events and JOIN with user data
    const eventData = await Event.findAll({
      include: [
        {
          model: User,
          attributes: ['event_owner'],
        },
      ],
    });

    // Serialize data so the template can read it
    const events = eventData.map((event) => event.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      events, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/event/:id', async (req, res) => {
  try {
    const eventData = await event.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['volunteer'],
        },
      ],
    });

    const event = eventData.get({ plain: true });

    res.render('event', {
      ...event,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Event }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;

// router.get('/', withAuth, (req, res) => {
//     Event.findAll({
//       where: {
//         // use the ID from the session
//         user_id: req.session.user_id
//       },
//       attributes: [
//         'id',
//         'name',
//         'event_date',
//         'event_address',
//         'event_owner'
//       ],
//       include: [
//         {
//           model: Task,
//           attributes: ['id', 'name', 'event_id', 'volunteer'],
//           include: {
//             model: User,
//             attributes: ['first_name', 'last_name', 'email']
//           }
//         },
//         {
//           model: User,
//           attributes: ['first_name', 'last_name', 'email']
//         }
//       ]
//     })
//       .then(dbEventData => {
//         // serialize data before passing to template
//         const events = dbEventData.map(post => post.get({ plain: true }));
//         res.render('profile', { events, loggedIn: true });
//       })
//       .catch(err => {
//         console.log(err);
//         res.status(500).json(err);
//       });
//   });