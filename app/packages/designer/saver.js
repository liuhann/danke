
const uploaded = {}

function saveWork (work) {

}

async function saveResource (resource) {
  for (let blobUrl in resource) {
    let formData = new FormData()
    formData.append('file', resource[blobUrl])
    let response = await instance.post('/file/upload', formData)
    uploaded[blobUrl] = response.path
  }
}

export default {
  saveWork,
  saveResource
}
