/**
 * Renders component for draft page
 */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Form, Table } from "react-bootstrap";
import Pagination from "../../components/Pagination";
import Message from "../../components/Message";
import io from "socket.io-client";
import PlayerTable from "../../components/PlayerTable";
var config;
const ENDPOINT = "https://league-fantasy-pro.herokuapp.com/"; //change for deploy
var socket;
const DraftPage = () => {
  const { leagueId } = useParams();
  const [error, setError] = useState(false);
  const [players, setPlayers] = useState([]);
  const [pickOrder, setPickOrder] = useState([]);
  const [playersPerPage, setplayersPerPage] = useState(10);
  const [currentPage, setcurrentPage] = useState(1);
  const [playerChosen, setPlayerChosen] = useState(0);
  const [userId, setUserId] = useState(0);
  const [filter, setFilter] = useState("");
  const [chosenPlayersFilter, setChosenPlayersFilter] = useState([0]);
  const navigate = useNavigate();
  const [orderDirection, setOrderDirection] = useState("ASC");
  const lastPostIndex = currentPage * playersPerPage;
  const firstPostIndex = lastPostIndex - playersPerPage;
  const currentPlayers = players
    .filter((player) =>
      player.gameName.toLowerCase().includes(filter.toLowerCase())
    )
    .filter((player) => !chosenPlayersFilter.includes(player.playerId))
    .slice(firstPostIndex, lastPostIndex);
  const currentPick = pickOrder.find((pick) => pick.players == null);
  /**
   * make api calls to get list of players
   */
  const getPlayers = async () => {
    try {
      const playerResponse = await axios.get(
        "/api/players/getPlayers/" + leagueId,
        config
      );
      setPlayers(playerResponse.data.players);
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  /**
   * make api call to get list of draft picks
   */
  const getPickOrder = async () => {
    try {
      const orderResponse = await axios.get(
        "/api/drafts/getDraftOrder/" + leagueId,
        config
      );
      setPickOrder(orderResponse.data.pickOrder);
      const filterArray = [];
      for (let i = 0; i < orderResponse.data.pickOrder.length; i++) {
        if (orderResponse.data.pickOrder[i].playerId) {
          filterArray.push(orderResponse.data.pickOrder[i].playerId);
        }
      }
      setChosenPlayersFilter(filterArray);
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  /**
   * When component is mounted, redirect user if they are not logged in and set config headers for verify login,
   * start websocket and calls methods to get players and pickorder
   */
  useEffect(() => {
    const userInfo = sessionStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/");
    } else {
      setUserId(JSON.parse(userInfo).userId);
      config = {
        headers: {
          Authorization: "Bearer " + JSON.parse(userInfo).token,
        },
      };
      getPlayers();
      getPickOrder();
      socket = io(ENDPOINT);

      socket.on("draftPickBroadcast", (leagueIdBroadcast) => {
        if (leagueIdBroadcast == leagueId) {
          getPickOrder();
        }
      });
    }
  }, []);
  /**
   * Once the last user of the draft has picked, make api call to finish draft
   */
  const finishDraft = async () => {
    try {
      const response = await axios.put(
        "/api/leagues/finishDraft",
        {
          leagueId: leagueId,
        },
        config
      );
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  /**
   * make api call to draft player user has chosen
   */
  const draftPlayer = async () => {
    if (playerChosen) {
      try {
        const response = await axios.put(
          "/api/drafts/addPlayer",
          {
            leagueId: leagueId,
            playerId: playerChosen.playerId,
            draftId: currentPick.draftId,
          },
          config
        );
        if (response) {
          socket.emit("draftPickSubmit", leagueId);
          getPickOrder();
          setError(false);
          if (currentPick == null) {
            finishDraft();
          } else if (currentPick == pickOrder[pickOrder.length - 1]) {
            finishDraft();
          }
        }
      } catch (error) {
        setError(error.response.data.message);
      }
    } else {
      setError("You Must Select a Player");
    }
  };
  return (
    <div className="container">
      {error && <Message variant="danger">{error}</Message>}
      <Button onClick={() => navigate("/league/" + leagueId)}>
        Back To League Page
      </Button>
      {currentPick && currentPick.userId == userId && (
        <Message variant="warning">Your Turn To Pick</Message>
      )}
      <h2>Draft Page</h2>
      <div className="pickorder">
        <h3 className="text-center">
          {pickOrder.length ? "Order of Picks" : "Waiting for host to start..."}
        </h3>
        <ul className="list-group list-group-horizontal order overflowx">
          {pickOrder &&
            pickOrder.map((pick) => (
              <div key={pick.draftId}>
                <li>
                  <Card style={{ width: "10rem" }} className="me-2">
                    <Card.Header as="h5">
                      {pick.users.username}'s pick
                    </Card.Header>
                    <Card.Body>
                      {currentPick &&
                        currentPick.draftId == pick.draftId &&
                        pick.players == null &&
                        "Currently Picking"}
                      {currentPick &&
                        currentPick.draftId != pick.draftId &&
                        pick.players == null &&
                        "Waiting to Pick"}
                      {pick.players &&
                        pick.players.gameName + " has been picked"}
                    </Card.Body>
                  </Card>
                </li>
              </div>
            ))}
        </ul>
      </div>
      <div className="playersList my-3">
        <h3 className="text-center">Draft Players</h3>
        <Form.Control
          className="mb-5"
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search for players name"
        />
        <div className="playerTable">
          <PlayerTable
            playerChosen={playerChosen}
            setPlayerChosen={setPlayerChosen}
            setPlayers={setPlayers}
            currentPlayers={currentPlayers}
            players={players}
          />
        </div>

        <Pagination
          totalPosts={
            players
              .filter((player) =>
                player.gameName.toLowerCase().includes(filter.toLowerCase())
              )
              .filter(
                (player) => !chosenPlayersFilter.includes(player.playerId)
              ).length
          }
          postsPerPage={playersPerPage}
          setCurrentPage={setcurrentPage}
          currentPage={currentPage}
        />
        <div className="d-flex justify-content-center my-3">
          <Button
            disabled={
              (currentPick && currentPick.userId != userId) || !currentPick
            }
            onClick={() => {
              draftPlayer();
            }}
            variant="light"
          >
            Lock In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DraftPage;
