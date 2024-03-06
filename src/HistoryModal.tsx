import { FC, Fragment, useEffect, useMemo, useRef } from "react";
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  const { open } = props;

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    }
  }, [open]);

  const summarized = useMemo(() => {
    const collated = props.history.games.reduce<Record<string, number>>(
      (acc, game) => {
        game.scores.forEach((g) => {
          if (acc[g.name] === undefined) {
            acc[g.name] = 0;
          }
          acc[g.name] += g.score;
        });
        return acc;
      },
      {}
    );

    return Object.entries(collated)
      .map<{ name: string; score: number }>(([name, score]) => ({
        name,
        score,
      }))
      .sort((a, b) => b.score - a.score);
  }, [props.history.games]);

  return createPortal(
    <dialog className="Modal" ref={dialogRef}>
      <div className="ModalHeader">
        <h2>Past Games</h2>
        <button
          type="button"
          onClick={() => {
            dialogRef.current?.close();
            props.onClose();
          }}
          autoFocus
        >
          Close
        </button>
      </div>
      <div className="Leaderboard">
        <h3>All-Time Leaderboard</h3>
        <div className="Leaderboard__list">
          {summarized.map((s, i) => (
            <Fragment key={i}>
              <span>{s.name}</span>
              <span className="right-align">{s.score}</span>
            </Fragment>
          ))}
        </div>
      </div>
      <div>
        <h3>Past Games</h3>
        <div className="PastGamesList">
          <span>Date</span>
          <span>Winner</span>
          <span>Score</span>
          <div className="GameEntry">
            {props.history.games.map((g, i) => (
              <Fragment key={i}>
                <span>{g.date}</span>
                <span>{g.scores[0]?.name}</span>
                <span className="right-align">{g.scores[0]?.score}</span>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </dialog>,
    MODAL_TARGET
  );
};
