/* eslint-disable */
module.exports = isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { return next(); }
   // res.redirect('/')
   res.status(401).send('Unathorized')
}