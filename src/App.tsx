import { FC, Fragment, useMemo, useRef, useState } from "react";
import "./App.css";
import { useScoringLogic, Player } from "./useScoringLogic";

function App() {
  const state = useScoringLogic();

  const sortedPlayers = useMemo(
    () => [...state.players].sort((a, b) => b.score - a.score),
    [state.players]
  );

  return (
    <>
      <div>
        <h1 className="Title">Take Two</h1>
        <div className="GameActions">
          <button type="button" onClick={() => state.addPlayer("New Player")}>
            Add Player
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm("Are you sure?")) state.clearWords();
            }}
          >
            New Game
          </button>
        </div>
        <div className="Summary">
          <h2>Scoreboard</h2>
          <div className="Summary__playerList">
            {sortedPlayers.map((player) => (
              <Fragment key={player.name}>
                <span>{player.name}</span>
                <span className="right-align">{player.score}</span>
              </Fragment>
            ))}
          </div>
        </div>
        <div className="PlayersList">
          {state.players.map((p, playerIndex) => (
            <PlayerView
              key={playerIndex}
              player={p}
              actions={bindState(playerIndex, state)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

const bindState = (
  playerIndex: number,
  state: ReturnType<typeof useScoringLogic>
): PlayerProps["actions"] => {
  return {
    addWord: (w) => state.addWord(playerIndex, w),
    removeWord: (i) => state.removeWord(playerIndex, i),
    removePlayer: () => {
      if (confirm("Are you sure?")) state.removePlayer(playerIndex);
      else console.log("what");
    },
    setName: (n) => state.setPlayerName(playerIndex, n),
  };
};

interface PlayerProps {
  player: Player;
  actions: {
    addWord: (word: string) => void;
    removeWord: (wordIndex: number) => void;
    removePlayer: () => void;
    setName: (name: string) => void;
  };
}

const PlayerView: FC<PlayerProps> = ({ player, actions }) => {
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState(false);
  const wordInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="Player">
      <PlayerName
        name={player.name}
        onUpdate={(n) => actions.setName(n)}
        onRemove={() => actions.removePlayer()}
      />
      <div className="Player__actions">
        {!adding && !removing && (
          <>
            <button
              type="button"
              onClick={() => {
                setAdding(true);
                setTimeout(() => wordInputRef.current?.focus());
              }}
            >
              + Add Words
            </button>
            <button
              type="button"
              onClick={() => {
                setRemoving(true);
              }}
            >
              Edit
            </button>
          </>
        )}
        {removing && (
          <>
            <span className="red-200">Removing words</span>
            <button type="button" onClick={() => setRemoving(false)}>
              Cancel
            </button>
          </>
        )}
      </div>
      {adding && (
        <form
          className="Player__wordForm"
          onSubmit={(e) => {
            e.preventDefault();
            if (!wordInputRef.current) return;

            const value = wordInputRef.current?.value.trim();
            if (!value) return;

            actions.addWord(value);
            wordInputRef.current.value = "";
          }}
        >
          <input type="text" ref={wordInputRef} />
          <button type="button" onClick={() => setAdding(false)}>
            Done
          </button>
        </form>
      )}
      {player.words.length === 0 && <em>No words added</em>}
      <div className="Player__wordList">
        {player.words.map((w, i) => (
          <Fragment key={i}>
            <span>{w.word}</span>
            {!removing && <span className="right-align">{w.score}</span>}
            {removing && (
              <button
                type="button"
                onClick={() => actions.removeWord(i)}
                className="danger"
              >
                X
              </button>
            )}
          </Fragment>
        ))}
        <span className="Player__scoreTotal">Total:</span>
        <span className="Player__scoreTotal right-align">{player.score}</span>
      </div>
    </div>
  );
};

interface PlayerNameProps {
  name: string;
  onUpdate: (name: string) => void;
  onRemove: () => void;
}

const PlayerName: FC<PlayerNameProps> = (props) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(props.name);

  const inputRef = useRef<HTMLInputElement>(null);

  if (editing) {
    return (
      <form
        className="Player__nameForm"
        onSubmit={(e) => {
          e.preventDefault();
          props.onUpdate(value);
          setEditing(false);
        }}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          ref={inputRef}
        />
        <button>Save</button>
      </form>
    );
  }

  return (
    <div className="Player__name">
      <div
        onClick={() => {
          setEditing(true);
          setTimeout(() => inputRef.current?.focus());
        }}
      >
        <h2>{props.name}</h2>
      </div>
      <button
        type="button"
        onClick={props.onRemove}
        title="Remove Player"
        className="danger"
      >
        X
      </button>
    </div>
  );
};

export default App;
