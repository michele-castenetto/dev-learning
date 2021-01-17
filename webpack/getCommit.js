const fs = require("fs");
const path = require("path");



const isGitRepo = function() {
    const basepath = path.resolve();
    return fs.existsSync(path.join(basepath, "./git/HEAD"));
};


const getCommit = function() {
    
    const basepath = path.resolve();

    let headContent = "";
    try {
        headContent = fs.readFileSync(path.join(basepath, ".git/HEAD")).toString();
    } catch (error) {
        return "";
    }
    
    let commit = "";
    
    if (headContent.indexOf(':') === -1) {
        commit = headContent;
    } else {
        const refPath = path.resolve(basepath, ".git", headContent.substring(5)).trim();
        commit = refContent = fs.readFileSync(refPath).toString().trim();
    }
    
    return commit;

};


module.exports = {
    isGitRepo,
    getCommit,
};

