import mongoose from 'mongoose';

const mongodb = mongoose.connect(
  process.env.MONGODB_CONNECTIONSTRING as string,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

export default mongodb;
