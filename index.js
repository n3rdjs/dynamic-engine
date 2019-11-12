
const fs = require('fs');
const path = require('path');
const {
    execSync
} = require('child_process');
const tmp = require('tmp');

class DynamicEngine {
    constructor(module_name, module_version='latest', tmpfolder=undefined) {
        this.module_name = module_name;
        this.module_version = module_version;
        if (tmpfolder == undefined) {
            this.tmpfolder = tmp.dirSync({
                unsafeCleanup: true
            }).name;
            console.log(`[+] TempDir Created: ${this.tmpfolder}`);
            execSync('npm init -y', {
                cwd: this.tmpfolder,
                timeout: 5000
            });
            execSync(`npm install --save ${module_name}@${module_version}`, {
                cwd: this.tmpfolder,
                timeout: 5000
            });
        }
        else {
            this.tmpfolder = tmpfolder;
        }
    }

    get_exported_functions() {
        const script = fs.readFileSync(path.join('lib', 'get_exported_functions.js')).toString().replace('{module_name}', this.module_name);
        fs.writeFileSync(path.join(this.tmpfolder, 'index.js'), script);
        return JSON.parse(execSync('node index.js', {
            cwd: this.tmpfolder,
            timeout: 5000
        }).toString());
    }
}

module.exports = {
    DynamicEngine: DynamicEngine,
};