function TheUser(xml) {
    this.xml = xml;
    this.getParser = function (xml) {
        if (window.DOMParser) {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(xml, "text/xml");
        }
        else // Internet Explorer
        {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(xml);
        }
        return xmlDoc;
    };
    this.findUsergroup = function (xml) {
        var parser = this.getParser(xml);
        return (parseInt(parser.getElementsByTagName("usergroup")[0].childNodes[0].nodeValue));
    };
    this.usergroup = this.findUsergroup(xml);
    this.setUser = function (xml) {
        parser = this.getParser(xml);
        switch (this.usergroup) {
            case 0:
                return(new Unknown(parser));
                break;
            case 1:
                return (new Student(parser));
                break;
            case 2:
                return (new Teacher(parser));
                break;
            case 3:
                return (new Administrator(parser));
                break;
        }
    };
    this.user = this.setUser(xml);
    this.toXML = function () {
        var str = "<loginxml>";
        str += "<usergroup>"+this.usergroup+"</usergroup>";
        str += this.user.toXML();
        str += "</loginxml>";
        return str;
    };
    this.addElement = function (unit) {
        if (this.usergroup == 2) {
            //teacher add element
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
                    this.user.createdclasses.push(unit);
                    break;
                case "thTeacherCreatedStudents":
                    this.user.createdstudents.push(unit);
                    break;
                case "thTeacherCreatedCompetences":
                    this.user.createdcompetences.push(unit);
                    break;
                case "thTeacherCreatedCstructures":
                    this.user.createdcstructures.push(unit);
                    break;
                case "thTeacherCreatedTasks":
                    this.user.createdtasks.push(unit);
                    break;
                case "thTeacherVisibleCompetences":
                    break;
                case "thTeacherVisibleCstructures":
                    break;
                case "thTeacherVisibleTasks":
                    break;
            }

            document.getElementById(chosenId).click();
            //alert(chosenId + unit.name);
        } else {
            alert("Usergroup - addElement not implemented");
        }

    };
    this.deleteElement = function (entity) {
        if (this.usergroup == 2) {

            //teacher delete element
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
                case "thTeacherCreatedTasks":
                    for (var i = 0; i < this.user.createdtasks.length; i++) {
                        if (this.user.createdtasks[i].name == entity.name) {
                            this.user.createdtasks.splice(i, 1);
                            break;
                        }
                    }
                    break;
                case "thTeacherCreatedClasses":
                    for (var i = 0; i < this.user.createdclasses.length; i++) {
                        if (this.user.createdclasses[i].name == entity.name) {
                            this.user.createdclasses.splice(i, 1);
                            break;
                        }
                    }
                    break;
                case "thTeacherCreatedCompetences":
                    for (var i = 0; i < this.user.createdcompetences.length; i++) {
                        if (this.user.createdcompetences[i].name == entity.name) {
                            this.user.createdcompetences.splice(i, 1);
                            break;
                        }
                    }
                    break;
                case "thTeacherCreatedCstructures":
                    for (var i = 0; i < this.user.createdcstructures.length; i++) {
                        if (this.user.createdcstructures[i].name == entity.name) {
                            this.user.createdcstructures.splice(i, 1);
                            break;
                        }
                    }
                    break;
                case "thTeacherCreatedStudents":
                    for (var i = 0; i < this.user.createdstudents.length; i++) {
                        if (this.user.createdstudents[i].name == entity.name) {
                            this.user.createdstudents.splice(i, 1);
                            break;
                        }
                    }
                    break;
            }

            document.getElementById(chosenId).click();
        } else {
            alert("Usergroup - deleteElement not implemented");
        }
    };
}

function Unknown(parser) {
    this.toXML = function () {
        return "";
    }
}

