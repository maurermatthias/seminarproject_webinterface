function loadPage(session) {
    var idContent = "divContent";
    var idMenu = "divMenu";
    if (session.user == null) {
        loadLoginPageMenu(idMenu, session);
        loadLoginPageContent(idContent, session);
        //tmp: login
        sessionInformation.login("teacher1", "teacher1");
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
    html += "";
    html += "</div></td><td id='tdStudentRight'><div id='divStudentRight'>";
    html += "";
    html += "</div></td></tr></table>";
    document.getElementById(id).innerHTML = html;

    loadScrollingClasses("divStudentLeft", session);
}

function loadScrollingClasses(id, session) {
    var html = "<table id='tableStudentClass' class='scroll'  width='100%'>";
    html += "  <thead><tr><th id='thStudentClassRegistered' class='hover thStudentClass'>Registered</th>";
    html += "<th id='thStudentClassAvailable' class='hover divChosen thStudentClass'>Available</th></tr></thead><tbody>";
    var classes = session.user.user.availableclasses;
    for (var i = 0; i < classes.length; i++) {
        html += "  <tr><td colspan='2' id='tdStudentClass" + i + "' class='tdStudentClass hover'>" + classes[i].name + "</td></tr>"
    }
    html += "</tbody></table>";
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
            //if (!(this.id == chosenId)) {
                //unselect old selected item
                var pos = document.getElementById(chosenId).className.split(" ").indexOf("divChosen");
                var newClassArray = document.getElementById(chosenId).className.split(" ");
                newClassArray.splice(pos, 1);
                document.getElementById(chosenId).className = newClassArray.join(" ");
                //select new item
                this.className = this.className + " divChosen";
                loadStudentClassInfo(null, session);
            //}
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
        document.getElementById('divStudentRight').innerHTML = "";
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
    var html = "<table class='fullTable'><colgroup><col span='1' id='colStudentClassLeft'><col span='1' id='colStudentClassRight'></colgroup>";
    html += "<tr class='fullTr'><td id='tdTeacherClassLeft'><div id='divStudentClassLeft'>";
    //middle section start
    if (registeredForClass) {
        html += "<h3>Registered Class</h3>";
    } else {
        html += "<h3>Available Class</h3>";
    }
    html += "<p>Name: <input type='text' id='viewEntityName' value='" + clazz.name + "' readonly></p>";
    html += "<p>Description:</p> <textarea rows='7' cols='70' id='viewEntityDescription' readonly>" + clazz.description + "</textarea >";
    html += "<p><input type='button' id='studentButtonRegister' value='";
    if (registeredForClass) {
        html += "Deregister";
    } else {
        html += "Register";
    }
    html += "'></p>";
    if (registeredForClass) {
        html += "<p><input type='button' value='Continue' id='buttonStudentContinueClass'></p>";
    }
    //middle section end
    html += "</div></td><td id='tdTeacherClassRight'><div id='divStudentClassRight'>";
    //right section start
    //right section end
    html += "</div></td></tr></table>";
    document.getElementById('divStudentRight').innerHTML = html;

    document.getElementById('studentButtonRegister').onclick = function () {
        var entity = new studentregistration();
        entity.classname = document.getElementById('viewEntityName').value;
        entity.studentname = sessionInformation.username;
        if (this.value == "Register") {
            postEntity(sessionInformation.username, sessionInformation.password, entity);
        } else if (this.value == "Deregister") {
            deleteEntity(sessionInformation.username, sessionInformation.password, entity);
            document.getElementById('thStudentClassRegistered').click();
        } else {
            alert("Line should not be reached!");
        }
    }

    var element = document.getElementById('buttonStudentContinueClass');
    if (element != null) {
        element.onclick = function () {
            var clazzname = document.getElementById('viewEntityName').value;
            var html = "<h3 id='nextTaskHeading'>" + clazzname + "</h3>";
            html += "<p>Question:</p> <textarea rows='7' cols='50' id='getNextTaskQuestion' readonly></textarea >";
            html += "<p><input type='text' id='getNextTaskAnswer' size='50'><input type='button' class='getNextTaskSubmit' value='Submit'></p>";
            document.getElementById('divStudentClassRight').innerHTML = html;
            getNextTask(sessionInformation.username, sessionInformation.password,clazzname);
        }
    }
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
    html += "  <thead><tr><th id='thTeacherCreatedClasses' class='hover thTeacherScroll'>  Created Classes  </th>";
    html += "<th id='thTeacherCreatedStudents' class='hover divChosen thTeacherScroll'>Created Students</th></tr>";
    html += "<tr><th id='thTeacherCreatedCompetences' class='hover thTeacherScroll'>Created Competences</th>";
    html += "<th id='thTeacherVisibleCompetences' class='hover thTeacherScroll'>Visible Competences</th></tr>";
    html += "<tr><th id='thTeacherCreatedCstructures' class='hover thTeacherScroll'>Created C.-Structures</th>";
    html += "<th id='thTeacherVisibleCstructures' class='hover thTeacherScroll'>Visible C.-Structures</th></tr>";
    html += "<tr><th id='thTeacherCreatedTasks' class='hover thTeacherScroll'>Created Tasks</th>";
    html += "<th id='thTeacherVisibleTasks' class='hover thTeacherScroll'>Visible Tasks</th></tr>";
    html += "</thead><tbody>";
    html += "  <tr><td colspan='2' id='tdTeacherEntities+' class='tdTeacherCreatedStudents center hover'>+</td></tr>"
    var entities = session.user.user.createdstudents;
    for (var i = 0; i < entities.length; i++) {
        html += "  <tr><td colspan='2' id='tdTeacherEntities" + i + "' class='tdTeacherCreatedStudents tdTeacherScroll hover'>" + entities[i].name + "</td></tr>"
    }
    html += "</tbody></table>";
    document.getElementById(id).innerHTML = html;
    setTeacherEntityClickListener(session);
    setTeacherEntityAddListener(session);

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
            var newEntity;
            switch (this.id) {
                case "thTeacherCreatedClasses":
                    entities = session.user.user.createdclasses;
                    className = 'tdTeacherCreatedClasses';
                    newEntity = true;
                    break;
                case "thTeacherCreatedStudents":
                    entities = session.user.user.createdstudents;
                    className = 'tdTeacherCreatedStudents';
                    newEntity = true;
                    break;
                case "thTeacherCreatedCompetences":
                    entities = session.user.user.createdcompetences;
                    className = 'tdTeacherCreatedCompetences';
                    newEntity = true;
                    break;
                case "thTeacherCreatedCstructures":
                    entities = session.user.user.createdcstructures;
                    className = 'tdTeacherCreatedCstructures';
                    newEntity = true;
                    break;
                case "thTeacherCreatedTasks":
                    entities = session.user.user.createdtasks;
                    className = 'tdTeacherCreatedTasks';
                    newEntity = true;
                    break;
                case "thTeacherVisibleCompetences":
                    entities = session.user.user.visiblecompetences;
                    className = 'tdTeacherVisibleCompetences';
                    newEntity = false;
                    break;
                case "thTeacherVisibleCstructures":
                    entities = session.user.user.visiblecstructures;
                    className = 'tdTeacherVisibleCstructures';
                    newEntity = false;
                    break;
                case "thTeacherVisibleTasks":
                    entities = session.user.user.visibletasks;
                    className = 'tdTeacherVisibleTasks';
                    newEntity = false;
                    break;
            }
            if(newEntity)
                newLines += "  <tr><td colspan='2' id='tdTeacherEntities+' class='" + className + " center tdTeacherCreatedStudents hover'>+</td></tr>"
            for (var i = 0; i < entities.length; i++) {
                newLines += "  <tr><td colspan='2' id='tdTeacherEntities" + i + "' class='"+className+" tdTeacherScroll hover'>" + entities[i].name + "</td></tr>"
            }
            table.tBodies[0].innerHTML += newLines;
            setTeacherEntityClickListener(session);
            setTeacherEntityAddListener(session);

            //set right side empty
            document.getElementById('divTeacherRight').innerHTML = "";
            //set +entity as current choice
            if (document.getElementById('tdTeacherEntities+') != null)
                document.getElementById('tdTeacherEntities+').click();
        }
    }
}

