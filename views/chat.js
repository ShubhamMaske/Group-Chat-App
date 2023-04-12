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






/* ------------------- Get Messages from specified group ------- */

document.getElementById("groupName").addEventListener("click", async function (e) {
    try {
        console.log("group id = ", e.target);
        const groupid = e.target.id;
        document.getElementById('groupheading').innerHTML = e.target.innerHTML;
        document.getElementById('addingMsg').innerHTML = "";
        if (localStorage.getItem('currentgroupid') == null || localStorage.getItem('currentgroupid') !== groupid) {
            localStorage.setItem('currentgroupid', groupid);
            const token = localStorage.getItem('usertoken');
            const messages = await axios.get(`http://localhost:3000/message/getMsgFromGroup/${groupid}`, { headers: { "Authorization": token } })

            
            var totalMsgs = messages.data.allMessages.length;
            var admin_id = messages.data.admin.userId;
            localStorage.setItem('adminId', admin_id);
            for (var i = 0; i < messages.data.allMessages.length; i++) {
                showMessages(messages.data.allMessages[i]);
            }
            if (totalMsgs > 0) {
                var idOfLastMessage = messages.data.allMessages[totalMsgs - 1].id;
                localStorage.setItem('idOfLastMessage', idOfLastMessage);
            } else {
                console.log(" zero messages");
            }


            const users = await axios.get(`http://localhost:3000/user/allusers/${groupid}`)
            document.getElementById('users').innerHTML = "";
            users.data.AllUsers.forEach(element => {
                showUsers(element);
            });
            setInterval(gettingMsg, 2000);
        }
    }
    catch (err) {
        console.log(err)
    }
})
/* -------------------------------------------------- */





async function gettingMsg() {
    try {
        const token = localStorage.getItem('usertoken');
        var totalLen = localStorage.getItem('len');
        var groupid = localStorage.getItem('currentgroupid');
        const messages = await axios.get(`http://localhost:3000/message/getMsg/${totalLen}/${groupid}`, { headers: { "Authorization": token } })
        

            if(messages.data.allMessages){
            if (messages.data.allMessages.id != localStorage.getItem('idOfLastMessage')) {
                localStorage.setItem('idOfLastMessage', messages.data.allMessages.id)
                totalLen++;
                localStorage.setItem('len', totalLen);
                showMessages(messages.data.allMessages);
                
            }
        }
            
        
    }
    catch (err) {
    console.log("getting updated msg error/no new message --", err);
}
}

var messages = [];
localStorage.setItem('MsgArray', JSON.stringify(messages));


function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


window.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem('usertoken');
        const joinedUser = document.getElementById('joinedUser')
        const li = document.createElement('li');
        const groupid = localStorage.getItem('currentgroupid');
        const decodeToken = parseJwt(token);
        localStorage.setItem('loginuserID',decodeToken.userId);
        const Groups = await axios.get('http://localhost:3000/group/getallgroups', { headers: { "Authorization": token } })
        for (var a = 0; a < Groups.data.groups.length; a++) {
            showUsergroups(Groups.data.groups[a]);
        }


        
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
        localStorage.setItem('idOfLastMessage',response.data.Info.id);
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
        if(user.admin == 1){
            childElement.textContent = `${user.name} : Admin`;
            parentEle.appendChild(childElement);
        }
        else if (user.admin == 0) {
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


            adminbtn.onclick = async (e) => {
                try {
                    const userid = adminbtn.id;
                    const groupid = localStorage.getItem('currentgroupid');
                    const adminid = localStorage.getItem('loginuserID');
                    const response = await axios.post(`http://localhost:3000/group/makeadmin/${userid}/${groupid}/${adminid}`);
                    alert(response.data.message);
                    if(response.status == 201){
                        e.target.previousSibling.remove();
                        e.target.remove();
                    }
                }
                catch (err) {
                    console.log("make admin error", err)
                }
            }

            removebtn.onclick = async (e) => {
                try {
                    const userid = removebtn.id;
                    const groupid = localStorage.getItem('currentgroupid');
                    const adminid = localStorage.getItem('loginuserID');
                    const response = await axios.post(`http://localhost:3000/group/removeuser/${userid}/${groupid}/${adminid}`);
                    alert(response.data.message);
                    if(response.status == 201){
                        e.target.parentElement.remove();
                    }
                }
                catch (err) {

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


