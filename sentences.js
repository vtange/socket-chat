"use strict";

let natural = require('natural');
let classifierBasic = new natural.BayesClassifier();
let classifierPOS = new natural.BayesClassifier();

/*-- LOAD A CLASSIFIER IF WE SAVED ONE 
natural.BayesClassifier.load('classifierBasic.json', null, function(err, classifier) {
    console.log(classifier.classify('long SUNW'));
    console.log(classifier.classify('short SUNW'));
});
--*/

/**
 * 
 * LEVEL 1 - classifierBasic : DIRECT INFERENCE FROM DIRECT WORDS
 * 
 * If someone says "Hello." -> It always means an introduction.
 * 
 */
let literalSentences = {
    "INTRO":["Hi","Yo","Hey","Sup","Hello","Morning","Evening"],
    "FINISH":["Bye","Goodbye","Night"],
    "QUESTION":["Who","What","Where","When","Why","How"],
    "UTTER":["Wow","Holy","Crap","Shit","Fuck","Damn"],
    "UNSURE":["Uh", "Umm", "Hmm"]
}
var hardMemory = {};

for(let prop in literalSentences)
{
    literalSentences[prop].forEach(function(word){
        classifierBasic.addDocument(word, prop);
        hardMemory[word] = prop;
    });
}
classifierBasic.train();
/**
 * 
 * LEVEL 2 - : VARIABLE WORDS, USE CHAINS OF PART OF SPEECH, CLAUSES
 * 
 */

//<name of person ___ is calling> "John!"
let sentenceClasses = {
    "CALLING":["NNP"],
    "STATEMENT":["PRP VBZ JJ","NNS VBP JJ","PRP VBP RB","PRP VBZ NN","PRP VBD RB","PRP VBP JJ","PRP VBZ VBG"],
    "QUESTION":["WP VBD DT","WP VBZ PRP","WRB VBZ PRP","WRB VBP NNS","WRB RB JJ"]
}
for(let prop in sentenceClasses)
{
    sentenceClasses[prop].forEach(function(sentenceStructure){
        classifierPOS.addDocument(sentenceStructure, prop);
    });
}

classifierPOS.train();
/*
classifierBasic.save('classifierBasic.json', function(err, classifier) {
    // classifierBasic is saved to the classifier.json file!
});
*/
exports = module.exports = {
    hardMemory: hardMemory,
    classifierBasic: classifierBasic,
    classifierPOS: classifierPOS
}