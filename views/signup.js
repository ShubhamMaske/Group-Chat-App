var form = document.getElementById('signup');
form.addEventListener('submit', verifyData);


        async function verifyData(e) {
            try {
                e.preventDefault();
                let Name = document.getElementById('name').value;
                let Email = document.getElementById('email').value;
                let Phone = document.getElementById('phone').value;
                let Password = document.getElementById('password').value;

                document.getElementById('name').value = "";
                document.getElementById('email').value = "";
                document.getElementById('phone').value = "";
                document.getElementById('password').value = "";

                const myObject = {
                    name: Name,
                    email: Email,
                    phone: Phone,
                    password: Password
                };

                const response = await axios.post("http://localhost:3000/user/signUp",myObject);
                if(response.status === 201){
                    window.location.href = "./signin.html";
                }
                else{
                    throw new Error(response.message);
                }

            }
            catch (err) {
                console.log("verifyData function error --", err)
            }
        }