function Student(parser) {
    this.registeredclasses = new Array();
    this.availableclasses = new Array();
    this.fillStudent = function () {
        var elements = parser.getElementsByTagName("registeredclasses")[0].getElementsByTagName("class");
        for (var i = 0; i < elements.length; i++) {
            this.registeredclasses.push(new clazz(elements[i]));
        }
        elements = parser.getElementsByTagName("availableclasses")[0].getElementsByTagName("class");
        for (var i = 0; i < elements.length; i++) {
            this.availableclasses.push(new clazz(elements[i]));
        }
    }
    this.fillStudent(parser);
    this.toXML = function () {
        var str = "<registeredclasses>";
        for (var i = 0; i < this.registeredclasses.length; i++) {
            str += this.registeredclasses[i].toXML();
        }
        str += "</registeredclasses>";
        str += "<availableclasses>";
        for (var i = 0; i < this.availableclasses.length; i++) {
            str += this.availableclasses[i].toXML();
        }
        str += "</availableclasses>";
        return str;
    };
}

function Teacher(parser) {
    this.createdclasses = new Array();
    this.createdstudents = new Array();
    this.createdcompetences = new Array();
    this.createdcstructures = new Array();
    this.createdtasks = new Array();
    this.visiblecompetences = new Array();
    this.visiblecstructures = new Array();
    this.visibletasks = new Array();
    this.fillTeacher = function (parser) {
        var elements = parser.getElementsByTagName("createdclasses")[0].getElementsByTagName("class");
        for (var i = 0; i < elements.length; i++) {
            this.createdclasses.push(new clazz(elements[i]));
        }
        elements = parser.getElementsByTagName("createdstudents")[0].getElementsByTagName("user");
        for (var i = 0; i < elements.length; i++) {
            this.createdstudents.push(new user(elements[i]));
        }
        elements = parser.getElementsByTagName("createdcompetences")[0].getElementsByTagName("competence");
        for (var i = 0; i < elements.length; i++) {
            this.createdcompetences.push(new competence(elements[i]));
        }
        elements = parser.getElementsByTagName("createdcstructures")[0].getElementsByTagName("competencestructure");
        for (var i = 0; i < elements.length; i++) {
            this.createdcstructures.push(new cstructure(elements[i]));
        }
        elements = parser.getElementsByTagName("createdtasks")[0].getElementsByTagName("task");
        for (var i = 0; i < elements.length; i++) {
            this.createdtasks.push(new task(elements[i]));
        }
        elements = parser.getElementsByTagName("visiblecompetences")[0].getElementsByTagName("competence");
        for (var i = 0; i < elements.length; i++) {
            this.visiblecompetences.push(new competence(elements[i]));
        }
        elements = parser.getElementsByTagName("visiblecstructures")[0].getElementsByTagName("competencestructure");
        for (var i = 0; i < elements.length; i++) {
            this.visiblecstructures.push(new cstructure(elements[i]));
        }
        elements = parser.getElementsByTagName("visibletasks")[0].getElementsByTagName("task");
        for (var i = 0; i < elements.length; i++) {
            this.visibletasks.push(new task(elements[i]));
        }
    }
    this.fillTeacher(parser);
    this.toXML = function () {
        var str = "<createdclasses>";
        for (var i = 0; i < this.createdclasses.length; i++) {
            str += this.createdclasses[i].toXML();
        }
        str += "</createdclasses>";
        str += "<createdstudents>";
        for (var i = 0; i < this.createdstudents.length; i++) {
            str += this.createdstudents[i].toXML();
        }
        str += "</createdstudents>";
        str += "<createdcompetences>";
        for (i = 0; i < this.createdcompetences.length; i++) {
            str += this.createdcompetences[i].toXML();
        }
        str += "</createdcompetences>";
        str += "<createdcstructures>";
        for (var i = 0; i < this.createdcstructures.length; i++) {
            str += this.createdcstructures[i].toXML();
        }
        str += "</createdcstructures>";
        str += "<createdtasks>";
        for (var i = 0; i < this.createdtasks.length; i++) {
            str += this.createdtasks[i].toXML();
        }
        str += "</createdtasks>";
        str += "<visiblecompetences>";
        for (var i = 0; i < this.visiblecompetences.length; i++) {
            str += this.visiblecompetences[i].toXML();
        }
        str += "</visiblecompetences>";
        str += "<visiblecstructures>";
        for (var i = 0; i < this.visiblecstructures.length; i++) {
            str += this.visiblecstructures[i].toXML();
        }
        str += "</visiblecstructures>";
        str += "<visibletasks>";
        for (var i = 0; i < this.visibletasks.length; i++) {
            str += this.visibletasks[i].toXML();
        }
        str += "</visibletasks>";
        return str;
    }
}

