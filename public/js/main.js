$(document).ready(function() {
    $('.deleteUser').on('click',deleteUser);
});

function deleteUser() {
    var confirmation = confirm('Are You Sure?');

    if(confirmation){
        $.ajax({
            type: 'DELETE',
            url: '/users/delete/'+$('.deleteUser').data('id')
        }).done(function(response){
            window.location.replace('/');
        });
        window.location.replace('/');
    }else {
        return false;
    }
   
}
