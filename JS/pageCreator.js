function loadPage(session) {
    var idContent = "divContent";
    var idMenu = "divMenu";
    if (session.user == null) {
        loadLoginPageMenu(idMenu, session);
        loadLoginPageContent(idContent, session);
        //tmp: login
        sessionInformation.login("a", "s");
    }
    else {
        if (session.user.usergroup == 0) {
            loadStartPageMenuUnknown(idMenu, session);
            loadStartPageContentUnknown(idContent, session);
        } else if (session.user.usergroup == 1) {
            loadStartPageMenuStudent(idMenu, session);
            loadStartPageContentStudent(idContent, session);
        } else if (session.user.usergroup == 2) {
            loadStartPageMenuTeacher(idMenu, session);
            loadStartPageContentTeacher(idContent, session);
        } else if (session.user.usergroup == 3) {
            loadStartPageMenuAdministrator(idMenu, session);
            loadStartPageContentAdministrator(idContent, session);
        } else {
            throw "Unknown usergroup for loading startpage";
        }
    }
}

//LOGIN

function loadLoginPageContent(id,session) {
    var html = "<div id='divLoginParent'><div id='divLoginChild'><div id='divLogin'>";
    html += "<table><tr>";
    html += "<td>Username:</td>";
    html += "<td><input type='text' id='inputUsername' class='center'></td>";
    html += "</tr><tr>";
    html += "<td>Password:</td>";
    html += "<td><input type='password' id='inputPassword' class='center'></td>";
    html += "</tr><tr>";
    html += "<td colspan='2'><button class='stretchButton' id='buttonLogin'>Login</button></td>";
    html += "</tr></table>";
    html += "</div></div></div>";
    document.getElementById(id).innerHTML = html;

    document.getElementById('buttonLogin').onclick = function () {
        sessionInformation.login(document.getElementById('inputUsername').value,
            document.getElementById('inputPassword').value);
    }
}

function loadLoginPageMenu(id, session) {
    var html = "";
    document.getElementById(id).innerHTML = html;
}

//UNKNOWN

function loadStartPageContentUnknown(id,session) {
    var html = "...";
    document.getElementById(id).innerHTML = html;
}

function loadStartPageMenuUnknown(id, session) {
    var html = "unknown";
    document.getElementById(id).innerHTML = html;
}

//STUDENT

function loadStartPageContentStudent(id, session) {
    var html = "...";
    document.getElementById(id).innerHTML = html;
}

function loadStartPageMenuStudent(id, session) {
    var html = "student";
    document.getElementById(id).innerHTML = html;
}

//TEACHER

function loadStartPageContentTeacher(id, session) {
    var html = "...";
    document.getElementById(id).innerHTML = html;
}

function loadStartPageMenuTeacher(id, session) {
    var html = "teacher";
    document.getElementById(id).innerHTML = html;
}

//ADMIN

function loadStartPageContentAdministrator(id, session) {
    var html = "<table class='fullTable'><colgroup><col span='1' id='colAdminLeft'><col span='1' id='colAdminRight'></colgroup>";
    html += "<tr class='fullTr'><td id='tdAminLeft'><div id='divAdminLeft'>";
    html += "left";
    html += "</div></td><td id='tdAminRight'><div id='divAdminRight'>";
    html += "right";
    html += "</div></td></tr></table>";
    document.getElementById(id).innerHTML = html;

    loadScrollingEntities("divAdminLeft");
}

function loadScrollingEntities(id) {
    /*
    var html = "<table class='fullTable'>";
    html += "<tr id='trAdminLeft'><td id='tdAdminEntityStudent' class='hover'>Student";
    html += "</td><td id='tdAminEntityTeacher' class='hover'>Teacher";
    html += "</td><td id='tdAminEntityAdmin' class='hover'>Administrator";
    html += "</td></tr><tr><td colspan='3'>...</td></tr></table>";
    */
    var html = "<table class='scroll' width='400px'>";
    html += "  <thead><tr><th id='thAdminEntityStudent' class='hover'>Students</th>";
    html += "<th id='thAdminEntityTeacher' class='hover'>Teachers</th>";
    html += "<th id='thAdminEntityAdmin' class='hover'>Administrators</th></tr></thead>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "  <tr><td colspan='3'>Data</td></tr>";
    html += "</table>";
    document.getElementById(id).innerHTML = html;
}

function loadStartPageMenuAdministrator(id, session) {
    var html = "administrator";
    document.getElementById(id).innerHTML = html;
}

























