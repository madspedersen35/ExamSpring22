
const logud = document.getElementById('logudBtn');
const brugerEmail = document.getElementById("brugerEmail");
const loginHref = document.getElementById("loginHref");
const deleteuser = document.getElementById("deleteuser");
const updateuseremail = document.getElementById("updateuseremail");
const createitem = document.getElementById("createitem");
const updateitem = document.getElementById("updateitem");
const updatepassword = document.getElementById("updatepassword");
const deleteitem = document.getElementById("deleteitem")


logud.addEventListener('click', function(){
    loginHref.style.display = 'inline'
    brugerEmail.textContent = 'Velkommen til: Ukendt bruger'
    deleteuser.style.display = 'none';
    updateuseremail.style.display = 'none';
    createitem.style.display = 'none';
    updateitem.style.display = 'none';
    updatepassword.style.display = 'none';
    deleteitem.style.display = 'none';
    localStorage.clear()
});

function nameDisplay(){
    if (localStorage.getItem('email')){
        let email = localStorage.getItem('email');
        brugerEmail.textContent = 'Velkommen til: ' + email;
        loginHref.style.display = 'none';
    } else {
        brugerEmail.textContent = 'du er ikke logget ind';
    }
};
document.body.onload = nameDisplay