function Administrator(parser) {
    this.administrators = new Array();
    this.teachers = new Array();
    this.students = new Array();
    this.fillAdministrator = function (parser) {
        var elements = parser.getElementsByTagName("administrators")[0].getElementsByTagName("user");
        for (var i = 0; i < elements.length; i++) {
            this.administrators.push(new user(elements[i]));
        }
        elements = parser.getElementsByTagName("teachers")[0].getElementsByTagName("user");
        for (var i = 0; i < elements.length; i++) {
            this.teachers.push(new user(elements[i]));
        }
        elements = parser.getElementsByTagName("students")[0].getElementsByTagName("user");
        for (var i = 0; i < elements.length; i++) {
            this.students.push(new user(elements[i]));
        }
    }
    this.fillAdministrator(parser);
    this.toXML = function () {
        var str = "<administrators>";
        for (var i = 0; i < this.administrators.length; i++) {
            str += this.administrators[i].toXML();
        }
        str += "</administrators>";
        str += "<teachers>";
        for (var i = 0; i < this.teachers.length; i++) {
            str += this.teachers[i].toXML();
        }
        str += "</teachers>";
        str += "<students>";
        for (var i = 0; i < this.students.length; i++) {
            str += this.students[i].toXML();
        }
        str += "</students>";
        return str;
    };
}

function task(parser) {
    this.name;
    this.description;
    this.text;
    this.answer;
    this.fillTask = function (parser) {
        if (parser === undefined)
            return;
        this.name = parser.getElementsByTagName("name")[0].childNodes[0].nodeValue;
        this.description = parser.getElementsByTagName("description")[0].childNodes[0].nodeValue;
        this.text = parser.getElementsByTagName("text")[0].childNodes[0].nodeValue;
        this.answer = parser.getElementsByTagName("answer")[0].childNodes[0].nodeValue;
    }
    this.fillTask(parser);
    this.toXML = function () {
        var str = "<task>";
        str += "<name>" + this.name + "</name>";
        str += "<description>" + this.description + "</description>";
        str += "<text>" + this.text + "</text>";
        str += "<answer>" + this.answer + "</answer>";
        str += "</task>";
        return str;
    };
    this.toDBEntityXML = function () {
        var xml = "<entity>";
        xml += "<type>task</type>";
        xml += "<name>" + this.name + "</name>";
        xml += "<description>" + this.description + "</description>";
        xml += "<visibility>" + this.visibility + "</visibility>";
        xml += "<text>" + this.text + "</text>";
        xml += "<answer>" + this.answer + "</answer>";
        xml += "</entity>";
        return xml;
    };
}

function cstructure(parser) {
    this.name;
    this.description;
    this.fillCstructure = function (parser) {
        if (parser === undefined)
            return;
        this.name = parser.getElementsByTagName("name")[0].childNodes[0].nodeValue;
        this.description = parser.getElementsByTagName("description")[0].childNodes[0].nodeValue;
    }
    this.fillCstructure(parser);
    this.toXML = function () {
        var str = "<competencestructure>";
        str += "<name>" + this.name + "</name>";
        str += "<description>" + this.description + "</description>";
        str += "</competencestructure>";
        return str;
    };
    this.toDBEntityXML = function () {
        var xml = "<entity>";
        xml += "<type>competencestructure</type>";
        xml += "<name>" + this.name + "</name>";
        xml += "<description>" + this.description + "</description>";
        xml += "<visibility>" + this.visibility + "</visibility>";
        xml += "</entity>";
        return xml;
    };
}

