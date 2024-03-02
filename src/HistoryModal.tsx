import { FC, Fragment } from "react";
import { createPortal } from "react-dom";
import { useGameHistory } from "./useGameHistory";
import "./HistoryModal.css";

const MODAL_TARGET = document.querySelector("#modal-root")!;

export type Props = {
  open: boolean;
  onClose: () => void;
  history: ReturnType<typeof useGameHistory>;
};

export const HistoryModal: FC<Props> = (props) => {
  return createPortal(
    <dialog open={props.open} className="Modal">
      <div className="ModalHeader">
        <h2>Past Games</h2>
        <button type="button" onClick={props.onClose}>
          Close
        </button>
      </div>
      <div className="PastGamesList">
        <span>Date</span>
        <span>Winner</span>
        <span>Score</span>
        <div className="GameEntry">
          {props.history.games.map((g, i) => (
            <Fragment key={i}>
              <span>{g.date}</span>
              <span>{g.scores[0]?.name}</span>
              <span>{g.scores[0]?.score}</span>
            </Fragment>
          ))}
        </div>
      </div>
    </dialog>,
    MODAL_TARGET
  );
};
