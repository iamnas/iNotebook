import { useState } from 'react';
import NoteContext from './noteContext';


const NoteState = (props) => {

  const host = "http://localhost:5000"
  const notesInitial = []
  const [notes, setNotes] = useState(notesInitial)

  //Add a note
  const getAllNote = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      // body: JSON.stringify({title, description, tags})
    });
    const json = await response.json();
    // //console.log(json);
    setNotes(json);

  }

  //Add a note

  const addNote = async (title, description, tags) => {
    // //console.log("adding a new note");
    //TODO :API call


    const response = await fetch(`${host}/api/notes/addnote`, {

      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tags })
    });
    const note = await response.json();
    // //console.log(json);
    setNotes(notes.concat(note));

  }

  //Delete a note 
  const deleteNote = async (id) => {
    // //console.log(notes);

    //TODO :API call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      }
    });
    const json = await response.json();
    console.log(json);
    const newNote = notes.filter((note) => { return note._id !== id })
    setNotes(newNote)

  }

  //Edit a note

  const editNote = async (id, title, description, tags) => {

    //console.log("Edit a note");
    //console.log("id", id);
    //TODO :API call

    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {

      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tags })
    });
    const json = await response.json();
    console.log(json);

    let newNotes = JSON.parse(JSON.stringify(notes));
    //Logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tags = tags;
        break;
      }
    }

    setNotes(newNotes);

  }

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getAllNote }} >
      {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState;



