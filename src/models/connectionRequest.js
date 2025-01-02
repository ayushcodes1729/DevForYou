const mongoose = require("mongoose");

const {Schema} = mongoose;

const connectionRequestSchema = new Schema(
    {
        fromUserId : {
            type : mongoose.Types.ObjectId,
            required : true,
            ref : "User"
        },
        toUserId : {
            type : mongoose.Types.ObjectId
        },
        status : {
            type : String,
            enum : {
                values: ["interested", "ignored", "accepted", "rejected"],
                message: '{VALUE} status type is not allowed' 
            }
        }
    },
    { timestamps : true}
)

connectionRequestSchema.index({fromUserId : 1, toUserId : 1})

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot sent connection request to yourself");
    }
    next();
})

const ConnectionRequestModel = mongoose.model("ConnectionRequestModel", connectionRequestSchema );
module.exports = ConnectionRequestModel;