// import h5wasm from "https://cdn.jsdelivr.net/npm/h5wasm@0.6.0/dist/esm/hdf5_hl.js";
import h5wasm from "./_hdf5_wasm.js";
class Read_HDF5{
    
    constructor(h5_file, filename){
        this.h5_file = h5_file;
        this.random_name = filename;
    }
    
    async getKeys(){
        // the WASM loads asychronously, and you can get the module like this:
        const Module = await h5wasm.ready;

        // then you can get the FileSystem object from the Module:
        const { FS } = Module;
        console.log(this.h5_file)
        let response = await fetch(this.h5_file)
        let ab = await response.arrayBuffer();

        FS.writeFile(this.random_name, new Uint8Array(ab));
        let f = new h5wasm.File(this.random_name, "r");
        return f
    }
}

window.Read_HDF5 = Read_HDF5;

let laughter = [];
let giggle = [];
let snicker = [];
let belly_laugh = [];
let chuckle = [];

let speech = [];
let conversation = [];
let narration = [];

let yamnetfiles = [];

let category = ["Speech", "Child speech, kid speaking", "Conversation", "Narration, monologue", "Babbling", "Speech synthesizer", "Shout", "Bellow", "Whoop", "Yell", "Children shouting", "Screaming", "Whispering", "Laughter", "Baby laughter", "Giggle", "Snicker", "Belly laugh", "Chuckle, chortle", "Crying, sobbing", "Baby cry, infant cry", "Whimper", "Wail, moan", "Sigh", "Singing", "Choir", "Yodeling", "Chant", "Mantra", "Child singing", "Synthetic singing", "Rapping", "Humming", "Groan", "Grunt", "Whistling", "Breathing", "Wheeze", "Snoring", "Gasp", "Pant", "Snort", "Cough", "Throat clearing", "Sneeze", "Sniff", "Run", "Shuffle", "Walk, footsteps", "Chewing, mastication", "Biting", "Gargling", "Stomach rumble", "Burping, eructation", "Hiccup", "Fart", "Hands", "Finger snapping", "Clapping", "Heart sounds, heartbeat", "Heart murmur", "Cheering", "Applause", "Chatter", "Crowd", "Hubbub, speech noise, speech babble", "Children playing", "Animal", "Domestic animals, pets", "Dog", "Bark", "Yip", "Howl", "Bow-wow", "Growling", "Whimper (dog)", "Cat", "Purr", "Meow", "Hiss", "Caterwaul", "Livestock, farm animals, working animals", "Horse", "Clip-clop", "Neigh, whinny", "Cattle, bovinae", "Moo", "Cowbell", "Pig", "Oink", "Goat", "Bleat", "Sheep", "Fowl", "Chicken, rooster", "Cluck", "Crowing, cock-a-doodle-doo", "Turkey", "Gobble", "Duck", "Quack", "Goose", "Honk", "Wild animals", "Roaring cats (lions, tigers)", "Roar", "Bird", "Bird vocalization, bird call, bird song", "Chirp, tweet", "Squawk", "Pigeon, dove", "Coo", "Crow", "Caw", "Owl", "Hoot", "Bird flight, flapping wings", "Canidae, dogs, wolves", "Rodents, rats, mice", "Mouse", "Patter", "Insect", "Cricket", "Mosquito", "Fly, housefly", "Buzz", "Bee, wasp, etc.", "Frog", "Croak", "Snake", "Rattle", "Whale vocalization", "Music", "Musical instrument", "Plucked string instrument", "Guitar", "Electric guitar", "Bass guitar", "Acoustic guitar", "Steel guitar, slide guitar", "Tapping (guitar technique)", "Strum", "Banjo", "Sitar", "Mandolin", "Zither", "Ukulele", "Keyboard (musical)", "Piano", "Electric piano", "Organ", "Electronic organ", "Hammond organ", "Synthesizer", "Sampler", "Harpsichord", "Percussion", "Drum kit", "Drum machine", "Drum", "Snare drum", "Rimshot", "Drum roll", "Bass drum", "Timpani", "Tabla", "Cymbal", "Hi-hat", "Wood block", "Tambourine", "Rattle (instrument)", "Maraca", "Gong", "Tubular bells", "Mallet percussion", "Marimba, xylophone", "Glockenspiel", "Vibraphone", "Steelpan", "Orchestra", "Brass instrument", "French horn", "Trumpet", "Trombone", "Bowed string instrument", "String section", "Violin, fiddle", "Pizzicato", "Cello", "Double bass", "Wind instrument, woodwind instrument", "Flute", "Saxophone", "Clarinet", "Harp", "Bell", "Church bell", "Jingle bell", "Bicycle bell", "Tuning fork", "Chime", "Wind chime", "Change ringing (campanology)", "Harmonica", "Accordion", "Bagpipes", "Didgeridoo", "Shofar", "Theremin", "Singing bowl", "Scratching (performance technique)", "Pop music", "Hip hop music", "Beatboxing", "Rock music", "Heavy metal", "Punk rock", "Grunge", "Progressive rock", "Rock and roll", "Psychedelic rock", "Rhythm and blues", "Soul music", "Reggae", "Country", "Swing music", "Bluegrass", "Funk", "Folk music", "Middle Eastern music", "Jazz", "Disco", "Classical music", "Opera", "Electronic music", "House music", "Techno", "Dubstep", "Drum and bass", "Electronica", "Electronic dance music", "Ambient music", "Trance music", "Music of Latin America", "Salsa music", "Flamenco", "Blues", "Music for children", "New-age music", "Vocal music", "A capella", "Music of Africa", "Afrobeat", "Christian music", "Gospel music", "Music of Asia", "Carnatic music", "Music of Bollywood", "Ska", "Traditional music", "Independent music", "Song", "Background music", "Theme music", "Jingle (music)", "Soundtrack music", "Lullaby", "Video game music", "Christmas music", "Dance music", "Wedding music", "Happy music", "Sad music", "Tender music", "Exciting music", "Angry music", "Scary music", "Wind", "Rustling leaves", "Wind noise (microphone)", "Thunderstorm", "Thunder", "Water", "Rain", "Raindrop", "Rain on surface", "Stream", "Waterfall", "Ocean", "Waves, surf", "Steam", "Gurgling", "Fire", "Crackle", "Vehicle", "Boat, Water vehicle", "Sailboat, sailing ship", "Rowboat, canoe, kayak", "Motorboat, speedboat", "Ship", "Motor vehicle (road)", "Car", "Vehicle horn, car horn, honking", "Toot", "Car alarm", "Power windows, electric windows", "Skidding", "Tire squeal", "Car passing by", "Race car, auto racing", "Truck", "Air brake", "Air horn, truck horn", "Reversing beeps", "Ice cream truck, ice cream van", "Bus", "Emergency vehicle", "Police car (siren)", "Ambulance (siren)", "Fire engine, fire truck (siren)", "Motorcycle", "Traffic noise, roadway noise", "Rail transport", "Train", "Train whistle", "Train horn", "Railroad car, train wagon", "Train wheels squealing", "Subway, metro, underground", "Aircraft", "Aircraft engine", "Jet engine", "Propeller, airscrew", "Helicopter", "Fixed-wing aircraft, airplane", "Bicycle", "Skateboard", "Engine", "Light engine (high frequency)", "Dental drill, dentist's drill", "Lawn mower", "Chainsaw", "Medium engine (mid frequency)", "Heavy engine (low frequency)", "Engine knocking", "Engine starting", "Idling", "Accelerating, revving, vroom", "Door", "Doorbell", "Ding-dong", "Sliding door", "Slam", "Knock", "Tap", "Squeak", "Cupboard open or close", "Drawer open or close", "Dishes, pots, and pans", "Cutlery, silverware", "Chopping (food)", "Frying (food)", "Microwave oven", "Blender", "Water tap, faucet", "Sink (filling or washing)", "Bathtub (filling or washing)", "Hair dryer", "Toilet flush", "Toothbrush", "Electric toothbrush", "Vacuum cleaner", "Zipper (clothing)", "Keys jangling", "Coin (dropping)", "Scissors", "Electric shaver, electric razor", "Shuffling cards", "Typing", "Typewriter", "Computer keyboard", "Writing", "Alarm", "Telephone", "Telephone bell ringing", "Ringtone", "Telephone dialing, DTMF", "Dial tone", "Busy signal", "Alarm clock", "Siren", "Civil defense siren", "Buzzer", "Smoke detector, smoke alarm", "Fire alarm", "Foghorn", "Whistle", "Steam whistle", "Mechanisms", "Ratchet, pawl", "Clock", "Tick", "Tick-tock", "Gears", "Pulleys", "Sewing machine", "Mechanical fan", "Air conditioning", "Cash register", "Printer", "Camera", "Single-lens reflex camera", "Tools", "Hammer", "Jackhammer", "Sawing", "Filing (rasp)", "Sanding", "Power tool", "Drill", "Explosion", "Gunshot, gunfire", "Machine gun", "Fusillade", "Artillery fire", "Cap gun", "Fireworks", "Firecracker", "Burst, pop", "Eruption", "Boom", "Wood", "Chop", "Splinter", "Crack", "Glass", "Chink, clink", "Shatter", "Liquid", "Splash, splatter", "Slosh", "Squish", "Drip", "Pour", "Trickle, dribble", "Gush", "Fill (with liquid)", "Spray", "Pump (liquid)", "Stir", "Boiling", "Sonar", "Arrow", "Whoosh, swoosh, swish", "Thump, thud", "Thunk", "Electronic tuner", "Effects unit", "Chorus effect", "Basketball bounce", "Bang", "Slap, smack", "Whack, thwack", "Smash, crash", "Breaking", "Bouncing", "Whip", "Flap", "Scratch", "Scrape", "Rub", "Roll", "Crushing", "Crumpling, crinkling", "Tearing", "Beep, bleep", "Ping", "Ding", "Clang", "Squeal", "Creak", "Rustle", "Whir", "Clatter", "Sizzle", "Clicking", "Clickety-clack", "Rumble", "Plop", "Jingle, tinkle", "Hum", "Zing", "Boing", "Crunch", "Silence", "Sine wave", "Harmonic", "Chirp tone", "Sound effect", "Pulse", "Inside, small room", "Inside, large room or hall", "Inside, public space", "Outside, urban or manmade", "Outside, rural or natural", "Reverberation", "Echo", "Noise", "Environmental noise", "Static", "Mains hum", "Distortion", "Sidetone", "Cacophony", "White noise", "Pink noise", "Throbbing", "Vibration", "Television", "Radio", "Field recording"];

