export const state = () => {

  return {
    data: ['medicals','super-market','wine shops','salons','local Shops','service centers','vets','banks','hospitals','garage'] // gps status
  }
  
}

export const mutations = {
  set(state,value){
    state.data = value
  },


}