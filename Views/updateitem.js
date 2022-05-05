const updateVare = document.getElementById('updateVare');

updateVare.addEventListener('click', async (e) => {
    var category = document.getElementById('kategori').value
    var originalpris = document.getElementById('originalpris').value
    var pris = document.getElementById('pris').value
    var vare = document.getElementById('vare').value
    var picture = document.getElementById('picture').value
    var zip = document.getElementById('zip').value

    const item = {
        category: category,
        originalPrice: originalpris,
        price: pris,
        header: vare,
        picture: picture,
        zip: zip,
        person: JSON.parse(localStorage.getItem('user')).id
    }

    var id = document.getElementById('itemId').value

    const response = await fetch('http://localhost:5000/updateitem/' + id, {
        method: "PUT",
        body: JSON.stringify(item),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.status == 200) {
        alert("updated");
    } else {
        alert('update failed');
    }
});