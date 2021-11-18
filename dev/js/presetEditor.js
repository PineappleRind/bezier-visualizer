/************************
 * Point Presets
 * 
 * Development from:
 * Nov 16 - Nov 18
 ************************/
var psc = document.getElementById('presetSelectChoice')
var presetEditorPages = [`<div><h1>Preset list</h1>${getPresetListHTML()}<button onclick="addPreset()">Add Preset...</button></div>`,]

function presetEditorPage(index) {
    if (document.querySelector('.modal')) {
        removeModal();
        setTimeout(function () {
            showModal(index)
        }, 500)
        return
    }
    showModal(index)
}

function showModal(index) {
    let modal = document.createElement('DIV')
    modal.classList.add("modal")
    modal.setAttribute('aria-modal', 'true')
    modal.innerHTML = `<p id="close" onclick="removeModal()">&times;</p>` + presetEditorPages[index]
    let o = document.getElementById('modalOverlay')
    o.appendChild(modal)
    o.classList.add('showing')
    setTimeout(function () {
        modal.classList.add("showing")
    })
    onkeydown = e => {
        if (e.key == 'Escape') {
            removeModal();
        }
    }
}

function removeModal() {
    document.querySelector('.modal').classList.remove('showing');
    document.querySelector('#modalOverlay').classList.remove('showing');
    setTimeout(() => {
        document.querySelector('.modal').remove();
    }, 500);
    onkeydown = () => { };
}

function getPresetListHTML() {
    let res = `<div id="presetChoice">
      `
    for (let i = 0; i < points.presets.length; i++) {
        res += `	<div class="preset"><h1>${points.presets[i].name}</h1><button onclick="removePreset(${i});toast('Preset ${points.presets[i].name} successfully deleted','success');this.parentElement.remove()">Delete</button><button onclick="editPresetData(${i})">Edit Data</button><button onclick="changePresetName(${i});">Rename</button></div>
          `
    }
    res += `
      </div>`
    return res
}

function getPresetSelectHTML() {
    let res = `<select id="presetChoice">
      `
    for (let i = 0; i < points.presets.length; i++) {
        res += `<option value="${i}">${points.presets[i].name}</option>
          `
    }
    res += `
      </select>`
    return res
}

function removePreset(index) {
    points.presets.splice(index, 1);
    updatePresetPage()
    psc.innerHTML = getPresetSelectHTML()
}
function updatePresetPage() {
    presetEditorPages = [`
    <p id="close" onclick="removeModal()">&times;</p><div><h1>Preset list</h1>${getPresetListHTML()}</div>
`]
}
function changePresetName(index) {
    let newName = prompt('New preset name:')
    points.presets[index].name = newName
    document.getElementById('presetChoice').remove()
    document.querySelector('.modal').innerHTML += getPresetListHTML()
    updatePresetPage()
    psc.innerHTML = getPresetSelectHTML()
}

function toast(content,type) {
    let toaster = document.createElement('DIV')
    toaster.classList.add('toast')
    if (type) toaster.classList.add(type)
    toaster.innerHTML = content
    document.body.appendChild(toaster)
    setTimeout(function () {
        toaster.classList.add('showing')
    })
    setTimeout(function () {
        toaster.classList.remove('showing')
        setTimeout(function () {
            toaster.remove()
        }, 500)
    }, 3000)
}

function editPresetData(index) {
    presetEditorPages[1] = `<p id="close" onclick="removeModal()">&times;</p><div><h1>Editing data for ${points.presets[index].name}</h1><textarea style="width:200px; height:300px">${JSON.stringify(points.presets[index].data).replace(/\]\,/g, '],&#13;&#10;').replace(/\[\[/g, '[&#13;&#10;[').replace(/\]\]/g, ']&#13;&#10;]')}</textarea><button onclick="savePresetData(${index},this.previousElementSibling)">Save</button>`
    presetEditorPage(1)
    psc.innerHTML = getPresetSelectHTML()
}

function savePresetData(index, textarea) {
    points.presets[index].data = JSON.parse(textarea.value.replace('&#13;&#10;', ''))
    toast('Successfully edited preset ' + points.presets[index].name,'success')
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
      <p style="width:300px">Each point's x & y coordinates is wrapped in brackets []. Example: [100, 130]. This will make a point at x 100 and y 130.</p>
      <br>
      <button onclick="parseAndAddPreset(document.getElementById('presetName'),document.getElementById('presetData'))">Create preset</button>`
    presetEditorPage(2)
}

function parseAndAddPreset(name, data) {
    let newInd = points.presets.length
    points.presets[newInd] = {}
    points.presets[newInd].name = name.value
    try {
        var newData = JSON.parse(data.value)
    } catch (err) {
        toast('Invalid data structure <br><small style="font-weight:200">'+error+'</small>','error')
        return
    }
    if (newData.length < 2) {
        toast('Please add more than 1 point','error')
        return
    }
    for (let i = 0; i < newData.length; i++) {
        if (newData[i].length != 2) {
            toast('Point ' + (i + 1) + ' does not have proper coordinates.','error')
        }
    }
    points.presets[newInd].data = JSON.parse(data.value)
    psc.innerHTML = getPresetSelectHTML()
    toast('Added preset '+name.value+' successfully','success')
    save.set()
    return presetEditorPage(0)
}
psc.oninput = () => {
    let number = parseInt(psc.value)
    points.data = points.presets[number].data
    replay()
}