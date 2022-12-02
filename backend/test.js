/**
 * Unit testing for api endpoints,
 * cannot test all endpoints this way 
 * because of how much data it requires to setup
 */
const axios = require('axios');
var config;
var config2;
var adminConfig;
var teamWithPlayer;
/**
 * Test admin login
 */
async function testAdminLogin(){
    try {
        const login=await axios.post("http://localhost:5000/api/users/login",{
            username:"Admin",
            password:"Admin1234"
        })
        adminConfig={
            headers:{
                Authorization:'Bearer '+login.data.token
            }
        }
        if(!login.data.isAdmin){
            throw "This account is not admin";
        }
        console.log("AdminLogin Test passed");
    } catch (error) {
        console.error(error);
    }
}
/**
 * Test add player api, test get players to see it is correct
 */
async function testAddPlayersGetPlayers(){
    try {
        playersJSON=[{
            gameName:"TestPlayer",
            region:"NA",
            position:"middle",
            team:"team",
            avgKPG:1,
            avgDPG:0,
            avgAPG:2,
            avgCSPG:100,
            scoreRating:700
        },{
            gameName:"OtherPlayer",
            region:"NA",
            position:"jungle",
            team:"other",
            avgKPG:1,
            avgDPG:0,
            avgAPG:2,
            avgCSPG:100,
            scoreRating:700
        }
        ]
        const addPlayers=await axios.post('http://localhost:5000/api/players/addPlayers',{
            playersJSON
        },adminConfig);
        const players=await await axios.get(
            "http://localhost:5000/api/players/getPlayers/" + 2,
            config
          );
        if(!(players.data.players[0].gameName==="TestPlayer"||players.data.players[0].gameName==="OtherPlayer")&&(players.data.players[1].gameName==="TestPlayer"||players.data.players[1].gameName==="OtherPlayer")){
            throw "Failed players added are not added successfully";
        }
        console.log("AddPlayersGetPlayers Passed");
    } catch (error) {
        console.error(error);
    }
}
/**
 * Test users signup and login
 */
async function testUserSignUpLogin(){
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
        const token=login1.data.token;
        const token2=login2.data.token;
        config={
            headers:{
                Authorization:'Bearer '+token
            },
        }
        config2={
            headers:{
                Authorization:'Bearer '+token2
            },
        }
        if(login1.data.username!=="test"&&login2.data.username!=="test2"){
            throw "FAILED, users are not same as the ones signed up"
        }
        console.log("UserSignUp Test Passed");
    }catch(error){
        console.error(error);
    }
}
/**test login with bad credentials
 * 
 */
 async function testToFailLoginWrongCredentials(){
    try {
        
        await axios.post("http://localhost:5000/api/users/login",{
            username:"test",
            password:"Test1234asdasd"
        });
        console.log("Failed-login should not happen");
    } catch (error) {
        console.error("Wrong login passed");
    }
}
/**
 * test signup with taken email
 */
async function testToFailSignupTakenEmail(){
    try {
        await axios.post("http://localhost:5000/api/users/signup",{
            username:"test2",
            email:"test2@test.com",
            password:"Test1234"
        });
        console.log("Failed-signup should not happen");
    } catch (error) {
        console.log("Already Signup Passed");
    }
}
/**
 * Test users get leagues, create leagues and join league
 */
async function testGetCreateJoinLeague(){
    try{
        const createLeague=await axios.post("http://localhost:5000/api/leagues/create",
        {
            name:"Something",
            region:"NA",
            teamName:"Team Blue"
    
        },config);
        const getLeagues=await axios.get("http://localhost:5000/api/leagues/",config);
        if(getLeagues.data.leagues[0].name!=="Something"){
            throw "FAILED, league hasn't been created successfully"
        }
        const joinLeague=await axios.post("http://localhost:5000/api/leagues/join",{
            leagueId:1,
            teamName:"Team Red",
        },config2);
        if(joinLeague.data.team.leagueId!==1&&joinLeague.data.team.teamName!=="Team Red"){
            throw "FAILED, join league has not created a team successfully"
        }
        console.log("GetCreateJoinLeague Test Passed");
    }catch(error){
        console.error(error);
    }
    
}
/**
 * Once user leaves league, api should fail when trying to retrieve created team
 */
async function testToFailLeaveLeagueGetTeam(){
    try {
        const leaveLeagueAsHost=await axios.delete("http://localhost:5000/api/teams/leaveLeague/1",config2);
        const team=await axios.get("http://localhost:5000/api/teams/getTeam/2",config2);
        } catch (error) {
            if(error.response.data.message!="Failed"){
                console.log("Failed, league has not been deleted successfully");
            }
            else{
                console.log("LeaveLeagueAsUser Passed")
            }
        }
}
/**
 * Once host of league leaves, api should fail trying to retrieve league info
 */
