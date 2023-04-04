let Send = document.getElementById("send");
Send.addEventListener("click", addMessage);


window.addEventListener("DOMContentLoaded", async () => {
    try{
        const token = localStorage.getItem('token');


        const messages = await axios.get("http://localhost:3000/message/getMsg",{ headers: { "Authorization": token } })
        console.log(messages.data);
        for (var i = 0; i < messages.data.allMessages.length; i++) {
            showMessages(messages.data.allMessages[i]);
        }

        messages.data.AllUsers.forEach(element => {
            showUsers(element);
        });

    }
    catch(err){
        console.log("Dom loaded error-- ",err);
    }
})


async function addMessage(e) {
    try {
        e.preventDefault();
        var message = document.getElementById('userMessage').value;

        document.getElementById('userMessage').value = "";

        let myMessage = {
            message: message
        }
        const token = localStorage.getItem('usertoken');

        const response = await axios.post("http://localhost:3000/message/saveMsg", myMessage, { headers: { "Authorization": token } });
        console.log("Info",response.data.Info)
        showMessages(response.data.Info);


    }
    catch (err) {
        console.log("sending msg error -- ", err)
    }
}


async function showMessages(data){
    const parentEle = document.getElementById('addingMsg');
    const childEle = document.createElement('li');
    childEle.setAttribute('id', data.id);
    childEle.className = 'msg';


    childEle.textContent = data.message;


    parentEle.appendChild(childEle);
}

async function showUsers(user){
    try{
        const parentElement = document.getElementById('users');
        const childElement = document.createElement('li');
        childElement.textContent = user.name;

        parentElement.appendChild(childElement);
    }
    catch(err){
        console.log(err)
    }
}