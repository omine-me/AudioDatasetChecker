document.getElementById("json_files").addEventListener("change", ev => {
    jsonfiles = ev.target.files
    show_dir(jsonfiles, "json_dir")
});
document.getElementById("audio_files").addEventListener("change", ev => {
    audiofiles = ev.target.files
    show_dir(audiofiles, "audio_dir")
});

function loadaudio(audiofile){
    ori_audioElm.src =  URL.createObjectURL(audiofile);
    document.getElementById("audio_file_name").innerText = audiofile["name"]
}

function show_dir(files, type){
    // console.log(files)
    let figure = document.createElement("figure");
    figure.innerHTML = ``;
    for (let i = 0; i < files.length; i++) {
        figure.innerHTML += `
            <button onclick="select('${i}', '${type}')">${files[i].webkitRelativePath}</button><br/>
            `;
    }
    document.getElementById(type).innerHTML='';
    document.getElementById(type).insertBefore(figure, null);
}

function select(idx, type){
    const basename = jsonfiles[idx]["name"].split("-")[1].split(".")[0]
    for (let i = 0; i < audiofiles.length; i++) {
        if (audiofiles[i]["name"].match(basename)){
            loadaudio(audiofiles[i])
            break;
        }
    }
    loadJson(idx)
    current_file_idx = Number(idx)
}

// 読み込み時にすること
window.addEventListener("load", ()=>{
    if (window.location.pathname.match(/audio-json-checker/)){
        let audios = document.querySelectorAll(".audio");
        ori_audioElm = audios[0]
        mono_audioElm = audios[1]
        console.log(audios)

        // attr_html = ""
        // attributes.forEach((attr)=>{
        //     if (attr.type == "bool"){
        //         attr_html += `<li><input id="${attr.name}" type="checkbox" class="checkbox" onclick='update_state("${attr.name}")'><label for="${attr.name}" class="attribute"><span>${attr.dis_name}</span></label><br></li>`
        //     }else if (attr.type == "text" || attr.type == "float"){
        //         attr_html += `<li><span>${attr.dis_name}</span><input id="${attr.name}" type="text" style="display: block;width: 100%;" onfocusout='update_state("${attr.name}")'></li>`
        //     }
        // })
        // document.getElementById("attributes").innerHTML = attr_html

        // attributes.forEach((attr)=>{
        //     if (attr.type == "bool"){
        //         document.getElementById(attr.name).checked = false
        //     }else{            
        //         document.getElementById(attr.name).value = ""
        //     }
        // })
        document.getElementById("play_ori").checked = true
        
        audios.forEach(function(target) {
            // console.log(laughters[0].start_sec)
            target.addEventListener('timeupdate', function() {
                curr_time = target.currentTime
                if (laughters[current_laughter].start_sec < curr_time && curr_time < laughters[current_laughter].end_sec){
                    document.getElementsByTagName('body')[0].style.backgroundColor = "#f00" 
                }else{
                    document.getElementsByTagName('body')[0].style.backgroundColor = "#fff" 
                }
            });
        });
        document.getElementById("json_files").focus()
    }else if(window.location.pathname.match(/word_timestamp/)){
        let audios = document.querySelectorAll(".audio");
        ori_audioElm = audios[0]
        
        _tmp_count = 0
        ori_audioElm.addEventListener('loadedmetadata', function (e) {
            var time = ori_audioElm.currentTime;
            requestAnimationFrame(function me () {
                if (time !== ori_audioElm.currentTime) {
                    time = ori_audioElm.currentTime;
                    ori_audioElm.dispatchEvent(new CustomEvent("timeupdate"));
                }
                requestAnimationFrame(me);
            });
        });
        ori_audioElm.addEventListener('timeupdate', function() {
            curr_time = ori_audioElm.currentTime
            // laughters["segments"][0]["words"][0]["end"]
            // _tmp_count++;
            // checking_word_elm.innerText = String(_tmp_count);

            // laughters["segments"].forEach((seg)=>{
            //     seg["words"].forEach((word)=>{
            //         if (word["start"] < curr_time && curr_time < word["end"]){
            //             checking_word_elm.innerText = (word["text"] ? word["text"]: word["word"]);
            //             // break;
            //         }
            //     })
            // })

            for (let i = 0; i < laughters["segments"].length; i++) {
                words = laughters["segments"][i]["words"]
                if (words[words.length-1]["end"] < curr_time){
                    continue;
                }
                for (let j = 0; j < words.length; j++) {
                    word = words[j]
                    if (word["start"] < curr_time && curr_time < word["end"]){
                        checking_word_elm.innerText = (word["text"] ? word["text"]: word["word"]);

                        pre_phrase = ""
                        for (let pre = 0; pre < j; pre++) {
                            pre_phrase += (words[pre]["text"] ? words[pre]["text"]: words[pre]["word"])
                        }
                        pre_checking_word_elm.innerText= pre_phrase
                        post_phrase = ""
                        for (let post = j+1; post < words.length; post++) {
                            post_phrase += (words[post]["text"] ? words[post]["text"]: words[post]["word"])
                        }
                        post_checking_word_elm.innerText = post_phrase
                        break;
                    }
                }   
            }
        });
        document.getElementById("json_files").focus()
    }    
});