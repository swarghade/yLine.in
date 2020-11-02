export const states = () => {
  return {
    shops: {
      query: {

      }
    }
  }
}

export const mutations = {
  
  set( state, target , val ){
    if(typeof val == 'object')
      state[target] = { ...state['target'], val }
    else
      state[target] = val
  }

}