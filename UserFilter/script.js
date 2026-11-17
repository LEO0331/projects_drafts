const result = document.getElementById('result')
const filter = document.getElementById('filter')
const listItems = []
getData()
filter.addEventListener('input', event => filterData(event.target.value))
async function getData() {
    const response = await fetch('https://randomuser.me/api?results=50')//50 people
    const { results } = await response.json()
    result.textContent = ''
    results.forEach(user => {
        const li = document.createElement('li')//<li>
        listItems.push(li)//push li in the array
        li.innerHTML = `
            <img>
            <div class="user-info">
                <h4></h4>
                <p></p>
            </div>
        `
        const portrait = li.querySelector('img')
        portrait.alt = user.name.first
        const portraitUrl = getPortraitUrl(user.picture.large)
        if (portraitUrl) portrait.src = portraitUrl
        li.querySelector('h4').textContent = `${user.name.first} ${user.name.last}`
        li.querySelector('p').textContent = `${user.location.city}, ${user.location.country}`
        result.appendChild(li)
    })
}

function getPortraitUrl(value) {
    try {
        const url = new URL(value)
        if (url.protocol === 'https:' && url.host === 'randomuser.me' && !url.username && !url.password) {
            return url.href
        }
    } catch {
        // Leave the image without a source when the URL is invalid.
    }
}

function filterData(searchTerm) {
    listItems.forEach(item => {
        if(item.innerText.toLowerCase().includes(searchTerm.toLowerCase())) {
            item.classList.remove('hide')
        } else {
            item.classList.add('hide')
        }
    })
}
