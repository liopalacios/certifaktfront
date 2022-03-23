const setToken = (state, token) => {
  state.token = token;
};

const setUser = (state, user) => {
  state.user = user;
};

const setIdPuntoVenta = (state, idPuntoVenta) => {
  state.idPuntoVenta = idPuntoVenta;
};


const setCompany = (state, company) => {
  state.company = company;
};



export default {
  setToken,
  setIdPuntoVenta,
  setUser,
  setCompany
};
