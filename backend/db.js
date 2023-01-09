const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/inotebook'

const connectToMongo = async() =>{
    mongoose.connect(mongoURI,()=>{
        console.log("Connected to Mongo successfully ");
    });
}


module.exports = connectToMongo;
// const Cat = mongoose.model('Cat', { name: String });

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));