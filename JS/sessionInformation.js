function SessionInformation(){
    this.username=null;
    this.password=null;
    this.user = null;
    this.activeMenuId = null;
    this.createclassentity = new Createclassentity();
    this.userloggedin = false;
    this.submittedEntity = null;
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
        location.reload();
        /*
        this.username = null;
        this.password = null;
        this.user = null;
        this.userloggedin = false;
        loadPage(this);
        */
    }
}