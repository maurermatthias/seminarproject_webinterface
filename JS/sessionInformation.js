function SessionInformation(){
    this.username;
    this.password;
    this.user;
    this.userloggedin;
    this.login = function (username, password) {
        this.username = username;
        this.password = password;
        doLogin(username,password);
    };
    this.setUser = function (xml) {
        this.user = new TheUser(xml);
        this.userloggedin = true;
        loadPage(this);
    };
    this.logout = function () {
        this.username = null;
        this.password = null;
        this.user = null;
        this.userloggedin = false;
        loadPage(this);
    }
}