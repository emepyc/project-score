import identity from "lodash.identity";

export function name2id(id) {
  return id.split(' ').join('_');
}

export function id2name(name) {
  return name.split('_').join(' ');
}
