const message = document.getElementById('message')
const loginBtn = document.getElementById('loginBtn')




loginBtn.addEventListener('click', async () => {
var password = document.getElementById('password').value
var email = document.getElementById('email').value

    const user = {
        email: email,
        password: password
    }
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);




const response = await fetch('http://localhost:5000/login', {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.status == 200) {
        window.location.replace('homepage.html')
    } else {
        message.innerHTML = 'User does not exist'
    }
})