document.getElementById("yamnet_files").addEventListener("change", ev => {
    yamnetfiles = ev.target.files
    show_dir(yamnetfiles, "yamnet")
});


async function loadyamnet(idx){
    let f = new Read_HDF5(URL.createObjectURL(yamnetfiles[idx]), yamnetfiles[idx]["name"]);
    let d = await f.getKeys()
    console.log("interval", d.get("score/axis1").value[1])
    let block0 = d.get("score/block0_values").value
    window.block0 = block0
    laughter = block0.filter( function( val, val_idx ) {return val_idx%521 == 13;})
    // window.laughter = laughter
    giggle = block0.filter( function( val, val_idx ) {return val_idx%521 == 15;})
    snicker = block0.filter( function( val, val_idx ) {return val_idx%521 == 16;})
    belly_laugh = block0.filter( function( val, val_idx ) {return val_idx%521 == 17;})
    chuckle = block0.filter( function( val, val_idx ) {return val_idx%521 == 18;})

    speech = block0.filter( function( val, val_idx ) {return val_idx%521 == 0;})
    conversation = block0.filter( function( val, val_idx ) {return val_idx%521 == 2;})
    narration = block0.filter( function( val, val_idx ) {return val_idx%521 == 3;})

    document.getElementById("yamnet_file_name").innerText = yamnetfiles[idx]["name"]
}
window.loadyamnet = loadyamnet

