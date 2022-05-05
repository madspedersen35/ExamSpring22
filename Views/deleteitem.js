const loginBtn = document.getElementById('deleteBtn')

deleteBtn.addEventListener('click', async () => {
    let item = document.getElementById('itemId').value;

    const response = await fetch('http://localhost:5000/deleteitem/' + item, {
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