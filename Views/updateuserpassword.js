const updateBtn = document.getElementById('updateBtn');

updateBtn.addEventListener('click', async () => {
    console.log("hallo");
    var nytPassword = document.getElementById('nyPassword').value

    const user = {
        password: nytPassword,
    }

    const response = await fetch('http://localhost:5000/UpdateuserPassword/' + JSON.parse(localStorage.getItem('user')).id, {
        method: "PUT",
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.status == 200) {
        alert("updated")
    } else {
        alert('update failed')
    }
})