const joke = document.getElementById('joke')
const jokeBtn = document.getElementById('jokeBtn')
randomJoke()
jokeBtn.addEventListener('click', randomJoke)
//https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
function randomJoke() {
    const config = {
    headers: {
           Accept: 'application/json',
        }
    }
    fetch('https://icanhazdadjoke.com', config)
        .then(response => response.json())
        .then(data => {
            joke.textContent = data.joke
    })
    /* async/await
    const response = await fetch('https://icanhazdadjoke.com', config)
    const data = await response.json()
    joke.textContent = data.joke
*/
}
