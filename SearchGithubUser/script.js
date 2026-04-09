const APIURL = 'https://api.github.com/users/'
const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')
async function getUser(username) {
    /* 
    axios(APIURL + username).then(res => res.data)
    const res = await axios(APIURL + username) --> res.data: data is a/an property/object inside the res object
    */
    try {//axios.get(url)
        const {data} = await axios(APIURL + username)//dont need to res=>res.json() in axios
        createUserCard(data)
        getRepos(username)
    } catch(error) {
        if(error.response.status === 404) {//==
            createErrorCard('No Profile with this Username')
        }
    }
}

async function getRepos(username) {
    try {//latest repos: add ?sort=created
        const { data } = await axios(APIURL + username + '/repos?sort=created')
        addReposToCard(data)
    } catch(error) {
        createErrorCard('Problem Fetching Repos')
    }
}

function createUserCard(user) {
    const card = document.createElement('div')
    card.className = 'card'

    const avatarWrap = document.createElement('div')
    const avatar = document.createElement('img')
    avatar.className = 'avatar'
    avatar.src = user.avatar_url || ''
    avatar.alt = user.name || 'avatar'
    avatarWrap.appendChild(avatar)

    const info = document.createElement('div')
    info.className = 'user-info'

    const name = document.createElement('h2')
    name.textContent = user.name || 'Unknown user'
    const bio = document.createElement('p')
    bio.textContent = user.bio || ''

    const list = document.createElement('ul')
    function makeStat(value, label) {
        const li = document.createElement('li')
        li.append(String(value || 0) + ' ')
        const strong = document.createElement('strong')
        strong.textContent = label
        li.appendChild(strong)
        return li
    }
    list.appendChild(makeStat(user.followers, 'Followers'))
    list.appendChild(makeStat(user.following, 'Following'))
    list.appendChild(makeStat(user.public_repos, 'Repos'))

    const repos = document.createElement('div')
    repos.id = 'repos'

    info.appendChild(name)
    info.appendChild(bio)
    info.appendChild(list)
    info.appendChild(repos)

    card.appendChild(avatarWrap)
    card.appendChild(info)
    main.replaceChildren(card)
}

function createErrorCard(message) {
    const card = document.createElement('div')
    card.className = 'card'
    const heading = document.createElement('h1')
    heading.textContent = message
    card.appendChild(heading)
    main.replaceChildren(card)
}

function addReposToCard(repos) {//alreadys has <div id="repos"></div> after creating user cards
    const reposEl = document.getElementById('repos')
    repos
        .slice(0, 10)//show only ? repos
        .forEach(repo => {
            const repoEl = document.createElement('a')//link, <a href="#">
            repoEl.classList.add('repo')//<a class="repo">
            repoEl.href = repo.html_url//<a href="html_url" class="repo">
            repoEl.target = '_blank'//open in a new window
            repoEl.rel = 'noopener noreferrer'
            repoEl.innerText = repo.name
            reposEl.appendChild(repoEl)
        })
}

form.addEventListener('submit', event => {//keydown
    event.preventDefault()//don't want submit to a file
    const user = search.value//event.target.value
    if(user) {//user input a valid username
        getUser(user)
        search.value = ''//clear search value
    }
})
