$(function(){
    let search = window.location.search;
    let params = new URLSearchParams(search);

    console.log('msg: ' + params.get('facebook_id'))
    console.log('params: ' + params)

    alert(params.get('facebook_id'))
    alert(params)

    if(params.has('facebook_id'))
    {
        console.log('msg: ' + params.get('facebook_id'))
        $('#facebook_id').val(params.get('facebook_id'))
    }

})