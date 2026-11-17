const people = document.getElementById('people')

getData()

async function getData() {
    const response = await fetch('https://randomuser.me/api?results=4') //random fetch ? users
    const {results} = await response.json()
    results.forEach(user => {
    	const div = document.createElement('div')
    	div.setAttribute("class","col-md-6 col-lg-3");
        div.innerHTML = `
            <div class="card bg-light">
              <div class="card-body text-center">
                <img
                  class="rounded-circle mb-3"
                />
                <h3 class="card-title mb-3"></h3>
                <p class="card-text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Assumenda accusamus nobis sed cupiditate iusto? Quibusdam.
                </p>
                <a href="#"><i class="bi bi-twitter text-dark mx-1"></i></a>
                <a href="#"><i class="bi bi-facebook text-dark mx-1"></i></a>
                <a href="#"><i class="bi bi-linkedin text-dark mx-1"></i></a>
                <a href="#"><i class="bi bi-instagram text-dark mx-1"></i></a>
              </div>
            </div>
        `
        const portrait = div.querySelector('img')
        portrait.alt = user.name.first
        const portraitUrl = getPortraitUrl(user.picture.large)
        if (portraitUrl) portrait.src = portraitUrl
        div.querySelector('h3').textContent = `${user.name.first} ${user.name.last}`
        people.appendChild(div)
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
