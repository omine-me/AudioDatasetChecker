let jsonfiles = []
let audiofiles = []
let current_file_idx = 0
let ori_audioElm = ""
let mono_audioElm = ""
let laughters = []
let current_laughter = 0
let play_from_n_sec_before = 2
let play_source = "ori"
// const attributes = ["not_a_laugh",
//                     // "second_laugh", //同じことで笑うのが二回目以上// 二度目以降の笑い
//                     // "talk_during_laugh",喋りが挟まる
//                     // "talker_not_divided",左右混ざってる
//                     "laugh_length_error",笑い長さ変
//                     // "tone",トーン変化での笑い
//                     // "infectious_laughter",つられ笑い
//                     "laugh_by_oneself",自発語の影響で笑う
//                     "laugh_by_oneself_prob",自発語確定度
//                     "other_error"その他のエラー
//                     ]
const attributes = [
    {"name": "not_a_laugh", "type": "bool", "dis_name": "笑いでない"},
    {"name": "ambiguous_start", "type": "bool", "dis_name": "開始点が不明瞭"},
    // {"name": "laugh_length_error" , "type": "bool", "dis_name": "笑い長さ変"},
    // {"name": "laugh_by_oneself" , "type": "bool", "dis_name": "自発語の影響で笑う"},
    // {"name": "laugh_by_oneself_prob" , "type": "float", "dis_name": "自発語確定度"},
    // {"name": "other_error", "type": "text", "dis_name": "その他のエラー"}
]
                    
const laugh_by_oneself_prob_thre = 0.45

function formatJSON(){
    const json_div = document.getElementById("json_raw");
    json_div.innerText = JSON.stringify(laughters[current_laughter], null, "　");
    json_div.classList.add("flash");
    setTimeout(function() {
        json_div.classList.remove('flash');
    }, 50);
}

function saveJson(){
    // not_fulfilled_indexes = []
    // for(let i=0;i < Object.keys(laughters).length; i++){
    //     attributes.forEach((attr)=>{
    //         if (!laughters[i].hasOwnProperty(attr.name)){
    //             not_fulfilled_indexes.push(i)
    //         }
    //     })
    // }
    // console.log(not_fulfilled_indexes)
    // if (not_fulfilled_indexes.length){
    //     alert([...new Set(not_fulfilled_indexes)])
    // }else{
        // JSON ファイルを表す Blob オブジェクトを生成
        const json = JSON.stringify(laughters);
        const blob = new Blob([json], { type: 'application/json' });

        // a 要素の href 属性に Object URL を セット
        document.getElementById("save").href = window.URL.createObjectURL(blob);
        // window.open(window.URL.createObjectURL(blob), '_blank')
        document.getElementById("save").download = jsonfiles[current_file_idx].name
        // document.getElementById("save").click()
    // }
}

async function loadJson(idx){
    await fetch(URL.createObjectURL(jsonfiles[idx]))
        .then( response => response.json())
        .catch(response=>alert("Error occured while fetching json"))
        .then( data => {
            laughters = data
            formatJSON();
            current_laughter = 0
            // console.log(laughters)
            document.getElementById("start_sec").value = laughters[current_laughter].start_sec
            document.getElementById("end_sec").value = laughters[current_laughter].end_sec
            // loadaudio(basename)
            document.getElementById("json_file_name").innerText = jsonfiles[idx]["name"]
            next_laughter('')
        })
        .catch(data=>alert("Error occured while loading json or audio"));    
}


function update_state(elm_name, offset=undefined, value=undefined){
    let elm = document.getElementById(elm_name)
    if (custom_validation(elm_name, elm, offset, value) == false){
        return true
    }
    if(elm.type == "number"){
        if (offset){
            elm.value = parseFloat((Number(elm.value) + offset).toFixed(4))
        }else if(value){
            elm.value = parseFloat((value).toFixed(4))
        }
        laughters[current_laughter][elm_name] = Number(elm.value)
    }else if(elm.type == "checkbox"){
        laughters[current_laughter][elm_name] = elm.checked;
    }else{
        alert("Not implemented yet.")
    }
    
    formatJSON()
}

