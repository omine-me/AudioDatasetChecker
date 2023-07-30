let share_current_state_to_other_tabs = true;

document.getElementById("json_files").addEventListener("change", ev => {
    jsonfiles = ev.target.files
    show_dir(jsonfiles, "json")
});
document.getElementById("audio_files").addEventListener("change", ev => {
    audiofiles = ev.target.files
    show_dir(audiofiles, "audio")
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
    if(!window.confirm('Open other ' +type+ '? (saved check)')){
        return
    }
    if (type=="json"){
        let basename = jsonfiles[idx]["name"].split(".")[0]
        let audio_found = false;
        for (let i = 0; i < audiofiles.length; i++) {
            if (audiofiles[i]["name"].match(basename.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'))){
                loadaudio(audiofiles[i])
                audio_found = true;
                break;
            }
        }
        if (!audio_found){
            alert("no audio found like", basename);
        }
        loadJson(idx)
        current_file_idx = Number(idx)
    }else if(type=="audio"){
        loadaudio(audiofiles[idx])
    }else if(type=="yamnet"){
        loadyamnet(idx)
    }
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
        //         attr_html += `<li><input id="${attr.name}" type="checkbox" class="checkbox" onclick='update_state(offset="${attr.name}")'><label for="${attr.name}" class="attribute"><span>${attr.dis_name}</span></label><br></li>`
        //     }else if (attr.type == "text" || attr.type == "float"){
        //         attr_html += `<li><span>${attr.dis_name}</span><input id="${attr.name}" type="text" style="display: block;width: 100%;" onfocusout='update_state(offset="${attr.name}")'></li>`
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
        const channel = new BroadcastChannel('app-data');
        ori_audioElm.addEventListener('loadedmetadata', function (e) {
            var time = ori_audioElm.currentTime;
            requestAnimationFrame(function me () {
                if (time !== ori_audioElm.currentTime) {
                    time = ori_audioElm.currentTime;
                    ori_audioElm.dispatchEvent(new CustomEvent("timeupdate"));
                }
                requestAnimationFrame(me);
            });
        })
        audios.forEach(function(target) {
            // console.log(laughters[0].start_sec)
            target.addEventListener('timeupdate', function() {
                curr_time = target.currentTime
                if (share_current_state_to_other_tabs){
                    channel.postMessage({"play": true, "time": curr_time});
                }
                show_current_bar_in_waveform()
                if (laughters[current_laughter].start_sec < curr_time && curr_time < laughters[current_laughter].end_sec){
                    if (document.getElementById("pause_at_laughter_start").checked){
                        ori_audioElm.pause()
                    }
                    document.getElementsByTagName('body')[0].style.backgroundColor = "#f00" 
                }else{
                    if (document.getElementById("pause_at_laughter_end").checked && laughters[current_laughter].end_sec < curr_time){
                        ori_audioElm.pause()
                    }
                    document.getElementsByTagName('body')[0].style.backgroundColor = "#333" 
                }                
            });
            target.addEventListener('pause', function() {
                setTimeout(()=>{
                    channel.postMessage({"play": false, "time": target.currentTime});
                }, 250)
            });
        });
        document.getElementById("json_files").focus()
    }else if(window.location.pathname.match(/word_timestamp/)){
        let audios = document.querySelectorAll(".audio");
        ori_audioElm = audios[0]
        
        _tmp_count = 0
        const channel = new BroadcastChannel('app-data');
        channel.addEventListener ('message', (event) => {
            // console.log(event.data)
            if (event.data["play"]){
                ori_audioElm.play()
            }else{
                ori_audioElm.pause()
            }
            ori_audioElm.currentTime= event.data["time"]
        });
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
            if (lang=="ja"){
                for (let i = 0; i < laughters["segments"].length; i++) {
                    words = laughters["segments"][i]["words"]
                    if (!words.length || words[words.length-1]["end"] < curr_time){
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
                            return;
                        }
                    }   
                }
            } else if(lang=="en"){
                words = laughters["results"][Object.keys(laughters["results"]).length-1]["alternatives"][0]["words"]
                for (let j = 0; j < words.length; j++) {
                    word = words[j]
                    if (Number(word["startTime"].slice(0,-1)) < curr_time && curr_time < Number(word["endTime"].slice(0,-1))){
                        checking_word_elm.innerText = word["word"];

                        pre_phrase = ""
                        // pre_checking_word_elm.innerText = ""
                        pre_checking_word_elm.innerHTML = ""; 

                        for (let pre = j-1; j-40 < pre; pre--) {
                            if (!!words[pre]["word"].match("\\.")){
                                break;
                            }
                            // pre_phrase = words[pre]["word"] + " " + pre_phrase
                            let new_word = document.createElement('span')
                            new_word.textContent = words[pre]["word"] + " "
                            new_word.classList.add("speaker" + words[pre]["speakerTag"]);
                            pre_checking_word_elm.insertBefore(new_word, pre_checking_word_elm.firstChild)
                        }
                        // pre_checking_word_elm.innerText= pre_phrase


                        post_phrase = ""
                        // post_checking_word_elm.innerText = ""
                        post_checking_word_elm.innerHTML = ""

                        for (let post = j+1; post < j+40; post++) {
                            // post_phrase += " " + words[post]["word"]
                            let new_word = document.createElement('span')
                            new_word.textContent = " " + words[post]["word"]
                            new_word.classList.add("speaker" + words[post]["speakerTag"]);
                            post_checking_word_elm.appendChild(new_word)
                            if (!!words[post]["word"].match("\\.")){
                                break;
                            }
                        }
                        // post_checking_word_elm.innerText = post_phrase
                        return;
                    }
                }   
            }
            pre_checking_word_elm.innerText = ""
            checking_word_elm.innerText = "(空)"
            post_checking_word_elm.innerText= ""
        });
        document.getElementById("json_files").focus()
    }    
});

window.addEventListener('beforeunload', (e) => {
  const message = '入力内容が保存されない可能性があります。ページを離れますか？'
    e.preventDefault()
    e.returnValue = message
    return message
})