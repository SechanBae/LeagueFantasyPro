/**
 * Renders component for trade page
 */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Tab, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Message from "../../components/Message";
import Pagination from "../../components/Pagination";
import PlayerTable from "../../components/PlayerTable";
import TradeCard from "../../components/TradeCard";
var config;
var currentAvailablePlayers;
var userId;
const TradePage = () => {
  const { teamId } = useParams();
  const [error, setError] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [selected, setSelected] = useState("received");
  const [received, setReceived] = useState(false);
  const [sent, setSent] = useState(false);
  const [availablePlayers, setAvailablePlayers] = useState(false);
  const [playersPerPage, setplayersPerPage] = useState(6);
  const [currentPage, setcurrentPage] = useState(1);
  const [wantPlayerChosen, setWantPlayerChosen] = useState(0);
  const [teamPlayerChosen, setTeamPlayerChosen] = useState(0);
  const [filter, setFilter] = useState("");
  const [teamPlayers, setTeamPlayers] = useState(false);
  const [toggleCreate, setToggleCreate] = useState(false);
  const [tradeFilter, setTradeFilter] = useState("");
  const [showCompare, setShowCompare] = useState(false);
  const lastPostIndex = currentPage * playersPerPage;
  const firstPostIndex = lastPostIndex - playersPerPage;
  if (availablePlayers) {
    currentAvailablePlayers = availablePlayers
      .filter((player) =>
        player.gameName.toLowerCase().includes(filter.toLowerCase())
      )
      .slice(firstPostIndex, lastPostIndex);
  }
  const navigate = useNavigate();
  /**
   * make api call to get trades
   */
  const getTrades = async () => {
    try {
      const response = await axios.get(
        "/api/trades/getTrades/" + teamId,
        config
      );
      setReceived(response.data.rTrades);
      setSent(response.data.sTrades);
    } catch (error) {
      setError(error.reponse.data.message);
      setConfirm(false);
    }
  };
  /**
   * make api call to get available players
   */
  const getAvailablePlayers = async () => {
    try {
      const response = await axios.get(
        "/api/trades/getAvailablePlayers/" + teamId,
        config
      );
      setAvailablePlayers(response.data.players);
    } catch (error) {
      setError(error.reponse.data.message);
      setConfirm(false);
    }
  };
  /**
   * make api call to get own team's players
   */
  const getTeamPlayers = async () => {
    try {
      const response = await axios.get("/api/teams/getTeam/" + teamId, config);
      if ((await response.data.team.userId) != userId) {
        navigate("/team/" + teamId);
      }
      setTeamPlayers(response.data.teamPlayers);
    } catch (error) {
      setError(error.reponse.data.message);
      setConfirm(false);
    }
  };
  /**
   * make api call to create trade with user inputs
   * @returns
   */
  const submitTrade = async () => {
    if (!wantPlayerChosen || !teamPlayerChosen) {
      setConfirm(false);
      setError("You Must Choose Players To Trade");
      setConfirm(false);
      return;
    }
    if (wantPlayerChosen.position != teamPlayerChosen.position) {
      setConfirm(false);
      setError("You Must Choose Players In The Same Position To Trade");
      setConfirm(false);
      return;
    }
    try {
      const response = await axios.post(
        "/api/trades/createTrade",
        {
          wantedPlayer: wantPlayerChosen.playerId,
          offeredPlayer: teamPlayerChosen.playerId,
          sender: teamId,
          receiverTeamName: wantPlayerChosen.team,
        },
        config
      );
      if (response) {
        getTrades();
        setConfirm("Trade Offer Has Been Submitted");
        setError(false);
      }
    } catch (error) {
      setError(error.reponse.data.message);
      setConfirm(false);
    }
  };
  /**
   * make api call to change trade status to response of user
   * @param {*} tradeId
   * @param {*} newStatus
   */
  const changeTradeStatus = async (tradeId, newStatus) => {
    try {
      const response = await axios.put(
        "/api/trades/changeStatus",
        {
          newStatus: newStatus,
          tradeId: tradeId,
        },
        config
      );
      getTrades();
      setConfirm("Trade Offer Has Been Changed");
      setError(false);
    } catch (error) {
      setError(error.reponse.data.message);
      setConfirm(false);
    }
  };
  /**
   * When component is mounted, redirect user if they are not logged in and set config headers for verify login,
   * and call methods to get data needed
   */
  useEffect(() => {
    const userInfo = sessionStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/");
    } else {
      userId = JSON.parse(userInfo).userId;
      config = {
        headers: {
          Authorization: "Bearer " + JSON.parse(userInfo).token,
        },
      };
    }
    getTrades();
    getAvailablePlayers();
    getTeamPlayers();
  }, []);

  return (
    <div className="container">
      {confirm && <Message variant="info">{confirm}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      <Button onClick={() => navigate("/team/" + teamId)}>
        Back To Team Page
      </Button>
      <h2>Trades</h2>
      <Button
        onClick={() => setToggleCreate(!toggleCreate)}
        variant={!toggleCreate ? "success" : "danger"}
        className="d-flex ms-auto"
      >
        {!toggleCreate ? "Create Trade" : "Cancel"}
      </Button>
      {toggleCreate && (
        <div>
          <div className="row">
            <h3 className="text-center">Create Trade</h3>
            <div className="col-sm-12">
              <h5 className="text-center">
                Select The Player You Want To Trade For
              </h5>
              <Form.Control
                className="mb-5"
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search for players name"
              />
              <div className="overflowx mx-2">
                <PlayerTable
                  playerChosen={wantPlayerChosen}
                  setPlayerChosen={setWantPlayerChosen}
                  setPlayers={setAvailablePlayers}
                  currentPlayers={currentAvailablePlayers}
                  players={availablePlayers}
                />
              </div>
              <Pagination
                totalPosts={
                  availablePlayers &&
                  availablePlayers.filter((player) =>
                    player.gameName.toLowerCase().includes(filter.toLowerCase())
                  ).length
                }
                postsPerPage={playersPerPage}
                setCurrentPage={setcurrentPage}
                currentPage={currentPage}
              />
            </div>
            <div className="col-sm-12 mt-auto">
              <h5 className="text-center">
                Select The Player You Want To Trade Away
              </h5>
              <div className="overflowx mx-2">
                <PlayerTable
                  playerChosen={teamPlayerChosen}
                  setPlayerChosen={setTeamPlayerChosen}
                  setPlayers={setTeamPlayers}
                  currentPlayers={teamPlayers}
                  players={teamPlayers}
                />
              </div>
            </div>
          </div>
          <Button
            onClick={submitTrade}
            variant="info"
            className="d-flex mx-auto my-3"
          >
            Submit Trade Offer
          </Button>
        </div>
      )}
      <h3 className="text-center">Trade Offers</h3>
      <div className="container d-flex justify-content-center">
        <Button
          onClick={() => setSelected("received")}
          variant="outline-secondary"
          style={{ width: "10rem" }}
          className="p-2 m-2"
          active={selected === "received" ? true : false}
        >
          Received Offers
        </Button>
        <Button
          onClick={() => setSelected("sent")}
          variant="outline-secondary"
          style={{ width: "10rem" }}
          className="p-2 m-2"
          active={selected !== "received" ? true : false}
        >
          Sent Offers
        </Button>
      </div>

      <div className="container d-flex justify-content-center flex-wrap">
        <Button
          onClick={() => setTradeFilter("")}
          variant="outline-secondary"
          className="p-1 m-1"
          size="sm"
          active={tradeFilter === "" ? true : false}
        >
          All
        </Button>
        <Button
          onClick={() => setTradeFilter("PENDING")}
          variant="outline-secondary"
          size="sm"
          className="p-1 m-1"
          active={tradeFilter === "PENDING" ? true : false}
        >
          Pending
        </Button>
        <Button
          onClick={() => setTradeFilter("ACCEPTED")}
          variant="outline-secondary"
          size="sm"
          className="p-1 m-1"
          active={tradeFilter === "ACCEPTED" ? true : false}
        >
          Accepted
        </Button>
        <Button
          onClick={() => setTradeFilter("DENIED")}
          variant="outline-secondary"
          size="sm"
          className="p-1 m-1"
          active={tradeFilter === "DENIED" ? true : false}
        >
          Denied
        </Button>
        <Button
          onClick={() => setTradeFilter("EXPIRED")}
          variant="outline-secondary"
          size="sm"
          className="p-2 m-1"
          active={tradeFilter === "EXPIRED" ? true : false}
        >
          Expired
        </Button>
      </div>
      <div className="d-flex justify-content-center flex-column my-3">
        {selected == "received" &&
          received &&
          received
            .filter((t) => t.trade.status.includes(tradeFilter))
            .map((trade) => (
              <TradeCard
                key={trade.trade.tradeId}
                variant={"received"}
                trade={trade}
                showCompare={showCompare}
                setShowCompare={setShowCompare}
                changeTradeStatus={changeTradeStatus}
              />
            ))}
        {selected == "sent" &&
          sent &&
          sent
            .filter((t) => t.trade.status.includes(tradeFilter))
            .map((trade) => (
              <TradeCard
                key={trade.trade.tradeId}
                variant={"sent"}
                trade={trade}
                showCompare={showCompare}
                setShowCompare={setShowCompare}
                changeTradeStatus={changeTradeStatus}
              />
            ))}
      </div>
    </div>
  );
};

export default TradePage;
