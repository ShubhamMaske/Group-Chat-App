let Send = document.getElementById("send");
Send.addEventListener("click", addMessage);


/*----------- Creating new group -------------*/

let groupClass = document.getElementById("createGroup");
groupClass.addEventListener("click", createGroupFunction);
var createGroupWindow = document.querySelector('.create-group');

async function createGroupFunction() {
    try {
        const token = localStorage.getItem('usertoken');
        var name = document.getElementById('inputgroupname').value;
        document.getElementById('inputgroupname').value = "";
        createGroupWindow.style.display = "none";
        let groupObj = {
            groupName: name
        }
        const group = await axios.post("http://localhost:3000/group/creategroup", groupObj, { headers: { "Authorization": token } })

        let parentElement = document.getElementById('groupName');
        let childElement = document.createElement('li');
        childElement.setAttribute = ('id', group.data.gName.id);
        childElement.textContent = group.data.gName.group_name;
        parentElement.appendChild(childElement);

    }
    catch (err) {
        console.log(err);
    }
}
/*  -------------------------------------------- */

//-----------------------Make user Admin --------------------




/* ------------------- Get Messages from specified group ------- */

document.getElementById("groupName").addEventListener("click", async function (e) {
    try {
        console.log("group id = ", e.target);
        const groupid = e.target.id;
        document.getElementById('addingMsg').innerHTML = "";
        if (localStorage.getItem('currentgroupid') == null || localStorage.getItem('currentgroupid') !== groupid) {
            localStorage.setItem('currentgroupid', groupid);
            const token = localStorage.getItem('usertoken');
            const messages = await axios.get(`http://localhost:3000/message/getMsgFromGroup/${groupid}`, { headers: { "Authorization": token } })

            // if (messages.data.allMessages.length == 0) {
            //     document.querySelector('.messages').style.display = 'none';
            //     alert("No chats");
            // }
            // else{
            //     document.querySelector('.messages').style.display = 'block'; 
            // }
            var admin_id = messages.data.admin.userId;
            localStorage.setItem('adminId', admin_id);
            for (var i = 0; i < messages.data.allMessages.length; i++) {
                showMessages(messages.data.allMessages[i]);
            }


            const users = await axios.get(`http://localhost:3000/user/allusers/${groupid}`)
            document.getElementById('users').innerHTML = "";
            users.data.AllUsers.forEach(element => {
                showUsers(element);
            });

        }
    }
    catch (err) {
        console.log(err)
    }
})
/* -------------------------------------------------- */



//setInterval(gettingMsg,2000);

// async function gettingMsg(){
//     try{ 
//         const token = localStorage.getItem('usertoken');
//         var totalLen = localStorage.getItem('len');
//         const messages = await axios.get(`http://localhost:3000/message/getMsg/${totalLen}`,{ headers: { "Authorization": token } })

//         var newLen = messages.data.allMessages.length;

//         if(newLen > 0){
//             totalLen++;
//             localStorage.setItem('len',totalLen);
//             newLen--; 
//             for (var i = newLen; i < messages.data.allMessages.length; i++) {
//                 showMessages(messages.data.allMessages[i]); 
//         }
//     }

//     }
//     catch(err){
//         console.log("getting updated msg error/no new message --",err);
//     }
// }

var messages = [];
localStorage.setItem('MsgArray', JSON.stringify(messages));

