import { isEqual } from "lodash";
import React from "react";
import { Button, Card, Table } from "react-bootstrap";

const TradeCard = ({
  variant,
  trade,
  changeTradeStatus,
  setShowCompare,
  showCompare,
}) => {
  return (
    <Card style={{ width: "80vw" }} className="mx-auto my-2">
      <Card.Body>
        <h5 className="text-center">{trade.trade.status}</h5>
        {variant == "sent" ? (
          <p className="text-center">
            <strong>YOU - ({trade.sender.teamName})</strong>
            <br />
            {trade.offeredPlayer.gameName}
            <br />
            {"\u2191"}
            {"\u2193"}
            <br />
            {trade.wantedPlayer.gameName}
            <br />
            <strong>Them - ({trade.receiver.teamName})</strong>
          </p>
        ) : (
          <p className="text-center">
            <strong>THEM - ({trade.sender.teamName})</strong>
            <br />
            {trade.offeredPlayer.gameName}
            <br />
            {"\u2191"}
            {"\u2193"}
            <br />
            {trade.wantedPlayer.gameName}
            <br />
            <strong>YOU - ({trade.receiver.teamName})</strong>
          </p>
        )}

        <Button
          variant="info"
          size="sm"
          className="d-flex mx-auto"
          onClick={() => setShowCompare(trade)}
        >
          Compare
        </Button>
        {isEqual(showCompare, trade) && (
          <div className="overflowx">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Game Name</th>
                  <th>Team</th>
                  <th>Position</th>
                  <th>Avg KPG</th>
                  <th>Avg DPG</th>
                  <th>Avg APG</th>
                  <th>Avg CSPG</th>
                  <th>Score Rating</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{trade.offeredPlayer.gameName}</td>
                  <td>{trade.offeredPlayer.team}</td>
                  <td>{trade.offeredPlayer.position}</td>
                  <td>{trade.offeredPlayer.avgKPG}</td>
                  <td>{trade.offeredPlayer.avgDPG}</td>
                  <td>{trade.offeredPlayer.avgAPG}</td>
                  <td>{trade.offeredPlayer.avgCSPG}</td>
                  <td>{trade.offeredPlayer.scoreRating}</td>
                </tr>
                <tr>
                  <td>{trade.wantedPlayer.gameName}</td>
                  <td>{trade.wantedPlayer.team}</td>
                  <td>{trade.wantedPlayer.position}</td>
                  <td>{trade.wantedPlayer.avgKPG}</td>
                  <td>{trade.wantedPlayer.avgDPG}</td>
                  <td>{trade.wantedPlayer.avgAPG}</td>
                  <td>{trade.wantedPlayer.avgCSPG}</td>
                  <td>{trade.wantedPlayer.scoreRating}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        )}
        <div className="d-flex flex-row justify-content-center">
          {((variant == "sent" )&&(trade.trade.status == "PENDING")) && (
              <Button
                variant="danger"
                size="sm"
                className="d-flex ms-auto"
                onClick={() => changeTradeStatus(trade.trade.tradeId, "EXPIRED")}
              >
                Cancel
              </Button>
            )
        }  
        {((variant == "received" )&&(trade.trade.status == "PENDING")) && 
            <>
              <Button
                variant="success"
                size="sm"
                className="d-flex me-auto"
                onClick={() => changeTradeStatus(trade.trade.tradeId, "ACCEPTED")}
              >
                Accept
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="d-flex ms-auto"
                onClick={() => changeTradeStatus(trade.trade.tradeId, "DENIED")}
              >
                Deny
              </Button>
            </>
          }
        </div>
      </Card.Body>
    </Card>
  );
};

export default TradeCard;
