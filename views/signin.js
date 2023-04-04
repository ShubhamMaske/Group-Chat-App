var form = document.getElementById('signin');
form.addEventListener('submit',signInUser);

        async function signInUser(e){
            try{
                e.preventDefault();

                let Email = document.getElementById('email').value;
                let Password = document.getElementById('password').value;

                document.getElementById('email').value = "";
                document.getElementById('password').value = "";

                let Obj = {
                    email: Email,
                    password: Password
                }

                const response = await axios.post("http://localhost:3000/user/signIn",Obj);
                if(response.status === 201){
                    localStorage.setItem('usertoken',response.data.token);
                    alert(response.data.message);
                    window.location.href = "./chat.html";
                }

            }
            catch(err){
                if(err.response.status === 401){
                    alert(err.response.data.message);
                }
                else if(err.response.status === 404){
                    alert(err.response.data.message);
                }
                else{
                    console.log(err);
                }
           
             }
        }