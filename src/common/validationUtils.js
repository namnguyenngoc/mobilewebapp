export default {
    required: value => !!value || 'Required field',
    required_long: value => !!value || 'This is required field !',
    required_short: value => !!value || 'Required',
    min: n => { return v => (v && v.length >= n) || `Min ${n} characters` },
    max: n => { return v => (v && v.length <= n) || `Max ${n} characters` },
    emailMatch: () => ('The email and password you entered don\'t match'),
    emailRules: v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
    emailIdRules: v => !v || /^\w+([.-]?\w+)*/.test(v) || 'E-mail must be valid',
    multiEmailRules: (n)=> { return v => {
            if (v.indexOf(';') !== -1 && v.indexOf(',') !== -1) {
                return 'E-mail is not allowed to use both comma and semicolon';
            } else if (v.indexOf(';') !== -1 || v.indexOf(',') !== -1) {
                let msgValid;
                let emailSet = new Set();
                let arrEmail = v.split(';').length > 1? v.split(';') : v.split(',');
                arrEmail.every(item => {
                    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(item)) {
                        msgValid = 'E-mail must be valid';
                        return false;
                    }
                    if (emailSet.has(item)) {
                        msgValid = 'E-mail has been duplicated';
                        return false;
                    } else {
                        emailSet.add(item);
                    }
                    return true;
                })
                if (arrEmail.length > n) {
                    msgValid = `Max ${n} email address.`;
                }
                if (msgValid) {
                    return msgValid;
                } else {
                    return true;
                }
            } else {
                return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
            }
        }
    }
}