export function id2name(id) {
  return id.split(' ').join('_');
}

export function name2id(name) {
  return name.split('_').join(' ');
}
