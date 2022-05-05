const registerBtn = document.getElementById('register');

registerBtn.addEventListener('click', async () => {
    var password = document.getElementById('password').value
    var email = document.getElementById('email').value

    const user = {
        email: email,
        password: password,
    }

    const response = await fetch('http://localhost:5000/register', {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.status == 200) {
        location.href = "login"
    } else {
        alert('Register failed, try again')
    }
})