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
    html += "Chose Entity for more information.";
    html += "</div></td></tr></table>";
    document.getElementById(id).innerHTML = html;

    loadScrollingEntities("divAdminLeft",session);
}

function loadScrollingEntities(id,session) {
    var html = "<table id='tableAdminEntity' class='scroll'  width='100%'>";
    html += "  <thead><tr><th id='thAdminEntityStudent' class='hover thAdminEntity'>Students</th>";
    html += "<th id='thAdminEntityTeacher' class='hover thAdminEntity'>Teachers</th>";
    html += "<th id='thAdminEntityAdmin' class='hover divChosen thAdminEntity'>Administrators</th></tr></thead>";
    var users = session.user.user.administrators;
    for (var i = 0; i < users.length; i++) {
        html += "  <tr><td colspan='3' id='tdAdminEntity" + i + "' class='tdAdminEntity hover'>" + users[i].name + "</td></tr>"
    }
    html += "</table>";
    document.getElementById(id).innerHTML = html;
    setAdminEntityClickListener(session);

    var elements = document.getElementsByClassName("thAdminEntity");
    for(var i=0;i<elements.length;i++){
        elements[i].onclick = function () {
            var elements = document.getElementsByClassName("thAdminEntity");
            var chosenId = -1;
            //find selected item
            for (var i = 0; i < elements.length; i++) {
                var classes = elements[i].className.split(" ");
                if (classes.indexOf("divChosen") > -1) {
                    chosenId = elements[i].id;
                    break;
                }
            }
            if (!(this.id == chosenId)) {
                //unselect old selected item
                var pos = document.getElementById(chosenId).className.split(" ").indexOf("divChosen");
                var newClassArray = document.getElementById(chosenId).className.split(" ");
                newClassArray.splice(pos, 1);
                document.getElementById(chosenId).className = newClassArray.join(" ");
                //select new item
                this.className = this.className + " divChosen";
                loadAdminEntityInfo(null,session);
            }
            //delete all rows
            var table = document.getElementById('tableAdminEntity');
            while(table.rows.length>1){
                table.deleteRow(1);
            }
            //add new lines
            var newLines = "";
            var users;
            switch (this.id) {
                case "thAdminEntityStudent":
                    users = session.user.user.students;
                    break;
                case "thAdminEntityTeacher":
                    users = session.user.user.teachers;
                    break;
                case "thAdminEntityAdmin":
                    users = session.user.user.administrators;
                    break;
            }
            for (var i = 0; i < users.length; i++) {
                newLines += "  <tr><td colspan='3' id='tdAdminEntity" + i + "' class='tdAdminEntity hover'>" + users[i].name + "</td></tr>"
            }
            table.tBodies[0].innerHTML += newLines;
            setAdminEntityClickListener(session);
        }
    }

}

function setAdminEntityClickListener(session) {
    var elements = document.getElementsByClassName("tdAdminEntity");
    for (var i = 0; i < elements.length; i++) {
        elements[i].onclick = function () {
            var elements = document.getElementsByClassName("tdAdminEntity");
            var chosenId = -1;
            //find selected item
            for (var i = 0; i < elements.length; i++) {
                var classes = elements[i].className.split(" ");
                if (classes.indexOf("divChosen") > -1) {
                    chosenId = elements[i].id;
                    break;
                }
            }
            if (!(this.id == chosenId)) {
                //unselect old selected item
                if (chosenId != -1) {
                    var pos = document.getElementById(chosenId).className.split(" ").indexOf("divChosen");
                    var newClassArray = document.getElementById(chosenId).className.split(" ");
                    newClassArray.splice(pos, 1);
                    document.getElementById(chosenId).className = newClassArray.join(" ");
                }
                //select new item
                this.className = this.className + " divChosen";
                loadAdminEntityInfo(this.innerHTML,session);
            }
        }
    }

}

function loadAdminEntityInfo(username, session) {
    if (username == null) {
        document.getElementById('divAdminRight').innerHTML = "Chose Entity for more information.";
        return;
    }
    //get Entity by username
    var user = null;
    for(var i=0;i<session.user.user.administrators.length;i++){
        if (session.user.user.administrators[i].name == username) {
            user = session.user.user.administrators[i];
            break;
        }
    }
    if (user == null) {
        for (var i = 0; i < session.user.user.teachers.length; i++) {
            if (session.user.user.teachers[i].name == username) {
                user = session.user.user.teachers[i];
                break;
            }
        }
    }
    if (user == null) {
        for (var i = 0; i < session.user.user.students.length; i++) {
            if (session.user.user.students[i].name == username) {
                user = session.user.user.students[i];
                break;
            }
        }
    }
    var html = "<div id='divAdminEntity'>";
    html += "NAME: " + user.name + "</br>";
    if (user.usergroup == 1) {
        html = "<div><table  class='scroll'  width='50%'>";
        html += "  <thead><tr><th>Student is registered for the following classes:</th></tr></thead>";
        var classes = user.registeredclasses;
        for (var i = 0; i < classes.length; i++) {
            html += "  <tr><td>" + classes[i].name +": " +classes[i].description + "</td></tr>"
        }
        html += "</table></div>";
    } else if (user.usergroup == 2) {
        html = "<div><table  class='scroll'  width='50%'>";
        html += "  <thead><tr><th>Teacher created the following classes:</th></tr></thead>";
        var classes = user.createdclasses;
        for (var i = 0; i < classes.length; i++) {
            html += "  <tr><td>" + classes[i].name + ": " + classes[i].description + "</td></tr>"
        }
        html += "</table></div>";
    }
    html += "<div>";
    document.getElementById('divAdminRight').innerHTML = html;
}

function loadStartPageMenuAdministrator(id, session) {
    var html = "administrator";
    document.getElementById(id).innerHTML = html;
}

























