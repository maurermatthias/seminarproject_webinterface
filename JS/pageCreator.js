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
    html += "<div id='divUnknownError'></div></div></div></div>";
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

function loadStartPageContentUnknown(id, session) {
    loadLoginPageContent(id, session);

    //var html = "<div id='divUnknownError'>";
    var html = "Login Failed!";
    //html += "</div>";

    document.getElementById('divUnknownError').innerHTML = html;

    setTimeout(function () { document.getElementById('divUnknownError').innerHTML = ""; }, 3000);
}

function loadStartPageMenuUnknown(id, session) {
    var html = "";
    document.getElementById(id).innerHTML = html;
}

//STUDENT

function loadStartPageContentStudent(id, session) {
    var html = "<table class='fullTable'><colgroup><col span='1' id='colStudentLeft'><col span='1' id='colStudentRight'></colgroup>";
    html += "<tr class='fullTr'><td id='tdStudentLeft'><div id='divStudentLeft'>";
    html += "left";
    html += "</div></td><td id='tdStudentRight'><div id='divStudentRight'>";
    html += "right";
    html += "</div></td></tr></table>";
    document.getElementById(id).innerHTML = html;

    loadScrollingClasses("divStudentLeft", session);
}

function loadScrollingClasses(id, session) {
    var html = "<table id='tableStudentClass' class='scroll'  width='100%'>";
    html += "  <thead><tr><th id='thStudentClassRegistered' class='hover thStudentClass'>Registered</th>";
    html += "<th id='thStudentClassAvailable' class='hover divChosen thStudentClass'>Available</th></tr></thead>";
    var classes = session.user.user.availableclasses;
    for (var i = 0; i < classes.length; i++) {
        html += "  <tr><td colspan='2' id='tdStudentClass" + i + "' class='tdStudentClass hover'>" + classes[i].name + "</td></tr>"
    }
    html += "</table>";
    document.getElementById(id).innerHTML = html;
    setStudentClassClickListener(session);

    var elements = document.getElementsByClassName("thStudentClass");
    for (var i = 0; i < elements.length; i++) {
        elements[i].onclick = function () {
            var elements = document.getElementsByClassName("thStudentClass");
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
                loadStudentClassInfo(null, session);
            }
            //delete all rows
            var table = document.getElementById('tableStudentClass');
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }
            //add new lines
            var newLines = "";
            var classes;
            switch (this.id) {
                case "thStudentClassRegistered":
                    classes = session.user.user.registeredclasses;
                    break;
                case "thStudentClassAvailable":
                    classes = session.user.user.availableclasses;
                    break;
            }
            for (var i = 0; i < classes.length; i++) {
                newLines += "  <tr><td colspan='2' id='tdStudentClass" + i + "' class='tdStudentClass hover'>" + classes[i].name + "</td></tr>"
            }
            table.tBodies[0].innerHTML += newLines;
            setStudentClassClickListener(session);
        }
    }

}

function setStudentClassClickListener(session) {
    var elements = document.getElementsByClassName("tdStudentClass");
    for (var i = 0; i < elements.length; i++) {
        elements[i].onclick = function () {
            var elements = document.getElementsByClassName("tdStudentClass");
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
                loadStudentClassInfo(this.innerHTML, session);
            }
        }
    }

}

function loadStartPageMenuStudent(id, session) {
    var html = "<div id='buttonLogout' class='hover'>Logout</div>";
    document.getElementById(id).innerHTML = html;

    document.getElementById('buttonLogout').onclick = function () {
        sessionInformation.logout();
    }
}

function loadStudentClassInfo(classname, session) {
    if (classname == null) {
        document.getElementById('divStudentRight').innerHTML = "right";
        return;
    }
    //get class by name
    var clazz = null;
    var registeredForClass = false;
    for (var i = 0; i < session.user.user.registeredclasses.length; i++) {
        if (session.user.user.registeredclasses[i].name == classname) {
            clazz = session.user.user.registeredclasses[i];
            registeredForClass = true;
            break;
        }
    }
    if (clazz == null) {
        for (var i = 0; i < session.user.user.availableclasses.length; i++) {
            if (session.user.user.availableclasses[i].name == classname) {
                clazz = session.user.user.availableclasses[i];
                break;
            }
        }
    }

    var html = "<div id='divStudentClass'>";
    html += "NAME: " + clazz.name + "</br>";
    if (registeredForClass) {
        html += "ALREADY REGISTERED";
    } else {
        html += "NOT REGISTERED";
    }
    html += "<div>";
    document.getElementById('divStudentRight').innerHTML = html;
}


//TEACHER

function loadStartPageContentTeacher(id, session) {
    var html = "<table class='fullTable'><colgroup><col span='1' id='colTeacherLeft'><col span='1' id='colTeacherRight'></colgroup>";
    html += "<tr class='fullTr'><td id='tdTeacherLeft'><div id='divTeacherLeft'>";
    html += "left";
    html += "</div></td><td id='tdTeacherRight'><div id='divTeacherRight'>";
    html += "right";
    html += "</div></td></tr></table>";
    document.getElementById(id).innerHTML = html;

    loadScrollingForTeacher("divTeacherLeft", session);
}

