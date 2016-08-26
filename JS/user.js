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
    this.addElement = function (entity, xml) {
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

            var type = this.getParser(xml).getElementsByTagName("type")[0].childNodes[0].nodeValue;

            switch (type) {
                case "class":
                    this.user.createdclasses.push(entity);
                    document.getElementById(chosenId).click();
                    break;
                case "user":
                    this.user.createdstudents.push(entity);
                    document.getElementById(chosenId).click();
                    break;
                case "competence":
                    this.user.createdcompetences.push(entity);
                    document.getElementById(chosenId).click();
                    break;
                case "competencestructure":
                    this.user.createdcstructures.push(entity);
                    document.getElementById(chosenId).click();
                    break;
                case "task":
                    this.user.createdtasks.push(entity);
                    document.getElementById(chosenId).click();
                    break;
                case "linkagetaskcompetence":
                    var task;
                    for (var i = 0; i < this.user.createdtasks.length; i++) {
                        if (entity.taskname == this.user.createdtasks[i].name) {
                            task = this.user.createdtasks[i];
                            break;
                        }
                    }
                    task.competencelinks.push(entity);

                    //find taskid selected
                    var elements = document.getElementsByClassName("tdTeacherCreatedTasks");
                    var chosenId2 = -1;
                    //find selected item
                    for (var i = 0; i < elements.length; i++) {
                        var classes = elements[i].className.split(" ");
                        if (classes.indexOf("divChosen") > -1) {
                            chosenId2 = elements[i].id;
                            break;
                        }
                    }

                    document.getElementById(chosenId).click();
                    document.getElementById(chosenId2).click();
                    break;
                case "linkageclasscstructure":
                    var clazzToChange;
                    for (var i = 0; i < this.user.createdclasses.length; i++) {
                        if (this.user.createdclasses[i].name == entity.classname) {
                            clazzToChange = this.user.createdclasses[i];
                            break;
                        }
                    }
                    clazzToChange.cstructure = entity.cstructurename;
                    document.getElementById('buttondropdown2').innerHTML = clazzToChange.cstructure;
                    break;
                case "linkageclasstask":
                    var clazzToChange;
                    for (var i = 0; i < this.user.createdclasses.length; i++) {
                        if (this.user.createdclasses[i].name == entity.classname) {
                            clazzToChange = this.user.createdclasses[i];
                            break;
                        }
                    }
                    clazzToChange.tasks.push(entity.taskname);

                    //find classid selected
                    var elements = document.getElementsByClassName("tdTeacherCreatedClasses");
                    var chosenId2 = -1;
                    //find selected item
                    for (var i = 0; i < elements.length; i++) {
                        var classes = elements[i].className.split(" ");
                        if (classes.indexOf("divChosen") > -1) {
                            chosenId2 = elements[i].id;
                            break;
                        }
                    }

                    document.getElementById(chosenId).click();
                    document.getElementById(chosenId2).click();
                    break;
                case "competenceweight":
                    var cstruct;
                    for (var i = 0; i < this.user.createdcstructures.length; i++) {
                        if (this.user.createdcstructures[i].name == entity.cstructurename) {
                            cstruct = this.user.createdcstructures[i];
                            break;
                        }
                    }
                    cstruct.weights.push(entity);

                    //find cstructureid selected
                    var elements = document.getElementsByClassName("tdTeacherCreatedCstructures");
                    var chosenId2 = -1;
                    //find selected item
                    for (var i = 0; i < elements.length; i++) {
                        var classes = elements[i].className.split(" ");
                        if (classes.indexOf("divChosen") > -1) {
                            chosenId2 = elements[i].id;
                            break;
                        }
                    }

                    document.getElementById(chosenId).click();
                    document.getElementById(chosenId2).click();
                    break;
                default:
                    alert("Add for this element not implemented!");
                    break;
            }
        } else if (this.usergroup == 1) {
            //student add element
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


            var type = this.getParser(xml).getElementsByTagName("type")[0].childNodes[0].nodeValue;

            switch (type) {
                case "studentregistration":
                    var clazz;
                    for (var i = 0; i < this.user.availableclasses.length; i++) {
                        if (entity.classname == this.user.availableclasses[i].name) {
                            clazz = this.user.availableclasses[i];
                            this.user.availableclasses.splice(i, 1);
                            break;
                        }
                    }
                    this.user.registeredclasses.push(clazz);
                    document.getElementById(chosenId).click();
                    break;
                default:
                    alert("Add for this element not implemented!");
                    break;
            }
        }else {
            alert("Usergroup - addElement not implemented");
        }

    };
    this.deleteElement = function (entity,xml) {
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

            var type = this.getParser(xml).getElementsByTagName("type")[0].childNodes[0].nodeValue;

            switch (type) {
                case "task":
                    for (var i = 0; i < this.user.createdtasks.length; i++) {
                        if (this.user.createdtasks[i].name == entity.name) {
                            this.user.createdtasks.splice(i, 1);
                            break;
                        }
                    }
                    document.getElementById(chosenId).click();
                    break;
                case "class":
                    for (var i = 0; i < this.user.createdclasses.length; i++) {
                        if (this.user.createdclasses[i].name == entity.name) {
                            this.user.createdclasses.splice(i, 1);
                            break;
                        }
                    }
                    document.getElementById(chosenId).click();
                    break;
                case "competence":
                    for (var i = 0; i < this.user.createdcompetences.length; i++) {
                        if (this.user.createdcompetences[i].name == entity.name) {
                            this.user.createdcompetences.splice(i, 1);
                            break;
                        }
                    }
                    document.getElementById(chosenId).click();
                    break;
                case "competencestructure":
                    for (var i = 0; i < this.user.createdcstructures.length; i++) {
                        if (this.user.createdcstructures[i].name == entity.name) {
                            this.user.createdcstructures.splice(i, 1);
                            break;
                        }
                    }
                    document.getElementById(chosenId).click();
                    break;
                case "user":
                    for (var i = 0; i < this.user.createdstudents.length; i++) {
                        if (this.user.createdstudents[i].name == entity.name) {
                            this.user.createdstudents.splice(i, 1);
                            break;
                        }
                    }
                    document.getElementById(chosenId).click();
                    break;
                case "linkagetaskcompetence":
                    var taskentity;
                    for (var i = 0; i < this.user.createdtasks.length; i++) {
                        if (this.user.createdtasks[i].name == entity.taskname) {
                            taskentity = this.user.createdtasks[i];
                            break;
                        }
                    }
                    for (var i = 0; i < taskentity.competencelinks.length; i++) {
                        if (taskentity.competencelinks[i].competencename == entity.competencename) {
                            taskentity.competencelinks.splice(i,1);
                            break;
                        }
                    }

                    //find taskid selected
                    var elements = document.getElementsByClassName("tdTeacherCreatedTasks");
                    var chosenId2 = -1;
                    //find selected item
                    for (var i = 0; i < elements.length; i++) {
                        var classes = elements[i].className.split(" ");
                        if (classes.indexOf("divChosen") > -1) {
                            chosenId2 = elements[i].id;
                            break;
                        }
                    }
                    document.getElementById(chosenId).click();
                    document.getElementById(chosenId2).click();
                    break;
                case "linkageclasscstructure":
                    var clazzToChange;
                    for (var i = 0; i < this.user.createdclasses.length; i++) {
                        if (this.user.createdclasses[i].name == entity.classname) {
                            clazzToChange = this.user.createdclasses[i];
                            break;
                        }
                    }
                    clazzToChange.cstructure = null;
                    document.getElementById('buttondropdown2').innerHTML = "&nbsp; &nbsp; &nbsp; - &nbsp; &nbsp; &nbsp;";
                    break;
                case "linkageclasstask":
                    var clazzToChange;
                    for (var i = 0; i < this.user.createdclasses.length; i++) {
                        if (this.user.createdclasses[i].name == entity.classname) {
                            clazzToChange = this.user.createdclasses[i];
                            break;
                        }
                    }
                    clazzToChange.tasks.splice(clazzToChange.tasks.indexOf(entity.taskname),1);

                    //find classid selected
                    var elements = document.getElementsByClassName("tdTeacherCreatedClasses");
                    var chosenId2 = -1;
                    //find selected item
                    for (var i = 0; i < elements.length; i++) {
                        var classes = elements[i].className.split(" ");
                        if (classes.indexOf("divChosen") > -1) {
                            chosenId2 = elements[i].id;
                            break;
                        }
                    }

                    document.getElementById(chosenId).click();
                    document.getElementById(chosenId2).click();
                    break;
                case "competenceweight":
                    var cstruct;
                    for (var i = 0; i < this.user.createdcstructures.length; i++) {
                        if (this.user.createdcstructures[i].name == entity.cstructurename) {
                            cstruct = this.user.createdcstructures[i];
                            break;
                        }
                    }
                    for (var i = 0; i < cstruct.weights.length; i++) {
                        if (cstruct.weights[i].fromname == entity.fromname && cstruct.weights[i].toname == entity.toname) {
                            cstruct.weights.splice(i,1);
                        }
                    }

                    //find cstructureid selected
                    var elements = document.getElementsByClassName("tdTeacherCreatedCstructures");
                    var chosenId2 = -1;
                    //find selected item
                    for (var i = 0; i < elements.length; i++) {
                        var classes = elements[i].className.split(" ");
                        if (classes.indexOf("divChosen") > -1) {
                            chosenId2 = elements[i].id;
                            break;
                        }
                    }

                    document.getElementById(chosenId).click();
                    document.getElementById(chosenId2).click();
                    break;
                default:
                    alert("Delete for this element not implemented!");
                    break;
            }

        } else if (this.usergroup == 1) {
            //student delete element
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

            var type = this.getParser(xml).getElementsByTagName("type")[0].childNodes[0].nodeValue;

            switch (type) {
                case "studentregistration":
                    var clazz;
                    for (var i = 0; i < this.user.registeredclasses.length; i++) {
                        if (entity.classname == this.user.registeredclasses[i].name) {
                            clazz = this.user.registeredclasses[i];
                            this.user.registeredclasses.splice(i, 1);
                            break;
                        }
                    }
                    this.user.availableclasses.push(clazz);
                    document.getElementById(chosenId).click();
                    break;
                default:
                    alert("Delete for this element not implemented!");
                    break;
            }
        } else {
            alert("Usergroup - deleteElement not implemented");
        }
    };
    this.updateElement = function (entity, xml) {
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

            var type = this.getParser(xml).getElementsByTagName("type")[0].childNodes[0].nodeValue;

            switch (type) {
                case "linkageclasscstructure":
                    var clazzToChange;
                    for (var i = 0; i < this.user.createdclasses.length; i++) {
                        if (this.user.createdclasses[i].name == entity.classname) {
                            clazzToChange = this.user.createdclasses[i];
                            break;
                        }
                    }
                    clazzToChange.cstructure = entity.cstructurename;
                    document.getElementById('buttondropdown2').innerHTML = clazzToChange.cstructure;
                    break;
                default:
                    alert("Update for this element not implemented!");
                    break;
            }

            //alert(chosenId + unit.name);

            //set new view
            //if (document.getElementById('tdTeacherEntities+') != null)
            //    document.getElementById('tdTeacherEntities+').click();
        } else {
            alert("Usergroup - addElement not implemented");
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
    this.competencelinks = new Array();
    this.fillTask = function (parser) {
        if (parser === undefined)
            return;
        this.name = parser.getElementsByTagName("name")[0].childNodes[0].nodeValue;
        this.description = parser.getElementsByTagName("description")[0].childNodes[0].nodeValue;
        this.text = parser.getElementsByTagName("text")[0].childNodes[0].nodeValue;
        this.answer = parser.getElementsByTagName("answer")[0].childNodes[0].nodeValue;
        if (parser.getElementsByTagName("competencelink").length > 0) {
            var links = parser.getElementsByTagName("competencelink");
            for (var i = 0; i < links.length; i++) {
                this.competencelinks.push(new linkagetaskcompetence(links[i]));
            }
        }
    }
    this.fillTask(parser);
    this.toXML = function () {
        var str = "<task>";
        str += "<name>" + this.name + "</name>";
        str += "<description>" + this.description + "</description>";
        str += "<text>" + this.text + "</text>";
        str += "<answer>" + this.answer + "</answer>";
        if (this.competencelinks.length > 0) {
            str += "<competencelinks>";
            for (var i = 0; i < this.competencelinks.length; i++) {
                str += this.competencelinks[i].toXML();
            }
            str += "</competencelinks>";
        }
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

function linkagetaskcompetence(parser) {
    this.taskname
    this.competencename;
    this.weight;
    this.fill = function (parser) {
        if (parser === undefined)
            return;
        this.competencename = parser.getElementsByTagName("competence")[0].childNodes[0].nodeValue;
        this.weight = parseFloat(parser.getElementsByTagName("weight")[0].childNodes[0].nodeValue);
    };
    this.fill(parser);
    this.toXML = function () {
        var str = "<competencelink>";
        str += "<taskname>" + this.taskname + "</taskname>";
        str += "<competencename>" + this.competencename + "</competencename>";
        str += "<weight>" + this.weight + "</weight>";
        str += "</competencelink>";
        return(str);
    };
    this.toDBEntityXML = function () {
        var xml = "<entity>";
        xml += "<type>linkagetaskcompetence</type>";
        xml += "<taskname>" + this.taskname + "</taskname>";
        xml += "<competencename>" + this.competencename + "</competencename>";
        xml += "<weight>" + this.weight + "</weight>";
        xml += "</entity>";
        return xml;
    };
}

function cstructure(parser) {
    this.name;
    this.description;
    this.weights = new Array();
    this.fillCstructure = function (parser) {
        if (parser === undefined)
            return;
        this.name = parser.getElementsByTagName("name")[0].childNodes[0].nodeValue;
        this.description = parser.getElementsByTagName("description")[0].childNodes[0].nodeValue;
        if (parser.getElementsByTagName("competenceweight").length > 0) {
            var elements = parser.getElementsByTagName("competenceweight");
            for (var i = 0; i < elements.length;i++){
                this.weights.push(new competenceweight(elements[i]));
            }
        }
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

function competenceweight(parser) {
    this.cstructurename;
    this.fromname;
    this.toname;
    this.weight;
    this.fillCompetenceweight = function (parser) {
        if (parser === undefined)
            return;
        this.fromname = parser.getElementsByTagName("from")[0].childNodes[0].nodeValue;
        this.toname = parser.getElementsByTagName("to")[0].childNodes[0].nodeValue;
        this.weight = parser.getElementsByTagName("weight")[0].childNodes[0].nodeValue;
    };
    this.fillCompetenceweight(parser);
    this.toXML = function () {
        var xml = "<competenceweight>";
        xml += "<fromname>" + this.fromname + "</fromname>";
        xml += "<toname>" + this.toname + "</toname>";
        xml += "<weight>" + this.weight + "</weight>";
        xml += "<cstructurename>" + this.cstructurename + "</cstructurename>";
        xml += "</competenceweight>";
        return xml;
    };
    this.toDBEntityXML = function () {
        var xml = "<entity>";
        xml += "<type>competenceweight</type>";
        xml += "<fromname>" + this.fromname + "</fromname>";
        xml += "<toname>" + this.toname + "</toname>";
        xml += "<weight>" + this.weight + "</weight>";
        xml += "<cstructurename>" + this.cstructurename + "</cstructurename>";
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
    this.cstructure;
    this.tasks = new Array();
    this.fillClass = function (parser) {
        if (parser === undefined)
            return;
        this.visibility = parser.getElementsByTagName("visibility")[0].childNodes[0].nodeValue;
        this.name = parser.getElementsByTagName("name")[0].childNodes[0].nodeValue;
        this.description = parser.getElementsByTagName("description")[0].childNodes[0].nodeValue;
        this.id = parser.getElementsByTagName("id")[0].childNodes[0].nodeValue;
        if (parser.getElementsByTagName("competencestructure").length >0)
            this.cstructure = parser.getElementsByTagName("competencestructure")[0].childNodes[0].nodeValue;
        if (parser.getElementsByTagName("task").length > 0) {
            for (var i = 0; i < parser.getElementsByTagName("task").length;i++){
                this.tasks.push(parser.getElementsByTagName("task")[i].childNodes[0].nodeValue);
            }
        }
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

function linkageclasscstructure() {
    this.classname;
    this.cstructurename;
    this.toDBEntityXML = function () {
        var xml = "<entity>";
        xml += "<type>linkageclasscstructure</type>";
        xml += "<classname>" + this.classname + "</classname>";
        if (this.cstructurename != null)
            xml += "<cstructurename>" + this.cstructurename + "</cstructurename>";
        xml += "</entity>";
        return xml;
    };
    this.toXML = function () {
        var xml = "<linkageclasscstructure>";
        xml += "<classname>" + this.classname + "</classname>";
        if (this.cstructurename != null)
            xml += "<cstructurename>" + this.cstructurename + "</cstructurename>";
        xml += "</linkageclasscstructure>";
        return xml;
    }
}

function linkageclasstask() {
    this.classname;
    this.taskname;
    this.toDBEntityXML = function () {
        var xml = "<entity>";
        xml += "<type>linkageclasstask</type>";
        xml += "<classname>" + this.classname + "</classname>";
        if (this.taskname != null)
            xml += "<taskname>" + this.taskname + "</taskname>";
        xml += "</entity>";
        return xml;
    };
    this.toXML = function () {
        var xml = "<linkageclasstask>";
        xml += "<classname>" + this.classname + "</classname>";
        if (this.taskname != null)
            xml += "<taskname>" + this.taskname + "</taskname>";
        xml += "</linkageclasstask>";
        return xml;
    }
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

function studentregistration() {
    this.classname;
    this.studentname;
    this.toDBEntityXML = function () {
        var xml = "<entity>";
        xml += "<type>studentregistration</type>";
        xml += "<classname>" + this.classname + "</classname>";
        xml += "<studentname>" + this.studentname + "</studentname>";
        xml += "</entity>";
        return xml;
    };
}

function taskanswer() {
    this.id;
    this.answer;
    this.toXML = function(){
        var xml = "<taskanswer>";
        xml += "<answer>" + this.answer + "</answer>";
        xml += "<id>" + this.id + "</id>";
        xml += "</taskanswer>";
        return xml;
    };

}