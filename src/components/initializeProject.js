import lodash from 'lodash'
import axios from 'axios'

export async function initializeProject (projectData, recursionDepth = 0) {
  if (recursionDepth > 3) {
    console.error('Too many recursions in project initialization. giving up')
    return {}
  }
  if (projectData.uriData) {
    var uncompressedData = projectData.uriData
    return initializeProject(uncompressedData, recursionDepth + 1)
  }
  if (projectData.extends) {
    var url = projectData.extends
    projectData.extends = null
    var originalData = await initializeProject({ url }, recursionDepth + 1)
    return lodash.merge(originalData, uncompressedData)
  }
  if (projectData.url) {
    var fileContent = await axios.get(projectData.url)
    return JSON.parse(fileContent)
  }
  return projectData
}
