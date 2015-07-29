angular.module('starter.services', ['ionic', 'ngCordova'])

.factory('Chats', function () {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var chats = [{
            id: 0,
            name: 'Steve Paul Jobs was an entrepreneur ... ',
            lastText: "April 13, 2016",
            face: 'http://a5.files.biography.com/image/upload/c_fill,cs_srgb,dpr_1.0,g_face,h_300,q_80,w_300/MTE5NDg0MDU0NTIzODQwMDE1.jpg'
  }, {
            id: 1,
            name: 'Bill Gates is a cool cat',
            lastText: 'April 12, 2016',
            face: 'http://1-ps.googleusercontent.com/hk/RxsTNFPkbRF_P8bVrLt5ErlRoc/www.dutiee.com/wp-content/uploads/800x423xbillgatescat.png.pagespeed.ic.puPNS0jYt_fqDY2lOIKS.jpg'
  }, {
            id: 2,
            name: 'Jonny Appleseed ate apples',
            lastText: 'April 11, 2016',
            face: 'http://lymanorchards.com/files/7013/6725/1487/apples.jpg'
  }, {
            id: 3,
            name: 'MIT was founded in the year 42 by jesus',
            lastText: 'April 8, 2016',
            face: 'http://ngdi.ubc.ca/files/2011/03/MIT.jpg'
  }, {
            id: 4,
            name: 'Quill is the best app ever made',
            lastText: 'April 7, 2016',
            face: 'http://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1000px-MIT_logo.svg.png'
  }];

        return {
            all: function () {
                return chats;
            },
            remove: function (chat) {
                chats.splice(chats.indexOf(chat), 1);
            },
            get: function (chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            }
        };
    })
    .factory('Camera', ['$q', function ($q) {

        return {
            getPicture: function (options) {
                var q = $q.defer();

                navigator.camera.getPicture(function (result) {
                    // Do any magic you need
                    q.resolve(result);
                }, function (err) {
                    q.reject(err);
                }, options);

                return q.promise;
            }
        }
}])
    .factory('photos', ['$http', function ($http) { //this is where you pull from Parse
        var arr = [];
        var arrParseObjs = [];
        return {
            queryEntries: function () {
                var query = new Parse.Query("Entry");
                query.equalTo("createdBy", Parse.User.current());
                query.descending("time")
                query.find({
                    success: function (results) {
                        arrParseObjs = results;
                        for (var i = 0; i < results.length; i++) {
                            var object = results[i];
                            var obj = new Object;
                            obj.time = object.get("time");
                            obj.text = object.get("text");
                            obj.summary = object.get("summary");
                            //obj.notes = object.get("notes");
                            //if(!arr.contains(obj) || arr.length==0)
                            arr.push(obj);
                        }
                        //alert("Successfully retrieved " + arr.length + " entries.");

                        $state.go('tab.dash');
                    },
                    error: function (error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
                return arr;
            },
            queryNewEntries: function () {
                var query = new Parse.Query("Entry");
                query.equalTo("createdBy", Parse.User.current());
                query.descending("time");
                query.find({
                    success: function (results) {
                        arrParseObjs = results;
                        if (results.length > arr.length) {
                            for (var i = arr.length; i < results.length; i++) {
                                var object = results[i];
                                var obj = new Object;
                                obj.time = object.get("time");
                                obj.text = object.get("text");
                                obj.summary = object.get("summary");
                                //obj.notes = object.get("notes");
                                //if(!arr.contains(obj) || arr.length==0)
                                arr.push(obj);
                            }
                        }
                    },
                    error: function (error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
                return arr;
            },
            deleteFromParse: function (indexToDelete) {
                arr.splice(indexToDelete, 1);
                var tmp = arrParseObjs[indexToDelete];
                tmp.destroy({
                    success: function (response) {},
                    error: function (response, error) {
                        alert('Error: could not delete from Parse');
                    }
                })
            },
            getArr: function () {
                return arr;
            }
        }
}])
    .service('noteCreation', ['$http', 'photos', function ($http, photos) {
        var localArr = photos.getArr(); //kushnote this should give access to the summaries, pictures, text
        var notes2 = [];
        var rawnotes;
        var tmpasdf, tmpasdf2;
        var ret = {};
        return {
            getNotes: function (text) {
                // var notes = [];

                // $http.get("http://access.alchemyapi.com/calls/text/TextGetRankedConcepts?apikey=f0c8d163d48994fedc40c29311f3c068e2d531f2&text=" + text + "&outputMode=json")
                //     .then(function (resp) {
                //         console.log('Success');
                //         rawnotes = resp.data;

                //         for (var i = 0; i < rawnotes.concepts.length; i++) {
                //             if (rawnotes.concepts[i].relevance > 0.6) {
                //                 var words = text.split(".");
                //                 console.log("Concept: " + rawnotes.concepts[i].text + " relevance: " + rawnotes.concepts[i].relevance);
                //                 notes.push(rawnotes.concepts[i]);
                //                 var notesIndex = notes.length - 1;
                //                 notes[notesIndex].sentences = [];
                //                 console.log("i: " + i + " concept: " + notes[notesIndex].text);
                //                 for (var j = 0; j < words.length; j++) {
                //                     if (words[j].indexOf(rawnotes.concepts[i].text) > -1) {
                //                         notes[notesIndex].sentences[j] = words[j].replace(rawnotes.concepts[i].text, "");
                //                         notes[notesIndex].sentences[j].replace("  ", " ");
                //                     }
                //                 }
                //                 $http.get("http://dragonflysearch.com/api/search-codeday.php?q=" + notes[notesIndex].text)
                //                     .then(function (resp) {
                //                         if (resp.data.Facts) {
                //                             dflynotes = resp.data;
                //                             //for (var x = 0; x < 1; x++) {
                //                             notes[notesIndex].sentences.push(dflynotes.Facts[0]);
                //                             //console.log('hi');
                //                             //}
                //                         }
                //                     }, function (err) {
                //                         if (!resp.data.facts) {
                //                             console.log('no info on ' + notes[notesIndex].text + ' this yet :)');
                //                         }
                //                     })
                //             }
                //         }
                //     }, function (err) {
                //         console.error('ERR', JSON.stringify(err)); //TODO save  to parse
                //     });
                // return notes;

                //second algorithim here

                // var words = text.split(" ");
                // var relevance = (Math.log(words.length/500) / Math.LN10) + 0.9;
                // //Mathematically modeling the number of notes - kush
                // console.log("relevance for index: " + relevance);

                // var notes = [];
                // $http.get("http://access.alchemyapi.com/calls/text/TextGetRelations?apikey=548454e0bd01102e1bf9345dbfc22536cd2abd36&text=" + text + "&outputMode=json")
                //     .then(function (resp) {
                //        rawnotes = resp.data;
                //          for (var i = 0; i < rawnotes.keywords.length; i++) {
                //              if (rawnotes.keywords[i].relevance > relevance) {
                //               notes.push(rawnotes.keywords[i]);
                //               var notesIndex = notes.length - 1;
                //               notes[notesIndex].relatedConcepts = [];
                //               $http.get("https://api.idolondemand.com/1/api/sync/findrelatedconcepts/v1?text="+ rawnotes.keywords[i].text + "&apikey=a46a1fd3-0815-41db-a757-d6d981de0fc6")
                //                 .then(function (resp2) {
                //                     rawnotes2 =  resp2.data;
                //                     for (var j = 0; j < 4; j++) {
                //                         notes[notesIndex].relatedConcepts.push(rawnotes2.entities[j]);
                //                     }
                //                 }, function (err) {
                //                     console.error('ERR', JSON.stringify(err));
                //                 });
                //              }
                //              if ((notes.length-1) == 7) {
                //                 break;
                //               }
                //             }

                // third algorithim starts here

                var words = text.split(" ");
                var relevance = (Math.log(words.length / 500) / Math.LN10) + 0.6;
                //Mathematically modeling the number of notes - kush
                console.log("relevance for index: " + relevance);

                var notes = [];

                //alert(text);
                $http.get("http://access.alchemyapi.com/calls/text/TextGetRankedNamedEntities?apikey=2caf1d6439b2ff5593bdaf31ec03919f937c3a56&text=" + text + "&outputMode=json")
                    .then(function (resp) {
                        rawnotes = resp.data;
                        //go through the top ones to store and put them in the notes array
                        for (var i = 0; i < rawnotes.entities.length; i++) {
                            if (rawnotes.entities[i].relevance > relevance) {
                                notes.push(rawnotes.entities[i]);
                                notes[notes.length - 1].sentences = [];
                                notes[notes.length - 1].subTopics = [];
                            }
                        }

                        $http.get("http://access.alchemyapi.com/calls/text/TextGetRelations?apikey=2caf1d6439b2ff5593bdaf31ec03919f937c3a56&text=" + text + "&outputMode=json&keywords=1")
                            .then(function (resp2) {
                                rawnotes2 = resp2.data;
                                for (var x = 0; x < notes.length; x++) {
                                    for (var j = 0; j < rawnotes2.relations.length; j++) {
                                        if (rawnotes2.relations[j].subject.hasOwnProperty("keywords")) {
                                            if (notes[x].text == rawnotes2.relations[j].subject.keywords[0].text) {


                                                notes[x].sentences.push(rawnotes2.relations[j].object.text)

                                                if (rawnotes2.relations[j].object.hasOwnProperty("keywords")) {

                                                    for (var b = 0; b < rawnotes2.relations[j].object.keywords.length; b++) {

                                                        notes[x].subTopics.push(rawnotes2.relations[j].subject.keywords[b].text);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }, function (err) {
                                console.error('ERR', JSON.stringify(err)); //TODO save  to parse
                            });



                    }, function (err) {
                        console.error('ERR', JSON.stringify(err)); //TODO save  to parse
                    });


                return notes;
            },
            getNumConcepts: function () {
                return notes.length;
            },
            retNotes2: function (ind) {
                //                alert(' 2');
                return notes2[ind];
            },
            getNotesForConcepts: function (index) {
                return notes[index].sentences.length;
            },
            getSentencesForConcepts: function (index) {},

            getText: function (notes) {
                return notes.toString();
            },

            getWordCloudArray: function (text) {
                //alert(text);
                var positive = [];
                var positive2 = [];
                var positive3 = [];
                var negative = [];
                var negative2 = [];
                var negative3 = [];
                var neutral = [];
                var neutral2 = [];
                var neutral3 = [];
                var a = 0;
                var b = 0;
                var c = 0;
                var d = 0;
                var e = 0;
                var f = 0;
                var g = 0;
                var h = 0;
                var i = 0;
                
$http.get("http://access.alchemyapi.com/calls/text/TextGetRankedNamedEntities?apikey=2caf1d6439b2ff5593bdaf31ec03919f937c3a56&text=" + text + "&outputMode=json&sentiment=1")
                    .then(function (resp) {
                        rawnotes = resp.data;
                        for (var i = 0; i < rawnotes.entities.length; i++) {
                            if (i == 20) {
                                break;
                            }
                            objectToAdd = {};
                            objectToAdd.id = i + 1;
                            objectToAdd.size = Math.round((rawnotes.entities[i].relevance * 10));
                            objectToAdd.word = rawnotes.entities[i].text + "      ";
                            //console.log("i: " + i + " id: " + objectToAdd.id + " size: " + objectToAdd.size + " words " + objectToAdd.word);
                            /*else if (rawnotes.entities[i].sentiment.type == "positive" && i == 1) {
                                positive2.push(objectToAdd);
                                i++;
                                alert(i);
                            } else if (rawnotes.entities[i].sentiment.type == "positive" && i == 2) {
                                positive3.push(objectToAdd);
                                i++;
                            } */
                            if (rawnotes.entities[i].sentiment.type == "positive" && a == 0) {
                                positive.push(objectToAdd);
                                a++;
                            } else if (rawnotes.entities[i].sentiment.type == "positive" && b == 0) {
                                positive2.push(objectToAdd);
                                b++;
                            } else if (rawnotes.entities[i].sentiment.type == "positive" && c == 0) {
                                positive3.push(objectToAdd);
                                c++;
                            } else if (rawnotes.entities[i].sentiment.type == "neutral" && d == 0) {
                                neutral.push(objectToAdd);
                                d++;
                            } else if (rawnotes.entities[i].sentiment.type == "neutral" && e == 0) {
                                neutral2.push(objectToAdd);
                                e++;
                            } else if (rawnotes.entities[i].sentiment.type == "neutral" && f == 0) {
                                neutral3.push(objectToAdd);
                                f++;
                            } else if (rawnotes.entities[i].sentiment.type == "negative" && g == 0) {
                                negative.push(objectToAdd);
                                g++;
                            } else if (rawnotes.entities[i].sentiment.type == "negative" && h == 0) {
                                negative2.push(objectToAdd);
                                h++;
                            } else {
                                negative3.push(objectToAdd);
                            }
                        }
                    }, function (err) {
                        console.error('ERR', JSON.stringify(err));
                    });
                return [positive, positive2, positive3, neutral, neutral2, neutral3, negative, negative2, negative3];
            },

            getArticlesArray: function (text, notes) {
                var numberConceptsToQuery = 1;
                var countOfArticles = 5;
                var conceptsPerArticle = 2;
                var entitiesPerArticle = 3;
                var firstTimeStamp = "180d";
                var recentTimeStamp = "7d";
                var articles = [];
                //                 $http.get("https://access.alchemyapi.com/calls/data/GetNews?apikey=2caf1d6439b2ff5593bdaf31ec03919f937c3a56&start=now-30d&end=now&outputMode=json&count=25&q.enriched.url.title=A[apple^watch]&return=enriched.url.url,enriched.url.title
                // ")
                //how i finally decide to do it:
                //get the ranked entities --> put in the appropro queries EXCEPT for timestamp
                //timestamp = last 6 months, any important articles + second timestamp = recent articles IFF recent articles have ALL the other queryfields matched (change this later as in during the weekend) 
                //if ^ that is less that 5 articles, extend timestamp to 12months, and if not, extend to 3 years. otherwise leave articleNumber as is.
                //THEN, for eac article, provide short description that shows, publication date, author, top concepts, sentiment (change color of title) AND option
                //to view text --> pop up model that extracts the text with text extraction API from alchemy WITH highlighted areas of importance
                //provide option to share/save the article AND go to the article in web browser

                // var queries[];
                // for(var x = 0; x < numberConceptsToQuery; x++) {
                //     queries.push(notes[x].nextProperty());
                // }
                // //todo: add the query + optimize the nextProperty() to workwith the queries
                // //todo: add the stuff into webChat.html so it shows into the div + add the pop up modal
                // // - kushnote
                // $http.get("https://access.alchemyapi.com/calls/data/GetNews?apikey=2caf1d6439b2ff5593bdaf31ec03919f937c3a56&start=now-" + firstTimeStamp + "&end=now&outputMode=json&count=" + countOfArticles + "&q.enriched.url.title=" + ___addQueriesHere___ + "&return=enriched.url.url,enriched.url.title,enriched.url.author,enriched.url.docSentiment,enriched.url.entities,enriched.url.concepts")
                // .then(function (resp) {
                //     rawnotes = resp.data;
                //     for(var i = 0; i < rawnotes.length; i++) {
                //         objectToAdd = {};
                //         var conceptsToAdd[];
                //         var entitiesToAdd[];
                //         for (var j = 0; j < conceptsPerArticle; j++) {
                //             conceptsToAdd.push(rawnotes[i].concepts[j]);
                //         }
                //         objectToAdd.concepts = conceptsToAdd;
                //         for (var a = 0; a < entitiesPerArticle; a++) {
                //             entitiesToAdd.push(rawnotes[i].entities[a]);
                //         }
                //         objectToAdd.url = rawnotes[i].url;
                //         objectToAdd.author = rawnotes[i].author;
                //         objectToAdd.title = rawnotes[i].title;
                //         //objectToAdd.text = call text exrtraction api here;



                //         articles.push(objectToAdd);
                //         console.log(articles.length);
                //     }
                // }, function (err) {
                //     console.error('ERR', JSON.stringify(err));
                // }); 
                // return articles;
            }
        }
}])
    .service('fileUpload', ['$http', function ($http) {
        this.uploadFileToUrl = function (file, uploadUrl) {
            //alert('file=' + file);
            //alert('uploadUrl=' + uploadUrl);
            var fd = new FormData();
            fd.append('file', file);
            $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .success(function (data) {
                    //alert(JSON.stringify(data));
                })
                .error(function () {});
        }
}])
    .factory('videos', ['$http', 'noteCreation', function ($http, noteCreation) {
        var arr = []; //rnotes[0].concept[0]
        return {
            retrieveVideoList: function (rnotes) {
                var rn = rnotes;
                console.log("rnString:" + rnotes.length);
                var rnString = "";
                //                for (var i = 0; i < rn.length; i++)
                //                  rnString += rn[i].concept + ((i != rn.length - 1) ? " " : ""); //joins all concepts with " "
                rnString = rnotes.join(" ");
                console.log("query string:" + rnotes.length)
                $http.get("https://www.googleapis.com/youtube/v3/search?q=" + rnString + "&channelId=UCX6b17PVsYBQ0ip5gyeme-Q&part=snippet&key=AIzaSyDhwZZScT38eVopgsPQVWS-3FZ7IPvfC98")
                    .then(function (resp) {
                        for (var i = 0; i < resp.data.items.length; i++) {
                            var tstr = resp.data.items[i].snippet.thumbnails.default.url;
                            tstr = tstr.substring(tstr.indexOf("/vi/") + 4, tstr.indexOf("/default.jpg"));
                            arr.push("https://www.youtube.com/embed/" + tstr); //arr = list of urls for iframes
                        }
                    }, function (err) {
                        alert("failed to query Youtube (243). error:" + JSON.stringify(err));
                    });
                return arr;
            },
            returnVideoList: function () {
                return arr;
            }
        }
            }])
    .factory('summary', function () {
        //var jt = require('lib/textteaser.js');
        return {
            summarize: function (input) {
                var article = {};
                article.title = "Orange in Impressionist Paintings";
                article.text = input;

                /*

               article.text = "In 1797, a French scientist, Louis Vauquelin, discovered the mineral crocoite, or lead chromate, which led in 1809 to the invention of the synthetic pigment chrome orange. Other synthetic pigments, cobalt red, cobalt yellow, and cobalt orange, the last made from cadmium sulfide plus cadmium selenide, soon followed. These new pigments, plus the invention of the metal paint tube in 1841, made it possible for artists to paint outdoors and to capture the colours of natural light.In Britain, orange became highly popular with the Pre-Raphaelites and with history painters. The flowing red-orange hair of Elizabeth Siddal, the wife of painter Dante Gabriel Rossetti, became a symbol of the Pre-Raphaelite movement, Lord Leighton, the President of the Royal Academy, produced Flaming June, a painting of a sleeping young woman in a bright orange dress, which won wide acclaim. Albert Joseph Moore painted festive scenes of Romans wearing orange cloaks brighter than any the Romans ever likely wore. In the United States, Winslow Homer brightened his palette with vivid oranges.In France, painters took orange in an entirely different direction. In 1872, Claude Monet painted Impression Sunrise, a tiny orange sun and some orange light reflected on the clouds and water in the centre of a hazy blue landscape. This painting gave its name to the impressionist movement.Orange became an important colour for all the impressionist painters. They all had studied the recent books on colour theory, and they know that orange placed next to azure blue made both colours much brighter. Auguste Renoir painted boats with stripes of chrome orange paint straight from the tube. Paul Cézanne did not use orange pigment, but created his own oranges with touches of yellow, red and ochre against a blue background. Toulouse-Lautrec often used oranges in the skirts of dancers and gowns of Parisiennes in the cafes and clubs he portrayed. For him it was the colour of festivity and amusement.";*/
                //alert("entered summary.service");
                var jtt = new JsTeaser(article);
                //alert("entered summary.service2");
                var sum = jtt.summarize();
                var sumOutput = sum.join(" ");
                //for(var i = 0 ; i < sum.length; i++)
                //  sumOutput += "> " + sum[i] + "\n"
                //alert("summary from jsteaser: " + sum[0]);
                return sumOutput;
            }
        }
    })
    .factory('spellcheck', function () {
        var speller = {};
        /**region*/
        // Dummy initializer for non-ServerJS environments.
        var exports;
        if (!exports) exports = {};

        // A function that trains the language model with the words in the supplied text.
        // Multiple invocation of this function can extend the training of the model.
        exports.train = speller.train = function (text) {
            var word, m, r = /[a-z]+/g;
            text = text.toLowerCase();
            while ((m = r.exec(text))) {
                word = m[0];
                speller.nWords[word] = speller.nWords.hasOwnProperty(word) ? speller.nWords[word] + 1 : 1;
            }
        };

        // A function that returns the correction for the specified word.
        exports.correct = speller.correct = function (word) {
            if (speller.nWords.hasOwnProperty(word)) return word;
            var candidates = {},
                list = speller.edits(word);
            list.forEach(function (edit) {
                if (speller.nWords.hasOwnProperty(edit)) candidates[speller.nWords[edit]] = edit;
            });
            if (speller.countKeys(candidates) > 0) return candidates[speller.max(candidates)];
            list.forEach(function (edit) {
                speller.edits(edit).forEach(function (w) {
                    if (speller.nWords.hasOwnProperty(w)) candidates[speller.nWords[w]] = w;
                });
            });
            return speller.countKeys(candidates) > 0 ? candidates[speller.max(candidates)] : word;
        };

        // A map of words to the number of times they were encountered during training.
        // This is exported only for the benefit of spelltest.js.
        exports.nWords = speller.nWords = {};

        // A helper function that counts the keys in the supplied object.
        speller.countKeys = function (object) {
            var attr, count = 0;
            for (attr in object)
                if (object.hasOwnProperty(attr))
                    count++;
            return count;
        };

        // A helper function that returns the word with the most occurences in the language
        // model, among the supplied candidates.
        speller.max = function (candidates) {
            var candidate, arr = [];
            for (candidate in candidates)
                if (candidates.hasOwnProperty(candidate))
                    arr.push(candidate);
            return Math.max.apply(null, arr);
        };

        speller.letters = "abcdefghijklmnopqrstuvwxyz".split("");

        // A function that returns the set of possible corrections of the specified word.
        // The edits can be deletions, insertions, alterations or transpositions.
        speller.edits = function (word) {
            var i, results = [];
            // deletion
            for (i = 0; i < word.length; i++)
                results.push(word.slice(0, i) + word.slice(i + 1));
            // transposition
            for (i = 0; i < word.length - 1; i++)
                results.push(word.slice(0, i) + word.slice(i + 1, i + 2) + word.slice(i, i + 1) + word.slice(i + 2));
            // alteration
            for (i = 0; i < word.length; i++)
                speller.letters.forEach(function (l) {
                    results.push(word.slice(0, i) + l + word.slice(i + 1));
                });
            // insertion
            for (i = 0; i <= word.length; i++)
                speller.letters.forEach(function (l) {
                    results.push(word.slice(0, i) + l + word.slice(i));
                });
            return results;
        };
        /*region*/
        //                var dictionary = new Typo("en_US");
        function readTextFile(file) {
            var ret = "nope";
            var rawFile = new XMLHttpRequest();
            rawFile.open("GET", file, false);
            rawFile.onreadystatechange = function () {
                if (rawFile.readyState === 4) {
                    if (rawFile.status === 200 || rawFile.status == 0) {
                        var allText = rawFile.responseText;
                        ret = allText
                    }
                }
            }
            rawFile.send(null);
            return ret;
        };
        return {
            prepare: function () {
                speller.train(readTextFile("lib/big.txt"));
            },
            check: function (input) {
                var out = "";
                var arr = input.split(" ");
                for (var i = 0; i < arr.length; i++)
                    out += speller.correct(arr[i]) + " ";
                return out;
            }
        }
    })
    .factory('Upload', function ($q, $cordovaCamera, $cordovaFileTransfer) {
        return {
            fileTo: function (serverURL) {
                //alert("we reached point 1");
                var deferred = $q.defer();
                if (ionic.Platform.isWebView()) {
                    //alert("we reached point 2");
                    var options = {
                        quality: 100,
                        destinationType: Camera.DestinationType.FILE_URI,
                        encodingType: Camera.EncodingType.JPEG
                    }
                    $cordovaCamera.getPicture(options).then(
                        function (fileURL) {
                            //alert("we reached pt 3:" + fileURL);
                            //alert("we reached pt 4:" + fileURL)
                            var uploadOptions = {
                                fileKey: "file",
                                fileName: fileURL.substr(fileURL.lastIndexOf('/') + 1),
                                mimeType: "image/jpeg",
                                chunkedMode: false
                            };
                            $cordovaFileTransfer.uploadFile(serverURL, fileURL, uploadOptions).then(
                                function (result) {
                                    alert("hello" + result);
                                },
                                function (err) {
                                    alert("1" + err);
                                },
                                function (progress) {
                                    alert(progress);
                                });
                        },

                        function (err) {
                            alert(err);
                        });
                } else {
                    deferred.reject('Uploading not supported in browser');
                }
                return deferred.promise;
            }
        }
    });
/* .factory('rmgarbage', function () {
//        var XRegExp;XRegExp=XRegExp||function(n){"use strict";function v(n,i,r){var u;for(u in t.prototype)t.prototype.hasOwnProperty(u)&&(n[u]=t.prototype[u]);return n.xregexp={captureNames:i,isNative:!!r},n}function g(n){return(n.global?"g":"")+(n.ignoreCase?"i":"")+(n.multiline?"m":"")+(n.extended?"x":"")+(n.sticky?"y":"")}function o(n,r,u){if(!t.isRegExp(n))throw new TypeError("type RegExp expected");var f=i.replace.call(g(n)+(r||""),h,"");return u&&(f=i.replace.call(f,new RegExp("["+u+"]+","g"),"")),n=n.xregexp&&!n.xregexp.isNative?v(t(n.source,f),n.xregexp.captureNames?n.xregexp.captureNames.slice(0):null):v(new RegExp(n.source,f),null,!0)}function a(n,t){var i=n.length;if(Array.prototype.lastIndexOf)return n.lastIndexOf(t);while(i--)if(n[i]===t)return i;return-1}function s(n,t){return Object.prototype.toString.call(n).toLowerCase()==="[object "+t+"]"}function d(n){return n=n||{},n==="all"||n.all?n={natives:!0,extensibility:!0}:s(n,"string")&&(n=t.forEach(n,/[^\s,]+/,function(n){this[n]=!0},{})),n}function ut(n,t,i,u){var o=p.length,s=null,e,f;y=!0;try{while(o--)if(f=p[o],(f.scope==="all"||f.scope===i)&&(!f.trigger||f.trigger.call(u))&&(f.pattern.lastIndex=t,e=r.exec.call(f.pattern,n),e&&e.index===t)){s={output:f.handler.call(u,e,i),match:e};break}}catch(h){throw h;}finally{y=!1}return s}function b(n){t.addToken=c[n?"on":"off"],f.extensibility=n}function tt(n){RegExp.prototype.exec=(n?r:i).exec,RegExp.prototype.test=(n?r:i).test,String.prototype.match=(n?r:i).match,String.prototype.replace=(n?r:i).replace,String.prototype.split=(n?r:i).split,f.natives=n}var t,c,u,f={natives:!1,extensibility:!1},i={exec:RegExp.prototype.exec,test:RegExp.prototype.test,match:String.prototype.match,replace:String.prototype.replace,split:String.prototype.split},r={},k={},p=[],e="default",rt="class",it={"default":/^(?:\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\d*|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S])|\(\?[:=!]|[?*+]\?|{\d+(?:,\d*)?}\??)/,"class":/^(?:\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S]))/},et=/\$(?:{([\w$]+)}|(\d\d?|[\s\S]))/g,h=/([\s\S])(?=[\s\S]*\1)/g,nt=/^(?:[?*+]|{\d+(?:,\d*)?})\??/,ft=i.exec.call(/()??/,"")[1]===n,l=RegExp.prototype.sticky!==n,y=!1,w="gim"+(l?"y":"");return t=function(r,u){if(t.isRegExp(r)){if(u!==n)throw new TypeError("can't supply flags when constructing one RegExp from another");return o(r)}if(y)throw new Error("can't call the XRegExp constructor within token definition functions");var l=[],a=e,b={hasNamedCapture:!1,captureNames:[],hasFlag:function(n){return u.indexOf(n)>-1}},f=0,c,s,p;if(r=r===n?"":String(r),u=u===n?"":String(u),i.match.call(u,h))throw new SyntaxError("invalid duplicate regular expression flag");for(r=i.replace.call(r,/^\(\?([\w$]+)\)/,function(n,t){if(i.test.call(/[gy]/,t))throw new SyntaxError("can't use flag g or y in mode modifier");return u=i.replace.call(u+t,h,""),""}),t.forEach(u,/[\s\S]/,function(n){if(w.indexOf(n[0])<0)throw new SyntaxError("invalid regular expression flag "+n[0]);});f<r.length;)c=ut(r,f,a,b),c?(l.push(c.output),f+=c.match[0].length||1):(s=i.exec.call(it[a],r.slice(f)),s?(l.push(s[0]),f+=s[0].length):(p=r.charAt(f),p==="["?a=rt:p==="]"&&(a=e),l.push(p),++f));return v(new RegExp(l.join(""),i.replace.call(u,/[^gimy]+/g,"")),b.hasNamedCapture?b.captureNames:null)},c={on:function(n,t,r){r=r||{},n&&p.push({pattern:o(n,"g"+(l?"y":"")),handler:t,scope:r.scope||e,trigger:r.trigger||null}),r.customFlags&&(w=i.replace.call(w+r.customFlags,h,""))},off:function(){throw new Error("extensibility must be installed before using addToken");}},t.addToken=c.off,t.cache=function(n,i){var r=n+"/"+(i||"");return k[r]||(k[r]=t(n,i))},t.escape=function(n){return i.replace.call(n,/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")},t.exec=function(n,t,i,u){var e=o(t,"g"+(u&&l?"y":""),u===!1?"y":""),f;return e.lastIndex=i=i||0,f=r.exec.call(e,n),u&&f&&f.index!==i&&(f=null),t.global&&(t.lastIndex=f?e.lastIndex:0),f},t.forEach=function(n,i,r,u){for(var e=0,o=-1,f;f=t.exec(n,i,e);)r.call(u,f,++o,n,i),e=f.index+(f[0].length||1);return u},t.globalize=function(n){return o(n,"g")},t.install=function(n){n=d(n),!f.natives&&n.natives&&tt(!0),!f.extensibility&&n.extensibility&&b(!0)},t.isInstalled=function(n){return!!f[n]},t.isRegExp=function(n){return s(n,"regexp")},t.matchChain=function(n,i){return function r(n,u){for(var o=i[u].regex?i[u]:{regex:i[u]},f=[],s=function(n){f.push(o.backref?n[o.backref]||"":n[0])},e=0;e<n.length;++e)t.forEach(n[e],o.regex,s);return u===i.length-1||!f.length?f:r(f,u+1)}([n],0)},t.replace=function(i,u,f,e){var c=t.isRegExp(u),s=u,h;return c?(e===n&&u.global&&(e="all"),s=o(u,e==="all"?"g":"",e==="all"?"":"g")):e==="all"&&(s=new RegExp(t.escape(String(u)),"g")),h=r.replace.call(String(i),s,f),c&&u.global&&(u.lastIndex=0),h},t.split=function(n,t,i){return r.split.call(n,t,i)},t.test=function(n,i,r,u){return!!t.exec(n,i,r,u)},t.uninstall=function(n){n=d(n),f.natives&&n.natives&&tt(!1),f.extensibility&&n.extensibility&&b(!1)},t.union=function(n,i){var l=/(\()(?!\?)|\\([1-9]\d*)|\\[\s\S]|\[(?:[^\\\]]|\\[\s\S])*]/g,o=0,f,h,c=function(n,t,i){var r=h[o-f];if(t){if(++o,r)return"(?<"+r+">"}else if(i)return"\\"+(+i+f);return n},e=[],r,u;if(!(s(n,"array")&&n.length))throw new TypeError("patterns must be a nonempty array");for(u=0;u<n.length;++u)r=n[u],t.isRegExp(r)?(f=o,h=r.xregexp&&r.xregexp.captureNames||[],e.push(t(r.source).source.replace(l,c))):e.push(t.escape(r));return t(e.join("|"),i)},t.version="2.0.0",r.exec=function(t){var r,f,e,o,u;if(this.global||(o=this.lastIndex),r=i.exec.apply(this,arguments),r){if(!ft&&r.length>1&&a(r,"")>-1&&(e=new RegExp(this.source,i.replace.call(g(this),"g","")),i.replace.call(String(t).slice(r.index),e,function(){for(var t=1;t<arguments.length-2;++t)arguments[t]===n&&(r[t]=n)})),this.xregexp&&this.xregexp.captureNames)for(u=1;u<r.length;++u)f=this.xregexp.captureNames[u-1],f&&(r[f]=r[u]);this.global&&!r[0].length&&this.lastIndex>r.index&&(this.lastIndex=r.index)}return this.global||(this.lastIndex=o),r},r.test=function(n){return!!r.exec.call(this,n)},r.match=function(n){if(t.isRegExp(n)){if(n.global){var u=i.match.apply(this,arguments);return n.lastIndex=0,u}}else n=new RegExp(n);return r.exec.call(n,this)},r.replace=function(n,r){var e=t.isRegExp(n),u,f,h,o;return e?(n.xregexp&&(u=n.xregexp.captureNames),n.global||(o=n.lastIndex)):n+="",s(r,"function")?f=i.replace.call(String(this),n,function(){var t=arguments,i;if(u)for(t[0]=new String(t[0]),i=0;i<u.length;++i)u[i]&&(t[0][u[i]]=t[i+1]);return e&&n.global&&(n.lastIndex=t[t.length-2]+t[0].length),r.apply(null,t)}):(h=String(this),f=i.replace.call(h,n,function(){var n=arguments;return i.replace.call(String(r),et,function(t,i,r){var f;if(i){if(f=+i,f<=n.length-3)return n[f]||"";if(f=u?a(u,i):-1,f<0)throw new SyntaxError("backreference to undefined group "+t);return n[f+1]||""}if(r==="$")return"$";if(r==="&"||+r==0)return n[0];if(r==="`")return n[n.length-1].slice(0,n[n.length-2]);if(r==="'")return n[n.length-1].slice(n[n.length-2]+n[0].length);if(r=+r,!isNaN(r)){if(r>n.length-3)throw new SyntaxError("backreference to undefined group "+t);return n[r]||""}throw new SyntaxError("invalid token "+t);})})),e&&(n.lastIndex=n.global?0:o),f},r.split=function(r,u){if(!t.isRegExp(r))return i.split.apply(this,arguments);var e=String(this),h=r.lastIndex,f=[],o=0,s;return u=(u===n?-1:u)>>>0,t.forEach(e,r,function(n){n.index+n[0].length>o&&(f.push(e.slice(o,n.index)),n.length>1&&n.index<e.length&&Array.prototype.push.apply(f,n.slice(1)),s=n[0].length,o=n.index+s)}),o===e.length?(!i.test.call(r,"")||s)&&f.push(""):f.push(e.slice(o)),r.lastIndex=h,f.length>u?f.slice(0,u):f},u=c.on,u(/\\([ABCE-RTUVXYZaeg-mopqyz]|c(?![A-Za-z])|u(?![\dA-Fa-f]{4})|x(?![\dA-Fa-f]{2}))/,function(n,t){if(n[1]==="B"&&t===e)return n[0];throw new SyntaxError("invalid escape "+n[0]);},{scope:"all"}),u(/\[(\^?)]/,function(n){return n[1]?"[\\s\\S]":"\\b\\B"}),u(/(?:\(\?#[^)]*\))+/,function(n){return i.test.call(nt,n.input.slice(n.index+n[0].length))?"":"(?:)"}),u(/\\k<([\w$]+)>/,function(n){var t=isNaN(n[1])?a(this.captureNames,n[1])+1:+n[1],i=n.index+n[0].length;if(!t||t>this.captureNames.length)throw new SyntaxError("backreference to undefined group "+n[0]);return"\\"+t+(i===n.input.length||isNaN(n.input.charAt(i))?"":"(?:)")}),u(/(?:\s+|#.*)+/,function(n){return i.test.call(nt,n.input.slice(n.index+n[0].length))?"":"(?:)"},{trigger:function(){return this.hasFlag("x")},customFlags:"x"}),u(/\./,function(){return"[\\s\\S]"},{trigger:function(){return this.hasFlag("s")},customFlags:"s"}),u(/\(\?P?<([\w$]+)>/,function(n){if(!isNaN(n[1]))throw new SyntaxError("can't use integer as capture name "+n[0]);return this.captureNames.push(n[1]),this.hasNamedCapture=!0,"("}),u(/\\(\d+)/,function(n,t){if(!(t===e&&/^[1-9]/.test(n[1])&&+n[1]<=this.captureNames.length)&&n[1]!=="0")throw new SyntaxError("can't use octal escape or backreference to undefined group "+n[0]);return n[0]},{scope:"all"}),u(/\((?!\?)/,function(){return this.hasFlag("n")?"(?:":(this.captureNames.push(null),"(")},{customFlags:"n"}),typeof exports!="undefined"&&(exports.XRegExp=t),t}()
//        var RE_WORD = /\S+/
//        var RE_SPACE = /\s+/
//        var RE_NEWLINE = /[\r\n]/
//        var RE_WHITESPACE = XRegExp('\\p{White_space}+');
//        var RE_ALNUM = XRegExp('[\\p{L}\\p{N}]', 'ig')
//        var RE_PUNCT = XRegExp('\\p{P}', 'ig')
//        var RE_REPEAT = XRegExp('(\\P{N})\\1{3,}')
//        var RE_UPPER = XRegExp('\\p{Lu}', 'g')
//        var RE_LOWER = XRegExp('\\p{Ll}', 'g')
//        var RE_ALL_ALPHA = XRegExp('\\p{L}', 'g')
//        var RE_ACRONYM = XRegExp("^\\(?[\\p{Lu}\\p{N}\\.-]+('?s)?\\)?[.,:]?$")
//        var RE_REPEATED = /(\b\S{1,2}\s+)(\S{1,3}\s+){5,}(\S{1,2}\s+)/gm;
//
//        function uniq(a) {
//            var ret = a.filter(function (item, pos) {
//                return a.indexOf(item) == pos;
//            })
//            return ret;
//        };
//        function isGarbage(w) {
//            var acronym = RE_ACRONYM.test(w);
//            return ((w.length > 40) ||
//                (RE_REPEAT.test(w)) ||
//                (!acronym && (w.smatch(RE_ALNUM).length < w.smatch(RE_PUNCT).length)) ||
//                (uniq(w.substring(1, w.length - 1).smatch(RE_PUNCT)).length >= 2) ||
//                (!acronym && (w.smatch(RE_UPPER).length > w.smatch(RE_LOWER).length)));
//        };
//        String.prototype.smatch = function (regexp) {
//            var result = this.match(regexp);
//            if (!result) {
//                result = [];
//            }
//            return result;
//        };
//        return {
//            clean: function (text) {
//                alert("passed in clean: " + text);
//                var cleaned = [];
//                var words = text.split(RE_WHITESPACE);
//                for (var i = 0; i < words.length; i++) {
//                    if (!isGarbage(words[i]))
//                        cleaned.push(words[i]);
//                }
//                var ret = cleaned.join(' ').replace(RE_REPEATED, '');
//                alert("returning from clean: " + ret);
//                return text;
//            }
//        }
//    });*/