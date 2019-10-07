module.exports = {
    isAdmin: function (req, res, next) {
        if (req.isAuthenticated() && req.user.isAdmin == 1) {
            return next();
        }
        req.flash("erro_msg", "Realize seu login como administrador para ter acesso a esta página.");
        res.redirect("/");
    }
}