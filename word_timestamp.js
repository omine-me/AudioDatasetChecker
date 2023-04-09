let jsonfiles = []
let audiofiles = []
let current_file_idx = 0
let ori_audioElm = ""
let laughters = []
let current_laughter = 0
let checking_word_elm = document.getElementById('checking_word')
let pre_checking_word_elm = document.getElementById('pre_checking_word')
let post_checking_word_elm = document.getElementById('post_checking_word')

async function loadJson(idx){
    await fetch(URL.createObjectURL(jsonfiles[idx]))
        .then( response => response.json())
        .catch(response=>alert("Error occured while fetching json"))
        .then( data => {
            laughters = data
            current_laughter = 0
            document.getElementById("json_file_name").innerText = jsonfiles[idx]["name"]
        })
        .catch(data=>alert("Error occured while loading json or audio"));    
}