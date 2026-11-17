const modal = document.querySelector('.modal')
const loginBtn = document.querySelector('.login-btn')
const closeBtn = document.querySelector('.close')
const generateEl = document.querySelector('.btn-random')
const resultEl = document.getElementById('password')

const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
}

loginBtn.addEventListener('click', openModal)
closeBtn.addEventListener('click', closeModal)
window.addEventListener('click', outsideClick)

function openModal() {
  modal.style.display = 'block'
}

function closeModal() {
  modal.style.display = 'none'
}

function outsideClick(e) {
  if (e.target === modal) {
    closeModal()
  }
}

generateEl.addEventListener('click', () => {
    resultEl.value = generatePassword() //https://stackoverflow.com/questions/20604299/what-is-innerhtml-on-input-elements
})

function generatePassword(){
	let generatedPassword = ''
	const typesArr = [
		{lower: true},
        {upper: true},
        {number: true},
        {symbol: true}
    ]
	for(let i=0; i<8; i++) { //fixed type order: lower, upper, number, symbol
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0] //get key
            generatedPassword += randomFunc[funcName]() //append and call the function with same type order
      	})
	}
	//return generatedPassword.slice(0, length)
    let result = ''
    let len = 8
    for(let i=0; i<8; i++) { //randomize the order of generatedPassword
        const r = randomIndex(len)
        result += generatedPassword.charAt(r)
        generatedPassword = generatedPassword.slice(0, r) + generatedPassword.slice(r+1, len)
        len--
    }
    return result //finalPassword
}

function randomIndex(size) {
    const range = 2 ** 32
    const limit = range - (range % size)
    const sample = new Uint32Array(1)
    do {
        crypto.getRandomValues(sample)
    } while (sample[0] >= limit)
    return sample[0] % size
}

function getRandomLower() { //lower case letter start at code 97
    return String.fromCharCode(randomIndex(26) + 97)//0-25
}

function getRandomUpper() { //upper case letter start at code 65
    return String.fromCharCode(randomIndex(26) + 65)
}

function getRandomNumber() { //number start at code 48
    return String.fromCharCode(randomIndex(10) + 48)//0-9
}

function getRandomSymbol() { //https://www.freeformatter.com/html-entities.html
    const symbols = '!@#$%^&*(){}[]=<>/,.'//decide all symbol types
    return symbols[randomIndex(symbols.length)] //20
}
