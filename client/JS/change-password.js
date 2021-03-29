const changePassword = async (e) => {
    e.preventDefault()
    const password = document.getElementById('password').value
    const confirm = document.getElementById('confirm-password').value
    const error = document.querySelector('.error')
 
    if (password !== confirm){
        error.innerText = 'Passwords dont match'
    }

    const result = await fetch('api/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
         newpassword: password,
         token: localStorage.getItem('token')
        })
    }).then((res) => res.json())
    
    if (result.status === 'ok'){
        const modal = document.querySelector('.modal')
        modal.getElementsByClassName.visibility = 'visible'
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
form.addEventListener('submit', changePassword) 
