const registerUser = async (e) => {
    e.preventDefault()
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    const confirm = document.getElementById('password-confirm').value
    const firstName = document.getElementById('firstname').value
    const surname = document.getElementById('surname').value
    const email = document.getElementById('email').value
    const error = document.querySelector('.error')

    if (password !== confirm){
        error.innerText = 'Passwords dont match'
    }

    const result = await fetch('api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password,
            firstName,
            surname,
            email
        })
    }).then((res) => res.json())
    
    if (result.status === 'ok'){
        const modal = document.querySelector('.modal')
        modal.style.visibility = 'visible'
        const loadPage = () => {
            window.location = '/login.html'
        }
        setTimeout(loadPage, 1500)
        
    } else {
        error.innerText = result.error
    }
}

//add current year to footer copyright 
const yearSpan = document.querySelector('.date')
const year = new Date().getFullYear()
yearSpan.innerText = year

const form = document.getElementById('reg-form')
form.addEventListener('submit', registerUser) 
