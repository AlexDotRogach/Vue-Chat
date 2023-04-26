export function removeQueryParams(to) {
  if (Object.keys(to.query).length)
    return { path: to.path, query: {}, hash: to.hash };
}

export function removeHash(to) {
  if (to.hash) return { path: to.path, query: to.query, hash: "" };
}