function setTeacherEntityAddListener(session) {
    var element = document.getElementById("tdTeacherEntities+");
    if (element != null) {
        element.onclick = function () {

            //unselect old selection
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
            if (chosenId != -1) {
                //unselect old selected item
                var pos = document.getElementById(chosenId).className.split(" ").indexOf("divChosen");
                var newClassArray = document.getElementById(chosenId).className.split(" ");
                newClassArray.splice(pos, 1);
                document.getElementById(chosenId).className = newClassArray.join(" ");
                //loadStudentClassInfo(null, session);
            }

            var classId = document.getElementById("tdTeacherEntities+").className.split(" ")[0];
            var html = "";
            switch (classId) {
                case "tdTeacherCreatedClasses":
                    html += "<h3>Adding a new Class</h3>";
                    html += "<p>Name: <input type='text' id='addEntityName'></p>";
                    html += "<p>Description:</p> <textarea rows='7' cols='70' id='addEntityDescription'></textarea >";
                    html += "<p>Visibile for all: <input type='checkbox' id='addEntityVisible' class='hover'></p>";
                    break;
                case "tdTeacherCreatedStudents":
                    html += "<h3>Adding a new Student</h3>";
                    html += "<p>Username: <input type='text' id='addEntityName'></p>";
                    html += "<p>Password: <input type='text' id='addEntityPassword'></p>";
                    break;
                case "tdTeacherCreatedCompetences":
                    html += "<h3>Adding a new Competence</h3>";
                    html += "<p>Name: <input type='text' id='addEntityName'></p>";
                    html += "<p>Description:</p> <textarea rows='7' cols='70' id='addEntityDescription'></textarea >";
                    html += "<p>Visibile for all: <input type='checkbox' id='addEntityVisible' class='hover'></p>";
                    break;
                case "tdTeacherCreatedCstructures":
                    html += "<h3>Adding a new Competence-Structure</h3>";
                    html += "<p>Name: <input type='text' id='addEntityName'></p>";
                    html += "<p>Description:</p> <textarea rows='7' cols='70' id='addEntityDescription'></textarea >";
                    html += "<p>Visibile for all: <input type='checkbox' id='addEntityVisible' class='hover'></p>";
                    break;
                case "tdTeacherCreatedTasks":
                    html += "<h3>Adding a new Task</h3>";
                    html += "<p>Name: <input type='text' id='addEntityName'></p>";
                    html += "<p>Description:</p> <textarea rows='7' cols='70' id='addEntityDescription'></textarea >";
                    html += "<p>Question:</p> <textarea rows='7' cols='70' id='addEntityQuestion'></textarea >";
                    html += "<p>Answer: <input type='text' id='addEntityAnswer'></p>";
                    html += "<p>Authenticity: <input type='text' id='viewEntityAuthenticity' value='' size='4'></p>";
                    html += "<p>Visibile for all: <input type='checkbox' id='addEntityVisible' class='hover'></p>";
                    break;
            }
            html += "<input type='button' id='submitNewEntity' value='Submit'>";
            document.getElementById('divTeacherRight').innerHTML = html;

            document.getElementById('submitNewEntity').onclick = function () {
                var classId = document.getElementById("tdTeacherEntities+").className.split(" ")[0];
                var submittedEntity = null;
                switch (classId) {
                    case "tdTeacherCreatedClasses":
                        var claz = new clazz();
                        claz.name = document.getElementById('addEntityName').value;
                        claz.description = document.getElementById('addEntityDescription').value;
                        claz.visibility = document.getElementById('addEntityVisible').checked ? "ALL" : "NOTALL";
                        submittedEntity = claz;
                        break;
                    case "tdTeacherCreatedStudents":
                        var student = new user();
                        student.usergroup = 1;
                        student.name = document.getElementById('addEntityName').value;
                        student.password = document.getElementById('addEntityPassword').value;
                        submittedEntity = student;
                        break;
                    case "tdTeacherCreatedCompetences":
                        var comp = new competence();
                        comp.name = document.getElementById('addEntityName').value;
                        comp.description = document.getElementById('addEntityDescription').value;
                        comp.visibility = document.getElementById('addEntityVisible').checked ? "ALL" : "NOTALL";
                        submittedEntity = comp;
                        break;
                    case "tdTeacherCreatedCstructures":
                        var cs = new cstructure();
                        cs.name = document.getElementById('addEntityName').value;
                        cs.description = document.getElementById('addEntityDescription').value;
                        cs.visibility = document.getElementById('addEntityVisible').checked ? "ALL" : "NOTALL";
                        submittedEntity = cs;
                        break;
                    case "tdTeacherCreatedTasks":
                        var tas = new task();
                        tas.name = document.getElementById('addEntityName').value;
                        tas.description = document.getElementById('addEntityDescription').value;
                        tas.text = document.getElementById('addEntityQuestion').value;
                        tas.answer = document.getElementById('addEntityAnswer').value;
                        tas.visibility = document.getElementById('addEntityVisible').checked ? "ALL" : "NOTALL";
                        tas.authenticity = document.getElementById('viewEntityAuthenticity').value;
                        submittedEntity = tas;
                        break;
                }

                postEntity(sessionInformation.username, sessionInformation.password, submittedEntity);
            }

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

    var html = "";
    var unit = null;
    switch (chosenId) {
        case "thTeacherCreatedClasses":
            for (var i = 0; i < session.user.user.createdclasses.length; i++) {
                if (session.user.user.createdclasses[i].name == name) {
                    unit = session.user.user.createdclasses[i];
                    break;
                }
            }
            html += "<table class='fullTable'><colgroup><col span='1' id='colTeacherClassLeft'><col span='1' id='colTeacherClassRight'></colgroup>";
            html += "<tr class='fullTr'><td id='tdTeacherClassLeft'><div id='divTeacherClassLeft'>";
            //middle section start
            html += "<h3>Created Class</h3>";
            html += "<p>Name: <input type='text' id='viewEntityName' value='"+unit.name+"'></p>";
            html += "<p>Description:</p> <textarea rows='7' cols='70' id='viewEntityDescription'>" + unit.description + "</textarea >";
            html += "<p>Visibile for all: <input type='checkbox' id='viewEntityVisible' class='hover'></p>";
            //start dropdown
            html += "<p>Linked to competence structure:";
            html += "<div id='dropdowntaskclasslinkage' class='dropdown center'>";
            html += "<button onclick='dropdownFunction2()' class='dropbtn' id='buttondropdown2'>";
            if (unit.cstructure==null)
                html += "&nbsp &nbsp &nbsp - &nbsp &nbsp &nbsp";
            else
                html += unit.cstructure;
            html+="</button>";
            html +=" <div id='myDropdown2' class='dropdown-content'>";
            var cstructures = new Array();
            cstructures.push("&nbsp &nbsp &nbsp - &nbsp &nbsp &nbsp");
            for (var i = 0; i < session.user.user.createdcstructures.length; i++) {
                if (cstructures.indexOf(session.user.user.createdcstructures[i].name) == -1 ) {
                    cstructures.push(session.user.user.createdcstructures[i].name);
                }
            }
            for (var i = 0; i < session.user.user.visiblecstructures.length; i++) {
                if (cstructures.indexOf(session.user.user.visiblecstructures[i].name) == -1 ) {
                    cstructures.push(session.user.user.visiblecstructures[i].name);
                }
            }
            for (var i = 0; i < cstructures.length; i++) {
                html += "<a href='#' id='dropdownlinkagetaskclass-" + cstructures[i] + "' class='dropdowncstructure'>" + cstructures[i] + "</a>";
            }
            html += "</div></div></p>";
            //end dropdown
            html += "<p id='psetactive'>Active since: ";
            html += "<div id='divactivesince'>";
            if (unit.active)
                html += unit.date;
            else
                html += " not active ";
            html += "</div> <input type='button' id='setClassActive' value='Set Active' class='hover'> &nbsp; &nbsp; <input type='button' id='setClassInactive' value='Set Inactive' class='hover'></p>";
            html += "<input type='button' id='deleteEntity' value='Delete'>";
            //middle section end
            html += "</td><td id='tdTeacherTaskRight'><div id='divTeacherTaskRight'>";
            //right section start
            html += "<table id='tableTeacherClassTaskLink' class='scroll' width='100%'>";
            html += "  <thead><tr><th colspan='2'> Task links </th></tr>";
            html += "</thead><tbody>";
            var alreadyLinkedTasks = new Array();
            var links = unit.tasks;
            for (var i = 0; i < links.length; i++) {
                alreadyLinkedTasks.push(links[i]);
                html += "  <tr><td id='tdTeacherClassLink" + i + "'>" + links[i] + "</td><td id='deletetaskclasslinkage-" + links[i] + "' class='center hover deletetaskclasslinkage'>-</td></tr>"
            }
            html += "</tbody><tfoot><tr><td id='tdTeacherClassLink+' class='center hover'>";
            html += "<div id='dropdowntaskclasslinkage' class='dropdown'>";
            html += "<button onclick='dropdownFunction3()' class='dropbtn' id='buttondropdown'>Add task</button>";
            html += "<div id='myDropdown3' class='dropdown-content'>";
            var strings = new Array();
            for (var i = 0; i < session.user.user.createdtasks.length; i++) {
                if (strings.indexOf(session.user.user.createdtasks[i].name) == -1 && alreadyLinkedTasks.indexOf(session.user.user.createdtasks[i].name) == -1) {
                    strings.push(session.user.user.createdtasks[i].name);
                }
            }
            for (var i = 0; i < session.user.user.visibletasks.length; i++) {
                if (strings.indexOf(session.user.user.visibletasks[i].name) == -1 && alreadyLinkedTasks.indexOf(session.user.user.visibletasks[i].name) == -1) {
                    strings.push(session.user.user.visibletasks[i].name);
                }
            }
            for (var i = 0; i < strings.length; i++) {
                html += "<a href='#' id='dropdownlinkagetaskclass-" + strings[i] + "' class='dropdowntask'>" + strings[i] + "</a>";
            }
            html += "</div>";
            html += "</div>";
            html += "</td>";
            html += "<td id='tdTeachertaskclasslinkage' class='center'><input type='button' id='buttonaddtaskclasslinkage' value='add' class='hover'></td></tr>"
            html += "<tfoot></table>";
            //right section end
            html += "</div></td></tr></table>";
            document.getElementById('divTeacherRight').innerHTML = html;

            //callbacks middle section
            document.getElementById('setClassActive').onclick = function () {
                var classname = document.getElementById('viewEntityName').value;
                var clazze;
                for (var i = 0; i < sessionInformation.user.user.createdclasses.length; i++) {
                    if (classname == sessionInformation.user.user.createdclasses[i].name) {
                        clazze = sessionInformation.user.user.createdclasses[i];
                        break;
                    }
                }
                setClassActive(sessionInformation.username, sessionInformation.password, clazze);
            }

            document.getElementById('setClassInactive').onclick = function () {
                if (document.getElementById('divactivesince').innerHTML == " not active ") {
                    alert("Class is not active!");
                    return;
                }
                var classname = document.getElementById('viewEntityName').value;
                var clazze;
                for (var i = 0; i < sessionInformation.user.user.createdclasses.length; i++) {
                    if (classname == sessionInformation.user.user.createdclasses[i].name) {
                        clazze = sessionInformation.user.user.createdclasses[i];
                        break;
                    }
                }
                setClassInactive(sessionInformation.username, sessionInformation.password, clazze);
            }

            var elements = document.getElementsByClassName('dropdowncstructure');
            for (var i = 0; i < elements.length; i++) {
                elements[i].onclick = function () {
                    var before = document.getElementById('buttondropdown2').innerHTML;
                    var linkagecc = new linkageclasscstructure();
                    linkagecc.classname = document.getElementById('viewEntityName').value;
                    linkagecc.cstructurename = this.innerHTML;
                    //no changes
                    if (before == linkagecc.cstructurename)
                        return;
                    if (before == "&nbsp; &nbsp; &nbsp; - &nbsp; &nbsp; &nbsp;") {
                        //post
                        postEntity(sessionInformation.username, sessionInformation.password, linkagecc);
                    } else {
                        if (linkagecc.cstructurename == "&nbsp; &nbsp; &nbsp; - &nbsp; &nbsp; &nbsp;") {
                            linkagecc.cstructurename = null;
                            deleteEntity(sessionInformation.username, sessionInformation.password, linkagecc);
                        } else {
                            updateEntity(sessionInformation.username, sessionInformation.password, linkagecc);
                        }
                    }
                }
            }

            //callbacks right section
            var elements = document.getElementsByClassName('deletetaskclasslinkage');
            for (var i = 0; i < elements.length;i++){
                elements[i].onclick = function () {
                    var link = new linkageclasstask();
                    link.classname = document.getElementById('viewEntityName').value;
                    link.taskname = this.id.substring(23, this.id.length);
                    deleteEntity(sessionInformation.username, sessionInformation.password, link);
                }
            }
            var elements = document.getElementsByClassName('dropdowntask');
            for (var i = 0; i < elements.length; i++) {
                elements[i].onclick = function () {
                    document.getElementById('buttondropdown').innerHTML = this.innerHTML;
                }
            }
            document.getElementById('buttonaddtaskclasslinkage').onclick = function () {
                var link = new linkageclasstask();
                link.classname = document.getElementById('viewEntityName').value;
                link.taskname = document.getElementById('buttondropdown').innerHTML;
                postEntity(sessionInformation.username, sessionInformation.password, link);
            }
            break;
        case "thTeacherCreatedStudents":
            for (var i = 0; i < session.user.user.createdstudents.length; i++) {
                if (session.user.user.createdstudents[i].name == name) {
                    unit = session.user.user.createdstudents[i];
                    break;
                }
            }
            html += "<h3>Created Student</h3>";
            html += "<p>Username: <input type='text' id='viewEntityName' value='"+unit.name+"'></p>";
            html += "<p>Password: <input type='password' id='viewEntityPassword' value='xxxxxxxx'></p>";
            html += "<input type='button' id='deleteEntity' value='Delete'>";
            document.getElementById('divTeacherRight').innerHTML = html;
            break;
        case "thTeacherCreatedCompetences":
            for (var i = 0; i < session.user.user.createdcompetences.length; i++) {
                if (session.user.user.createdcompetences[i].name == name) {
                    unit = session.user.user.createdcompetences[i];
                    break;
                }
            }
            html += "<h3>Created Competence</h3>";
            html += "<p>Name: <input type='text' id='addEntityName' value='" + unit.name + "'></p>";
            html += "<p>Description:</p> <textarea rows='7' cols='70' id='viewEntityDescription'>" + unit.description + "</textarea >";
            html += "<p>Visibile for all: <input type='checkbox' id='viewEntityVisible' class='hover'></p>";
            html += "<input type='button' id='deleteEntity' value='Delete'>";
            document.getElementById('divTeacherRight').innerHTML = html;
            break;
        case "thTeacherCreatedCstructures":
            for (var i = 0; i < session.user.user.createdcstructures.length; i++) {
                if (session.user.user.createdcstructures[i].name == name) {
                    unit = session.user.user.createdcstructures[i];
                    break;
                }
            }

            html += "<table class='fullTable'><colgroup><col span='1' id='colTeacherCstructureLeft'><col span='1' id='colTeacherCstructureRight'></colgroup>";
            html += "<tr class='fullTr'><td id='tdTeacherCstructureLeft'><div id='divTeacherCstructureLeft'>";
            //middle section start
            html += "<h3>Created Competence-Structure</h3>";
            html += "<p>Name: <input type='text' id='addEntityName' value='" + unit.name + "'></p>";
            html += "<p>Description:</p> <textarea rows='7' cols='70' id='viewEntityDescription'>" + unit.description + "</textarea >";
            html += "<p>Visibile for all: <input type='checkbox' id='viewEntityVisible' class='hover'></p>";
            html += "<input type='button' id='deleteEntity' value='Delete'>";
            //middle section end
            html += "</td><td id='tdTeacherCstructureRight'><div id='divTeacherCstructureRight'>";
            //right section start
            html += "<table id='tableTeacherCstructureLink' class='scroll' width='100%'>";
            html += "  <thead><tr><th colspan='4'> Competence Weights </th></tr>";
            html += "</thead><tbody>";
            var links = unit.weights;
            for (var i = 0; i < links.length; i++) {
                html += "  <tr><td id='tdTeacherCstructureFrom" + i + "'>" + links[i].fromname + "</td><td id='tdTeacherCstructureTo" + i + "'>" + links[i].toname + "</td>";
                html += "<td id='tdTeacherCstructureWeight" + i + "' class='center'>" + links[i].weight + "</td><td id='deletetaskcompetencelinkage-" + i+ "' class='center hover deletetaskcompetencelinkage'>-</td></tr>"
            }
            html += "</tbody>";
            html += "<tfoot><tr><td id='tdTeacherTaskLink+' class='center'>";
            ////left dropdown start
            html += "<div id='dropdowncompetenceweightfrom' class='dropdown'>";
            html += "<button onclick='dropdownFunction4()' class='dropbtn' id='buttondropdowncompetenceweightfrom'>From</button>";
            html += "<div id='myDropdown4' class='dropdown-content'>";
            var strings = new Array();
            for (var i = 0; i < session.user.user.createdcompetences.length; i++) {
                if (strings.indexOf(session.user.user.createdcompetences[i].name) == -1 ) {
                    strings.push(session.user.user.createdcompetences[i].name);
                }
            }
            for (var i = 0; i < session.user.user.visiblecompetences.length; i++) {
                if (strings.indexOf(session.user.user.visiblecompetences[i].name) == -1) {
                    strings.push(session.user.user.visiblecompetences[i].name);
                }
            }
            for (var i = 0; i < strings.length; i++) {
                html += "<a href='#' id='dropdowncompetenceweightfrom-" + strings[i] + "' class='dropdowncompetencefrom'>" + strings[i] + "</a>";
            }
            html += "</div>";
            html += "</div>";
            /////feft dropdown end
            html += "</td><td id='tdDropdowncompetenceweightto' class='center'>";
            /*
            html +="weight: &nbsp &nbsp <input type='text' id='linkagetaskcompetenceweight' class='center' size='6'>";
            */
            html += "</td><td id='tdTeachercstructureweight' class='center'>";
            /*
            
            */
            html += "</td><td class='center'>";
            html += "<input type='button' id='buttonaddCompetenceWeight' value='add' class='hover center'>"
            html += "</td></tr><tfoot>";
            //*/
            html+="</table>";
            //right section end
            html += "</div></td></tr></table>";
            document.getElementById('divTeacherRight').innerHTML = html;

            var elements = document.getElementsByClassName('deletetaskcompetencelinkage');
            for (var i = 0; i < elements.length; i++) {
                elements[i].onclick = function () {
                    var index = this.id.substring(28, this.id.length);
                    var edge = new competenceweight();
                    edge.fromname = document.getElementById('tdTeacherCstructureFrom' + index).innerHTML;
                    edge.toname = document.getElementById('tdTeacherCstructureTo' + index).innerHTML;
                    edge.weight = document.getElementById('tdTeacherCstructureWeight' + index).innerHTML;
                    edge.cstructurename = document.getElementById('addEntityName').value;
                    deleteEntity(sessionInformation.username, sessionInformation.password, edge);
                }
            }

            document.getElementById('buttonaddCompetenceWeight').onclick = function () {
                var element = document.getElementById('inputTeachercstructureweight');
                var competencefrom = document.getElementById('buttondropdowncompetenceweightfrom').innerHTML;
                var weight;
                if (element == null || competencefrom == "From" || document.getElementById('buttondropdowncompetenceweightto') == null) {
                    alert("Pleas enter data first!");
                    return;
                }
                var competenceto = document.getElementById('buttondropdowncompetenceweightto').innerHTML;
                weight = document.getElementById('inputTeachercstructureweight').value;
                if (weight == "" || competenceto == "To") {
                    alert("Pleas enter data first!");
                    return;
                }
                var cweight = new competenceweight();
                cweight.fromname = competencefrom;
                cweight.toname = competenceto;
                cweight.weight = weight;
                cweight.cstructurename = document.getElementById('addEntityName').value;
                postEntity(sessionInformation.username, sessionInformation.password, cweight);
            }

            var elements = document.getElementsByClassName('dropdowncompetencefrom');
            for (var i = 0; i < elements.length; i++) {
                elements[i].onclick = function () {
                    var competencename = this.innerHTML;
                    document.getElementById('buttondropdowncompetenceweightfrom').innerHTML = competencename;
                    //get possible to-competences
                    //first-find cstructure
                    var structure;
                    var structname = document.getElementById('addEntityName').value;
                    for (var i = 0; i < sessionInformation.user.user.createdcstructures.length; i++) {
                        if (structname == sessionInformation.user.user.createdcstructures[i].name) {
                            structure = sessionInformation.user.user.createdcstructures[i];
                            break;
                        }
                    }
                    //find already existent weights
                    var notAllowedCompetences = new Array();
                    for (var i = 0; i < structure.weights.length; i++) {
                        if (structure.weights[i].fromname == competencename) {
                            notAllowedCompetences.push(structure.weights[i].toname);
                        }
                    }
                    var allowedCompetences = new Array();
                    for (var i = 0; i < session.user.user.createdcompetences.length; i++) {
                        if (allowedCompetences.indexOf(session.user.user.createdcompetences[i].name) == -1
                            && notAllowedCompetences.indexOf(session.user.user.createdcompetences[i].name) == -1
                            && session.user.user.createdcompetences[i].name != competencename) {
                            allowedCompetences.push(session.user.user.createdcompetences[i].name);
                        }
                    }
                    for (var i = 0; i < session.user.user.visiblecompetences.length; i++) {
                        if (allowedCompetences.indexOf(session.user.user.visiblecompetences[i].name) == -1
                            && notAllowedCompetences.indexOf(session.user.user.createdcompetences[i].name) == -1
                            && session.user.user.createdcompetences[i].name != competencename) {
                            allowedCompetences.push(session.user.user.visiblecompetences[i].name);
                        }
                    }
                    var html = "";
                    html += "<div id='dropdowncompetenceweightto' class='dropdown'>";
                    html += "<button onclick='dropdownFunction5()' class='dropbtn' id='buttondropdowncompetenceweightto'>To</button>";
                    html += "<div id='myDropdown5' class='dropdown-content'>";
                    for (var i = 0; i < allowedCompetences.length; i++) {
                        html += "<a href='#' id='dropdowncompetenceweightto-" + allowedCompetences[i] + "' class='dropdowncompetenceto'>" + allowedCompetences[i] + "</a>";
                    }
                    html += "</div></div>";
                    document.getElementById('tdDropdowncompetenceweightto').innerHTML = html;

                    var elements = document.getElementsByClassName('dropdowncompetenceto');
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].onclick = function () {
                            var competencename = this.innerHTML;
                            document.getElementById('buttondropdowncompetenceweightto').innerHTML = competencename;
                            if (document.getElementById('tdTeachercstructureweight').innerHTML != "") {
                                return;
                            }
                            var html = "<input type='text' size='5' id='inputTeachercstructureweight' class='center' value=''>";
                            document.getElementById('tdTeachercstructureweight').innerHTML = html;
                        }
                    }

                }
            }

            break;
        case "thTeacherCreatedTasks":
            for (var i = 0; i < session.user.user.createdtasks.length; i++) {
                if (session.user.user.createdtasks[i].name == name) {
                    unit = session.user.user.createdtasks[i];
                    break;
                }
            }

            html += "<table class='fullTable'><colgroup><col span='1' id='colTeacherTaskLeft'><col span='1' id='colTeacherTaskRight'></colgroup>";
            html += "<tr class='fullTr'><td id='tdTeacherTaskLeft'><div id='divTeacherTaskLeft'>";
            //middle section start
            html += "<h3>Created Task</h3>";
            html += "<p>Name: <input type='text' id='addEntityName' value='" + unit.name + "'></p>";
            html += "<p>Description:</p> <textarea rows='7' cols='70' id='viewEntityDescription'>" + unit.description + "</textarea >";
            html += "<p>Question:</p> <textarea rows='7' cols='70' id='viewEntityQuestion'>" + unit.text + "</textarea >";
            html += "<p>Answer: <input type='text' id='viewEntityAnswer' value='" + unit.answer + "'></p>";
            html += "<p>Authenticity: <input type='text' id='viewEntityAuthenticity' value='" + unit.authenticity + "' size='4'></p>";
            html += "<p>Visibile for all: <input type='checkbox' id='viewEntityVisible' class='hover'></p>";
            html += "<input type='button' id='deleteEntity' value='Delete'>";
            //middle section end
            html += "</td><td id='tdTeacherTaskRight'><div id='divTeacherTaskRight'>";
            //right section start
            ///*
            html += "<table id='tableTeacherTaskLink' class='scroll' width='100%'>";
            html += "  <thead><tr><th colspan='3'> Competence links </th></tr>";
            html += "</thead><tbody>";
            var alreadyLinkedCompetences = new Array();
            var links = unit.competencelinks;
            for (var i = 0; i < links.length; i++) {
                alreadyLinkedCompetences.push(links[i].competencename);
                html += "  <tr><td id='tdTeacherTaskLink" + i + "'>" + links[i].competencename + "</td><td id='tdTeacherTaskLink" + i + "'>" + links[i].weight + "</td><td id='deletetaskcompetencelinkage-" + links[i].competencename + "' class='center hover deletetaskcompetencelinkage'>-</td></tr>"
            }
            html += "</tbody><tfoot><tr><td id='tdTeacherTaskLink+' class='center hover'>";
            html += "<div id='dropdowntaskcompetencelinkage' class='dropdown'>";
            html += "<button onclick='dropdownFunction()' class='dropbtn' id='buttondropdown'>Add competence</button>";
            html += "<div id='myDropdown' class='dropdown-content'>";
            var strings = new Array();
            for (var i = 0; i < session.user.user.createdcompetences.length; i++) {
                if (strings.indexOf(session.user.user.createdcompetences[i].name) == -1 && alreadyLinkedCompetences.indexOf(session.user.user.createdcompetences[i].name) == -1) {
                    strings.push(session.user.user.createdcompetences[i].name);
                }
            }
            for (var i = 0; i < session.user.user.visiblecompetences.length; i++) {
                if (strings.indexOf(session.user.user.visiblecompetences[i].name) == -1 && alreadyLinkedCompetences.indexOf(session.user.user.visiblecompetences[i].name) == -1) {
                    strings.push(session.user.user.visiblecompetences[i].name);
                }
            }
            for (var i = 0; i < strings.length; i++) {
                html += "<a href='#' id='dropdownlinkagetaskcomnpetence-"+strings[i]+"' class='dropdowncompetence'>"+strings[i]+"</a>";
            }
            html += "</div>";
            html += "</div>";
            html += "</td><td>weight: &nbsp &nbsp <input type='text' id='linkagetaskcompetenceweight' class='center' size='6'></td>";
            html += "<td id='tdTeachertaskcompetencelinkage' class='center'><input type='button' id='buttonaddtaskcompetencelinkage' value='add' class='hover'></td></tr>"
            html += "<tfoot></table>";
            //*/
            //right section end
            html += "</div></td></tr></table>";
            document.getElementById('divTeacherRight').innerHTML = html;

            var elements = document.getElementsByClassName('dropdowncompetence');
            for (var i = 0; i < elements.length; i++) {
                elements[i].onclick = function () {
                    document.getElementById('buttondropdown').innerHTML = this.innerHTML;
                }
            }
            document.getElementById('buttonaddtaskcompetencelinkage').onclick = function () {
                var link = new linkagetaskcompetence();
                link.weight = parseFloat(document.getElementById('linkagetaskcompetenceweight').value);
                link.competencename = document.getElementById('buttondropdown').innerHTML;
                link.taskname = document.getElementById('addEntityName').value;
                if (isNaN(link.weight)) {
                    alert('Please enter valid value for the weight!');
                    return;
                }
                if (link.competencename == "Add competence") {
                    alert('Please chose a competence!');
                    return;
                }
                postEntity(sessionInformation.username, sessionInformation.password, link);
            }
            elements = document.getElementsByClassName('deletetaskcompetencelinkage');
            for (var i = 0; i < elements.length; i++) {
                elements[i].onclick = function () {
                    var competencename = this.id.substring(28, this.id.length);
                    var name = document.getElementById('addEntityName').value;
                    var entity;
                    for(var i=0;i<sessionInformation.user.user.createdtasks.length;i++){
                        if(sessionInformation.user.user.createdtasks[i].name == name){
                            entity = sessionInformation.user.user.createdtasks[i];
                            break;
                        }
                    }
                    var entityToDelete;
                    for (var i = 0; i < entity.competencelinks.length; i++) {
                        if (entity.competencelinks[i].competencename == competencename) {
                            entityToDelete = entity.competencelinks[i];
                            break;
                        }
                    }
                    entityToDelete.taskname = name;
                    deleteEntity(sessionInformation.username, sessionInformation.password, entityToDelete);
                }
            }

            break;
        case "thTeacherVisibleCompetences":
            for (var i = 0; i < session.user.user.visiblecompetences.length; i++) {
                if (session.user.user.visiblecompetences[i].name == name) {
                    unit = session.user.user.visiblecompetences[i];
                    break;
                }
            }
            html += "<h3>Visible Competence</h3>";
            html += "<p>Name: <input type='text' id='addEntityName' value='" + unit.name + "'></p>";
            html += "<p>Description:</p> <textarea rows='7' cols='70' id='viewEntityDescription'>" + unit.description + "</textarea >";
            html += "<p>Visibile for all: <input type='checkbox' id='viewEntityVisible' class='hover'></p>";
            document.getElementById('divTeacherRight').innerHTML = html;
            break;
        case "thTeacherVisibleCstructures":
            for (var i = 0; i < session.user.user.visiblecstructures.length; i++) {
                if (session.user.user.visiblecstructures[i].name == name) {
                    unit = session.user.user.visiblecstructures[i];
                    break;
                }
            }
            html += "<h3>Visible Competence-Structure</h3>";
            html += "<p>Name: <input type='text' id='addEntityName' value='" + unit.name + "'></p>";
            html += "<p>Description:</p> <textarea rows='7' cols='70' id='viewEntityDescription'>" + unit.description + "</textarea >";
            html += "<p>Visibile for all: <input type='checkbox' id='viewEntityVisible' class='hover'></p>";
            document.getElementById('divTeacherRight').innerHTML = html;
            break;
        case "thTeacherVisibleTasks":
            for (var i = 0; i < session.user.user.visibletasks.length; i++) {
                if (session.user.user.visibletasks[i].name == name) {
                    unit = session.user.user.visibletasks[i];
                    break;
                }
            }
            html += "<h3>Visible Task</h3>";
            html += "<p>Name: <input type='text' id='addEntityName' value='" + unit.name + "'></p>";
            html += "<p>Description:</p> <textarea rows='7' cols='70' id='viewEntityDescription'>" + unit.description + "</textarea >";
            html += "<p>Question:</p> <textarea rows='7' cols='70' id='viewEntityQuestion' >" + unit.text + "</textarea >";
            html += "<p>Answer: <input type='text' id='viewEntityAnswer' value='" + unit.answer + "'></p>";
            html += "<p>Authenticity: <input type='text' id='viewEntityAuthenticity' value='" + unit.authenticity + "' size='4'></p>";
            html += "<p>Visibile for all: <input type='checkbox' id='viewEntityVisible' class='hover'></p>";
            document.getElementById('divTeacherRight').innerHTML = html;
            break;
    }

    setTeacherEntityDeleteListener(session);
}