function update_yamnet_threshold(){
    let new_thres = document.getElementById("yamnet_threshold").value + "%"
    document.getElementById("yamnet_threshold_value").innerText = new_thres
    document.getElementById("thres_line").style.left = new_thres
}
window.update_yamnet_threshold = update_yamnet_threshold

window.addEventListener("load", ()=>{
    let curr_time_display = document.getElementById("curr_time");

    let yamnet_laughter = document.getElementById("yamnet_laughter");
    let yamnet_laughter_bar_style = document.getElementById("laughter_bar").style;
    let yamnet_giggle = document.getElementById("yamnet_giggle");
    let yamnet_giggle_bar_style = document.getElementById("giggle_bar").style;
    let yamnet_snicker = document.getElementById("yamnet_snicker");
    let yamnet_snicker_bar_style = document.getElementById("snicker_bar").style;
    let yamnet_belly_laugh = document.getElementById("yamnet_belly_laugh");
    let yamnet_belly_laugh_bar_style = document.getElementById("belly_laugh_bar").style;
    let yamnet_chuckle = document.getElementById("yamnet_chuckle");
    let yamnet_chuckle_bar_style = document.getElementById("chuckle_bar").style;

    let yamnet_speech = document.getElementById("yamnet_speech");
    let yamnet_speech_bar_style = document.getElementById("speech_bar").style;
    let yamnet_conversation = document.getElementById("yamnet_conversation");
    let yamnet_conversation_bar_style = document.getElementById("conversation_bar").style;
    let yamnet_narration = document.getElementById("yamnet_narration");
    let yamnet_narration_bar_style = document.getElementById("narration_bar").style;

    const interval = .48;
    let curr_idx = -1;
    
    const channel = new BroadcastChannel('app-data');
    channel.addEventListener ('message', (event) => {
        let curr_time = event.data["time"]
        curr_time_display.innerText = curr_time;
        let idx = Math.floor(curr_time/interval)

        if (idx == curr_idx){
            return
        }
        curr_idx = idx

        let _laughter = laughter[idx]
        yamnet_laughter.innerText = _laughter
        yamnet_laughter_bar_style.width = (_laughter * 100) + "%"

        let _giggle = giggle[idx]
        yamnet_giggle.innerText = _giggle
        yamnet_giggle_bar_style.width = (_giggle * 100) + "%"

        let _snicker = snicker[idx]
        yamnet_snicker.innerText = _snicker
        yamnet_snicker_bar_style.width = (_snicker * 100) + "%"

        let _belly_laugh = belly_laugh[idx]
        yamnet_belly_laugh.innerText = _belly_laugh
        yamnet_belly_laugh_bar_style.width = (_belly_laugh * 100) + "%"

        let _chuckle = chuckle[idx]
        yamnet_chuckle.innerText = _chuckle
        yamnet_chuckle_bar_style.width = (_chuckle * 100) + "%"

        let _speech = speech[idx]
        yamnet_speech.innerText = _speech
        yamnet_speech_bar_style.width = (_speech * 100) + "%"

        let _conversation = conversation[idx]
        yamnet_conversation.innerText = _conversation
        yamnet_conversation_bar_style.width = (_conversation * 100) + "%"

        let _narration = narration[idx]
        yamnet_narration.innerText = _narration
        yamnet_narration_bar_style.width = (_narration * 100) + "%"

        let curr_all_class_value = window.block0.slice(idx*521, (idx+1)*521)
        // console.log("Max prob class: ", curr_all_class_value.indexOf(Math.max(...curr_all_class_value)))
        for(let i=0; i<521;i++){
            if (curr_all_class_value[i] > .01){
                console.log(category[i], curr_all_class_value[i])
            }
        }
        console.log("")
    });
})