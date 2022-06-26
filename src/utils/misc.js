export const last = (array) => {
  const length = array == null? 0 : array.length
  return length ? array[length - 1] : undefined
}

export const stripIpfsUriPrefix = (cidOrUri) => {
  if (cidOrUri.startsWith('ipfs://')) {
    return cidOrUri.slice('ipfs://'.length)
  }
  return cidOrUri;
}

export function ensureIpfsUriPrefix(cidOrURI) {
  let uri = cidOrURI.toString()
  if (!uri.startsWith('ipfs://')) {
    uri = 'ipfs://' + cidOrURI
  }
  // Avoid the Nyan Cat bug (https://github.com/ipfs/go-ipfs/pull/7930)
  if (uri.startsWith('ipfs://ipfs/')) {
    uri = uri.replace('ipfs://ipfs/', 'ipfs://')
  }
  return uri
}