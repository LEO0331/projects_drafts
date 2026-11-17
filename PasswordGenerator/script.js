const resultEl = document.getElementById('result')
const lengthEl = document.getElementById('length')
const uppercaseEl = document.getElementById('uppercase')
const lowercaseEl = document.getElementById('lowercase')
const numbersEl = document.getElementById('numbers')
const symbolsEl = document.getElementById('symbols')
const generateEl = document.getElementById('generate')
const clipboardEl = document.getElementById('clipboard')
const randomFunc = {//key-value, callback
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
}

clipboardEl.addEventListener('click', () => {
    const textarea = document.createElement('textarea')//<textarea>
    const password = resultEl.innerText
    if(!password) { return }
    textarea.value = password
    document.body.appendChild(textarea)//<body><textarea>
    textarea.select()//select everything in the textarea
    document.execCommand('copy')
    textarea.remove()//clear
    alert('Password copied to the clipboard!')
})

generateEl.addEventListener('click', () => {
    const length = +lengthEl.value//string to number: Number(lengthEl.value)
    const hasLower = lowercaseEl.checked//T/F
    const hasUpper = uppercaseEl.checked
    const hasNumber = numbersEl.checked
    const hasSymbol = symbolsEl.checked
    resultEl.innerText = generatePassword(length, hasLower, hasUpper, hasNumber, hasSymbol)
})

function generatePassword(length, lower, upper, number, symbol) {
    let generatedPassword = ''//initialize
    const typesCount = lower + upper + number + symbol//true=1 => true+true=2 can represent how many types
    const typesArr = [{lower}, {upper}, {number}, {symbol}].filter(item => Object.values(item)[0])//first item
    /* filter out items that hv false as value
        {lower: true},
        {upper: true},
        {number: true},
        {symbol: true}
    */
    if(typesCount === 0) {
        return ''
    }
    for(let i = 0; i < length; i += typesCount) {//fixed type order: lower, upper, number, symbol
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0]//get key
            generatedPassword += randomFunc[funcName]()//append and call the function with same type order
        })
    }
    //return generatedPassword.slice(0, length)
    let result = ''
    let len = Math.ceil(length)
    for(let i = 0; i < length; i++) {//randomize the order of generatedPassword
        const r = randomIndex(len)
        result += generatedPassword.charAt(r)
        generatedPassword = generatedPassword.slice(0, r) + generatedPassword.slice(r+1, len)
        len--
    }
    return result//finalPassword
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

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode
function getRandomLower() {//lower case letter start at code 97
    return String.fromCharCode(randomIndex(26) + 97)//0-25
}

function getRandomUpper() {//upper case letter start at code 65
    return String.fromCharCode(randomIndex(26) + 65)
}

function getRandomNumber() {//number start at code 48
    return String.fromCharCode(randomIndex(10) + 48)//0-9
}
//https://www.freeformatter.com/html-entities.html
function getRandomSymbol() {
    const symbols = '!@#$%^&*(){}[]=<>/,.'//decide all symbol types
    return symbols[randomIndex(symbols.length)]//20
}
