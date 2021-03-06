var express = require('express');
var path = require("path");
var bodyParser = require("body-parser");
var router = express.Router();
var db = require("../config/db");
var session = require("express-session");

/* 用户名和密码 */
var username = [];
var password = [];

/* 设置session密钥 */
router.use(session({
    secret: "sinpo",
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

router.use(bodyParser.urlencoded({extended: true}));

router.use(express.static(path.join(__dirname, "../public")));
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('main', {name: 'Express'});
});

/* 注册 */
router.get('/register', function (req, res, next) {
    res.render('register');
});

/* 登录 */
router.get('/login', function (req, res, next) {
    res.render('login');
});

/* 欢迎页 */
router.get('/welcome', function (req, res, next) {
    res.render('welcome', {
        name: req.session.user
    });
});

/* 编写邮件 */
router.get('/writeMail', function (req, res, next) {
    res.render('writeMail');
});

/* POST获取发送邮件的数据并存入数据库 */
router.post("/writeMail", function (req, res, next) {
    db.query("INSERT INTO `mail`.`mail` (`sender`, `receiver`, `title`, `content`) VALUES ('" + req.session.user + "', '" + req.body.receiver + "', '" + req.body.title + "', '" + req.body.content + "');", function (err, rows) {
        if (err) {
            console.log("Failed" + err);
        } else {
            console.log("Success insert mail");
        }
    });
    res.redirect("/welcome");
});

/* 查看邮件 */
router.get('/checkMail_all', function (req, res, next) {
    db.query("select * from mail where receiver='" + req.session.user + "'", function (err, rows) {
        if (err) {
            console.log("Failed" + err);
        } else {
            var mailArr = [];
            var shortMail = [];
            for (var i = 0; i < rows.length; i++) {
                var sender = rows[i].sender;
                var receiver = rows[i].receiver;
                var title = rows[i].title;
                var content = rows[i].content;
                var mailstring = "id: " + i + " sender: " + sender + " receiver: " + receiver + " title: " + title + " content: " + content;
                mailArr.push(mailstring);
                var shortString = "id: " + i + " sender: " + sender + " title: " + title;
                shortMail.push(shortString);
            }
            res.render('checkMail_all', {
                short:shortMail,
                mailArr: mailArr
            });
        }
    });

});

/* 添加进数据库 */
router.post("/register-add", function (req, res, next) {
    // console.log(req.body.email+req.body.pwd);//---1223157723@qq.com123
    var mail_address = req.body.email;
    var password = req.body.pwd;
    db.query("INSERT INTO `mail`.`user` (`username`, `password`) VALUES ('" + mail_address + "', '" + password + "');", function (err, rows) {
        if (err) {
            console.log("Failed" + err);
        } else {
            console.log("Success insert");
        }
    });
});

/* 登录验证 */
router.post("/login-confirm", function (req, res, next) {
    var login_email = req.body.mail;
    var login_password = req.body.pwd;
    db.query("select * from user", function (err, rows) {
        if (err) {
            console.log("err: " + err);
        } else {
            /* 保存用户名 */
            /* 保存密码 */
            for (var i = 0; i < rows.length; i++) {
                username.push(rows[i].username);
                password.push(rows[i].password);
            }
            if (username.indexOf(login_email) !== -1 && password.indexOf(login_password) !== -1) {
                console.log("验证成功");
                req.session.user = login_email;
                //     ---ajax局部刷新
                res.redirect();
            }
        }
    });
});

module.exports = router;
