let data = require('../data/data.json');
let ballots = data.ballots;
if (data.method == 2) {
    let result = {};
    for (const ballot of ballots)
        if (result[ballot] == undefined) result[ballot] = 0;
        else result[ballot]++;
    console.table(result);
} else if (data.methodId == 4) {
    let trueC = 0, falseC = 0;
    for (const ballot of ballots) {
        // Secure test to make sure no way the ballot was checked wrongly
        if (ballot === true) trueC++;
        else if (ballot === false) falseC++;
        else console.log('Faulty ballot');
    }
    console.log(`True: ${trueC}\nFalse: ${falseC}`)
}