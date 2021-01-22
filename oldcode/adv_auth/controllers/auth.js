const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const User = require('../models/user');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'singh4neeraj@gmail.com',
    pass: 'UNQ4neeraj@#'
  }
})

const sentEmail = async (email, message) => {
  return transporter.sendMail({
    from: 'singh4neeraj@gmail.com',
    to: email,
    subject: message.subject,
    html: message.body
  }, 
  (err) => {
    if (err) return err;
  })
}

exports.getLogin = (req, res, next) => {
  // console.log(req.flash('error'));
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: message
  });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: email});
  if (!user) {
    req.flash('error', 'Invalid email.');
    return res.redirect('/login');
  }

  const result = await bcrypt.compare(password, user.password);
  if (!result) {
    req.flash('error', 'Invalid password.');
    return res.redirect('/login');
  }

  req.session.isLoggedIn = true;
  req.session.user = user;

  const sessionErr = await req.session.save(err => err);
  if (sessionErr) console.log(sessionErr);
  if (!sessionErr) return res.redirect('/');
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  
  const userDoc = await User.findOne({email: email})
  if (userDoc) {
    req.flash('error', 'Email already exists.');
    return res.redirect('/signup');
  }

  const hasedPassword = await bcrypt.hash(password, 12);
  
  const message = {
    subject: 'Signup Success',
    body: '<h1>Account created successfully.</h1>'
  }

  const err = await sentEmail(email, message);

  if (!err) {
    const user = await new User({
      email: email,
      password: hasedPassword,
      cart: {
        items: []
      }
    })
    const result = await user.save();
  }
  if (err) {
    req.flash('error', 'Unable to send email');
    return res.redirect('/signup');
  }

  res.redirect('/login');
};

exports.postLogout = async (req, res, next) => {
  const respErr = await req.session.destroy(err => err);
  if (respErr) console.log(respErr); 
  res.redirect('/');
};

exports.getReset = async (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    isAuthenticated: false,
    errorMessage: message
  });
}

exports.postReset = (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
        return  res.redirect('/reset');
      }
      const token = buffer.toString('hex');
      User.findOne({email: email})
        .then(user => {
          if (!user) {
            req.flash('error', 'No user found')
            res.redirect('/reset');
          }
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          return user.save();
        })
        .then(result => {
          const message = {
            subject: 'Password Reset',
            body: `
              <h1>Password reset request</h1>
              <p>Click here <a href="http://192.168.43.195:3000/reset/${token}">Link</a></p>
              `
            }
            sentEmail(email, message);
            res.redirect('/reset');
        })
        .catch(err => console.log(err))
    });
}


exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
      resetToken: token, 
      resetTokenExpiration: {$gt: Date.now()
    }})
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        isAuthenticated: false,
        errorMessage: message,
        passwordToken: token,
        userId: user._id.toString()
      });
    })
    .catch(err => console.log(err));
}

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
      resetToken: passwordToken, 
      resetTokenExpiration: {$gt: Date.now()},
      _id: userId
    })
  .then(user => {
    resetUser = user;
    return bcrypt.hash(newPassword, 12);
  })
  .then(hashedPassword => {
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save();
  })
  .then(result => {
    req.flash('error', 'Password Changed Successfully.');
    res.redirect('/login');
  })
  .catch(err => console.log(err));
}