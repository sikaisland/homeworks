var express = require('express');
var base = require('../base');

function mid_log(req, res) {
    console.log(req.body);
    console.log(req.body.username);
    console.log(req.body.password);
    //获得 post的数据
    //数据库
    var name = req.body.username;
    var pwd = req.body.password;

    //查询
    base(function (con) {
        var sql = "select  *  from  users  where    username='" + name + "' and password='" + pwd + "'  ";
        con.query(sql, function (err, result) {
            if (err) {
                console.log('失败失败');
                throw err
            };
            if (result.length == 1) {
                //登陆成功后  把状态改为 1   为登录态
                base(function (con) {
                    var sql2 = "update users set status = '1' where username = '" + name + "'";

                    con.query(sql2, function (err, result) {
                        if (err) {
                            console.log('失败失败');
                            throw err
                        };
                    
                    req.session.name = name;    

                    
                    res.redirect('./mail.html');
                    });

                }, 'mailsys');
            } else {
                //登录失败！！！！



            }
        });
    }, 'mailsys');
};
module.exports = mid_log;