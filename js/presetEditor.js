// will eventually rewrite this.
// good luck deciphering it.
// it's a mess. and insecure also.
// and it's not even in production, nor has it ever been.
// just purely on the local machine.

/************************
 * Point Presets
 *
 * Development from:
 * Nov 16 - Nov 18 2021
 ************************/
//const $ = (id) => document.getElementById(id)
var psc = $("presetSelectChoice");
var presetEditorPages = [
  `<div><h1>Preset list</h1>${getPresetListHTML()}<button onclick="addPreset()">Add Preset...</button></div>`,
];
var pso = $("presetEditorOpener");
pso.onclick = showModal.bind(this, [0]);
function presetEditorPage(index) {
  if (document.querySelector(".modal")) {
    removeModal();
    setTimeout(function () {
      showModal(index);
    }, 500);
    return;
  }
  showModal(index);
}

function showModal(index) {
  let modal = document.createElement("DIV");
  modal.classList.add("modal");
  modal.setAttribute("aria-modal", "true");
  modal.innerHTML =
    `<p id="close" onclick="removeModal()">&times;</p>` +
    presetEditorPages[index];
  let o = $("modalOverlay");
  o.appendChild(modal);
  o.classList.add("showing");
  setTimeout(function () {
    modal.classList.add("showing");
  });
  onkeydown = (e) => {
    if (e.key == "Escape") {
      removeModal();
    }
  };
}

function removeModal() {
  document.querySelector(".modal").classList.remove("showing");
  document.querySelector("#modalOverlay").classList.remove("showing");
  setTimeout(() => {
    document.querySelector(".modal").remove();
  }, 500);
  onkeydown = () => {};
}

function getPresetListHTML() {
  let res = `<div id="presetChoice">
       `;
  for (let i = 0; i < saveData.presets.length; i++) {
    res += `	<div class="preset"><h1>${saveData.presets[i].name}</h1><button onclick="removePreset(${i});toast('Preset ${saveData.presets[i].name} successfully deleted','success');this.parentElement.remove()">Delete</button><button onclick="editPresetData(${i})">Edit Data</button><button onclick="changePresetName(${i});">Rename</button></div>
           `;
  }
  res += `
       </div>`;
  return res;
}

function removePreset(index) {
  saveData.presets.splice(index, 1);
  updatePresetPage();
  psc.innerHTML = getPresetSelectHTML();
}
function updatePresetPage() {
  presetEditorPages = [
    `
     <p id="close" onclick="removeModal()">&times;</p><div><h1>Preset list</h1>${getPresetListHTML()}</div>
 `,
  ];
}
function changePresetName(index) {
  let newName = prompt("New preset name:");
  if (newName === "") return toast("Name cannot be empty", "error");
  else if (newName === null) return;
  saveData.presets[index].name = newName;
  $("presetChoice").remove();
  document.querySelector(".modal").innerHTML += getPresetListHTML();
  updatePresetPage();
  psc.innerHTML = getPresetSelectHTML();
}

function editPresetData(index) {
  presetEditorPages[1] = `<p id="close" onclick="removeModal()">&times;</p><div><h1>Editing data for ${
    saveData.presets[index].name
  }</h1><textarea style="width:200px; height:300px">${JSON.stringify(
    saveData.presets[index].data
  )
    .replace(/\]\,/g, "],&#13;&#10;")
    .replace(/\[\[/g, "[&#13;&#10;[")
    .replace(
      /\]\]/g,
      "]&#13;&#10;]"
    )}</textarea><button onclick="savePresetData(${index},this.previousElementSibling)">Save</button>`;
  presetEditorPage(1);
  psc.innerHTML = getPresetSelectHTML();
}

function savePresetData(index, textarea) {
  saveData.presets[index].data = JSON.parse(
    textarea.value.replace("&#13;&#10;", "")
  );
  toast(
    "Successfully edited preset " + saveData.presets[index].name,
    "success"
  );
}

function addPreset() {
  presetEditorPages[2] = `<p id="close" onclick="removeModal()">&times;</p>
       <div>
       <button onclick="presetEditorPage(0)">Back</button>
       <h1>New preset</h1>
       <p>Name:</p>
       <input type="text" id="presetName" placeholder="Name"><br>
       <p>Data:</p>
       <textarea  id="presetData" style="width:300px; height:200px">[
       [0, 0],
       [0, 0]
   ]</textarea><br>
         <p>View options:</p>
         <div id="presetViewOptions">
             <input type="checkbox" value="lines" id="plines" checked><label for="plines">Show lines</label><br>
             <input type="checkbox" value="midpoints"id="pmidpoints" checked><label for="pmidpoints">Show midpoints</label><br>
             <input type="checkbox" value="trail" id="ptrail" checked><label for="ptrail">Show trail</label><br>
             <input type="checkbox" value="controlpoints" id="pcontrolpoints" checked><label for="pcontrolpoints">Show control points</label><br>
             <input type="checkbox" value="finalmidpoint" id="pfinalmidpoint" checked><label for="pfinalmidpoint">Show final midpoints</label><br>
         </div><br>
       <p style="width:400px">Each point's x & y coordinates is wrapped in brackets []. Example: [100, 130]. This will make a point at x 100 and y 130.</p>
       <br>
       <button onclick="parseAndAddPreset($('presetName'),$('presetData'),$('presetViewOptions'))">Create preset</button>`;
  presetEditorPage(2);
}

function parseAndAddPreset(name, data, viewOpts) {
  let newInd = saveData.presets.length;
  saveData.presets[newInd] = {};
  saveData.presets[newInd].name = name.value;
  saveData.presets[newInd].show = 0b11111;
  try {
    var newData = JSON.parse(data.value);
  } catch (err) {
    toast(
      'Invalid data structure <br><small style="font-weight:200">' +
        err +
        "</small>",
      "error"
    );
    return;
  }
  if (newData.length < 2) {
    toast("Please add more than 1 point", "error");
    return;
  }
  for (let i = 0; i < newData.length; i++) {
    if (newData[i].length != 2) {
      toast("Point " + (i + 1) + " does not have proper coordinates.", "error");
    }
  }
  for (let i = 0; i < viewOpts.children.length; i++) {
    if (viewOpts.children[i].checked) {
      saveData.presets[newInd].show ^= bits[viewOpts.children[i].value];
    } else saveData.presets[newInd].show ^= ~bits[viewOpts.children[i].value];
  }
  saveData.presets[newInd].data = JSON.parse(data.value);
  psc.innerHTML = getPresetSelectHTML();
  toast("Added preset " + name.value + " successfully", "success");
  save.set();
  return presetEditorPage(0);
}
psc.oninput = () => {
  loadPreset(parseInt(psc.value));
  save.set();
};
function loadPreset(number) {
  let toupdate = saveData.presets[number];
  saveData.data = toupdate.data;
  let newShow;
  if (toupdate.show === null) {
    newShow = 0b11111;
  } else newShow = toupdate.show;
  saveData.settings.show = newShow;
  replay();
  save.set();
  updateCheckboxes();
}
$("presetSelectChoice").innerHTML = getPresetSelectHTML();
