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

//admin delete user page
app.get('/adminDeleteUser', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views/adminDeleteUser.html'))
});

//admin update user page
app.get('/adminUpdateUser', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views/adminUpdateUser.html'))
});

//admin usage stats page
app.get('/adminUsageStats', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views/adminUsageStats.html'))
});

//admin update user page
app.get('/fulgteitems', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views/fulgteitems.html'))
});

//marketplace page
app.get('/marketplace', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views/marketplace.html'))
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

//update user password funktionalitet
app.put('/UpdateuserPassword/:user', async (req, res) => {
    await mssql.query(`UPDATE Person SET password = '${req.body.password}' WHERE id = ` + req.params.user);
    res.status(200).send(req.body);
});

//update user funktionalitet
app.put('/updateUser/:user', async (req, res) => {
    let gold = 0;
    if (req.body.gold) {
        gold = 1;
    }

    await mssql.query(`UPDATE Person SET password = '${req.body.password}', golduser = ${gold} WHERE id = ` + req.params.user);
    res.status(200).send(req.body);
});

//createitem get route
app.get('/Createitem', (req, res) => {
    res.sendFile(path.join(__dirname, '/Views/Createitem.html'))
});

//show all items get route
app.get('/items', async (req, res) => {
    let items = await mssql.query(`SELECT * FROM Product`);

    //Sort gold items to be on top
    let goldItems = [];
    let nonGoldItems = [];
    let goldusers = await mssql.query(`SELECT * FROM Person WHERE golduser = 1`);

    //Loops over all items
    for (let item of items.recordset) {

        //Checks if item is gold item
        let isGoldItem = false;
        for (let user of goldusers.recordset) {
            //If items person is same as current looped golduser, then set isGoldItem to true
            if (item.person == user.id) {
                isGoldItem = true;
            }
        }

        //If item is golditem, add to goldItems array, else add to nonGoldItems
        if (isGoldItem) {
            goldItems.push(item);
        } else {
            nonGoldItems.push(item);
        }
    }

    //Add all nonGoldItems to goldItems array to make them come last
    for (let nonGoldItem of nonGoldItems) {
        goldItems.push(nonGoldItem);
    }

    res.status(200).send(goldItems);
});

//show all followed items for user
app.get('/followedItems/:user', async (req, res) => {
    let items = await mssql.query(`SELECT Product.* FROM PersonProductFollow INNER JOIN Product ON PersonProductFollow.product = Product.id WHERE PersonProductFollow.person = ${req.params.user}`);

    res.status(200).send(items.recordset);
});

//show all users items get route
app.get('/items/:user', async (req, res) => {
    let result = await mssql.query(`SELECT * FROM Product WHERE person = ${req.params.user}`);
    res.status(200).send(result.recordset);
});

//brugsstatistikker
app.get('/usageStats', async (req, res) => {
    let persons = await mssql.query(`SELECT * FROM Person`);
    let products = await mssql.query(`SELECT * FROM Product`);
    for (let person of persons.recordset) {
        //Initialize itemcount to 0
        person.itemCount = 0;

        //Loop over all products and +1 to itemcount if owner of product is same as current person in loop
        for (let product of products.recordset) {
            if (product.person == person.id) {
                person.itemCount++;
            }
        }
    }

    res.status(200).send(persons.recordset);
});

//create item
app.post('/Createitem', async (req, res) => {
    await mssql.query(`INSERT INTO Product (category, price, person, header, picture, zip, createdAt, originalPrice) VALUES('${req.body.category}', ${req.body.price}, ${req.body.person}, '${req.body.header}', '${req.body.picture}', '${req.body.zip}', '${new Date().toISOString()}', ${req.body.originalPrice})`);
    res.status(200).send(req.body);
});

//follow item
app.post('/followItem', async (req, res) => {
    await mssql.query(`INSERT INTO PersonProductFollow (person, product) VALUES(${req.body.userId}, ${req.body.itemId})`);
    res.status(200).send(req.body);
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