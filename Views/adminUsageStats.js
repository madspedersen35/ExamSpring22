document.addEventListener('DOMContentLoaded', () => {
    if (JSON.parse(localStorage.getItem('user')).clearance != 2) {
        alert("This page requires admin access");
        location.href = "homepage";
    }
})

const usageList = document.getElementById('usageList');

document.addEventListener('DOMContentLoaded', async () => {
    usageList.innerHTML = `
    <tr>
        <th>Bruger ID</th>
        <th>Bruger email</th>
        <th>Antal annoncer</th>
    <tr/> 
    `;

    let totalItems = 0;
    await fetch('http://localhost:5000/usageStats/', {
        method: 'GET'
    })
        .then((res) => res.json())
        .then((res) => {
            for (let user of res) {
                totalItems = totalItems + user.itemCount;

                usageList.innerHTML += `
                    <tr>
                    <td>${user.id}</td>
                    <td>${user.email}</td>
                    <td>${user.itemCount}</td>
                    </tr>
                    `;
            }

            let totaleAnnoncer = document.getElementById('totaleAnnoncer');
            totaleAnnoncer.innerHTML = "Totale annoncer på markedsplads: " + totalItems;
        });
})