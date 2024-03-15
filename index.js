const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors =require('cors');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const setRounds=10;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));

app.use(
    session({
        key: "usermail",
        secret: "success",
        resave: false,
        saveUninitialized: false,
        cookie:{
            expires: 60 * 10,
        }
    })
)

const db = mysql.createConnection({
    user:'avnadmin',
    password:'AVNS_5W135YZrjuwuLR-WHt5',
    host:'mysql-39af648c-gokul.a.aivencloud.com',
    database:'vaccine',
    port:'11941'
})

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        res.send("We need token give it next time");
    } else {
        jwt.verify(token, "secret", (err, decoded) => {
            if (err) {
                res.json({ auth: false, message: "Failed to authenticate" });
            } else {
                req.usermail = decoded.id;
                next();
            }
        });
    }
};


app.get('/isAuth',verifyJWT,(req,res)=>{
    res.send("Authenticeted Successfully");
})

app.post('/login', async (req, res) => {
    const usermail = req.body?.usermail;
    const password = req.body?.password;

    db.query(
        "SELECT * FROM signup WHERE usermail=?",
        [usermail],
        (err, result) => {
            if (err) {
                console.log("Error:", err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            if (result.length > 0) {
                bcryptjs.compare(password, result[0].password, (err, response) => {
                    if (response) {
                        const id  = result[0].id;
                        const token = jwt.sign({ id }, "secret", { expiresIn: 300 });
                        res.json({ auth: true, token: token, result: result[0], message: 'Login Successful' });
                    } else {
                        res.status(401).json({ message: 'Invalid Credentials' });
                    }
                });
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        }
    );
});

const verJWT = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        res.send("We need token give it next time");
    } else {
        jwt.verify(token, "secret", (err, decoded) => {
            if (err) {
                res.json({ auth: false, message: "Failed to authenticate" });
            } else {
                req.usermail = decoded.id;
                next();
            }
        });
    }
};


app.get('/isAauth', verJWT, (req, res) => {
    const userDetails = {
        usermail: req.usermail,
    };

    res.json({ result: [userDetails] });
});

app.post('/alogin', async (req, res) => {
    const usermail = req.body?.usermail;
    const password = req.body?.password;

    db.query(
        "SELECT * FROM alogin WHERE usermail=?",
        [usermail],
        (err, result) => {
            if (err) {
                console.log("Error:", err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            if (result.length > 0) {
                bcryptjs.compare(password, result[0].password, (err, response) => {
                    if (response) {
                        const id  = result[0].id;
                        const token = jwt.sign({ id }, "secret", { expiresIn: 300 });
                        res.json({ auth: true, token: token, message: 'Login Successful' });
                    } else {
                        res.status(401).json({ message: 'Invalid Credentials' });
                    }
                });
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        }
    );
});


app.post('/register', (req, res) => {
    const firstname = req.body?.firstname;
    const lastname = req.body?.lastname;
    const dob = req.body?.dob;
    const age = req.body?.age;
    const email = req.body?.email;
    const contact = req.body?.contact;
    const address = req.body?.address;
    const usermail = req.body?.usermail;
    const password = req.body?.password;
    const cpassword = req.body?.cpassword;
    const mem = req.body?.mem;
    const yes = req.body?.yes;

    console.log(req.body);

    if (password !== cpassword) {
        return res.status(400).json({ message: 'Password and Confirm Password do not match' });
    }

    bcryptjs.hash(password,setRounds,(err,hash)=>{
            if(err){
                console.log(err)
            }

        db.query(
            'INSERT INTO signup(firstname, lastname, dob, age, email, contact, address, mem, usermail, password, cpassword, yes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
            [firstname, lastname, dob, age, email, contact, address, mem, usermail, hash, hash, yes],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    console.log(result);
                    return res.status(200).json({ message: 'Registration Successful' });
                }
            }
        );
    });
});

app.put('/baby', (req, res) => {
    const babyname = req.body?.babyname;
    const babydob = req.body?.babydob;
    const babygender = req.body?.babygender;
    const hospital = req.body?.hospital;

    db.query(
        'UPDATE signup SET babyname = ?, babydob = ?, babygender = ?, hospital = ? ORDER BY id DESC LIMIT 1',
        [babyname, babydob, babygender, hospital],
        (updateErr, updateResult) => {
            if (updateErr) {
                console.log(updateErr);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            console.log(updateResult);
            return res.status(200).json({ message: 'User details updated successfully' });
        }
    );
});



app.post('/add', (req, res) => {
    const city = req.body?.city;
    const hname = req.body?.hname;
    const contact = req.body?.contact;
    const ddate = req.body?.ddate;
    const slots = req.body?.slots;
    const count = req.body?.count;
    const ost = req.body?.ost;
    const oet = req.body?.oet;
    const sst = req.body?.sst;
    const sset = req.body?.sset;
    const tst = req.body?.tst;
    const tet = req.body?.tet;
    const slotone = req.body?.slotone;
    const slottwo = req.body?.slottwo;
    const slotthree = req.body?.slotthree;

    // Check if any required field is missing
    if (!city || !hname || !contact || !ddate || !slots || !count || !ost || !oet || !sst || !sset || !tst || !tet || !slotone || !slottwo || !slotthree) {
        return res.status(400).json({ error: 'Please fill in all details' });
    }

    console.log(req.body);

    db.query(
        'INSERT INTO `add` (city, hname, contact, ddate, slots, count, ost, oet, sst, sset, tst, tet, slotone, slottwo, slotthree) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [city, hname, contact, ddate, slots, count, ost, oet, sst, sset, tst, tet, slotone, slottwo, slotthree],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            } else {
                console.log(result);
                return res.status(200).json({ message: 'Registration Successful' });
            }
        }
    );
 }); 


    app.put("/updateData/:id", (req, res) => {
        const id = req.params.id;
        const updatedData = {
            city: req.body?.city,
            count: req.body?.count,
            slots: req.body?.slots,
            slotone: req.body?.slotone,
            slottwo: req.body?.slottwo,
            slotthree: req.body?.slotthree,
            hname: req.body?.hname,
        };
    
        db.query(
            "UPDATE `add` SET ? WHERE id = ?",
            [updatedData, id],
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("Error updating employee");
                } else {
                    res.send(result);
                }
            }
        );
    });

    app.delete("/delete/:id", (req, res) => {
        const id = req.params.id;
        db.query("DELETE FROM `add` WHERE id = ?", id, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
        });
    });
    

    app.get('/fetchdata', (req, res) => {
        const { city, date } = req.query;
    
        let query = 'SELECT * FROM `add`';
        const queryParams = [];
    
        if (city) {
            query += ' WHERE city = ?';
            queryParams.push(city);
        }
    
        if (date) {
            if (queryParams.length > 0) {
                query += ' AND ddate = ?';
            } else {
                query += ' WHERE ddate = ?';
            }
            queryParams.push(date);
        }
    
        db.query(query, queryParams, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            } else {
                console.log(result);
                return res.status(200).json({ data: result });
            }
        });
    });
    


    app.get('/fetchData', (req, res) => {
        db.query('SELECT * FROM `add`', (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            } else {
                console.log(result);
                return res.status(200).json({ data: result });
            }
        });
    });
    
    app.post('/book', (req, res) => {
        const usermail = req.body?.usermail;
        const slot = req.body?.slot;
        const aadhar = req.body?.aadhar;
        const count = req.body?.count;
        const city = req.body?.city;
        const firstname = req.body?.firstname;
        const lastname = req.body?.lastname
        const validSlots = ['slotone', 'slottwo', 'slotthree'];
        if (!validSlots.includes(slot)) {
            return res.status(400).json({ error: 'Invalid slot value' });
        }
        const sqlQuery = `INSERT INTO book (usermail, slot, aadhar, count, city, firstname, lastname) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [usermail, slot, aadhar, count, city, firstname, lastname];

        db.query(sqlQuery, values, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            } else {
                updateAddTable(city, slot, count);
                console.log(result);
                return res.status(200).json({ message: 'Registration Successful' });
            }
        });
    });
    const updateAddTable = (city, slot, count) => {
        const validSlots = ['slotone', 'slottwo', 'slotthree'];
        if (!validSlots.includes(slot)) {
            console.log('Invalid slot value');
            return;
        }
        const updateAddQuery = `UPDATE \`add\` SET ${slot} = ${slot} - ?, count = count - ? WHERE city = ? AND count >= ?`;
        const updateAddValues = [count, count, city, count];
    
        db.query(updateAddQuery, updateAddValues, (err, updateAddResult) => {
            if (err) {
                console.log(err);
                return;
            }
    
            console.log(updateAddResult);
        });
    };
    

app.listen(8080,()=>{
    console.log('Server started');
});