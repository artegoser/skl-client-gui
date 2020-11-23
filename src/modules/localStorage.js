//Файл зашифрован и находится в %AppData%/Local/sklclient/localStorage

const crypto = require('crypto');
const fs = require('fs');

const pass = 'WAJjC7PvU^K9+KrgtftUpMmhFasASFasGASfUK';
const algo = 'aes-192-cbc';
const keyLength = 192 / 8; // в байтах

const key = crypto.scryptSync(pass, 'MxohgI', keyLength);

const publicInitVector = Buffer.alloc(16, 0);

const AppData = process.env.APPDATA;

class localStorage {
    constructor() {
        this.busy = false;
        this.needToSave = false;

        this._items = {};

        this._load();
    }

    decodeFromStorage(){
        let decrypted = '{}';

        const decipher = crypto.createDecipheriv(algo, key, publicInitVector);
        const fileBuffer = fs.readFileSync(AppData + '/sklclient/localStorage').toString();

        if (fileBuffer.length === 0) throw new Error('Buffer length is null')

        decrypted = decipher.update(fileBuffer, 'hex', 'utf8');

        decrypted += decipher.final('utf8');

        return [fileBuffer, decrypted]
    }

    async _load() {
        if (!fs.existsSync(AppData + '/sklclient')) {
            fs.mkdirSync(AppData + '/sklclient');
        }

        if (fs.existsSync(AppData + '/sklclient/localStorage')) {
            try {
                let [fileBuffer, decrypted] = this.decodeFromStorage();

                if (decrypted.length > 0) {
                    fs.writeFileSync(AppData + '/sklclient/localStorageBackup', fileBuffer);

                    this._items = JSON.parse(decrypted);
                }else{
                    this._loadFromBackup();
                }
            } catch (e) {
                try{
                    this._loadFromBackup();
                }catch(e1){
                    console.log(e, e1)
                    this._items = {};
                }
            }
        }
    }

    _save() {
        if (this.busy) return this.needToSave = true;
        this.busy = true;

        if (!fs.existsSync(AppData + '/sklclient')) {
            fs.mkdirSync(AppData + '/sklclient');
        }

        const cipher = crypto.createCipheriv(algo, key, publicInitVector);
        let crypted = cipher.update(JSON.stringify(this._items), 'utf8', 'hex');
        crypted += cipher.final('hex')

        // синхронность - вынужденная мера
        fs.writeFileSync(AppData + '/sklclient/localStorage', crypted);

        setTimeout(() => {
            this.busy = false;

            if(this.needToSave){
                this.needToSave = false;
                this._save();
            } 
        }, 1000);
    }

    _loadFromBackup(){
        if (fs.existsSync(AppData + '/sklclient/localStorageBackup')) {
            fs.unlinkSync(AppData + '/sklclient/localStorage');
            fs.renameSync(AppData + '/sklclient/localStorageBackup', AppData + '/sklclient/localStorage');

            let decrypted = this.decodeFromStorage();

            if (decrypted.length > 0) {
                this._items = JSON.parse(decrypted);
            } else throw new Error('Backup is corrupted')
        } else throw new Error('Backup file does not exist')
    }

    /**
     * Возвращает значение ключа item, либо null
     * Не может быть использован до _load
     * @param {String} key 
     */
    getItem(key) {
        return this._items[key] || null
    }

    setItem(key, value) {
        if (this._items[key] == value) return;
        this._items[key] = value; //JSON.stringify(value);
        this._save();
    }

    removeItem(key) {
        delete this._items[key];
        this._save();
    }
}

module.exports = new localStorage();