import shortid from "shortid"

export default {
    _id: {
        type: String,
        required: false,
        default: shortid.generate,
    },
    firstName: {
        type: String,
        required:false
    },
    lastName: {
        type: String,
        required:false
    },
    email: {
        type: String,
        required:false
    },
    phoneNumber: {
        type: String,
        required:false
    },
    password:{
        type:String,
        required:false
    },
    role:{
        type:String,
        required:false
    },
    delete:{
        type:Boolean,
        required:false,
        default:false
    }

}
