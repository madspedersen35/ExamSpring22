document.addEventListener('DOMContentLoaded', () => {
    if (JSON.parse(localStorage.getItem('user')).clearance != 2) {
        alert("This page requires admin access");
        location.href = "homepage";
    }
})

const updateBtn = document.getElementById('updateBtn');

updateBtn.addEventListener('click', async () => {
    var nytPassword = document.getElementById('nyPassword').value;
    var gold = document.getElementById('golduser').checked;
    let userId = document.getElementById('userId').value;

    const user = {
        password: nytPassword,
        gold: gold
    }

    const response = await fetch('http://localhost:5000/updateUser/' + userId, {
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