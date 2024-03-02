import { FC, Fragment, useRef, useState } from "react";
import "./App.css";
import { useScoringLogic, Player } from "./useScoringLogic";

function App() {
  const state = useScoringLogic();

  return (
    <>
      <div>
        <h1>Take Two</h1>
        <div>
          <button type="button" onClick={() => state.addPlayer("New Player")}>
            Add Player
          </button>
          <button type="button" onClick={() => state.clearWords()}>
            New Game
          </button>
        </div>
        {state.players.map((p, playerIndex) => (
          <PlayerView
            key={playerIndex}
            player={p}
            actions={bindState(playerIndex, state)}
          />
        ))}
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
    removePlayer: () => state.removePlayer(playerIndex),
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
  const wordInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <PlayerName
        name={player.name}
        onUpdate={(n) => actions.setName(n)}
        onRemove={() => actions.removePlayer()}
      />
      {!adding && (
        <div>
          <button type="button" onClick={() => setAdding(true)}>
            +
          </button>
        </div>
      )}
      {adding && (
        <form
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
      {player.words.length === 0 && "No words added"}
      <div>
        {player.words.map((w, i) => (
          <Fragment key={i}>
            <span>{w.word}</span>
            <span>{w.score}</span>
          </Fragment>
        ))}
        <div>
          <span>Total:</span>
          <span>{player.score}</span>
        </div>
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
    <div>
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
        onClick={() => props.onRemove()}
        title="Remove Player"
      >
        X
      </button>
    </div>
  );
};

export default App;
