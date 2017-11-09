module.exports = {
    string_encrypt(string, key) {
        let CryptoJS = require("crypto-js");
        return CryptoJS.AES.encrypt(string, key).toString();
    },
    string_decrypt(cipher_text, key) {
        let CryptoJS = require("crypto-js");
        let bytes = CryptoJS.AES.decrypt(cipher_text.toString(), key);
        return bytes.toString(CryptoJS.enc.Utf8);
    },

    encryption_key_validation(encryption_key){
        const validation_hash = 'de024ef52640e52d82bdb7e6433d37e3';
        if(!config_store.has('encryption_validate')){
            config_store.set('encryption_validate', window.helpers.string_encrypt(validation_hash, encryption_key));
            return true;
        }
        try {
            if (validation_hash != this.string_decrypt(config_store.get('encryption_validate'), encryption_key)) {
                return false;
            }
        }catch(e){
            return false;
        }
        return true;
    },
    get_disk_driver_config(driver, encryption_key){
        let disk_config_obj = JSON.parse(this.string_decrypt(disk_driver_store.get('disk.'+driver), encryption_key));
        return disk_config_obj;
    },
    set_disk_driver_config(driver, remote_url, username, password, encryption_key){
        let driver_config_obj = {
            remote_url: _.trim(remote_url),
            username: _.trim(username),
            password: _.trim(password),
        };
        return disk_driver_store.set('disk.'+driver, window.helpers.string_encrypt(JSON.stringify(driver_config_obj), encryption_key));
    },
    delete_disk_driver_config(driver){
        return disk_driver_store.delete('disk.' + driver);
    },
    has_disk_driver(driver){
        return disk_driver_store.has(driver);
    },

    combine_filename(folder, filename){
        let basefolder = folder;
        if(!_.endsWith('/', basefolder)){
            basefolder += '/';
        }
        if(_.startsWith('/', filename)){
            filename = String(filename).substr(1);
        }

        return basefolder + filename;
    },
    open_folder(path){
        remote.shell.showItemInFolder(path);
    },

    get_time_string(utc_timestamp){
        let date = new Date(utc_timestamp);
        return date.toLocaleString();
    },
};