const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = 5000;
const methodOverride = require('method-override');
const formData = require('express-form-data');
//laver en function til at generere random IDS
let uniq =  Math.random().toString(16).slice(2)
app.use('/uploads', express.static('uploads'));
app.use('/', express.static('Views'));
app.use(methodOverride('_method'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
  }));



//delete user page
app.get('/Deleteuser', (req, res) => {
    res.sendFile('C:/Users/vald0/OneDrive/Skrivebord/Progprojekt/Views/Deleteuser.html')
});


//homepage
app.get('/homepage', (req, res) => {
    res.sendFile('C:/Users/vald0/OneDrive/Skrivebord/Progprojekt/Views/homepage.html')
});


//login side
app.get('/login', (req, res) => {
    res.sendFile('C:/Users/vald0/OneDrive/Skrivebord/Progprojekt/Views/login.html')
});


//register side
app.get('/register', (req, res) => {
    res.sendFile('C:/Users/vald0/OneDrive/Skrivebord/Progprojekt/Views/register.html')
});


//login autentication for looper igennem min users.json og tjekker om password og email matcher
app.post('/login', (req, res) => {
    const userdata = fs.readFileSync('Database/users.json')
    const allUsers = JSON.parse(userdata)

    for (let i = 0; i < allUsers.length; i++) {

        if (allUsers[i].email == req.body.email && allUsers[i].password == req.body.password){
           return res.status(200).json({message:'User logged in'});
        }
    }
    return res.status(400).json({message:'User does not exist'});
});


// delete user
app.delete('/Deleteuser', (req, res) => {
    const userdata = fs.readFileSync('Database/users.json')
    const allUsers = JSON.parse(userdata)

   for (let i = 0; i < allUsers.length; i++){
        if (allUsers[i].email == req.body.email && allUsers[i].password == req.body.password){
            allUsers.splice(i, 1)
            fs.writeFileSync('Database/users.json', JSON.stringify(allUsers, null, 4))
            return res.redirect('/login')
        }
    }
    return res.status(400).json({message:'User does not exist'});
});


// register funktionalitet
app.post('/register', (req, res) => {
    const userdata = fs.readFileSync('Database/users.json')
    const allUsers = JSON.parse(userdata)
    
    allUsers.push(req.body)
    fs.writeFileSync('Database/users.json', JSON.stringify(allUsers, null, 4))
    res.redirect('/login')
    
});

//Update password page
app.get('/Updateuserpassword', (req, res) => {
    res.sendFile('C:/Users/vald0/OneDrive/Skrivebord/Progprojekt/Views/UpdateuserPassword.html')
});


//Update Email page
app.get('/Updateuser', (req, res) => {
    res.sendFile('C:/Users/vald0/OneDrive/Skrivebord/Progprojekt/Views/Updateuser.html')
});

//Updateuser Email funktionalitet
app.put('/Updateuser', (req, res) => {
    const userdata = fs.readFileSync('Database/users.json');
    const allUsers = JSON.parse(userdata);

    for (let i = 0; i < allUsers.length; i++){
        
        if (allUsers[i].email == req.body.oldemail && allUsers[i].password == req.body.oldpassword){ 
            allUsers[i].email = req.body.nyEmail
            fs.writeFileSync('Database/users.json', JSON.stringify(allUsers, null, 4))
            return res.redirect('/homepage')
        }
    }
    return res.status(400).json({message:'Input didnt match try again'});
});

//update user password funktionalitet
app.put('/UpdateuserPassword', (req, res) => {
    const userdata = fs.readFileSync('Database/users.json');
    const allUsers = JSON.parse(userdata);

    for (let i = 0; i < allUsers.length; i++){

        if (allUsers[i].password == req.body.oldpassword && allUsers[i].email == req.body.oldemail){

            allUsers[i].password = req.body.nyPassword
            fs.writeFileSync('Database/users.json', JSON.stringify(allUsers, null, 4));
            return res.redirect('/homepage');
        }
    }
    return res.status(400).json({message:'Input didnt match an try again'});
});

const billedeFolder = {
    uploadDir: './uploads'
}
    app.use(formData.parse(billedeFolder));


//createitem get route
app.get('/Createitem', (req, res) => {
    res.sendFile('C:/Users/vald0/OneDrive/Skrivebord/Progprojekt/Views/Createitem.html')
});

//show all items get route
app.get('/Createitems', (req, res) => {
    const itemData = fs.readFileSync('Database/items.json');
    const allItems = JSON.parse(itemData);
    
    res.json(allItems);

}); 

//create item
app.post('/Createitem', formData.parse(billedeFolder), (req, res) => {
    let {kategori, pris, vare, email } = req.body;
    let itemPic = req.files.itemPic.path.replace('\\',('/'));

    const itemData = fs.readFileSync('Database/items.json');
    const allItems = JSON.parse(itemData);

    allItems.push({kategori, pris, vare, itemPic, uniq, email})
    fs.writeFileSync('Database/items.json', JSON.stringify(allItems, null, 4));
    return res.redirect('/homepage')
});

//items indenfor en bestemt kategori
app.get('/items/:kategori', (req, res) => {
    const itemData = fs.readFileSync('Database/items.json');
    const allItems = JSON.parse(itemData);
    const category = allItems.find((c) => c.kategori === req.params.kategori);

    if(!category){
        res.status(404).send('category does not exist')
    } else{
        return res.send(category)
    }
});

//delete item get route
app.get('/deleteitem', (req, res) => {
    res.sendFile('C:/Users/vald0/OneDrive/Skrivebord/Progprojekt/Views/deleteitem.html')
});

// delete item
app.delete('/deleteitem', (req, res) => {
    const itemData = fs.readFileSync('Database/items.json')
    const allItems = JSON.parse(itemData)

   for (let i = 0; i < allItems.length; i++){
        
        if (allItems[i].uniq == req.body.itemId){
            allItems.splice(i, 1)
            fs.writeFileSync('Database/items.json', JSON.stringify(allItems, null, 4))
            return res.redirect('/homepage')
        }
    }
    return res.status(400).json({message:'User does not exist'});


});

//Update items get route
app.get('/Updateitem', (req, res) => {
    res.sendFile('C:/Users/vald0/OneDrive/Skrivebord/Progprojekt/Views/Updateitem.html')
});

//Update items funktionalitet
app.put('/Updateitem', (req, res) => {
    const itemData = fs.readFileSync('Database/items.json')
    const allItems = JSON.parse(itemData)

   for (let i = 0; i < allItems.length; i++){ 
        if (allItems[i].uniq == req.body.itemId){  
            allItems[i].pris = req.body.pris
            allItems[i].kategori = req.body.kategori
            allItems[i].vare = req.body.vare

            fs.writeFileSync('Database/items.json', JSON.stringify(allItems, null, 4))
            return res.redirect('/homepage')
        }
    }
    return res.status(400).json({message:'ID didnt match an item try again'});
});


app.listen(PORT, () => {
    console.log (`app is listening on ${PORT}`)
});

module.exports = app;