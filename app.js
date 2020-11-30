const express = require('express');
const exphbs = require('express-handlebars');
var cookieParser = require('cookie-parser');
const app = express();
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.use(cookieParser());
//JSON object to be added to cookie 
let users = { 
    name : "sachin", 
    age : "45"
} 

var myLogger = function (req, res, next) {
    req.requestTime = Date.now()
    req.forViewToDisplay = {
        protocol:req.protocol,
        hostname:req.hostname,
        path:req.path,
        originalUrl:req.originalUrl,
        subDomain:req.subdomains,
        method:req.method,
        keyword: req.query.keyword,
        userAgent:req.header('user-agent'),
        headerAuthorization:req.header('Authorization'),
        headerContentType:req.header('Content-Type')
    }
    console.log('LOGGED')
    next()
}
app.use(myLogger)

//Route for adding cookie 
app.get('/setuser', (req, res)=>{ 
    users.ts= new Date().getTime()
    res.cookie("userData", users); 
    res.append('Set-Cookie', 'myCookie-localhost='+ 'sachin - ' + new Date().getTime())
    res.redirect('/'); 
});
//Iterate users data from cookie 
app.get('/getuser', (req, res)=>{ 
    //shows all the cookies 
    // res.send(req.cookies); 
    res.render('req',req.cookies.userData)
});  

app.get('/', (req, res) => {
    res.append('Set-Cookie', 'myCookie-localhost='+ new Date().getTime())
    res.render('home',{
        author:'sachin',
        image:'https://picsum.photos/500/500',
        reqTime:req.requestTime,
        // comments:['one','two']
        comments:[
            {name:'sachin',age:44},
            {name:'shilpa',age:44}
        ]
    })
});

app.get('/reqParams', (req,res)=>{
    // 
    req.forViewToDisplay['coockies']=req.cookies['myCookie-localhost']
    res.render('req',
        // I can pass object to view as shown below
        // {
        //     protocol:req.protocol,
        //     hostname:req.hostname,
        //     path:req.path,
        //     originalUrl:req.originalUrl,
        //     subDomain:req.subdomains,
        //     method:req.method,
        //     keyword: req.query.keyword,
        //     userAgent:req.header('user-agent'),
        //     headerAuthorization:req.header('Authorization'),
        //     headerContentType:req.header('Content-Type')
        // }
        //OR i can pass the object to view as i populated in middleware function
        //note that req.forViewToDisplay is a variable that i populated in 
        //middleware function and assigned it to req object. So that I can use it here
        req.forViewToDisplay,

    )
})

app.listen(3000, () => {
    console.log('The web server has started on port 3000');
});