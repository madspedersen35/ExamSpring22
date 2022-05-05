const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = 5000;
const methodOverride = require('method-override');
const formData = require('express-form-data');
const mssql = require('mssql');

//laver en function til at generere random IDS
let uniq = Math.random().toString(16).slice(2)
app.use('/uploads', express.static('uploads'));
app.use('/', express.static('Views'));
app.use(methodOverride('_method'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
var path = require("path");

mssql.connect('Server=database-test-cbs.database.windows.net,1433;Database=ExamSpring2022;User Id=valdemar;Password=Valde0321;Encrypt=true')

//delete user page
app.get('/marketplace', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views/marketplace.html'))
});

//delete user page
app.get('/Deleteuser', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views/Deleteuser.html'))
});


//homepage
app.get('/homepage', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views/homepage.html'))
});


//login side
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views/login.html'))
});


//register side
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views/register.html'))
});


//login autentication for looper igennem min users.json og tjekker om password og email matcher
app.post('/login', async (req, res) => {
    let result = await mssql.query(`SELECT * FROM Person WHERE email = '${req.body.email}' AND password = '${req.body.password}'`);
    if (result.recordset.length > 0) {
        res.status(200).send(result.recordset[0]);
    } else {
        res.status(401).send("Wrong login");
    }
});


// delete user
app.delete('/deleteUser/:user', async (req, res) => {
    await mssql.query(`DELETE FROM Person WHERE id = ${req.params.user}`);
    res.status(200).send("Deleted");
});


// register funktionalitet
app.post('/register', async (req, res) => {
    //Default not golduser and 1 in clearance (Normal user)
    await mssql.query(`INSERT INTO Person (email, password, golduser, clearance) VALUES('${req.body.email}', '${req.body.password}', 0, 1)`);
    res.status(200).send(req.body);
});

//Update password page
app.get('/Updateuserpassword', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views/UpdateuserPassword.html'))
});


//Update Email page
app.get('/Updateuser', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views/Updateuser.html'))
});

//Updateuser Email funktionalitet
app.put('/Updateuser', (req, res) => {
    const userdata = fs.readFileSync('Database/users.json');
    const allUsers = JSON.parse(userdata);

    for (let i = 0; i < allUsers.length; i++) {

        if (allUsers[i].email == req.body.oldemail && allUsers[i].password == req.body.oldpassword) {
            allUsers[i].email = req.body.nyEmail
            fs.writeFileSync('Database/users.json', JSON.stringify(allUsers, null, 4))
            return res.redirect('/homepage')
        }
    }
    return res.status(400).json({ message: 'Input didnt match try again' });
});

//update user password funktionalitet
app.put('/UpdateuserPassword/:user', async (req, res) => {
    await mssql.query(`UPDATE Person SET password = '${req.body.password}' WHERE id = ` + req.params.user);
    res.status(200).send(req.body);
});


//createitem get route
app.get('/Createitem', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views/Createitem.html'))
});

//show all items get route
app.get('/items', async (req, res) => {
    let result = await mssql.query(`SELECT * FROM Product`);
    res.status(200).send(result.recordset);
});

//show all users items get route
app.get('/items/:user', async (req, res) => {
    let result = await mssql.query(`SELECT * FROM Product WHERE person = ${req.params.user}`);
    res.status(200).send(result.recordset);
});

//create item
app.post('/Createitem', async (req, res) => {
    await mssql.query(`INSERT INTO Product (category, price, person, header, picture, zip, createdAt, originalPrice) VALUES('${req.body.category}', ${req.body.price}, ${req.body.person}, '${req.body.header}', '${req.body.picture}', '${req.body.zip}', '${new Date().toISOString()}', ${req.body.originalPrice})`);
    res.status(200).send(req.body);
});

//items indenfor en bestemt kategori
app.get('/items/:kategori', (req, res) => {
    const itemData = fs.readFileSync('Database/items.json');
    const allItems = JSON.parse(itemData);
    const category = allItems.find((c) => c.kategori === req.params.kategori);

    if (!category) {
        res.status(404).send('category does not exist')
    } else {
        return res.send(category)
    }
});

//delete item get route
app.get('/deleteitem', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views/deleteitem.html'))
});

// delete item
app.delete('/deleteitem/:item', async (req, res) => {
    await mssql.query(`DELETE FROM Product WHERE id = ${req.params.item}`);
    res.status(200).send("Deleted");
});

//Update items get route
app.get('/Updateitem', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views/Updateitem.html'))
});

//Update items funktionalitet
app.put('/Updateitem/:item', async (req, res) => {
    await mssql.query(`UPDATE Product SET category = ${req.body.category}, price = '${req.body.price}', header = '${req.body.header}', picture = '${req.body.picture}', zip = '${req.body.zip}', originalPrice = '${req.body.originalPrice}' WHERE id = ` + req.params.item);
    res.status(200).send(req.body);
});


app.listen(PORT, () => {
    console.log(`app is listening on ${PORT}`)
});

module.exports = app;