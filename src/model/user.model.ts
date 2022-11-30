import shortid from "shortid"

export default {
    _id: {
        type: String,
        required: false,
        default: shortid.generate,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    }

}