async function testToFailLeaveLeagueAsHostGetLeague(){
    try {
    const leaveLeagueAsHost=await axios.delete("http://localhost:5000/api/teams/leaveLeague/1",config);
    const league=await axios.get("http://localhost:5000/api/leagues/getLeagueInfo/1",config);
    } catch (error) {
        if(error.response.data.message!="No League Exists"){
            console.log("Failed, league has not been deleted successfully");
        }
        else{
            console.log("LeaveLeagueAsHost Passed")
        }
    }
}
/**
 * setup leagues again
 */
async function setUpCreateAndJoinLeague(){
    try{
        const createLeague=await axios.post("http://localhost:5000/api/leagues/create",
        {
            name:"Something",
            region:"NA",
            teamName:"Team Blue"
    
        },config);
        const getLeagues=await axios.get("http://localhost:5000/api/leagues/",config);
        const joinLeague=await axios.post("http://localhost:5000/api/leagues/join",{
            leagueId:2,
            teamName:"Team Red",
        },config2);
    }catch(error){
        console.error(error);
    }
}
/**
 * test chat messages api
 */
async function testChat(){
    try {
        const messages=await axios.get("http://localhost:5000/api/messages/2",config);
        if(messages.data.length>0){
            throw "failed, there shouldn't be any messages yet";
        }
        const send=await axios.post("http://localhost:5000/api/messages/sendMessage",{
            content:"hello",
            leagueId:2
          },config) 
        const messagesAgain=await axios.get("http://localhost:5000/api/messages/2",config);
        if(messagesAgain.data.messages[0].content!=="hello"&&messagesAgain.data.messages[0].leagueId!==2){
            throw "failed, the message has not been created properly";
        }
        console.log("Chat test passed")
    } catch (error) {
        console.error(error);
    }
}
/**
 * test start draft api, confirm through get league api to see change
 */
async function testStartDraft(){
    try {
        const start=await axios.put("http://localhost:5000/api/leagues/startDraft/",{
            leagueId:2
          },config);
        const league=await axios.get("http://localhost:5000/api/leagues/getLeagueInfo/"+2,config);
        if(league.data.league.draftStatus!=="ONGOING"){
            throw "Failed, draft should be ongoing now";
        }
        console.log("StartDraft Passed");
    } catch (error) {
        console.error(error);
    }
}
/**
 * test pick draft api, confirm through get team with the player
 */
async function testPickDraft(){
    try {
        const order=await axios.get("http://localhost:5000/api/drafts/getDraftOrder/" + 2,
        config)
        var pick;
        var team;
        if(order.data.pickOrder[0].userId===2){
            pick=await axios.put(
                "http://localhost:5000/api/drafts/addPlayer",
                {
                  leagueId: 2,
                  playerId: 1,
                  draftId: order.data.pickOrder[0].draftId,
                },
                config
              );
            teamWithPlayer=3;
            team=await axios.get("http://localhost:5000/api/teams/getTeam/"+3,config);
        }else{
            pick=await axios.put(
                "http://localhost:5000/api/drafts/addPlayer",
                {
                  leagueId: 2,
                  playerId: 1,
                  draftId: order.data.pickOrder[0].draftId,
                },
                config2
              );
            teamWithPlayer=4;
            team=await axios.get("http://localhost:5000/api/teams/getTeam/"+4,config);
        }
        if(team.data.teamPlayers[0].playerId!==1){
            throw "Failed, Pick player did not pass";
        }
        console.log("Pick Draft has Passed");
    } catch (error) {
        console.error(error);
    }
}
/**
 * Test finish draft api
 * get league to check
 */
async function testFinishDraft(){
    try {
        
    const finsih = await axios.put(
        "http://localhost:5000/api/leagues/finishDraft",
        {
        leagueId:2,
        },
        config
    );
    const response=await axios.get("http://localhost:5000/api/leagues/getLeagueInfo/"+2,config);
    if(response.data.league.draftStatus!=="FINISHED"){
        throw "FAILED draft finish";
    }
        console.log("FinishDraft Passed");
    } catch (error) {
        console.error(error);
    }
}

async function runTests(){
    await testAdminLogin();
    await testUserSignUpLogin();
    await testToFailLoginWrongCredentials();
    await testToFailSignupTakenEmail();
    await testGetCreateJoinLeague();
    await testToFailLeaveLeagueGetTeam();
    await testToFailLeaveLeagueAsHostGetLeague();
    await setUpCreateAndJoinLeague();
    await testChat();
    await testStartDraft();
    await testAddPlayersGetPlayers();
    await testPickDraft();
    await testFinishDraft();
}
runTests()