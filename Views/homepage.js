
const logud = document.getElementById('logudBtn');
const deleteUser = document.getElementById('deleteUser');

document.addEventListener('DOMContentLoaded', () => {

    if (!localStorage.getItem('user')) {
        location.href = "login";
    }
})

logud.addEventListener('click', async () => {
    localStorage.removeItem('user');
    location.href = "login";
})

deleteUser.addEventListener('click', async () => {
    const response = await fetch('http://localhost:5000/deleteUser/' + JSON.parse(localStorage.getItem('user')).id, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.status == 200) {
        localStorage.removeItem('user');
        location.href = "login";
    } else {
        alert('Delete failed');
    }
})