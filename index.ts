import {VoyagerPlugin, TLD, DirContent} from './Plugin';
import * as path from 'path';
import * as fs from 'async-file';
const si = require('systeminformation'); //no bindings/not friendly

export = (electron) => {
	async function getTLDs () {
		let toReturn: TLD[] = [];
		let drives = await si.fsSize();
		for(let drive of drives) {
			let tld: TLD = {
				name: drive.fs as string,
				mount: drive.mount as string
			}
			let deets = new Map<string, string>();
			deets.set('size', drive.size);
			deets.set('used', drive.used);
			deets.set('type', drive.type);
			tld.details = deets;
			toReturn.push(tld);
		}
		return toReturn;
	}
	async function getDirContents(dir: string) {
		try {
			let toReturn: DirContent = {dirs: [], files: []};
			let strs = await fs.readdir(dir);
			for(let i = 0; i < strs.length; i++) {
				try {
					let str = strs[i];
					let stat = await fs.lstat(path.join(dir, str));
					if(stat.isDirectory()) {
						toReturn.dirs.push(str);
					}
					else if(stat.isFile()) {
						toReturn.files.push(str);
					}
				}
				catch(err) {};
			}
			return toReturn;
		}
		catch(err) {
			return {dirs: null, files: null};
		}
	};
	async function openFile (path: string) {
		electron.shell.openItem(path);
	}
	let ret: VoyagerPlugin = {
		pluginName: 'Local Files',
		getTLDs: getTLDs,
		getDirContents: getDirContents,
		openFile: openFile
	}
	return ret;
}





