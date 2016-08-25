  function doGet (url,returnMethod)
  {
    // send xml string
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function()
    {
      //alert ("onreadystatechange: state: " + xmlhttp.readyState + ", status: " + xmlhttp.status);
      if (xmlhttp.readyState==4)
      {
        var restultvalue = xmlhttp.responseText;
        returnMethod(restultvalue);
      }
    }

    xmlhttp.open("GET",url,true);
    xmlhttp.setRequestHeader("content-type","text/plain");
    xmlhttp.send();
  } 
  
  function doPost(url,postdata,returnMethod)
  {
    // send xml string
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function()
    {
      //alert ("onreadystatechange: state: " + xmlhttp.readyState + ", status: " + xmlhttp.status);
      if (xmlhttp.readyState==4)
      {
        var restultvalue = xmlhttp.responseText;
        returnMethod(restultvalue);
      }
    }

    xmlhttp.open("POST",url,true);
    xmlhttp.setRequestHeader("content-type","text/plain"); //application/x-www-form-urlencoded
    xmlhttp.send(postdata);
  }

  function doLogin(username, password) {
      var url = "http://192.168.178.51:8080/test2/rest/login" + "?name=" + username + "&password=" + password;
      //readTextFile("student", sessionInformation.setUser);
      // send xml string
      ///*
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
          //alert ("onreadystatechange: state: " + xmlhttp.readyState + ", status: " + xmlhttp.status);
          if (xmlhttp.readyState == 4) {
              var restultvalue = xmlhttp.responseText;
              sessionInformation.setUser(restultvalue);
          }
      }
      xmlhttp.open("GET", url, true);
      xmlhttp.setRequestHeader("content-type", "text/plain");
      xmlhttp.send();
      //*/
  }

  function postEntity(username, password, entity) {
      var url = "http://192.168.178.51:8080/test2/rest/postEntity" + "?name=" + username + "&password=" + password;

      // send xml string
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
          //alert ("onreadystatechange: state: " + xmlhttp.readyState + ", status: " + xmlhttp.status);
          if (xmlhttp.readyState == 4) {
              var resultvalue = xmlhttp.responseText;
              if (resultvalue.indexOf("success") > 0) {
                  //store data in local storage
                  sessionInformation.user.addElement(sessionInformation.submittedEntity, resultvalue);
              } else if (resultvalue.indexOf("failure") > 0) {
                  alert("There was an Error!");
                  //add error codes
              } else  {
                  alert("Server not reached!");
              }
          }
      }

      xmlhttp.open("POST", url, true);
      xmlhttp.setRequestHeader("content-type", "text/plain"); //application/x-www-form-urlencoded
      sessionInformation.submittedEntity = entity;
      xmlhttp.send(entity.toDBEntityXML());
  }

  function deleteEntity(username, password, entity) {
      //var xml = "<delete><type>" + xmltype + "</type>" + entity.toXML() + "</delete>";
      var url = "http://192.168.178.51:8080/test2/rest/deleteEntity" + "?name=" + username + "&password=" + password;

      //alert(xml);

      // send xml string
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
          //alert ("onreadystatechange: state: " + xmlhttp.readyState + ", status: " + xmlhttp.status);
          if (xmlhttp.readyState == 4) {
              var resultvalue = xmlhttp.responseText;
              if (resultvalue.indexOf("success") > 0) {
                  //store data in local storage
                  sessionInformation.user.deleteElement(sessionInformation.submittedEntity, resultvalue);
                  //set new view
                  //if (document.getElementById('tdTeacherEntities+') != null)
                  //    document.getElementById('tdTeacherEntities+').click();
              } else if (resultvalue.indexOf("failure") > 0) {
                  alert("There was an Error!");
                  //add error codes
              } else {
                  alert("Server not reached!");
              }
          }
      }

      xmlhttp.open("POST", url, true);
      xmlhttp.setRequestHeader("content-type", "text/plain"); //application/x-www-form-urlencoded
      sessionInformation.submittedEntity = entity;
      xmlhttp.send(entity.toDBEntityXML());
  }

  function updateEntity(username, password, entity) {
      var url = "http://192.168.178.51:8080/test2/rest/updateEntity" + "?name=" + username + "&password=" + password;

      //alert(xml);

      // send xml string
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
          //alert ("onreadystatechange: state: " + xmlhttp.readyState + ", status: " + xmlhttp.status);
          if (xmlhttp.readyState == 4) {
              var resultvalue = xmlhttp.responseText;
              if (resultvalue.indexOf("success") > 0) {
                  //store data in local storage
                  sessionInformation.user.updateElement(sessionInformation.submittedEntity, resultvalue);
              } else if (resultvalue.indexOf("failure") > 0) {
                  alert("There was an Error!");
                  //add error codes
              } else {
                  alert("Server not reached!");
              }
          }
      }

      xmlhttp.open("POST", url, true);
      xmlhttp.setRequestHeader("content-type", "text/plain"); //application/x-www-form-urlencoded
      sessionInformation.submittedEntity = entity;
      xmlhttp.send(entity.toDBEntityXML());
  }