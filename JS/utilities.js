//Method for recoloring menu, when choosen
//buttonClassActive and buttonClass -classes should have other css background colors
//@param element............activated element (this when in onclick handeler)
//@param buttonClass.........class all buttons have to have
//@param buttonClassActive...class for the active button
function setActiveButton(element, buttonClass, buttonClassActive) {
    var elements = document.getElementsByClassName(buttonClass);
    for (var i = 0; i < elements.length; i++) {
        var classes = elements[i].className.split(" ");
        var index = classes.indexOf(buttonClassActive);
        if (index >= 0) {
            classes.splice(index, 1);
        }
        elements[i].className = classes.join(" ");
    }
    element.className += " "+buttonClassActive;
}

//Method for getting active button element or null in case none is active
//@param buttonClass.........class all buttons have to have
//@param buttonClassActive...class for the active button
function getActiveButton(buttonClass, buttonClassActive) {
    var elements = document.getElementsByClassName(buttonClass);
    for (var i = 0; i < elements.length; i++) {
        var classes = elements[i].className.split(" ");
        var index = classes.indexOf(buttonClassActive);
        if (index >= 0) {
            return elements[i];
        }
    }
    return null;
}