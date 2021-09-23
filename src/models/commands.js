import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  name:{ 
    type:String,
    lowercase:true,
    required:true,
    unique: true,
    index:true
  },
  response:{
    type:String,
    required:true
  },
});

export default mongoose.model.commands || mongoose.model('commands', Schema);