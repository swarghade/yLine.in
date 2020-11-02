export const state = () => {

  return {
    status : false, // gps status
    isSupported: true,
    latitude: 0,
    longitude: 0
  }
  
}

export const mutations = {
  location(state, pos){
    state.latitude = pos.latitude
    state.longitude = pos.longitude
    console.log(pos)
  },

  supported(state,value){
    state.isSupported = value
  },

  status(state,value){
    state.status = value
  }
}