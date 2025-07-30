const axios=require("axios")
const http=axios.create({
    baseUrl:"localhost:3000"
})
module.exports=http