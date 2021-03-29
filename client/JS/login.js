
const login= async (e) => {
    e.preventDefault()
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    const error = document.querySelector('.error')
    
    const result = await fetch('api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    }).then((res) => res.json())
    
    if (result.status === 'ok'){
        const name = result.name
        const modal = document.querySelector('.modal')
        modal.style.visibility = 'visible'
        localStorage.setItem('token', result.data)
        const loadPage = () => {
            window.location = `chat.html?username=${name}&room=general`
        }
        setTimeout(loadPage, 1500)
    } else {
        console.log(result)
        error.innerText = result.error
    }
}


//add current year to footer copyright 
const yearSpan = document.querySelector('.date')
const year = new Date().getFullYear()
yearSpan.innerText = year


const form = document.getElementById('reg-form')
form.addEventListener('submit', login) 
