export function getRule (loaders, id) {
  for (let i = 0; i < loaders.length; i++) {
    const rule = loaders[i]
    if (rule.id === id) {
      return rule
    }
  }
}


export default {
  getRule
};
