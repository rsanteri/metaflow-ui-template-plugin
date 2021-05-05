// fn
const Listeners = [];
let onReadyFn = () => null

function messageHandler(event) {
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'ReadyToRender': {
        onReadyFn();
        return;
      }
      case 'DataUpdate': {
        for (const listener of Listeners) {
          listener(event.data)
        }
        return;
      }
    }
  }
}

const Metaflow = {
  heightCheck() {
    const body = document.body;
    const height = Math.max( body.scrollHeight, body.offsetHeight, body.clientHeight );
    window.parent.postMessage({ name: window.name, type: 'PluginHeightCheck', height: height }, '*')
  },
  register(slot) {
    window.parent.postMessage({ name: window.name, type: 'PluginRegisterEvent', slot: slot }, '*')
  },
  onReady(fn) {
    onReadyFn = fn;
  },
  requestPageData(fn) {
    Listeners.push(fn)
    window.parent.postMessage({ name: window.name, type: 'PluginSubscribeToData' }, '*')
  },
  service: {
    uiVersion: '',
    serviceVersion: '',
    apiUrl: '',
  },
  init() {
    window.addEventListener('message', messageHandler);
  },
  remove(fn) {
    window.parent.postMessage({ name: window.name, type: 'PluginRemoveRequest' }, '*')
  },
}




window.Metaflow = Metaflow;

