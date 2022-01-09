var express = require('express')
let app = express()
var bodyParser = require ('body-parser');
const cors = require('cors');
const dns = require('dns')

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

// SOLUTION
const shortUrls = [
{original_url:'https://freecodecamp.org/', short_url:1}
] // array of objects {url, short_url}, we will use that as a "DB"

let testURL = ( url,res ) => {
  let testedURL
  try {
    testedURL = url.match(/https:\/\/|http:\/\//g)?  new URL(url):null
    return (testedURL.hostname)
  } catch(e){
    if (e) res.json({error: 'invalid url'})
  }
}

app.post('/api/shorturl', function (req, res){
  let url = req.body.url
  let hostname = testURL(url,res)
  
  if (hostname != null || hostname != undefined) {
    dns.lookup(hostname, {all:true}, (err, address) => {
    //if not, return error code
    if(err){
      res.json({error: 'invalid url'})
    } 
    // if yes, assign a short URL ID to a URL. We should add a way to check if we are not assigning a url to a already existing URL
    else {
      let short_url = Math.floor(Math.random() * 7500)
      shortUrls.push({original_url:url,short_url})
      res.json({original_url:url,short_url})
    }  
  });
  } else {
    res.json({error: 'invalid url'})
  }
  /* */
})

//Get /api/<shorturl>, check if we have one, if not, error, if yes, open the full url
app.get('/api/shorturl/:shorturl', function (req,res){
  let shortUrl = req.params.shorturl
  let target = shortUrls.find(e => e.short_url == shortUrl)
  let url = target.original_url.match(/https:\/\/|http:\/\//g)? target.original_url : 'https://' + target.original_url
  res.redirect(url)
})

module.exports = app


//TODO
/* You should provide your own project, not the example URL.

You can POST a URL to /api/shorturl and get a JSON response with original_url and short_url properties. Here's an example: { original_url : 'https://freeCodeCamp.org', short_url : 1}

When you visit /api/shorturl/<short_url>, you will be redirected to the original URL.

If you pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain { error: 'invalid url' } */