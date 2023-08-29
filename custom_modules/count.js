import { ballots, method, methodId } from '../data/data.json';

if (method == 2) {
    let result = {};
    for (const ballot of ballots)
        if (result[ballot] == undefined) result[ballot] = 0;
        else result[ballot]++;
    console.table(result);
} else if (methodId == 4) {
    let trueC = 0, falseC = 0;
    for (const ballot of ballots) {
        // Secure test to make sure no way the ballot was checked wrongly
        if (ballot === true) trueC++;
        else if (ballot === false) falseC++;
        else console.log('Faulty ballot');
    }
    console.log(`True: ${trueC}\nFalse: ${falseC}`);
}