"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const path = require("path");
const fs = require("async-file");
const si = require('systeminformation');
module.exports = (electron) => {
    function getTLDs() {
        return __awaiter(this, void 0, void 0, function* () {
            let toReturn = [];
            let drives = yield si.fsSize();
            for (let drive of drives) {
                let tld = {
                    name: drive.fs,
                    mount: drive.mount
                };
                let deets = new Map();
                deets.set('size', drive.size);
                deets.set('used', drive.used);
                deets.set('type', drive.type);
                tld.details = deets;
                toReturn.push(tld);
            }
            return toReturn;
        });
    }
    function getDirContents(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let toReturn = { dirs: [], files: [] };
                let strs = yield fs.readdir(dir);
                for (let i = 0; i < strs.length; i++) {
                    try {
                        let str = strs[i];
                        let stat = yield fs.lstat(path.join(dir, str));
                        if (stat.isDirectory()) {
                            toReturn.dirs.push(str);
                        }
                        else if (stat.isFile()) {
                            toReturn.files.push(str);
                        }
                    }
                    catch (err) { }
                    ;
                }
                return toReturn;
            }
            catch (err) {
                return { dirs: null, files: null };
            }
        });
    }
    ;
    function openFile(path) {
        return __awaiter(this, void 0, void 0, function* () {
            electron.shell.openItem(path);
        });
    }
    let ret = {
        pluginName: 'Local Files',
        getTLDs: getTLDs,
        getDirContents: getDirContents,
        openFile: openFile
    };
    return ret;
};
//# sourceMappingURL=index.js.map