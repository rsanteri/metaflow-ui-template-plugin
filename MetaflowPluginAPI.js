// fn
const Listeners = [];
// [name, fn][]
const ResourceListeners = [];

const Metaflow = {
  heightCheck() {
    const body = document.body;
    const height = Math.max( body.scrollHeight, body.offsetHeight, body.clientHeight );
    window.parent.postMessage({ name: window.name, type: 'PluginHeightCheck', height: height }, '*')
  },
  register(slot) {
    window.parent.postMessage({ name: window.name, type: 'PluginRegisterEvent', slot: slot }, '*')
  },
  requestData(type, fn) {
    Listeners.push(fn)
    window.parent.postMessage({ name: window.name, type: 'PluginSubscribeToData', dataType: type }, '*')
  },
  requestResource(name, fn) {
    ResourceListeners.push([name, fn])
    window.parent.postMessage({ name: window.name, type: 'PluginResourceRequest', name: name }, '*')
  },
  PageData: {
    Run: {},
    Task: {},
  },
  service: {
    uiVersion: '',
    serviceVersion: '',
    apiUrl: '',
  }
}

window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'DataUpdate') {
    if (event.data.data.run) {
      Metaflow.PageData.Run = event.data.data.run
    }
    if (event.data.data.task) {
      Metaflow.PageData.Task = event.data.data.task
    }

    for (const listener of Listeners) {
      listener(event.data)
    }
  } else if (event.data && event.data.type === 'ResourceUpdate') {
    const listeners = ResourceListeners.filter(([ name, fn ]) => name === event.data.name)
    ResourceListeners = ResourceListeners.filter(([ name, fn ]) => name !== event.data.name)
    for (const listener of listeners) {
      listener(event.data)
    }
  }
})


window.Metaflow = Metaflow;

