let Send = document.getElementById("send");
Send.addEventListener("click", addMessage);


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
        alert(response.data.message)


    }
    catch (err) {
        console.log("sending msg error -- ", err)
    }
}