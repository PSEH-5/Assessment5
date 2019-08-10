var express = require('express');
var router = express.Router();
var standings = require("../services/standings.json");
var countries = require("../services/countries.json");
var errorTemplate = require("../services/errorTemplate.json");
var finalResult = require("../services/resultTemplate.json");

/* GET users listing. */
router.get('/', function(req, res, next) {
  var standingsByteamId;
  var countryId;
  
  console.log(req.query);
  res.setHeader('content-type', 'text/javascript');
  if(req.query.country_name && req.query.league_name && req.query.team_name) {
    standingsByteamId = standings.find(item=>item.team_name==req.query.team_name);
    countryId = countries.find(item=>item.country_name==req.query.country_name);
    if(standingsByteamId) {
      if(countryId) {
        handleSuccessTemplates(countryId, standingsByteamId, res);        
      } else {
        handleErrorTemplates("Wrong country name specified.. Please specify a valid country name", res);
      }
    } else {
      //Error handler for wrong team
      handleErrorTemplates("Wrong team name specified.. Please specify a valid team name", res);
    }
  } else {
    handleErrorTemplates("country_name, league_name and team_name and mandatory query paramteres.. please specify them in the URL", res);
  }
  
});

function handleErrorTemplates(message, res) {
  errorTemplate["errorMessage"] = message;
  res.send(JSON.stringify(errorTemplate));
}

function handleSuccessTemplates(countryId, standingsByteamId, res) {
  finalResult["Country ID & Name"] = countryId.country_id + "-" + countryId.country_name;
  finalResult["League ID & Name"] = standingsByteamId.league_id + "-" + standingsByteamId.league_name;
  finalResult["Team ID & Name"] = standingsByteamId.team_id + "-" + standingsByteamId.team_name;
  finalResult["Overall League Position"] = standingsByteamId.overall_league_position;
  res.send(JSON.stringify(finalResult));
}

module.exports = router;
