const axios = require('axios').default;

class ApiClient {
  constructor(serverHost) {
    this.apiClient = axios.create({
      baseURL: serverHost
    });

    if (!serverHost.includes('http')) {
      throw 'You must supply a scheme';
    }
  }

  triggerSingleClick() {
    this.apiClient.post('click/single_click');
  }

  triggerDoubleClick() {
    this.apiClient.post('click/double_click');
  }

  triggerHold() {
    this.apiClient.post('click/hold');
  }
};

module.exports = ApiClient;
