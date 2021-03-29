const deleteAccount = async (e) => {
    e.preventDefault()
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    const confirm = document.getElementById('confirm').value
    const error = document.querySelector('.error')

    if (password !== confirm){
        error.innerText = 'Passwords do not match'
    } 

    const result = await fetch('api/delete-account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password,
            token: localStorage.getItem('token')
        })
    }).then((res) => res.json())
    
    if (result.status === 'ok'){
        const modal = document.querySelector('.modal')
        modal.style.visibility = 'visible'
        const loadPage = () => {
            window.location = `/`
        }
        setTimeout(loadPage, 1250)
    } else {
        error.innerText = result.error
    }
}

//add current year to footer copyright 
const yearSpan = document.querySelector('.date')
const year = new Date().getFullYear()
yearSpan.innerText = year


const form = document.getElementById('reg-form')
form.addEventListener('submit', deleteAccount) 