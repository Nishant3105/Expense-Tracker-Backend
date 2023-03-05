const form=document.querySelector('form')

form.addEventListener('submit',addUser)

async function addUser(e){
    e.preventDefault()
    const name=document.getElementById('name').value
    const email=document.getElementById('email').value
    const password=document.getElementById('password').value

    let my_obj={
        name,
        email,
        password
    }
    console.log(my_obj)

    await axios.post('http://35.78.73.83:4000/user/signup', my_obj)
}