let groupArray = [];

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem('usertoken');
        const joinedUser = document.getElementById('joinedUser')
        const li = document.createElement('li');
        // const users = await axios.get("http://localhost:3000/user/allusers")
        // users.data.AllUsers.forEach(element => {
        //     showUsers(element);
        // });

        const Groups = await axios.get('http://localhost:3000/group/getallgroups', { headers: { "Authorization": token } })
        for (var a = 0; a < Groups.data.groups.length; a++) {
            showUsergroups(Groups.data.groups[a]);
        }

        const allGroups = await axios.get('http://localhost:3000/group/allgroups', { headers: { "Authorization": token } })
        if (allGroups.data.groups.length > 0) {
            for (var a = 0; a < Groups.data.groups.length; a++) {
                groupArray.push(Groups.data.groups[a]);
            }
        }


        var lastMsgId = 0;
        const msgArray = JSON.parse(localStorage.getItem('MsgArray'));
        const index = 0;
        console.log("MsgArr  ", msgArray[index]);
        console.log("MsgArr is array", Array.isArray(msgArray));
        console.log("length local", msgArray.length)
        if (msgArray.length == 0) {
            lastMsgId = undefined;
        }
        else {
            var length = msgArray.length;

            lastMsgId = msgArray[length - 1].id;
            console.log("lastMsgId  ", lastMsgId);
            for (var i = 0; i < msgArray.length; i++) {
                showMessages(msgArray[i]);
            }
        }

        const messages = await axios.get(`http://localhost:3000/message/getNewMsg/${lastMsgId}`, { headers: { "Authorization": token } })
        console.log("backend length  ", messages.data.allMessages.length);
        if (messages.data.allMessages.length > 0) {
            for (var i = 0; i < messages.data.allMessages.length; i++) {
                showMessages(messages.data.allMessages[i]);
            }
            let newMsg = messages.data.allMessages;
            msgArray.push(...newMsg);
            localStorage.setItem("MsgArray", JSON.stringify(msgArray))
            localStorage.setItem('len', messages.data.allMessages.length);
        }

        //
        //
        //
        // const messages = await axios.get("http://localhost:3000/message/getMsg",{ headers: { "Authorization": token } })
        console.log("-<>-", messages.data.allMessages);
        li.textContent = messages.data.username + " Joined the chat";
        // localStorage.setItem('len',messages.data.allMessages.length);
        // for (var i = 0; i < messages.data.allMessages.length; i++) {
        //     showMessages(messages.data.allMessages[i]);
        // }

        joinedUser.appendChild(li);
    }
    catch (err) {
        console.log("Dom loaded error-- ", err);
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
        const groupid = localStorage.getItem('currentgroupid');
        const response = await axios.post(`http://localhost:3000/message/saveMsg/${groupid}`, myMessage, { headers: { "Authorization": token } });
        var length = localStorage.getItem('len');
        length++;
        localStorage.setItem('len', length);
        localStorage.setItem('messageId', response.data.Info.id);
        showMessages(response.data.Info);


    }
    catch (err) {
        console.log("sending msg error -- ", err)
    }
}


async function showMessages(data) {
    try {
        const parentEle = document.getElementById('addingMsg');
        const childEle = document.createElement('li');
        var chatwindow = document.querySelector(".chats");
        childEle.setAttribute('id', data.id);
        childEle.className = 'msg';
        childEle.textContent = data.message;
        parentEle.appendChild(childEle);
        chatwindow.scrollTop = chatwindow.scrollHeight;
    }
    catch (err) {
        console.log(err);
    }
}

async function showUsers(user) {
    try {
        const parentEle = document.getElementById('users');
        const childElement = document.createElement('li');
        let adminId = localStorage.getItem('adminId');
        console.log(user.id == adminId);
        
            childElement.textContent = user.name;
            parentEle.appendChild(childElement);
        if(user.id != adminId){
            const removebtn = document.createElement('input');
            removebtn.type = "button"
            removebtn.className = 'removeuser';
            removebtn.value = "remove";
            removebtn.setAttribute('id', user.id);

            const adminbtn = document.createElement('input');
            adminbtn.type = "button"
            adminbtn.className = 'makeAdmin';
            adminbtn.value = "make Admin";
            adminbtn.setAttribute('id', user.id);

            childElement.textContent = user.name;
            parentEle.appendChild(childElement);
            childElement.appendChild(removebtn);
            childElement.appendChild(adminbtn);


            adminbtn.onclick = async (e)=> {
                try{
                    alert("Admin btn click");
                    const userid = adminbtn.id;
                    const groupid = localStorage.getItem('currentgroupid');
                    const token = localStorage.getItem('usertoken');
                    const adminid = localStorage.getItem('adminId');
                    const response = await axios.post(`http://localhost:3000/group/makeadmin/${userid}/${groupid}/${adminid}`);
                    alert(response.data.message);
                    e.target.previousSibling.remove();
                    e.target.remove();
                }
                catch(err){
                    console.log("make admin error",err)
                }
            }
        
            removebtn.onclick = async (e)=> {
                try{
                    alert("remove btn click");
                    const userid = removebtn.id;
                    const groupid = localStorage.getItem('currentgroupid');
                    const token = localStorage.getItem('usertoken');
                    const adminid = localStorage.getItem('adminId');
                    const response = await axios.post(`http://localhost:3000/group/removeuser/${userid}/${groupid}/${adminid}`);
                    alert(response.data.message);
                    e.target.parentElement.remove();
                    
                }
                catch(err){
        
                }
            }

            
        }
    }
    catch (err) {
        console.log(err)
    }
}

async function showUsergroups(group) {
    try {
        let parentElement = document.getElementById('groupName');
        let childElement = document.createElement('li');
        console.log("group id", group.id);
        childElement.id = +group.id;
        childElement.textContent = group.group_name;
        parentElement.appendChild(childElement);
    }
    catch (err) {
        console.log("showing userGroup err- ", err);
    }
}


    