$(document).ready(function () {
    //$('#dateTimeSelector').datetimepicker({
    // //   timepicker: true
    // ////   , format: 'd.m.Y H:i'
    // ////   , lang: 'en'
	   // ////, defaultDate: '03.01.70' // it's my birthday
    // ////   , defaultTime: '10:00'

    // //   //, inline: true
    // //   , format: 'dd/mm/yyyy'
    // //   , formatDate: 'dd/mm/yyyy'
    // //   , minDate: new Date()//'01/01/2017' // yesterday is minimum date
    // //   //, maxDate: '01/12/2017'

    //});
        //$('#dateTimeSelector').datetimepicker('hide');
    $('#dateTimeSelector').datetimepicker({
        sideBySide: true
    });

    $('#dateTimeSelector').enabled = false;
    //$('#dateTimeSelector')
    $('#newDateTime').click(function (e) {
        var divId = Date.now().toString();
        var newInput = $("<input type=\"text\" id=\"" + divId + "\" name=\"" + divId + "\" />").appendTo('#clone-group');
        newInput.attr('placeholder', 'click to add timeline');
        newInput.datetimepicker();
        //$('<div>', {
        //    id: divId,
        //}).appendTo('#form-group');

        //$('<div>', {
        //    id: divId+"__",
        //    class: 'input-group date col-md-2'
        //}).appendTo('#' + divId);

        //$('<input>', {
        //    id: divId+'_input'
        //    , class: 'input-group date col-md-2'
        //    , type: 'text'
        //}).appendTo("#"+divId);

        //$('<span>', {
        //    id: divId + '_span'
        //    , class:"input-group-addon"
        //}).appendTo("#"+divId);
        //$('<span>', {
        //    id: divId + '_span_'
        //    , class: "glyphicon glyphicon-calendar"
        //}).appendTo("#"+divId+'_span');
        //alert('asd');
        //var newDateTime = $("#dateTimeSelector").html();

        ////appendTo('#clone-group');
        ////newDateTime.id = Date.now()
        //var cloneHtml = $('#clone-group').html();
        ////cloneHtml += newDateTime;
        //var cloneDiv = $("#dateTimeSelector").clone(true, true);
        //cloneDiv.attr('id', Date.now());
        //$("#clone-group").append(cloneDiv);

       // $('#clone-group').prepend($('<div>', { id: Date.now(), src: newDateTime, class: 'testingDivPrepend' }))
        //$('#clone-group').html($(cloneHtml));
    });//$('#newDateTime').click(function (e) {


});