function custom_validation(elm_name, elm, offset=undefined, value=undefined){
    if (elm_name == "start_sec" || elm_name == "end_sec"){
        if (elm_name == "start_sec"){
            if (offset == undefined){
                if (value >= laughters[current_laughter]["end_sec"]){
                    alert("start_sec must be smaller than end_sec")
                    return false
                }
            }else if (value == undefined){
                if (laughters[current_laughter]["start_sec"] + offset >= laughters[current_laughter]["end_sec"]){
                    alert("start_sec must be smaller than end_sec")
                    return false
                }
            }
        }else{
            if (offset == undefined){
                if (laughters[current_laughter]["start_sec"] >= value){
                    alert("start_sec must be smaller than end_sec")
                    return false
                }
            }else if (value == undefined){
                if (laughters[current_laughter]["end_sec"] + offset <= laughters[current_laughter]["start_sec"]){
                    alert("start_sec must be smaller than end_sec")
                    return false
                }
            }
        }
    }

    return true
}

function update_play_before(){
    document.getElementById("play_from_n_sec_before_curr_val").innerText = document.getElementById("play_from_n_sec_before").value
    play_from_n_sec_before = document.getElementById("play_from_n_sec_before").value
    if (document.getElementById("play_from_n_sec_before").value == 0){
        document.getElementById("pause_at_laughter_start").checked = false
    }
}
function update_min_prob(){
    document.getElementById("min_prob_counter").innerText = document.getElementById("min_prob").value
}

function next_file(next_or_prev){
if(!window.confirm('go to '+next_or_prev+' json? (saved check)')){
        return
    }
    if (next_or_prev == "next"){
        if (current_file_idx+1 >= jsonfiles.length){
            current_file_idx = 0
        }else{
            current_file_idx = current_file_idx+1;
        }
    } else if (next_or_prev == "prev"){
        if (current_file_idx-1 < 0){
            current_file_idx = jsonfiles.length-1
        }else{
            current_file_idx = current_file_idx-1;
        }
    }
    

    // reset settings
    // document.getElementById("except_not_a_laugh").checked = false
    document.getElementById("except_by_laugh_by_oneself_prob").checked = false

    select(String(current_file_idx), 'json')
}

function next_laughter(next_or_prev){
    // console.log(current_laughter)
    if (next_or_prev == "next"){
        if (current_laughter+1 >= Object.keys(laughters).length){
            current_laughter = 0
        }else{
            current_laughter = current_laughter+1;
            if ((document.getElementById("except_by_laugh_by_oneself_prob").checked &&
                laughters[current_laughter]["laugh_by_oneself_prob"] > laugh_by_oneself_prob_thre) ||
                (document.getElementById("except_not_a_laugh").checked &&
                laughters[current_laughter]["not_a_laugh"]) || 
                (document.getElementById("min_prob").value > laughters[current_laughter]["prob"])){
                    next_laughter(next_or_prev)
                    return
            }
        }
    } else if (next_or_prev == "prev"){
        if (current_laughter-1 < 0){
            current_laughter = Object.keys(laughters).length-1
        }else{
            current_laughter = current_laughter-1;
            if ((document.getElementById("except_by_laugh_by_oneself_prob").checked &&
                laughters[current_laughter]["laugh_by_oneself_prob"] > laugh_by_oneself_prob_thre) ||
                (document.getElementById("except_not_a_laugh").checked &&
                laughters[current_laughter]["not_a_laugh"]) || 
                (document.getElementById("min_prob").value > laughters[current_laughter]["prob"])){
                    next_laughter(next_or_prev)
                    return
            }
        }
    }
    document.getElementById("start_sec").value = laughters[current_laughter].start_sec
    document.getElementById("end_sec").value = laughters[current_laughter].end_sec
    // console.log(laughters[0])
    attributes.forEach((attr)=>{
        if (laughters[current_laughter].hasOwnProperty(attr.name)){
            if (attr.name == "other_error" || attr.name == "laugh_by_oneself_prob"){
                document.getElementById(attr.name).value = laughters[current_laughter][attr.name]
            }else{
                document.getElementById(attr.name).checked = laughters[current_laughter][attr.name]
            }
        }else {
            if (attr.name == "other_error" || attr.name == "laugh_by_oneself_prob"){
                document.getElementById(attr.name).value = ""
                // laughters[current_laughter][attr.name] = ""
            }else{
                document.getElementById(attr.name).checked = false
                // laughters[current_laughter][attr.name] = false
            }
        }
    })

    document.getElementById("laugh_done_ratio").innerText = (current_laughter + 1) + "/" + Object.keys(laughters).length
    formatJSON()

    if (next_or_prev != ""){
        // reset advaneced settings
        document.getElementById("pause_at_laughter_start").checked = false
        document.getElementById("pause_at_laughter_end").checked = false
        document.getElementById("play_from_n_sec_before").value = play_from_n_sec_before
        update_play_before()
    }
    
    ori_audioElm.currentTime= laughters[current_laughter].start_sec - play_from_n_sec_before
    mono_audioElm.currentTime= laughters[current_laughter].start_sec - play_from_n_sec_before
    if (play_source == "ori"){
        ori_audioElm.play()
        mono_audioElm.pause()
    }else if(play_source == "mono"){
        mono_audioElm.play()
        ori_audioElm.pause()
    }

    if (laughters[current_laughter]["prob"] >= document.getElementById("min_prob").value && (next_or_prev != "" || current_laughter == 0)){
        getWaveform()
    }    
}

