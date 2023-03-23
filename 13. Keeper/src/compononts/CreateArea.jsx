import React, { useState } from "react";
import Zoom from "@mui/material/Zoom";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

function CreateArea(props) {
  const [input, setInput] = useState({
    title: "",
    content: "",
  });

  const [isClicked, setIsClicked] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setInput((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  function expand() {
    setIsClicked(true);
  }

  function submitNote(event) {
    event.preventDefault();
    props.onAdd(input);
    setInput({
      title: "",
      content: "",
    });
  }

  return (
    <div>
      <form className="create-note">
        {isClicked && (
          <input
            onChange={handleChange}
            name="title"
            placeholder="Title"
            value={input.title}
          />
        )}
        <textarea
          name="content"
          placeholder="Take a note..."
          onClick={expand}
          rows={isClicked ? 3 : 1}
          onChange={handleChange}
          value={input.content}
        />
        {isClicked && (
          <Zoom in={true}>
            <Fab onClick={submitNote}>
              <AddIcon />
            </Fab>
          </Zoom>
        )}
      </form>
    </div>
  );
}

export default CreateArea;