function loadScrollingForTeacher(id, session) {
    var html = "<table id='tableTeacherClass' class='scroll'  width='100%'>";
    html += "  <thead><tr><th id='thTeacherCreatedClasses' class='hover thTeacherScroll'>Created Classes</th>";
    html += "<th id='thTeacherCreatedStudents' class='hover divChosen thTeacherScroll'>Created Students</th></tr>";
    html += "<tr><th id='thTeacherCreatedCompetences' class='hover thTeacherScroll'>Created Competences</th>";
    html += "<th id='thTeacherVisibleCompetences' class='hover thTeacherScroll'>Visible Competences</th></tr>";
    html += "<tr><th id='thTeacherCreatedCstructures' class='hover thTeacherScroll'>Created C.-Structures</th>";
    html += "<th id='thTeacherVisibleCstructures' class='hover thTeacherScroll'>Visible C.-Structures</th></tr>";
    html += "<tr><th id='thTeacherCreatedTasks' class='hover thTeacherScroll'>Created Tasks</th>";
    html += "<th id='thTeacherVisibleTasks' class='hover thTeacherScroll'>Visible Tasks</th></tr>";
    html += "</thead>";
    var entities = session.user.user.createdstudents;
    for (var i = 0; i < entities.length; i++) {
        html += "  <tr><td colspan='2' id='tdTeacherEntities" + i + "' class='tdTeacherCreatedStudents tdTeacherScroll hover'>" + entities[i].name + "</td></tr>"
    }
    html += "</table>";
    document.getElementById(id).innerHTML = html;
    setTeacherEntityClickListener(session);

    var elements = document.getElementsByClassName("thTeacherScroll");
    for (var i = 0; i < elements.length; i++) {
        elements[i].onclick = function () {
            var elements = document.getElementsByClassName("thTeacherScroll");
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
                //loadStudentClassInfo(null, session);
            }
            //delete all rows
            var table = document.getElementById('tableTeacherClass');
            while (table.rows.length > 4) {
                table.deleteRow(4);
            }
            //add new lines
            var newLines = "";
            var entities;
            var className;
            switch (this.id) {
                case "thTeacherCreatedClasses":
                    entities = session.user.user.createdclasses;
                    className='tdTeacherCreatedClasses';
                    break;
                case "thTeacherCreatedStudents":
                    entities = session.user.user.createdstudents;
                    className='tdTeacherCreatedStudents';
                    break;
                case "thTeacherCreatedCompetences":
                    entities = session.user.user.createdcompetences;
                    className='tdTeacherCreatedCompetences';
                    break;
                case "thTeacherCreatedCstructures":
                    entities = session.user.user.createdcstructures;
                    className='tdTeacherCreatedCstructures';
                    break;
                case "thTeacherCreatedTasks":
                    entities = session.user.user.createdtasks;
                    className='tdTeacherCreatedTasks';
                    break;
                case "thTeacherVisibleCompetences":
                    entities = session.user.user.visiblecompetences;
                    className='tdTeacherVisibleCompetences';
                    break;
                case "thTeacherVisibleCstructures":
                    entities = session.user.user.visiblecstructures;
                    className='tdTeacherVisibleCstructures';
                    break;
                case "thTeacherVisibleTasks":
                    entities = session.user.user.visibletasks;
                    className='tdTeacherVisibleTasks';
                    break;
            }
            for (var i = 0; i < entities.length; i++) {
                newLines += "  <tr><td colspan='2' id='tdTeacherEntities" + i + "' class='"+className+" tdTeacherScroll hover'>" + entities[i].name + "</td></tr>"
            }
            table.tBodies[0].innerHTML += newLines;
            setTeacherEntityClickListener(session);
            
        }
    }

}

function setTeacherEntityClickListener(session) {
    var elements = document.getElementsByClassName("tdTeacherScroll");
    for (var i = 0; i < elements.length; i++) {
        elements[i].onclick = function () {
            var elements = document.getElementsByClassName("tdTeacherScroll");
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
                loadTeacherEntityInfo(this.innerHTML, session);
            }
        }
    }
}

function loadTeacherEntityInfo(name, session) {
    var html = "";

    var elements = document.getElementsByClassName("thTeacherScroll");
    var chosenId = -1;
    //find selected item
    for (var i = 0; i < elements.length; i++) {
        var classes = elements[i].className.split(" ");
        if (classes.indexOf("divChosen") > -1) {
            chosenId = elements[i].id;
            break;
        }
    }
    switch (chosenId) {
        case "thTeacherCreatedClasses":
            html += "Created Class: " + name;
            break;
        case "thTeacherCreatedStudents":
            html += "Created Student: " + name;
            break;
        case "thTeacherCreatedCompetences":
            html += "Created Competence: " + name;
            break;
        case "thTeacherCreatedCstructures":
            html += "Created C.-Structure: " + name;
            break;
        case "thTeacherCreatedTasks":
            html += "Created Task: " + name;
            break;
        case "thTeacherVisibleCompetences":
            html += "Visible Competence: " + name;
            break;
        case "thTeacherVisibleCstructures":
            html += "Visible C.-Structure: " + name;
            break;
        case "thTeacherVisibleTasks":
            html += "Visible Task: " + name;
            break;
    }

    document.getElementById('divTeacherRight').innerHTML = html;
}

function loadStartPageMenuTeacher(id, session) {
    var html = "<div id='buttonLogout' class='hover'>Logout</div>";
    document.getElementById(id).innerHTML = html;

    document.getElementById('buttonLogout').onclick = function () {
        sessionInformation.logout();
    }
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
    var html = "<div id='buttonLogout' class='hover'>Logout</div>";
    document.getElementById(id).innerHTML = html;

    document.getElementById('buttonLogout').onclick = function () {
        sessionInformation.logout();
    }
}