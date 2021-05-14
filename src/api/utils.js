export function name2id(id) {
  return id.split(' ').join('_');
}

export function id2name(name) {
  return name.split('_').join(' ');
}

export function fitnessIsSignificant(essentiality) {
  return essentiality.bf_scaled < 0;
}

export const totalModels = 811;
