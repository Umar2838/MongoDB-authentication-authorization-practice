const express = require("express")
const app = express()
const userModel = require("./models/user")
const path = require("path")
const bcrypt = require('bcrypt')
const cookie = require("cookie-parser")
const jwt = require("jsonwebtoken")
app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))
app.use(cookie())


app.get("/",(req,res)=>{
res.render("index")
})

app.post("/create", async (req,res)=>{
    let {username,email,password,age} = req.body
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async(err, hash)=> {
            let createduser = await userModel.create({
                username,
                email,
                password:hash,
                age
                    })
                  let token =  jwt.sign({email},"secret")
                  res.cookie("token",token) 
                  res.send(createduser)
        });
    });
})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.get("/logout",(req,res)=>{
    res.cookie("token","")
    res.redirect("/")
})

app.post("/login", async(req,res)=>{
   
    let user = await userModel.findOne({email:req.body.email})
       if(!user){
    return res.send("something went wrong")
   }
   bcrypt.compare(req.body.password, user.password, function(err, result) {
    console.log(result)
    if(result){
        let token =  jwt.sign({email : user.email},"secret")
                  res.cookie("token",token) 
   res.send("Yes you can login")
    }
else{
    res.send("You can't login")

}
});
})

app.listen(3000)