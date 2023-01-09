import React, { useContext, useState } from 'react'
import noteContext from '../context/notes/noteContext';

const AddNote = (props) => {
    const [note, setNote] = useState({ title: "", description: "", tags: "" })
    const context = useContext(noteContext)
    const { addNote } = context;
    const handleClick = (e) => {
        //it is used for if any change is occour page will not reload
        e.preventDefault();
        addNote(note.title, note.description, note.tags)
        setNote({title: "", description: "", tags: "" })
        props.showAlert("Added Successfully","success")

    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }
    return (
        <div className="container my-3" >
            <h2>Add a Note</h2>
            <form className="my-3">
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title" value={note.title} onChange={onChange} minLength={5} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name="description" value={note.description} onChange={onChange} minLength={5} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tags" name="tags" value={note.tags} onChange={onChange} />
                </div>
                <button disabled = { note.title.length<5||note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
            </form>
        </div>
    )
}

export default AddNote