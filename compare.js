async function loadLaughterJson(row, e){
    // console.log(e);
    var file = e.target.files[0];

    if (typeof e.target.files[0] === 'undefined') {
        alert('不明：' + file.name);
        return;
    }

    await fetch(URL.createObjectURL(e.target.files[0]))
        .then(response => response.json())
        .catch(response => alert("Error occured while fetching json"))
        .then(data => {
            let l_json = data

            row = row.toString();

            const container_div = document.getElementById('laughter_json' + row);
            const inputFields = container_div.querySelectorAll('input');
            const EndBar = container_div.getElementsByClassName('endbar')[0];
            container_div.innerHTML = '';
            for (let i = 0; i < inputFields.length; i++) {
                container_div.appendChild(inputFields[i]);
            }
            if (EndBar != undefined){
                container_div.appendChild(EndBar);
            }            

            Object.keys(l_json).forEach((key) => {
                var div = document.createElement('div');
                div.style.position = 'absolute';
                if ("not_a_laugh" in l_json[key] && l_json[key]['not_a_laugh'] == true){
                    div.style.backgroundColor = 'blue';
                }else{
                    div.style.backgroundColor = 'red';
                }                
                div.style.top = '0px';
                div.style.height = "100%";
                div.style.left = l_json[key]['start_sec'] * 10. + 'px';
                div.style.width = (l_json[key]['end_sec'] - l_json[key]['start_sec']) * 10. + 'px';
                container_div.appendChild(div);

                // add start and end time to the div
                var start = document.createElement('div');
                start.style.fontFamily = 'sans-serif';
                start.style.position = 'absolute';
                start.style.backgroundColor = 'green';
                start.style.top = '0px';
                start.style.height = "30px";
                start.style.left = l_json[key]['start_sec'] * 10. + 'px';
                start.style.color = 'white';
                start.style.fontSize = '30px';
                start.innerHTML = l_json[key]['start_sec'].toFixed(3);
                container_div.appendChild(start);

                var end = document.createElement('div');
                end.style.fontFamily = 'sans-serif';
                end.style.position = 'absolute';
                end.style.backgroundColor = 'green';
                end.style.bottom = '30px';
                end.style.height = "30px";
                end.style.left = (l_json[key]['end_sec']) * 10. + 'px';
                end.style.color = 'white';
                end.style.fontSize = '30px';
                end.innerHTML = l_json[key]['end_sec'].toFixed(3);
                container_div.appendChild(end);

            });
        })
        // .catch(data => alert("Error occured while loading json")); 

    
}

function loadLaughterAudio(e){
    // console.log(e);
    var file = e.target.files[0];

    if (typeof e.target.files[0] === 'undefined') {
        alert('不明：' + file.name);
        return;
    }

    document.getElementById('ori_audio').src = URL.createObjectURL(e.target.files[0]);

    setTimeout(function(){
        var div = document.createElement('div');
        div.className = 'endbar';
        div.style.left = (document.getElementById('ori_audio').duration * 10.) + 100 + 'px';
        document.getElementById('laughter_json1').appendChild(div);

        var div = document.createElement('div');
        div.className = 'endbar';
        div.style.left = (document.getElementById('ori_audio').duration * 10.) + 100 + 'px';
        document.getElementById('laughter_json2').appendChild(div);

        var div = document.createElement('div');
        div.className = 'endbar';        
        div.style.left = (document.getElementById('ori_audio').duration * 10.) + 100 + 'px';
        document.getElementById('laughter_json3').appendChild(div);
    }, 300);
}


function updateSeekbar(){
    parent_div = document.getElementById('laughter_json1');
    if (document.getElementById('seekbar1') == null) {
        parent_div.innerHTML += '<div id="seekbar1" class="seekbar">';
    }
    var seekbar1 = document.getElementById('seekbar1');
    seekbar1.style.left = document.getElementById('ori_audio').currentTime * 10. + 'px';
    // -------- repetitive code
    parent_div = document.getElementById('laughter_json2');
    if (document.getElementById('seekbar2') == null) {
        parent_div.innerHTML += '<div id="seekbar2" class="seekbar">';
    }
    var seekbar2 = document.getElementById('seekbar2');
    seekbar2.style.left = document.getElementById('ori_audio').currentTime * 10. + 'px';
    // -------- repetitive code
    parent_div = document.getElementById('laughter_json3');
    if (document.getElementById('seekbar3') == null){
        parent_div.innerHTML += '<div id="seekbar3" class="seekbar">';
    }
    var seekbar3 = document.getElementById('seekbar3');
    seekbar3.style.left = document.getElementById('ori_audio').currentTime * 10. + 'px';
}
document.getElementById('ori_audio').addEventListener('timeupdate', updateSeekbar);

function syncLeft(row, e){
    setTimeout(function(){
        obeyIds = [1, 2, 3];
        // remove number equal to row and leave others
        obeyIds = obeyIds.filter(function (value, index, array) {
            return value != row;
        });

        obeyIds.forEach(function (value, index, array) {
            document.getElementById('laughter_json' + value).scrollLeft = document.getElementById('laughter_json' + row).scrollLeft;
        });
    }, 10);
}

