let Send = document.getElementById("send");
Send.addEventListener("click", addMessage);

setInterval(gettingMsg,2000);

async function gettingMsg(){
    try{ 
        const token = localStorage.getItem('usertoken');
        var totalLen = localStorage.getItem('len');
        const messages = await axios.get(`http://localhost:3000/message/getMsg/${totalLen}`,{ headers: { "Authorization": token } })
        
        var newLen = messages.data.allMessages.length;

        if(newLen > 0){
            totalLen++;
            localStorage.setItem('len',totalLen);
            newLen--; 
            for (var i = newLen; i < messages.data.allMessages.length; i++) {
                showMessages(messages.data.allMessages[i]); 
        }
    }
        
    }
    catch(err){
        console.log("getting updated msg error/no new message --",err);
    }
}

var messages = [];
localStorage.setItem('MsgArray',JSON.stringify(messages));

window.addEventListener("DOMContentLoaded", async () => {
    try{
        const token = localStorage.getItem('usertoken');
        const joinedUser = document.getElementById('joinedUser')
        const li = document.createElement('li');
        const users = await axios.get("http://localhost:3000/user/allusers")
        users.data.AllUsers.forEach(element => {
            showUsers(element);
        });
          
            var lastMsgId = 0; 
            const msgArray = JSON.parse(localStorage.getItem('MsgArray'));
            const index = 0;
            console.log("MsgArr  ",msgArray[index]);
            console.log("MsgArr is array",Array.isArray(msgArray));
            console.log("length local",msgArray.length)
            if(msgArray.length == 0){
                lastMsgId = undefined;     
            }
            else{
                var length = msgArray.length;
                
                lastMsgId = msgArray[length-1].id;
                console.log("lastMsgId  ",lastMsgId);
                for (var i = 0; i < msgArray.length; i++) {
                    showMessages(msgArray[i]);
                }
            }

            const messages = await axios.get(`http://localhost:3000/message/getNewMsg/${lastMsgId}`,{ headers: { "Authorization": token } })
            console.log("backend length  ",messages.data.allMessages.length);
            if(messages.data.allMessages.length > 0){
                for (var i = 0; i < messages.data.allMessages.length; i++) {
                    showMessages(messages.data.allMessages[i]);
                }
                let newMsg = messages.data.allMessages;
                msgArray.push(...newMsg);
                localStorage.setItem("MsgArray",JSON.stringify(msgArray))
                localStorage.setItem('len',messages.data.allMessages.length);
            }
        
        //
        //
        //
        // const messages = await axios.get("http://localhost:3000/message/getMsg",{ headers: { "Authorization": token } })
        console.log("-<>-",messages.data.allMessages);
        li.textContent = messages.data.username + " Joined the chat";
        // localStorage.setItem('len',messages.data.allMessages.length);
        // for (var i = 0; i < messages.data.allMessages.length; i++) {
        //     showMessages(messages.data.allMessages[i]);
        // }

        joinedUser.appendChild(li);
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
        var length = localStorage.getItem('len');
        length++;
        localStorage.setItem('len',length);
        localStorage.setItem('messageId',response.data.Info.id);
        showMessages(response.data.Info);


    }
    catch (err) {
        console.log("sending msg error -- ", err)
    }
}


async function showMessages(data){
    const parentEle = document.getElementById('addingMsg');
    const childEle = document.createElement('li');
    var chatwindow = document.querySelector(".chats");
    childEle.setAttribute('id', data.id);
    childEle.className = 'msg';


    childEle.textContent = data.message;


    parentEle.appendChild(childEle);
    chatwindow.scrollTop=chatwindow.scrollHeight;
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