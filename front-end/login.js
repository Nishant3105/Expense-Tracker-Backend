const form=document.querySelector('form')
const forgetPassword=document.querySelector('#fp')

form.addEventListener('submit',userLogin)
forgetPassword.addEventListener('click',resetPassword)

async function userLogin(e){
    try{
        e.preventDefault()
        const email=document.getElementById('email').value
        const password=document.getElementById('password').value

        let my_obj={
            email,
            password
        }
        console.log(my_obj)

        axios.post('http://35.78.73.83:4000/user/login', my_obj).then(response=>{
            console.log(response.data)
            localStorage.setItem('token',response.data.token)
            window.location.href='./expense.html'
        })
    }
    catch(err){
        console.log(err)
    }
    
}

function resetPassword(){
   window.location.href='./forgotPassword.html'
}