const axios = require('axios');

async function test(){
    try{
        const signup1=await axios.post("http://localhost:5000/api/users/signup",{
            username:"test",
            email:"test@test.com",
            password:"Test1234"
        });
        const signup2=await axios.post("http://localhost:5000/api/users/signup",{
            username:"test2",
            email:"test2@test.com",
            password:"Test1234"
        });
        const login1=await axios.post("http://localhost:5000/api/users/login",{
            username:"test",
            password:"Test1234"
        });
        const login2=await axios.post("http://localhost:5000/api/users/login",{
            username:"test2",
            password:"Test1234"
        });
        console.log(login1.data);
        
        console.log(login2.data);
        const token=login1.data.token;
        const token2=login2.data.token;
        const config={
            headers:{
                Authorization:'Bearer '+token
            },
        }
        const config2={
            headers:{
                Authorization:'Bearer '+token2
            },
        }          
        const data3=await axios.post("http://localhost:5000/api/leagues/create",
        {
            name:"Something",
            region:"NA",
            teamName:"Team Blue"

        },config);
        console.log(data3.data);
        const data4=await axios.get("http://localhost:5000/api/leagues/",config);
        console.log(data4.data);
        const join2to1=await axios.post("http://localhost:5000/api/leagues/join",{
            leagueId:1,
            teamName:"Team Red",
        },config2);
        console.log("join");
        console.log(join2to1);
    }catch(error){
        console.log(error.response.data.message);
    }
}

test();