function competence(parser) {
    this.name;
    this.description;
    this.fillCompetence = function (parser) {
        if (parser === undefined)
            return;
        this.name = parser.getElementsByTagName("name")[0].childNodes[0].nodeValue;
        this.description = parser.getElementsByTagName("description")[0].childNodes[0].nodeValue;
    }
    this.fillCompetence(parser);
    this.toXML = function () {
        var str = "<competence>";
        str += "<name>" + this.name + "</name>";
        str += "<description>" + this.description + "</description>";
        str += "</competence>";
        return str;
    };
    this.toDBEntityXML = function () {
        var xml = "<entity>";
        xml += "<type>competence</type>";
        xml += "<name>" + this.name + "</name>";
        xml += "<description>" + this.description + "</description>";
        xml += "<visibility>" + this.visibility + "</visibility>";
        xml += "</entity>";
        return xml;
    };
}

function clazz(parser) {
    this.visibility;
    this.name;
    this.description;
    this.id;
    this.fillClass = function (parser) {
        if (parser === undefined)
            return;
        this.visibility = parser.getElementsByTagName("visibility")[0].childNodes[0].nodeValue;
        this.name = parser.getElementsByTagName("name")[0].childNodes[0].nodeValue;
        this.description = parser.getElementsByTagName("description")[0].childNodes[0].nodeValue;
        this.id = parser.getElementsByTagName("id")[0].childNodes[0].nodeValue;
    }
    this.fillClass(parser);
    this.toXML = function () {
        var str = "<class>";
        str += "<name>" + this.name + "</name>";
        str += "<description>"+this.description+"</description>";
        str += "</class>";
        return str;
    };
    this.toDBEntityXML = function () {
        var xml = "<entity>";
        xml += "<type>class</type>";
        xml += "<name>" + this.name + "</name>";
        xml += "<description>" + this.description + "</description>";
        xml += "<visibility>" + this.visibility + "</visibility>";
        xml += "</entity>";
        return xml;
    };
}

function user(parser) {
    this.registeredclasses = new Array();
    this.createdclasses = new Array();
    this.usergroup;
    this.password;
    this.name;
    this.fillUser = function (parser) {
        if (parser === undefined)
            return;
        this.usergroup = parseInt(parser.getElementsByTagName("usergroup")[0].childNodes[0].nodeValue);
        this.name = parser.getElementsByTagName("name")[0].childNodes[0].nodeValue;
        if (parser.getElementsByTagName("registeredclasses").length > 0) {
            var classes = parser.getElementsByTagName("registeredclasses")[0].getElementsByTagName("class");
            for (var i = 0; i < classes.length; i++) {
                this.registeredclasses.push(new clazz(classes[i]));
            }
        }
        if (parser.getElementsByTagName("createdclasses").length > 0) {
            var classes = parser.getElementsByTagName("createdclasses")[0].getElementsByTagName("class");
            for (var i = 0; i < classes.length; i++) {
                this.createdclasses.push(new clazz(classes[i]));
            }
        }
    }
    this.fillUser(parser);
    this.toXML = function () {
        var str = "<user>";
        str += "<usergroup>" + this.usergroup + "</usergroup>";
        str += "<name>" + this.name + "</name>";
        if (this.registeredclasses.length > 0) {
            str += "<registeredclasses>";
            for (var i = 0; i < this.registeredclasses.length; i++) {
                str += this.registeredclasses[i].toXML();
            }
            str += "</registeredclasses>";
        }
        if (this.createdclasses.length > 0) {
            str += "<createdclasses>";
            for (var i = 0; i < this.createdclasses.length; i++) {
                str += this.createdclasses[i].toXML();
            }
            str += "</createdclasses>";
        }
        str += "</user>";
        return str;
    };
    this.toDBEntityXML = function () {
        var xml = "<entity>";
        xml += "<type>user</type>";
        xml += "<name>" + this.name + "</name>";
        xml += "<usergroup>" + this.usergroup + "</usergroup>";
        xml += "<password>"+this.password+"</password>";
        xml += "</entity>";
        return xml;
    };
}
