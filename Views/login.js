const loginBtn = document.getElementById('loginBtn')

loginBtn.addEventListener('click', async () => {
    var password = document.getElementById('password').value
    var email = document.getElementById('email').value

    const user = {
        email: email,
        password: password
    }

    const response = await fetch('http://localhost:5000/login', {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.status == 200) {
        localStorage.setItem('user', JSON.stringify(await response.json()));
        location.href = 'homepage.html';
    } else {
        alert('Wrong login');
    }
})