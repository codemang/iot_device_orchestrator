const axios = require('axios').default;

class ApiClient {
  constructor(rpiHost) {
    this.apiClient = axios.create({
      baseURL: rpiHost
    });

    if (!rpiHost.includes('http')) {
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
