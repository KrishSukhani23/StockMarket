var express = require('express');
var path = require('path');
var exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const axios = require('axios');
var yahooStockPrices = require('yahoo-stock-prices');
const app = express();


app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static("public"))

app.get('/', async(req,res)=>{
    console.log('Hii');
    const predictstockone = ['TCS.NS','EICHERMOT.NS','HDFCBANK.NS','BRITANNIA.NS','BAJFINANCE.NS','ASIANPAINT.NS','HINDUNILVR.NS','TATAMOTORS.NS','WIPRO.NS','RELIANCE.NS']


    yahooStockPrices.getHistoricalPrices(1, 1, 2012, 10, 25, 2020, predictstockone[0], '1d', function(err, prices){
        
        revPrices = prices.reverse();
        let close = [];
        // let date = new Date(1970,0,1);
        // date.setSeconds(revPrices[0].date);
        // console.log(date.toString());
        labels2 = [];
        for(let i=0;i<revPrices.length;i+=1)
        {
            if(revPrices[i].close===null || revPrices[i].close===undefined)
                continue;
            // date = new Date(1970,0,1);
            // date.setSeconds(revPrices[i].date);
            // labels.push(date.toString());
            labels2.push(i);
            close.push(revPrices[i].close);
        }
       
        res.render('Homepage',{
            id : req.query.id,
            prices : close,
            // labels : labels,
            labels2 : labels2
        })
    });
    
})

app.post("/company",(req,res) => {
    // console.log(req.body.id);
    // const spawn = require('child_process').spawn
    // const pythonProcess = spawn('python',['./predict.py' , req.body.id])

    // pythonProcess.stdout.on('data', (data) => {
    //     console.log(data.toString());
    //     res.render('Homepage',{
    //         id : req.body.id,
    //         price: data.toString()
    //     })
        
    // })  
    

    // pythonProcess.stderr.on('data',(data) => {
    //     console.error(data.toString())
    // })

    const predictstockone = ['TCS.NS','EICHERMOT.NS','HDFCBANK.NS','BRITANNIA.NS','BAJFINANCE.NS','ASIANPAINT.NS','HINDUNILVR.NS','TATAMOTORS.NS','WIPRO.NS','RELIANCE.NS']


    yahooStockPrices.getHistoricalPrices(1, 1, 2012, 10, 25, 2020, predictstockone[parseInt(req.body.id)], '1d', function(err, prices){
        
        revPrices = prices.reverse();
        let close = [];
        // labels = [];
        // let date = new Date(1970,0,1);
        // date.setSeconds(revPrices[0].date);
        // console.log(date.toString());
        labels2 = [];
        for(let i=0;i<revPrices.length;i+=1)
        {
            if(revPrices[i].close===null || revPrices[i].close===undefined)
                continue;
            // date = new Date(1970,0,1);
            // date.setSeconds(revPrices[i].date);
            // labels.push(date.toString());
            labels2.push(i);
            close.push(revPrices[i].close);
        }
       
        const spawn = require('child_process').spawn
    const pythonProcess = spawn('python',['./predict.py' , req.body.id])

    pythonProcess.stdout.on('data', (data) => {
        console.log(data.toString());
        res.render('Homepage',{
            price : data.toString(),
            id : req.query.id,
            prices : close,
            // labels : labels,
            labels2 : labels2
        })
        
    })  
    

    pythonProcess.stderr.on('data',(data) => {
        console.error(data.toString())
    })


        
    });
    
    
})

app.get('/company', (req,res)=>{
    console.log(parseInt(req.query.id));
    return res.render('Homepage',{
        id : 5
    })
})



app.post('/login',async(req, res)=>{
    const response = await axios.get('https://stockprediction-5e4ce.firebaseio.com/userInfo.json');
    console.log(response.data);
    for(var key in response.data)
    {
        var user = response.data[key];
        if(user.email === req.body.email && user.password === req.body.password)
        {
            
            return res.render('Homepage',{id:0})
        }
    } 
})

app.post('/register',async(req, res)=>{
    console.log(req.body);
    if(req.body.email === null || req.body.email.trim().length === 0)
    {
        console.log('Name should not be empty');
        return;
    }
    if(req.body.password === null || req.body.password.trim().length === 0)
    {
        console.log('Password should not be empty');
        return;
    }
    if(req.body.contact < 10 || req.body.conact > 10)
    {
        console.log('Contact can be less or greater than 10');
        return;
    }

    const obj = {
        'email': req.body.email,
        'password': req.body.password,
        'contact': req.body.contact,
        'wallet': 0,
    }
    const response = await axios.post('https://stockprediction-5e4ce.firebaseio.com/userInfo.json', obj);
    console.log(response);
    return response;
})

app.listen(5000,()=>{
    console.log("Server started");
})