function changeSource(source){
    play_source = source
    next_laughter('')
}
function toggleSource(){
    if (play_source == "mono"){
        play_source = "ori"
        document.getElementById("play_ori").click()
    }else{
        play_source = "mono"
        document.getElementById("play_mono").click() 
    }
    next_laughter('')
}
function toggle_play(){
    if (mono_audioElm.paused && ori_audioElm.paused){
        if (play_source == "ori"){
            ori_audioElm.play()
        }else if(play_source == "mono"){
            mono_audioElm.play()
        }
    }else{
        mono_audioElm.pause()
        ori_audioElm.pause()
    }
}
function playback_speed(gain){
    if (gain == 0.0){
        ori_audioElm.playbackRate = 1.0
        mono_audioElm.playbackRate = 1.0
    }else{
        ori_audioElm.playbackRate += gain
        mono_audioElm.playbackRate += gain
    }
    document.getElementById("play_speed").innerText = ori_audioElm.playbackRate
}

function toggle_share_current_state(){
    share_current_state_to_other_tabs = !share_current_state_to_other_tabs;
}

document.addEventListener('keydown', event => {
    // if (event.ctrlKey && event.code === 'KeyD') {
    if (event.code.slice(0,-1) === 'Digit') {
        idx = Number(event.code.slice(-1,))-1
        document.getElementById(attributes[idx].name).checked = !document.getElementById(attributes[idx].name).checked;
        update_state(attributes[idx].name)
        update_play_before()
        event.preventDefault();
    }else if(event.code.slice(0,-1) === 'Numpad'){
        idx = Number(event.code.slice(-1,))
        document.getElementById("play_from_n_sec_before").value = idx
        play_from_n_sec_before = idx
        update_play_before()
        event.preventDefault();
    }else if (!event.ctrlKey && event.code === 'KeyQ') {
        next_file('prev')
        event.preventDefault();
    }else if (!event.ctrlKey && event.code === 'KeyW') {
        next_laughter('prev')
        event.preventDefault();
    }else if (!event.ctrlKey && event.code === 'KeyR') {
        next_laughter('')
        event.preventDefault();
    }else if (event.code === 'KeyE' || event.code === 'Space') {
        toggle_play()
        event.preventDefault();
    }else if (!event.ctrlKey && event.code === 'KeyT') {
        next_laughter('next')
        event.preventDefault();
    }else if (!event.ctrlKey && event.code === 'KeyY') {
        next_file('next')
        event.preventDefault();
    }else if (!event.ctrlKey && event.code === 'KeyA') {
        playback_speed(-0.2)
        event.preventDefault();
    }else if (!event.ctrlKey && event.code === 'KeyD') {
        playback_speed(0.2)
        event.preventDefault();
    }else if (!event.ctrlKey && event.code === 'KeyS') {
        playback_speed(0.0)
        event.preventDefault();
    // }else if (!event.ctrlKey && event.code === 'KeyC') {
    //     toggleSource("mono")
    //     event.preventDefault();
    }else if (event.ctrlKey && event.code === 'KeyS') {
        saveJson()
        document.getElementById("save").click()
        alert("saved!")
        event.preventDefault();
    }else if (!event.ctrlKey && event.code === 'KeyV') {
        document.getElementById("pause_at_laughter_start").checked = !document.getElementById("pause_at_laughter_start").checked
    }else if(!event.ctrlKey && event.code === 'KeyB') {
        document.getElementById("pause_at_laughter_end").checked = !document.getElementById("pause_at_laughter_end").checked
    }else if (!event.ctrlKey && event.code === 'KeyZ') {
        update_state('start_sec',  offset=-0.1)
        drawWaveform(ori_audioElm.currentTime, undefined);
    }else if(!event.ctrlKey && event.code === 'KeyX') {
        update_state('start_sec',  offset=0.1)
        drawWaveform(ori_audioElm.currentTime, undefined);
    }
});
