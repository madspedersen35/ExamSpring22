document.addEventListener('DOMContentLoaded', () => {
    if (JSON.parse(localStorage.getItem('user')).clearance != 2) {
        alert("This page requires admin access");
        location.href = "homepage";
    }
})

const deleteBtn = document.getElementById('deleteBtn')

deleteBtn.addEventListener('click', async () => {
    let user = document.getElementById('userId').value;

    const response = await fetch('http://localhost:5000/deleteuser/' + user, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.status == 200) {
        alert("deleted");
    } else {
        alert('delete failed');
    }
})