"use strict";
var express = require('express');
var path = require('path');
var app = express();
//routes
//use static middleware in express to load static page directory
app.use(express.static(path.join(__dirname, 'public')));
//create server that watches node app
var http = require('http').createServer(app);
//socket-io
var io = require('socket.io').listen(http);

    /*=================================================================================================*/
    /*=================================================================================================*/
    /*=================================================================================================*/

//language processing
let natural = require('natural'), metaphone = natural.Metaphone, soundEx = natural.SoundEx;
natural.PorterStemmer.attach();
  /*------
  @ [Words] Check similarspelled words by letter
      .JaroWinklerDistance ++ .LevenshteinDistance ++ .DiceCoefficient
  @ [Words] Words that sound the same
      metaphone / .soundsLike
  @ [Words] Word Stemming
      .PorterStemmer =
      .LancasterStemmer =
  -------*/
let TfIdf = natural.TfIdf,
    tfidf = new TfIdf();
  /*------
  @ [Sentences] Determine how important a word (or words) is to a document relative to a corpus.
  -------*/
let nounInflector = new natural.NounInflector();
  /*------
  @ [Nouns] .pluralize() -> Plural
  @ [Nouns] .singularize() -> Singular

  CountInflector for 1st thru Nth number

  PresentVerbInflector for Verbs
  -------*/

  //larger pos dictionary
let WordPOS = require('wordpos');
let wordpos = new WordPOS();

var classifiers = require('./sentences.js');
function getIntent(strSentence)
{
  if(classifiers.hardMemory.hasOwnProperty(strSentence))
  {
    return classifiers.classifierBasic.classify(strSentence);
  }
  else
  {
    var setn = tagger.tag(tokenizer.tokenize(strSentence)).map(function(term){return term[1]}).join(" ");
    var pos = classifiers.classifierPOS.classify(setn);
    return pos;
  }
}
    /*=================================================================================================*/
    /*=================================================================================================*/
    /*=================================================================================================*/

//init POS tagger
var Tagger = natural.BrillPOSTagger;//".\node_modules\natural\lib\natural\brill_pos_tagger\lib\Brill_POS_Tagger.js"
var base_folder = "./node_modules/natural/lib/natural/brill_pos_tagger/data/English";
var rules_file = base_folder + "/tr_from_posjs.txt";
var lexicon_file = base_folder + "/lexicon_from_posjs.json";
var default_category = 'N'; //default to nouns
  /*------
  @ [Sentences] Tag part-of-speech in sentences
  -------*/
var tokenizer = new natural.TreebankWordTokenizer();
  /*------
  @ [Sentences] Break down str sentence into Penn treebank words
  -------*/
var tagger = new Tagger(lexicon_file, rules_file, default_category, function(error) {
  if (error)
  {
    console.log(error);
  }
  else
  {
    //init
    http.listen(4000, function(){
      console.log('listening on *:4000');
    });

    //init sockets
    io.on('connection', function(socket)
    {
      console.log('a user connected');
      
      //CLOSE OR REFRESH
      socket.on('disconnect', function(){
        console.log('user disconnected');
      });
      
      //DEFINED INSIDE INDEX.HTML
      socket.on('chat message', function(msg){
        io.emit('chat message',tagger.tag(tokenizer.tokenize(msg)));
        io.emit('message intent',getIntent(msg));
      });
    });
  };
});

