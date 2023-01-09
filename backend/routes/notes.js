const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');


// ROUTE 1:get all the notes of a particular User using: get "/api/notes/fetchallnotes" .Login required  
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})

// ROUTE 2:Add a new notes of a particular User using: POST "/api/notes/addnote" .Login required  
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'description must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {

    try {

        //If there are errors, return bad require and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { description, title, tags } = req.body;
        const note = new Notes({ description, title, tags, user: req.user.id })
        const savedNote = await note.save()

        res.json(savedNote);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})

// ROUTE 3:Update an existing Note using: PUT "/api/notes/updatenote" .Login required  
router.put('/updatenote/:id', fetchuser, async (req, res) => {

    try {
        const { description, title, tags } = req.body;
        //Create a newNote object 
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tags) { newNote.tags = tags }

        // Find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found"); }

        console.log(note.user);

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });

        res.json(note)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})

// ROUTE 4:Delete an existing Note using: DELETE "/api/notes/deletenote" .Login required  
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {

        // Find the note to be deleted and delete it
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found"); }

        //Allowed deletion only if the user is owner of this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id)

        // note = await Notes.findByIdAndUpdate(req.params.id, {$set:newNote},{new:true});

        res.json({"Success":"Note has been deleted",note})
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router;
