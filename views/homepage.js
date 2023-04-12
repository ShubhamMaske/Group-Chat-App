













window.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem('token');
        const Groups = await axios.get('http://localhost:3000/group/getallgroups', { headers: { "Authorization": token } })
        
        
        
    
    }
    catch (err) {
        console.log(err);
    }

})
