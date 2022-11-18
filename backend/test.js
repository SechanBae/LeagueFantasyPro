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
        const login2=await axios.post("http://localhost:5000/api/users/login",{
            username:"test",
            password:"Test1234"
        });
        const login1=await axios.post("http://localhost:5000/api/users/login",{
            username:"test",
            password:"Test1234"
        });
        console.log(login1);
        const config2={
            headers:{
                Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoidGVzdDIiLCJwYXNzd29yZCI6IiQyYiQxMCRHLnNyU3VjdmJFajF2L05NWVJTbmoub1p6ZEtjWm9Uc1YxRDAxSTlHNjY2Y0t2L00xbUFBQyIsImVtYWlsIjoidGVzdDJAdGVzdC5jb20iLCJpc011dGVkIjpmYWxzZSwiaXNBZG1pbiI6ZmFsc2UsImNyZWF0ZWRBdCI6IjIwMjItMTEtMThUMDA6MzM6NDguMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMTEtMThUMDA6MzM6NDguMDAwWiJ9LCJpYXQiOjE2Njg3MzE2MjksImV4cCI6MTY2ODgxODAyOX0.hD-gliRGfXBAE1Spb3Ww1A7fDt-apCNDl_4OtYwXnxc'
            },
        }          
        const config={
            headers:{
                Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdCIsInBhc3N3b3JkIjoiJDJiJDEwJFQ0L1VmZm1UTDNSM1lveE5UWkFaa3Vha3VMMXcwSTJwTHMzQzV3WUR3TXdveHJVUTBnMzlXIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaXNNdXRlZCI6ZmFsc2UsImlzQWRtaW4iOmZhbHNlLCJjcmVhdGVkQXQiOiIyMDIyLTExLTE4VDAyOjAxOjAwLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTExLTE4VDAyOjAxOjAwLjAwMFoifSwiaWF0IjoxNjY4NzM2ODYwLCJleHAiOjE2Njg4MjMyNjB9.vzLVGSYDzNEs50sZ8RKw-0UpNCKQWvZIHH-87QdZDOg'
            },
        }
        const data3=await axios.post("http://localhost:5000/api/leagues/create",
        {
            name:"Something",
            region:"NA",

        },config);
        console.log(data3.data);
        const data4=await axios.get("http://localhost:5000/api/leagues/",config);
        console.log(data4.data);
        const join2to1=await axios.post("http://localhost:5000/api/leagues/join",{
            leagueId:1
        },config2);
        console.log("join");
        console.log(join2to1);
    }catch(error){
        console.log(error);
    }
}

test();