function setTeacherEntityDeleteListener(session) {
    if (document.getElementById('deleteEntity') != null) {
        document.getElementById('deleteEntity').onclick = function () {
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

            //find chosen entity
            var name = null;
            elements = document.getElementsByClassName("tdTeacherScroll");
            for (var i = 0; i < elements.length; i++) {
                var classes = elements[i].className.split(" ");
                if (classes.indexOf("divChosen") > -1) {
                    name = elements[i].innerHTML;
                    break;
                }
            }


            var unit = null;
            switch (chosenId) {
                case "thTeacherCreatedClasses":
                    for (var i = 0; i < sessionInformation.user.user.createdclasses.length; i++) {
                        if (sessionInformation.user.user.createdclasses[i].name == name) {
                            unit = sessionInformation.user.user.createdclasses[i];
                            break;
                        }
                    }
                    break;
                case "thTeacherCreatedStudents":
                    for (var i = 0; i < sessionInformation.user.user.createdstudents.length; i++) {
                        if (sessionInformation.user.user.createdstudents[i].name == name) {
                            unit = sessionInformation.user.user.createdstudents[i];
                            break;
                        }
                    }
                    break;
                case "thTeacherCreatedCompetences":
                    for (var i = 0; i < sessionInformation.user.user.createdcompetences.length; i++) {
                        if (sessionInformation.user.user.createdcompetences[i].name == name) {
                            unit = sessionInformation.user.user.createdcompetences[i];
                            break;
                        }
                    }
                    break;
                case "thTeacherCreatedCstructures":
                    for (var i = 0; i < sessionInformation.user.user.createdcstructures.length; i++) {
                        if (sessionInformation.user.user.createdcstructures[i].name == name) {
                            unit = sessionInformation.user.user.createdcstructures[i];
                            break;
                        }
                    }
                    break;
                case "thTeacherCreatedTasks":
                    for (var i = 0; i < sessionInformation.user.user.createdtasks.length; i++) {
                        if (sessionInformation.user.user.createdtasks[i].name == name) {
                            unit = sessionInformation.user.user.createdtasks[i];
                            break;
                        }
                    }
                    break;
            }
            //alert(unit.visibility);
            deleteEntity(sessionInformation.username, sessionInformation.password, unit);
        }
    }
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