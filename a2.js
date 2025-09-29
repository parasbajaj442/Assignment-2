/********************************************************************************
*  WEB700 – Assignment 02
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: _______Paras_______________ Student ID: ___122177249___________ Date: _09/28/2025_____________
*
********************************************************************************/

class LegoData {
    constructor() {
        // this will eventually hold all the sets after we load them
        this.sets = [];
    }

    // load both JSON files and merge them into "sets"
    initialize() {
        return new Promise((resolve, reject) => {
            try {
                const setData = require("./data/setData.json");
                const themeData = require("./data/themeData.json");

                setData.forEach(s => {
                    // find matching theme from themeData
                    let foundTheme = themeData.find(t => t.id == s.theme_id);

                    // create a new object with theme name included
                    let completeSet = {
                        ...s,
                        theme: foundTheme ? foundTheme.name : "Unknown"
                    };

                    this.sets.push(completeSet);
                });

                resolve();  // no errors → done
            } catch (err) {
                reject("Initialization failed: " + err);
            }
        });
    }

    // return everything
    getAllSets() {
        return new Promise((resolve, reject) => {
            if (this.sets.length > 0) {
                resolve(this.sets);
            } else {
                reject("No sets available");
            }
        });
    }

    // find a set by its number
    getSetByNum(setNum) {
        return new Promise((resolve, reject) => {
            let result = this.sets.find(s => s.set_num === setNum);
            if (result) {
                resolve(result);
            } else {
                reject("Set not found: " + setNum);
            }
        });
    }

    // find sets by theme (case-insensitive + partial match)
    getSetsByTheme(theme) {
        return new Promise((resolve, reject) => {
            let results = this.sets.filter(s =>
                s.theme.toLowerCase().includes(theme.toLowerCase())
            );
            if (results.length > 0) {
                resolve(results);
            } else {
                reject("No sets found for theme: " + theme);
            }
        });
    }
}

// -------------------------
// Testing code (keep this in)
// -------------------------

let data = new LegoData();

data.initialize()
    .then(() => data.getAllSets())
    .then(allSets => {
        console.log("Number of Sets:", allSets.length);
        return data.getSetByNum("0012-1");
    })
    .then(oneSet => {
        console.log("Set 0012-1:", oneSet);
        return data.getSetsByTheme("tech");
    })
    .then(themeSets => {
        console.log("Number of 'tech' sets:", themeSets.length);
    })
    .catch(err => {
        console.log("ERROR:", err);
    });
